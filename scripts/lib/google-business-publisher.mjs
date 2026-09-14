import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { prepareGoogleBusinessPost } from "../prepare-google-business-post.mjs";
import { assertValid, validateRun } from "./blog-pipeline.mjs";
import { berlinDate } from "./blog-queue.mjs";

const ORIGIN = "https://krankenfahrten-bad-homburg.de";
const API = "https://mybusiness.googleapis.com/v4/";
const sha256 = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

// Never include response bodies, credentials or request headers in exceptions/logs.
async function request(fetcher, url, options = {}) {
  try {
    return await fetcher(url, { ...options, redirect: "error", signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error("Netzwerkantwort nicht bestätigt; keine automatische Schreibwiederholung.");
  }
}

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([, key, value]) => [key.toLowerCase(), value]));
}

export async function verifyPublishedArticle(fetcher, article) {
  const url = `${ORIGIN}/ratgeber/${article.slug}/`;
  const response = await request(fetcher, url);
  requireThat(response.status === 200 && /text\/html/i.test(response.headers.get("content-type") || ""), "Produktionsartikel liefert kein HTML mit HTTP 200.");
  requireThat(!response.url || response.url === url, "Produktionsartikel wurde umgeleitet.");
  requireThat(!/noindex|none/i.test(response.headers.get("x-robots-tag") || ""), "Produktionsartikel besitzt eine Indexierungssperre.");
  const html = await response.text();
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attrs(tag));
  const canonicals = links.filter(link => (link.rel || "").toLowerCase() === "canonical");
  requireThat(canonicals.length === 1 && canonicals[0].href === url, "Produktionsartikel besitzt nicht den erwarteten Canonical.");
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attrs(tag));
  requireThat(!meta.some(item => /^(robots|googlebot)$/i.test(item.name || "") && /noindex|none/i.test(item.content || "")), "Produktionsartikel besitzt eine Meta-Indexierungssperre.");
  const structured = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([, json]) => { try { return [JSON.parse(json)]; } catch { return []; } });
  const matchesArticle = node => node && typeof node === "object" && (
    (["Article", "BlogPosting"].includes(node["@type"]) && node.headline === article.title)
    || Object.values(node).some(value => Array.isArray(value) ? value.some(matchesArticle) : matchesArticle(value))
  );
  requireThat(structured.some(matchesArticle), "Produktionsinhalt ist nicht als erwarteter Artikel nachgewiesen.");
  return url;
}

export function createFileLedger(directory, key) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const filename = resolve(directory, `${createHash("sha256").update(key).digest("hex")}.json`);
  const lockfile = `${filename}.lock`;
  let locked = false;
  return {
    lock() {
      try { closeSync(openSync(lockfile, "wx", 0o600)); locked = true; }
      catch { throw new Error("Google-Beitrag ist gesperrt; parallelen oder abgebrochenen Lauf zuerst prüfen."); }
    },
    read() { return existsSync(filename) ? JSON.parse(readFileSync(filename, "utf8")) : null; },
    write(state) {
      requireThat(locked, "Ledger benötigt eine exklusive Sperre.");
      writeFileSync(`${filename}.tmp`, JSON.stringify(state, null, 2) + "\n", { mode: 0o600 });
      renameSync(`${filename}.tmp`, filename);
    },
    unlock() { if (locked) { unlinkSync(lockfile); locked = false; } },
  };
}

export async function createGoogleBusinessClient(env, fetcher = fetch) {
  const credentials = ["GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN"];
  requireThat(credentials.every(key => env[key]?.trim()), "OAuth-Konfiguration fehlt: Client-ID, Client-Secret und Refresh-Token erforderlich.");
  const tokenResponse = await request(fetcher, "https://oauth2.googleapis.com/token", {
    method: "POST", body: new URLSearchParams({ client_id: env.GBP_CLIENT_ID, client_secret: env.GBP_CLIENT_SECRET, refresh_token: env.GBP_REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  requireThat(tokenResponse.ok, "Google-OAuth konnte nicht erneuert werden.");
  let token;
  try { token = (await tokenResponse.json()).access_token; } catch { /* Neutral error below. */ }
  requireThat(typeof token === "string" && token.length > 0, "Google-OAuth lieferte keinen Zugriffstoken.");
  async function api(path, method = "GET", body) {
    const response = await request(fetcher, `${API}${path}`, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    requireThat(response.ok, `Google-Business-Anfrage fehlgeschlagen (HTTP ${response.status}); Antwortinhalt wird nicht protokolliert.`);
    try { return await response.json(); } catch { throw new Error("Google-Business-Antwort ist unvollständig."); }
  }
  return {
    async list(parent) {
      const posts = [];
      let pageToken;
      const tokens = new Set();
      do {
        const query = new URLSearchParams({ pageSize: "100", ...(pageToken ? { pageToken } : {}) });
        const page = await api(`${parent}/localPosts?${query}`);
        requireThat(Array.isArray(page.localPosts || []), "Google-Beitragsliste ist ungültig.");
        posts.push(...(page.localPosts || []));
        pageToken = page.nextPageToken;
        requireThat(!pageToken || !tokens.has(pageToken), "Google-Beitragsliste ist unvollständig; Abbruch statt Duplikatrisiko.");
        if (pageToken) tokens.add(pageToken);
      } while (pageToken);
      return posts;
    },
    create: (parent, payload) => api(`${parent}/localPosts`, "POST", payload),
  };
}

export async function publishGoogleBusinessPost({ preview, article, status, publishedArticle, parent, enabled = false, approvedPayloadHash, ledger, client, fetcher = fetch, today = berlinDate() }) {
  const payloadHash = sha256(preview.payload);
  if (!enabled) return { ...preview, payloadHash, status: "preview_only" };
  requireThat(/^accounts\/\d+\/locations\/\d+$/.test(parent || ""), "Exakte Google-Account-/Location-ID fehlt oder ist ungültig.");
  requireThat(preview.operatorApproval === "approved" && status.status === "approved_for_publish" && /^\d{4}-\d{2}-\d{2}$/.test(status.approvedAt || "") && status.approvedAt <= today, "Betreiberfreigabe fehlt.");
  requireThat(article.publishedAt <= today, "Artikel ist noch nicht fällig.");
  requireThat(approvedPayloadHash === payloadHash, "Explizite Freigabe dieses Google-Kurztexts fehlt oder Text wurde geändert.");
  requireThat(publishedArticle && sha256(publishedArticle) === sha256(article), "Veröffentlichungsregister enthält nicht den identischen Artikel.");
  requireThat(preview.articleSlug === article.slug && new URL(preview.payload.callToAction.url).origin === ORIGIN && new URL(preview.payload.callToAction.url).pathname === `/ratgeber/${article.slug}/`, "Google-Ziellink stimmt nicht mit dem Artikel überein.");
  await verifyPublishedArticle(fetcher, article);
  ledger.lock();
  try {
    const previous = ledger.read();
    requireThat(!previous || previous.payloadHash === payloadHash, "Bereits begonnener Beitrag hat anderen Inhalt; manuelle Prüfung erforderlich.");
    const articleUrl = new URL(preview.payload.callToAction.url);
    const posts = await client.list(parent);
    const matches = posts.filter(post => {
      try { const url = new URL(post.callToAction?.url); return url.origin === articleUrl.origin && url.pathname === articleUrl.pathname; } catch { return false; }
    });
    requireThat(matches.length <= 1, "Mehrere Google-Beiträge für diesen Artikel gefunden; manuell prüfen.");
    const save = post => {
      requireThat(typeof post.name === "string" && post.name.startsWith(`${parent}/localPosts/`) && ["LIVE", "PROCESSING", "REJECTED"].includes(post.state), "Google-Beitrags-ID oder Status fehlt; kein erneuter POST.");
      const state = { articleSlug: article.slug, parent, payloadHash, postName: post.name, status: post.state, checkedAt: new Date().toISOString() };
      ledger.write(state);
      requireThat(post.state !== "REJECTED", "Google hat den Beitrag abgelehnt; redaktionelle Prüfung erforderlich.");
      return state;
    };
    if (matches.length) {
      requireThat(matches[0].summary === preview.payload.summary, "Vorhandener Google-Beitrag hat abweichenden Text; keine automatische Änderung.");
      return save(matches[0]);
    }
    requireThat(!previous, "Früherer Schreibversuch vorhanden, aber remote nicht gefunden; nicht blind erneut senden.");
    requireThat(/^\d{4}-\d{2}-\d{2}$/.test(status.revalidateAfter || "") && status.revalidateAfter >= today, "Aktualitätsfreigabe ist abgelaufen; kein neuer Google-Beitrag.");
    ledger.write({ articleSlug: article.slug, parent, payloadHash, status: "sending_unknown", attemptedAt: new Date().toISOString() });
    return save(await client.create(parent, preview.payload));
  } finally { ledger.unlock(); }
}

// Explicit CLI only; not wired to a schedule. Preview makes no network requests.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const runDirectory = resolve(process.argv[2] || "");
    requireThat(process.argv[2], "Artikellauf als Verzeichnis angeben.");
    const preview = prepareGoogleBusinessPost(runDirectory);
    const enabled = process.argv.includes("--publish") && process.env.GBP_PUBLISH_ENABLED === "true";
    if (!enabled) console.log(JSON.stringify({ ...preview, payloadHash: sha256(preview.payload) }, null, 2));
    else {
      const { article, status, errors } = validateRun(runDirectory, { requirePublishable: true });
      assertValid(errors);
      requireThat(process.env.GBP_STATE_DIRECTORY, "Dauerhaftes GBP_STATE_DIRECTORY erforderlich; kein flüchtiger CI-Arbeitsordner.");
      const parent = process.env.GBP_LOCATION_NAME;
      const publishedArticle = JSON.parse(readFileSync(resolve("automation/blog/published", `${article.slug}.json`), "utf8"));
      const client = await createGoogleBusinessClient(process.env);
      const ledger = createFileLedger(resolve(process.env.GBP_STATE_DIRECTORY), `${parent}:${article.slug}`);
      console.log(JSON.stringify(await publishGoogleBusinessPost({ preview, article, status, publishedArticle, parent, enabled, approvedPayloadHash: process.env.GBP_APPROVED_PAYLOAD_SHA256, ledger, client }), null, 2));
    }
  } catch (error) {
    // Own errors only; filesystem errors may contain private local paths but never contents.
    console.error(error instanceof Error && !error.code ? error.message : "Google-Business-Konfiguration oder Zustandsdatei konnte nicht gelesen werden.");
    process.exitCode = 1;
  }
}

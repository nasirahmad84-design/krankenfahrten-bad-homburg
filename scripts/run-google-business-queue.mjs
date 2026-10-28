import { readFileSync, existsSync, readdirSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { prepareGoogleBusinessPost } from "./prepare-google-business-post.mjs";
import { assertValid, validateRun } from "./lib/blog-pipeline.mjs";
import { berlinDate } from "./lib/blog-queue.mjs";
import { createGoogleBusinessClient, publishGoogleBusinessPost } from "./lib/google-business-publisher.mjs";
import { createGitLedger } from "./lib/google-business-git-ledger.mjs";

export const GBP_LOCATION = "accounts/111505448904866961656/locations/14639701242816410626";

export function googleQueue(root, today = berlinDate()) {
  const approvals = JSON.parse(readFileSync(resolve(root, "automation/blog/google-business-approvals.json"), "utf8"));
  const items = [];
  for (const entry of readdirSync(resolve(root, "automation/blog/articles"), { withFileTypes: true })) {
    const directory = resolve(root, "automation/blog/articles", entry.name);
    if (!entry.isDirectory() || !existsSync(resolve(directory, "run-status.json"))) continue;
    const status = JSON.parse(readFileSync(resolve(directory, "run-status.json"), "utf8"));
    const approval = approvals[status.articleSlug];
    if (approval?.status !== "approved" || approval.automaticPublishing !== true || status.scheduledDate > today) continue;
    const result = validateRun(directory, { requirePublishable: true });
    assertValid(result.errors);
    const preview = prepareGoogleBusinessPost(directory);
    const hash = createHash("sha256").update(JSON.stringify(preview.payload)).digest("hex");
    if (approval.payloadHash !== hash || preview.payload.media?.length !== 1) throw new Error("Freigegebener Google-Payload oder Bild fehlt bzw. wurde geändert.");
    const publishedPath = resolve(root, "automation/blog/published", result.article.slug + ".json");
    const published = existsSync(publishedPath) ? JSON.parse(readFileSync(publishedPath, "utf8")) : null;
    // Promotion may change publication timestamps, but never silently accept changed text.
    if (published) {
      const omitDates = value => { const copy = { ...value }; delete copy.publishedAt; delete copy.updatedAt; return copy; };
      if (JSON.stringify(omitDates(published)) !== JSON.stringify(omitDates(result.article))) throw new Error("Live-Register weicht inhaltlich vom freigegebenen Artikel ab.");
    }
    items.push({ directory, status, article: published || result.article, published, preview, approval, hash });
  }
  return items.sort((a, b) => a.status.scheduledDate.localeCompare(b.status.scheduledDate));
}

export async function runGoogleQueue(root, env = process.env) {
  const today = berlinDate();
  const items = googleQueue(root, today);
  const enabled = env.GBP_QUEUE_ENABLED === "true" && env.GBP_QUEUE_DRY_RUN !== "true";
  // Preflight validates OAuth even before the first publication date, without any POST.
  const client = await createGoogleBusinessClient(env);
  await client.list(GBP_LOCATION);
  console.log("Google-OAuth und Zielprofil erfolgreich geprüft.");
  if (enabled && !env.GBP_STATE_DIRECTORY) throw new Error("Persistentes Google-Zustandsverzeichnis fehlt.");
  let changed = false;
  for (const item of items) {
    if (!item.published) {
      console.log(item.article.slug + ": wartet auf bestätigten Artikel-Livegang.");
      if (item.status.scheduledDate < today) throw new Error("Überfälliger Google-Beitrag: Artikel fehlt im Live-Register.");
      continue;
    }
    if (!enabled) { console.log(item.article.slug + ": geprüfte Vorschau, kein POST."); continue; }
    const ledger = createGitLedger(env.GBP_STATE_DIRECTORY, GBP_LOCATION + ":" + item.article.slug);
    const before = ledger.read();
    const result = await publishGoogleBusinessPost({
      preview: item.preview, article: item.article, status: item.status, publishedArticle: item.published,
      parent: GBP_LOCATION, enabled: true, approvedPayloadHash: item.approval.payloadHash,
      googleApproval: item.approval, ledger,
      client, today,
    });
    console.log(item.article.slug + ": " + result.status);
    if (JSON.stringify(before) !== JSON.stringify(result)) changed = true;
    if (result.status === "PROCESSING" && Date.now() - Date.parse(result.firstSeenAt) > 24 * 60 * 60 * 1000) throw new Error("Google-Beitrag seit über 24 Stunden in Prüfung.");
  }
  if (!items.length) console.log("Noch kein Google-Beitrag fällig; keine Veröffentlichung.");
  if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, "changed=" + changed + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runGoogleQueue(process.cwd()).catch(error => { console.error(error.code ? "Google-Konfiguration oder Zustandsdatei nicht lesbar." : error.message); process.exitCode = 1; });
}

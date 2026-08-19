import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { REQUIRED_CLAIM_HEADERS, validateArticle, validateRun } from "./blog-pipeline.mjs";

const API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5-mini";
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const REVIEW_GATES = ["sourceGate", "claimGate", "serviceGate", "legalSensitivityGate", "seoGate"];

export function outputTextFromResponse(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) return response.output_text;
  return (response?.output ?? [])
    .flatMap((item) => item?.content ?? [])
    .filter((item) => item?.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("");
}

export function parseJsonOutput(response, label) {
  const output = outputTextFromResponse(response).trim();
  if (!output) throw new Error(`${label}: Die API lieferte keinen Textinhalt.`);
  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`${label}: Die API-Antwort ist kein gültiges JSON.`);
  }
}

export function csvEscape(value) {
  const text = String(value ?? "").replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function claimsToCsv(claims) {
  return [
    REQUIRED_CLAIM_HEADERS.join(","),
    ...claims.map((claim) => REQUIRED_CLAIM_HEADERS.map((header) => csvEscape(claim?.[header])).join(",")),
  ].join("\n") + "\n";
}

function safeRunPart(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "ohne-thema";
}

function uniqueRunDirectory(root, scheduledDate, topicOrSlug) {
  const base = `${scheduledDate}-${safeRunPart(topicOrSlug)}`;
  const parent = resolve(root, "automation/blog/articles");
  let runId = base;
  let counter = 2;
  while (existsSync(join(parent, runId))) {
    runId = `${base}-${counter}`;
    counter += 1;
  }
  return { runId, runDirectory: join(parent, runId) };
}

function ensureString(value, label, minimum = 1) {
  if (typeof value !== "string" || value.trim().length < minimum) throw new Error(`${label} fehlt oder ist zu kurz.`);
  return value.trim();
}

function normalizeClaims(claims, articleSlug) {
  if (!Array.isArray(claims) || claims.length < 1) throw new Error("Das Claim-Register ist leer.");
  return claims.map((claim, index) => {
    const normalized = Object.fromEntries(REQUIRED_CLAIM_HEADERS.map((header) => [header, String(claim?.[header] ?? "").trim()]));
    normalized.claim_id ||= `C-${index + 1}`;
    normalized.article_slug = articleSlug;
    return normalized;
  });
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function persistNoTopicRun(root, scheduledDate, result) {
  const topic = ensureString(result?.topic || "Kein veröffentlichbares Thema", "Thema");
  const brief = ensureString(result?.researchBrief, "Recherchebrief", 80);
  const { runId, runDirectory } = uniqueRunDirectory(root, scheduledDate, "kein-veroeffentlichbares-thema");
  mkdirSync(runDirectory, { recursive: false });
  writeJson(join(runDirectory, "run-status.json"), {
    schemaVersion: 1,
    runId,
    scheduledDate,
    articleSlug: null,
    topic,
    status: "no_publishable_topic",
    sourceGate: "not_checked",
    claimGate: "not_checked",
    serviceGate: "not_checked",
    legalSensitivityGate: "not_checked",
    seoGate: "not_checked",
    livePublishing: false,
    facebookPublishing: false,
  });
  writeFileSync(join(runDirectory, "research-brief.md"), `${brief}\n`, "utf8");
  const validation = validateRun(runDirectory);
  if (validation.errors.length) throw new Error(validation.errors.join("\n"));
  return { status: "no_publishable_topic", runId, runDirectory, slug: "" };
}

export function persistReviewedRun(root, scheduledDate, writerResult, reviewerResult, allowedServiceSlugs) {
  const article = reviewerResult?.article;
  const articleErrors = validateArticle(article, "Review-Artikel");
  if (articleErrors.length) throw new Error(articleErrors.join("\n"));
  const serviceSlugs = new Set(allowedServiceSlugs);
  const unknownServices = (article.relatedServiceSlugs ?? []).filter((slug) => !serviceSlugs.has(slug));
  if (unknownServices.length) throw new Error(`Unbekannte Leistungs-Slugs: ${unknownServices.join(", ")}`);

  const publishedPath = resolve(root, "automation/blog/published", `${article.slug}.json`);
  if (existsSync(publishedPath)) throw new Error(`Der Artikel-Slug ist bereits veröffentlicht: ${article.slug}`);

  const decision = reviewerResult?.decision === "approved_for_publish" ? "approved_for_publish" : "blocked";
  const gates = Object.fromEntries(REVIEW_GATES.map((gate) => [gate, reviewerResult?.[gate] === "passed" ? "passed" : "failed"]));
  const claims = normalizeClaims(reviewerResult?.claims, article.slug);
  const researchBrief = ensureString(reviewerResult?.researchBrief || writerResult?.researchBrief, "Recherchebrief", 80);
  const facebookDraft = ensureString(reviewerResult?.facebookDraft || writerResult?.facebookDraft, "Facebook-Entwurf", 80);
  const topic = ensureString(reviewerResult?.topic || writerResult?.topic || article.title, "Thema");
  const approved = decision === "approved_for_publish"
    && REVIEW_GATES.every((gate) => gates[gate] === "passed")
    && claims.every((claim) => claim.status !== "blocked");
  const status = approved ? "approved_for_publish" : "blocked";
  const { runId, runDirectory } = uniqueRunDirectory(root, scheduledDate, article.slug);
  mkdirSync(runDirectory, { recursive: false });

  writeJson(join(runDirectory, "article.json"), article);
  writeFileSync(join(runDirectory, "research-brief.md"), `${researchBrief}\n`, "utf8");
  writeFileSync(join(runDirectory, "claim-register.csv"), claimsToCsv(claims), "utf8");
  writeFileSync(join(runDirectory, "facebook-draft.md"), `${facebookDraft}\n`, "utf8");
  writeJson(join(runDirectory, "run-status.json"), {
    schemaVersion: 1,
    runId,
    scheduledDate,
    articleSlug: article.slug,
    topic,
    status,
    ...gates,
    livePublishing: false,
    facebookPublishing: false,
    reviewNotes: String(reviewerResult?.reviewNotes ?? "").trim(),
  });

  const validation = validateRun(runDirectory, { requirePublishable: approved });
  if (validation.errors.length) throw new Error(validation.errors.join("\n"));
  return { status, runId, runDirectory, slug: article.slug };
}

export function loadCloudContext(root) {
  const read = (path) => readFileSync(resolve(root, path), "utf8");
  const publishedDirectory = resolve(root, "automation/blog/published");
  const published = existsSync(publishedDirectory)
    ? readdirSync(publishedDirectory).filter((file) => file.endsWith(".json")).sort().map((file) => JSON.parse(readFileSync(join(publishedDirectory, file), "utf8")))
    : [];
  const servicesSource = read("src/content/services.ts");
  const serviceSlugs = [...servicesSource.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((match) => match[1]);
  return {
    editorialPolicy: read("automation/blog/editorial-policy.md"),
    servicesSource,
    faqSource: read("src/content/faq.ts"),
    siteConfigSource: read("src/lib/site-config.ts"),
    published,
    serviceSlugs,
  };
}

export async function requestJson({ apiKey, model = DEFAULT_MODEL, instructions, input, fetchImpl = fetch }) {
  if (!apiKey) throw new Error("OPENAI_API_KEY fehlt.");
  const requestBody = {
    model,
    store: false,
    tools: [{ type: "web_search", search_context_size: "high", user_location: { type: "approximate", country: "DE", city: "Bad Homburg", region: "Hessen" } }],
    input: [
      { role: "system", content: [{ type: "input_text", text: instructions }] },
      { role: "user", content: [{ type: "input_text", text: input }] },
    ],
    text: { format: { type: "json_object" } },
    max_output_tokens: 14000,
  };

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 150_000);
    try {
      const response = await fetchImpl(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload?.error?.message || `HTTP ${response.status}`;
        if (attempt < 2 && RETRYABLE_STATUS_CODES.has(response.status)) {
          await new Promise((resolvePromise) => setTimeout(resolvePromise, 1500));
          continue;
        }
        throw new Error(`OpenAI API: ${message}`);
      }
      if (payload?.status === "incomplete") throw new Error("OpenAI API: Antwort wurde unvollständig beendet.");
      return payload;
    } catch (error) {
      lastError = error;
      if (attempt >= 2 || error?.name !== "AbortError") throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

export function contextFingerprint(context) {
  return createHash("sha256").update(JSON.stringify(context)).digest("hex").slice(0, 12);
}

export function githubOutput(result, path = process.env.GITHUB_OUTPUT) {
  if (!path) return;
  const relativeRunDirectory = result.runDirectory.replace(`${process.cwd()}/`, "");
  writeFileSync(path, `status=${result.status}\nrun_id=${result.runId}\nrun_directory=${relativeRunDirectory}\nslug=${result.slug}\n`, { flag: "a" });
}

export const BLOG_CLOUD_DEFAULT_MODEL = DEFAULT_MODEL;

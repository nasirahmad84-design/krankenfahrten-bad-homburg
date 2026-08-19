import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLISHABLE_STATUSES = new Set(["approved_for_publish"]);
const RUN_STATUSES = new Set([
  "draft_ready",
  "approved_for_publish",
  "blocked",
  "rejected",
  "no_publishable_topic",
]);
const GATES = ["sourceGate", "claimGate", "serviceGate", "legalSensitivityGate", "seoGate"];
const SENSITIVE_CLAIM_TYPES = new Set([
  "coverage",
  "eligibility",
  "legal",
  "medical",
  "prescription",
  "service-boundary",
]);

export const REQUIRED_CLAIM_HEADERS = [
  "claim_id",
  "article_slug",
  "claim_text",
  "claim_type",
  "source_id",
  "source_url",
  "source_locator",
  "status",
  "checked_at",
  "review_note",
];

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function parseCsv(input) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (quoted) throw new Error("CSV enthält ein nicht geschlossenes Anführungszeichen.");
  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

export function validateArticle(article, context = "Artikel") {
  const errors = [];
  const requiredStrings = [
    "slug",
    "title",
    "metadataTitle",
    "description",
    "format",
    "publishedAt",
    "updatedAt",
    "reviewedAt",
    "intro",
  ];

  for (const field of requiredStrings) {
    if (typeof article?.[field] !== "string" || article[field].trim() === "") {
      errors.push(`${context}: ${field} fehlt.`);
    }
  }
  if (!SLUG_PATTERN.test(article?.slug ?? "")) errors.push(`${context}: ungültiger Slug.`);
  if (!DATE_PATTERN.test(article?.publishedAt ?? "")) errors.push(`${context}: publishedAt ist ungültig.`);
  if (!DATE_PATTERN.test(article?.updatedAt ?? "")) errors.push(`${context}: updatedAt ist ungültig.`);
  if (!DATE_PATTERN.test(article?.reviewedAt ?? "")) errors.push(`${context}: reviewedAt ist ungültig.`);
  if (!new Set(["Ratgeber", "Aktuelle Information", "Einordnung"]).has(article?.format)) {
    errors.push(`${context}: unbekanntes Artikelformat.`);
  }
  if ((article?.metadataTitle?.length ?? 0) < 25 || article.metadataTitle.length > 60) {
    errors.push(`${context}: metadataTitle muss 25 bis 60 Zeichen lang sein.`);
  }
  if ((article?.description?.length ?? 0) < 110 || article.description.length > 160) {
    errors.push(`${context}: description muss 110 bis 160 Zeichen lang sein.`);
  }
  if (!Number.isInteger(article?.readingTimeMinutes) || article.readingTimeMinutes < 1 || article.readingTimeMinutes > 30) {
    errors.push(`${context}: readingTimeMinutes muss zwischen 1 und 30 liegen.`);
  }
  if (!Array.isArray(article?.summary) || article.summary.length < 3) errors.push(`${context}: mindestens drei Kernaussagen fehlen.`);
  if (!Array.isArray(article?.sections) || article.sections.length < 3) errors.push(`${context}: mindestens drei Abschnitte fehlen.`);
  if (!Array.isArray(article?.faqs) || article.faqs.length < 2) errors.push(`${context}: mindestens zwei FAQ fehlen.`);
  if (!Array.isArray(article?.sources) || article.sources.length < 2) errors.push(`${context}: mindestens zwei Quellen fehlen.`);
  if (!Array.isArray(article?.relatedServiceSlugs)) errors.push(`${context}: relatedServiceSlugs fehlt.`);

  const sources = Array.isArray(article?.sources) ? article.sources : [];
  const sourceIds = new Set();
  for (const source of sources) {
    if (!source?.id || sourceIds.has(source.id)) errors.push(`${context}: Quellen-ID fehlt oder ist doppelt.`);
    sourceIds.add(source?.id);
    if (!source?.title || !source?.publisher) errors.push(`${context}: Quelle ${source?.id ?? "?"} ist unvollständig.`);
    if (!/^https:\/\//.test(source?.url ?? "")) errors.push(`${context}: Quelle ${source?.id ?? "?"} benötigt eine HTTPS-URL.`);
    if (!DATE_PATTERN.test(source?.checkedAt ?? "")) errors.push(`${context}: Quelle ${source?.id ?? "?"} hat kein gültiges Prüfdatum.`);
  }

  const usedSourceIds = new Set();
  for (const section of Array.isArray(article?.sections) ? article.sections : []) {
    if (!section?.id || !section?.title || !Array.isArray(section?.paragraphs) || section.paragraphs.length < 1) {
      errors.push(`${context}: ein Abschnitt ist unvollständig.`);
    }
    if (!Array.isArray(section?.sourceIds) || section.sourceIds.length < 1) {
      errors.push(`${context}: Abschnitt ${section?.id ?? "?"} hat keine Quellenreferenz.`);
    }
    for (const sourceId of section?.sourceIds ?? []) {
      usedSourceIds.add(sourceId);
      if (!sourceIds.has(sourceId)) errors.push(`${context}: Abschnitt referenziert unbekannte Quelle ${sourceId}.`);
    }
  }
  for (const sourceId of sourceIds) {
    if (!usedSourceIds.has(sourceId)) errors.push(`${context}: Quelle ${sourceId} wird in keinem Abschnitt verwendet.`);
  }

  return errors;
}

export function validateRun(runDirectory, { requirePublishable = false } = {}) {
  const errors = [];
  const statusPath = join(runDirectory, "run-status.json");
  const status = readJson(statusPath);
  const runName = basename(runDirectory);

  if (status.schemaVersion !== 1) errors.push("run-status.json: schemaVersion muss 1 sein.");
  if (status.runId !== runName) errors.push("run-status.json: runId muss dem Verzeichnisnamen entsprechen.");
  if (!RUN_STATUSES.has(status.status)) errors.push("run-status.json: unbekannter Status.");
  if (!DATE_PATTERN.test(status.scheduledDate ?? "")) errors.push("run-status.json: scheduledDate ist ungültig.");
  if (status.livePublishing !== false || status.facebookPublishing !== false) {
    errors.push("run-status.json: Deployment und Facebook-Veröffentlichung werden ausschließlich vom kontrollierten Publisher gesteuert.");
  }

  if (status.status === "no_publishable_topic") {
    const researchBrief = readFileSync(join(runDirectory, "research-brief.md"), "utf8");
    if (researchBrief.trim().length < 80) errors.push("Recherchebrief für den verworfenen Lauf ist zu kurz.");
    if (requirePublishable) errors.push("Der Lauf enthält bewusst kein veröffentlichbares Thema.");
    return { article: null, claims: [], errors, status };
  }

  const article = readJson(join(runDirectory, "article.json"));
  errors.push(...validateArticle(article));
  if (article.slug !== status.articleSlug) errors.push("Artikel-Slug und Laufstatus stimmen nicht überein.");

  const researchBrief = readFileSync(join(runDirectory, "research-brief.md"), "utf8");
  const facebookDraft = readFileSync(join(runDirectory, "facebook-draft.md"), "utf8");
  for (const source of article.sources ?? []) {
    if (!researchBrief.includes(source.url)) errors.push(`Recherchebrief enthält Quelle ${source.id} nicht.`);
  }
  if (!facebookDraft.includes("{{ARTICLE_URL}}")) errors.push("Facebook-Entwurf benötigt den Platzhalter {{ARTICLE_URL}}.");
  if (facebookDraft.length < 80 || facebookDraft.length > 1500) errors.push("Facebook-Entwurf muss 80 bis 1.500 Zeichen lang sein.");

  const csvRows = parseCsv(readFileSync(join(runDirectory, "claim-register.csv"), "utf8"));
  const [headers = [], ...dataRows] = csvRows;
  if (headers.join("|") !== REQUIRED_CLAIM_HEADERS.join("|")) errors.push("Claim-Register besitzt nicht das verbindliche Schema.");
  const claims = dataRows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
  if (claims.length < 1) errors.push("Claim-Register enthält keine Claims.");

  const articleSourceUrls = new Set((article.sources ?? []).map(({ url }) => url));
  const claimIds = new Set();
  const claimedWebSourceUrls = new Set();
  for (const claim of claims) {
    if (!claim.claim_id || claimIds.has(claim.claim_id)) errors.push(`Claim-ID fehlt oder ist doppelt: ${claim.claim_id || "?"}.`);
    claimIds.add(claim.claim_id);
    if (claim.article_slug !== article.slug) errors.push(`Claim ${claim.claim_id}: falscher Artikel-Slug.`);
    if (!new Set(["verified", "inference", "blocked"]).has(claim.status)) errors.push(`Claim ${claim.claim_id}: ungültiger Status.`);
    if (!DATE_PATTERN.test(claim.checked_at ?? "")) errors.push(`Claim ${claim.claim_id}: ungültiges Prüfdatum.`);
    if (/^https:\/\//.test(claim.source_url)) {
      claimedWebSourceUrls.add(claim.source_url);
      if (!articleSourceUrls.has(claim.source_url)) errors.push(`Claim ${claim.claim_id}: Webquelle fehlt in article.json.`);
    } else if (!/^(?:src|automation|deployment)\//.test(claim.source_url)) {
      errors.push(`Claim ${claim.claim_id}: lokale Quelle liegt außerhalb der erlaubten Bereiche.`);
    }
    if (claim.status === "inference" && SENSITIVE_CLAIM_TYPES.has(claim.claim_type)) {
      errors.push(`Claim ${claim.claim_id}: sensibler Claim darf keine inference sein.`);
    }
  }
  for (const sourceUrl of articleSourceUrls) {
    if (!claimedWebSourceUrls.has(sourceUrl)) errors.push(`Artikelquelle ohne zugehörigen Claim: ${sourceUrl}.`);
  }

  const publishable = PUBLISHABLE_STATUSES.has(status.status);
  if (requirePublishable && !publishable) errors.push("Lauf ist nicht zur Veröffentlichung freigegeben.");
  if (publishable || requirePublishable) {
    for (const gate of GATES) {
      if (status[gate] !== "passed") errors.push(`run-status.json: ${gate} ist nicht bestanden.`);
    }
    if (claims.some(({ status: claimStatus }) => claimStatus === "blocked")) errors.push("Ein blockierter Claim verhindert die Veröffentlichung.");
  }

  return { article, claims, errors, status };
}

export function assertValid(errors) {
  if (errors.length > 0) throw new Error(errors.map((error) => `- ${error}`).join("\n"));
}

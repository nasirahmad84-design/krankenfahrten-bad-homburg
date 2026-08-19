import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  BLOG_CLOUD_DEFAULT_MODEL,
  contextFingerprint,
  githubOutput,
  loadCloudContext,
  parseJsonOutput,
  persistNoTopicRun,
  persistReviewedRun,
  requestJson,
  reviewedOutputErrors,
} from "./lib/blog-cloud.mjs";

const root = process.cwd();
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_BLOG_MODEL || BLOG_CLOUD_DEFAULT_MODEL;
const scheduledDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const articleShape = readFileSync(resolve(root, "automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json"), "utf8");
const context = loadCloudContext(root);

const writerInstructions = `Du bist die recherchierende Fachredaktion für Krankenfahrten Bad Homburg. Recherchiere vor dem Schreiben mit dem Web-Suchwerkzeug. Verwende für sensible fachliche Aussagen aktuelle Primärquellen. Gib ausschließlich ein JSON-Objekt zurück, niemals Markdown außerhalb der JSON-Werte. Erfinde keine Leistungen, Preise, Garantien, Personen, Erfahrungen oder lokalen Fakten. Bei fehlender Evidenz wähle no_publishable_topic.`;
const writerInput = `Datum in Deutschland: ${scheduledDate}

AUFGABE
Finde ein aktuelles oder dauerhaft relevantes, praktisch nützliches Thema für Patienten oder Angehörige im bestätigten Leistungsbereich. Bereits veröffentlichte Themen dürfen nicht dupliziert werden. Recherchiere online, öffne jede verwendete Quelle und schreibe anschließend einen eigenständigen deutschen Entwurf.

ANTWORTFORMAT
{
  "status": "draft_ready" oder "no_publishable_topic",
  "topic": "...",
  "researchBrief": "mindestens 80 Zeichen, mit jeder verwendeten vollständigen HTTPS-URL und kurzer Fundstellen-/Aktualitätsnotiz",
  "article": null oder Artikelobjekt exakt wie das Beispiel,
  "claims": [Objekte mit claim_id, article_slug, claim_text, claim_type, source_id, source_url, source_locator, status, checked_at, review_note],
  "facebookDraft": "80 bis 1500 Zeichen, eigenständiger Text mit {{ARTICLE_URL}}"
}
Für draft_ready: mindestens zwei Quellen und Claims; checked_at sowie alle Artikeldaten = ${scheduledDate}; Claim-Status nur verified, inference oder blocked. Sensible Claims niemals inference. Jede Artikelquelle muss in mindestens einem Claim vorkommen. Jede Sektion benötigt sourceIds. relatedServiceSlugs nur aus: ${context.serviceSlugs.join(", ")}.

REDAKTIONELLE RICHTLINIE
${context.editorialPolicy}

BESTÄTIGTE LEISTUNGEN
${context.servicesSource}

BESTÄTIGTE FAQ
${context.faqSource}

UNTERNEHMENSDATEN
${context.siteConfigSource}

BEREITS VERÖFFENTLICHTE ARTIKEL
${JSON.stringify(context.published.map(({ slug, title, summary }) => ({ slug, title, summary })), null, 2)}

STRUKTURBEISPIEL FÜR ARTICLE
${articleShape}`;

try {
  console.log(`Starte recherchierenden Cloud-Lauf (${model}, Kontext ${contextFingerprint(context)}) …`);
  const writerResponse = await requestJson({ apiKey, model, instructions: writerInstructions, input: writerInput });
  const writerResult = parseJsonOutput(writerResponse, "Recherchelauf");

  if (writerResult.status === "no_publishable_topic") {
    const result = persistNoTopicRun(root, scheduledDate, writerResult);
    githubOutput(result);
    console.log(`Kein veröffentlichbares Thema: ${result.runId}`);
    process.exit(0);
  }
  if (writerResult.status !== "draft_ready" || !writerResult.article) throw new Error("Recherchelauf lieferte keinen gültigen Entwurfsstatus.");

  const reviewerInstructions = `Du bist eine unabhängige, kritische zweite Fachredaktion. Du erhältst einen Entwurf, aber keinen vorherigen Gesprächsverlauf. Öffne und prüfe jede externe Quelle mit dem Web-Suchwerkzeug erneut. Korrigiere belegbare Mängel. Blockiere bei einem ungeklärten Kernclaim. Gib ausschließlich ein JSON-Objekt zurück, niemals Markdown außerhalb der JSON-Werte.`;
  const reviewerInput = `Datum in Deutschland: ${scheduledDate}

PRÜFAUFTRAG
Prüfe Quelle, Claim, bestätigten Leistungsumfang, rechtlich/medizinisch sensible Formulierungen, Suchintention, Eigenständigkeit und SEO. Der korrigierte Artikel muss das vorgegebene Artikelschema erfüllen. Jede Quelle muss im Recherchebrief als vollständige URL und in mindestens einem Claim vorkommen. Der Facebook-Entwurf benötigt {{ARTICLE_URL}}.

ANTWORTFORMAT
{
  "decision": "approved_for_publish" oder "blocked",
  "topic": "...",
  "reviewNotes": "...",
  "sourceGate": "passed" oder "failed",
  "claimGate": "passed" oder "failed",
  "serviceGate": "passed" oder "failed",
  "legalSensitivityGate": "passed" oder "failed",
  "seoGate": "passed" oder "failed",
  "researchBrief": "...",
  "article": korrigiertes vollständiges Artikelobjekt,
  "claims": [vollständige Claim-Objekte],
  "facebookDraft": "... {{ARTICLE_URL}} ..."
}
Nur wenn alle fünf Gates passed sind und kein Claim blocked ist, darf decision approved_for_publish sein. relatedServiceSlugs nur aus: ${context.serviceSlugs.join(", ")}.
Formale Pflichtwerte: metadataTitle 25 bis 60 Zeichen, description 110 bis 160 Zeichen, mindestens drei summary-Punkte, mindestens drei Abschnitte, mindestens zwei FAQ und mindestens zwei Quellen.

REDAKTIONELLE RICHTLINIE
${context.editorialPolicy}

BESTÄTIGTE LEISTUNGEN
${context.servicesSource}

BESTÄTIGTE FAQ
${context.faqSource}

BEREITS VERÖFFENTLICHTE THEMEN
${JSON.stringify(context.published.map(({ slug, title, summary }) => ({ slug, title, summary })), null, 2)}

ZU PRÜFENDER ENTWURF
${JSON.stringify(writerResult)}`;

  console.log("Starte unabhängigen Quellen- und Claim-Review …");
  const reviewerResponse = await requestJson({ apiKey, model, instructions: reviewerInstructions, input: reviewerInput });
  let reviewerResult = parseJsonOutput(reviewerResponse, "Reviewlauf");
  const formalErrors = reviewedOutputErrors(reviewerResult, context.serviceSlugs);
  if (formalErrors.length > 0) {
    console.log("Reviewer korrigiert einmalig formale Validatorfehler …");
    const repairInput = `Korrigiere ausschließlich die folgenden formalen Validatorfehler in deinem geprüften Ergebnis. Verändere keine belegten Aussagen, Quellen, Freigabeentscheidung oder Gates ohne sachlichen Grund. Gib wieder ausschließlich das vollständige JSON-Objekt im zuvor verlangten Reviewformat zurück.\n\nFEHLER\n${formalErrors.map((error) => `- ${error}`).join("\n")}\n\nGEPRÜFTES ERGEBNIS\n${JSON.stringify(reviewerResult)}`;
    const repairedResponse = await requestJson({ apiKey, model, instructions: reviewerInstructions, input: repairInput });
    reviewerResult = parseJsonOutput(repairedResponse, "Reviewkorrektur");
  }
  const result = persistReviewedRun(root, scheduledDate, writerResult, reviewerResult, context.serviceSlugs);
  githubOutput(result);
  console.log(`Review abgeschlossen: ${result.status} (${result.runId}).`);
} catch (error) {
  console.error(`Cloud-Bloglauf abgebrochen: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

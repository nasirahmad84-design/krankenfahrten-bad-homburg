import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  claimsToCsv,
  csvEscape,
  outputTextFromResponse,
  parseJsonOutput,
  persistNoTopicRun,
  persistReviewedRun,
  requestJson,
} from "../scripts/lib/blog-cloud.mjs";

const projectRoot = process.cwd();
const pilot = JSON.parse(readFileSync(join(projectRoot, "automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json"), "utf8"));

function temporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), "blog-cloud-"));
  mkdirSync(join(root, "automation/blog/articles"), { recursive: true });
  mkdirSync(join(root, "automation/blog/published"), { recursive: true });
  return root;
}

function reviewedFixture(slug = "testartikel-cloud") {
  const article = {
    ...pilot,
    slug,
    title: "Sicher organisierte Krankenfahrt: Was vor dem Termin wichtig ist",
    metadataTitle: "Krankenfahrt sicher organisieren in Bad Homburg",
    description: "Welche Angaben für eine planbare sitzende Krankenfahrt wichtig sind und wie Patienten sowie Angehörige den Termin zuverlässig vorbereiten.",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    reviewedAt: "2026-08-19",
  };
  const claims = article.sources.map((source: { id: string; url: string }, index: number) => ({
    claim_id: `C-${index + 1}`,
    article_slug: slug,
    claim_text: `Belegter Claim ${index + 1}`,
    claim_type: "definition",
    source_id: source.id,
    source_url: source.url,
    source_locator: "Geprüfter Abschnitt",
    status: "verified",
    checked_at: "2026-08-19",
    review_note: "Quelle erneut geöffnet",
  }));
  const brief = `${article.sources.map(({ url }: { url: string }) => url).join("\n")}\nAlle Quellen wurden am 2026-08-19 durch die zweite Redaktion erneut geprüft.`;
  return {
    writer: { topic: article.title, researchBrief: brief, facebookDraft: "Praktische Hinweise zur Vorbereitung einer Krankenfahrt. Mehr erfahren: {{ARTICLE_URL}}" },
    reviewer: {
      decision: "approved_for_publish",
      topic: article.title,
      reviewNotes: "Alle Quellen und Claims geprüft.",
      sourceGate: "passed",
      claimGate: "passed",
      serviceGate: "passed",
      legalSensitivityGate: "passed",
      seoGate: "passed",
      article,
      claims,
      researchBrief: brief,
      facebookDraft: "Praktische Hinweise für Patienten und Angehörige zur Vorbereitung einer sitzenden Krankenfahrt. Mehr erfahren: {{ARTICLE_URL}}",
    },
  };
}

test("liest strukturierten Text aus beiden Responses-API-Ausgabeformen", () => {
  assert.equal(outputTextFromResponse({ output_text: '{"ok":true}' }), '{"ok":true}');
  assert.equal(outputTextFromResponse({ output: [{ content: [{ type: "output_text", text: '{"ok":true}' }] }] }), '{"ok":true}');
});

test("akzeptiert ein eng begrenztes JSON-Objekt auch nach einer Markdown-Einfassung", () => {
  assert.deepEqual(parseJsonOutput({ output_text: "```json\n{\"ok\":true}\n```" }, "Test"), { ok: true });
  assert.throws(() => parseJsonOutput({ output_text: "kein JSON" }, "Test"), /kein gültiges JSON-Objekt/);
});

test("maskiert Claim-CSV ohne Schemaänderung", () => {
  assert.equal(csvEscape('Text mit, Komma und "Zitat"'), '"Text mit, Komma und ""Zitat"""');
  const csv = claimsToCsv([{ claim_id: "C-1", claim_text: "Zeile 1\nZeile 2" }]);
  assert.match(csv, /^claim_id,article_slug,claim_text,/);
  assert.match(csv, /"Zeile 1\nZeile 2"/);
});

test("persistiert no_publishable_topic ohne öffentliche Artikeldaten", () => {
  const root = temporaryRoot();
  try {
    const result = persistNoTopicRun(root, "2026-08-19", {
      topic: "Kein hinreichend belegbares Thema",
      researchBrief: "Die Recherche ergab heute kein neues Thema mit ausreichend belastbaren Primärquellen und praktischem Mehrwert für die Zielgruppe.",
    });
    assert.equal(result.status, "no_publishable_topic");
    assert.equal(readFileSync(join(result.runDirectory, "run-status.json"), "utf8").includes('"no_publishable_topic"'), true);
    assert.throws(() => readFileSync(join(result.runDirectory, "article.json"), "utf8"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("gibt nur einen vollständig bestandenen unabhängigen Review frei", () => {
  const root = temporaryRoot();
  try {
    const { writer, reviewer } = reviewedFixture();
    const result = persistReviewedRun(root, "2026-08-19", writer, reviewer, pilot.relatedServiceSlugs);
    assert.equal(result.status, "approved_for_publish");
    const status = JSON.parse(readFileSync(join(result.runDirectory, "run-status.json"), "utf8"));
    assert.equal(status.livePublishing, false);
    assert.equal(status.facebookPublishing, false);

    const blocked = persistReviewedRun(root, "2026-08-19", writer, { ...reviewer, article: { ...reviewer.article, slug: "blockierter-testartikel" }, sourceGate: "failed" }, pilot.relatedServiceSlugs);
    assert.equal(blocked.status, "blocked");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("sendet den Schlüssel nur als Authorization-Header und fordert Websuche an", async () => {
  let request: { url?: string; options?: RequestInit } = {};
  const fetchImpl = async (url: string, options: RequestInit) => {
    request = { url, options };
    return new Response(JSON.stringify({ output_text: '{"ok":true}' }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  await requestJson({ apiKey: "test-secret", instructions: "Gib JSON zurück.", input: "Test", fetchImpl });
  assert.equal(request.url, "https://api.openai.com/v1/responses");
  assert.equal((request.options?.headers as Record<string, string>).Authorization, "Bearer test-secret");
  const body = JSON.parse(String(request.options?.body));
  assert.deepEqual(body.tools[0].type, "web_search");
  assert.equal(body.store, false);
  assert.equal(body.text, undefined);
  assert.equal(JSON.stringify(body).includes("test-secret"), false);
});

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { generatedPublishedBlogPosts } from "../src/content/generated-blog-posts.ts";
import { parseCsv, validateArticle, validateRun } from "../scripts/lib/blog-pipeline.mjs";

const root = process.cwd();
const pilotPath = join(root, "automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json");
const pilot = JSON.parse(readFileSync(pilotPath, "utf8"));

test("erzeugt öffentliche Ratgeberdaten ausschließlich aus validierten JSON-Dateien", () => {
  assert.deepEqual(generatedPublishedBlogPosts, [pilot]);
  assert.deepEqual(validateArticle(pilot), []);
});

test("verarbeitet korrekt maskierte CSV-Claims", () => {
  const rows = parseCsv('claim_id,claim_text,status\nC-1,"Text mit, Komma und ""Zitat""",verified\n');
  assert.deepEqual(rows, [
    ["claim_id", "claim_text", "status"],
    ["C-1", 'Text mit, Komma und "Zitat"', "verified"],
  ]);
});

test("lässt nur getrennt geprüfte und vollständig belegte Läufe zur Übernahme zu", () => {
  const directory = mkdtempSync(join(tmpdir(), "blog-run-"));
  const runId = directory.split("/").at(-1)!;
  try {
    writeFileSync(join(directory, "article.json"), `${JSON.stringify(pilot, null, 2)}\n`);
    writeFileSync(
      join(directory, "run-status.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        runId,
        scheduledDate: "2026-08-11",
        articleSlug: pilot.slug,
        topic: pilot.title,
        status: "approved_for_publish",
        sourceGate: "passed",
        claimGate: "passed",
        serviceGate: "passed",
        legalSensitivityGate: "passed",
        seoGate: "passed",
        livePublishing: false,
        facebookPublishing: false,
      }, null, 2)}\n`,
    );
    writeFileSync(
      join(directory, "research-brief.md"),
      pilot.sources.map(({ url }: { url: string }) => url).join("\n"),
    );
    writeFileSync(join(directory, "facebook-draft.md"), "Eine sachliche und eigenständige Zusammenfassung für Patientinnen, Patienten und Angehörige.\n\nMehr erfahren: {{ARTICLE_URL}}\n");
    writeFileSync(join(directory, "claim-register.csv"), [
      "claim_id,article_slug,claim_text,claim_type,source_id,source_url,source_locator,status,checked_at,review_note",
      ...pilot.sources.map(({ id, url }: { id: string; url: string }, index: number) =>
        `C-${index + 1},${pilot.slug},Belegter Claim ${index + 1},definition,${id},${url},Geprüfter Abschnitt,verified,2026-08-11,Eng paraphrasiert`,
      ),
    ].join("\n"));

    const result = validateRun(directory, { requirePublishable: true });
    assert.deepEqual(result.errors, []);

    const blockedStatus = { ...result.status, claimGate: "not_checked" };
    writeFileSync(join(directory, "run-status.json"), `${JSON.stringify(blockedStatus, null, 2)}\n`);
    assert.match(validateRun(directory, { requirePublishable: true }).errors.join(" "), /claimGate/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("hält Recherchelauf und Reviewlauf technisch getrennt", () => {
  const writerPrompt = readFileSync(join(root, "automation/blog/prompts/research-and-draft.md"), "utf8");
  const reviewerPrompt = readFileSync(join(root, "automation/blog/prompts/review-and-test-publish.md"), "utf8");
  assert.match(writerPrompt, /weder öffentliche Blogdaten ändern noch committen oder deployen/);
  assert.match(reviewerPrompt, /npm run deploy:blog:test/);
  assert.match(reviewerPrompt, /npm run deploy:blog:live/);
  assert.match(reviewerPrompt, /kein `npm run deploy:test` oder `npm run deploy:live`/);
  assert.match(reviewerPrompt, /kein Facebook-Post vor erfolgreicher Live-URL/);
});

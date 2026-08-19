import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { selectScheduledRun } from "../scripts/lib/blog-queue.mjs";

const projectRoot = process.cwd();
const pilot = JSON.parse(readFileSync(join(projectRoot, "automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json"), "utf8"));

function rootFixture() {
  const root = mkdtempSync(join(tmpdir(), "blog-queue-"));
  mkdirSync(join(root, "automation/blog/articles"), { recursive: true });
  mkdirSync(join(root, "automation/blog/published"), { recursive: true });
  return root;
}

function queueRun(root: string, runId: string, { status = "approved_for_publish", revalidateAfter = "2026-09-30" } = {}) {
  const publicationDate = "2026-08-24";
  const slug = runId.replace(/^2026-08-24-/, "");
  const directory = join(root, "automation/blog/articles", runId);
  mkdirSync(directory);
  const article = {
    ...pilot,
    slug,
    title: "Krankenfahrt rechtzeitig und verlässlich vorbereiten",
    metadataTitle: "Krankenfahrt rechtzeitig vorbereiten",
    description: "Welche Angaben bei einer Fahrtanfrage helfen und warum eine frühzeitige Abstimmung von Termin, Abholung und Rückfahrt sinnvoll ist.",
    publishedAt: publicationDate,
    updatedAt: publicationDate,
    reviewedAt: "2026-08-19",
  };
  writeFileSync(join(directory, "article.json"), `${JSON.stringify(article, null, 2)}\n`);
  writeFileSync(join(directory, "research-brief.md"), `${article.sources.map(({ url }: { url: string }) => url).join("\n")}\nAlle Quellen wurden für den geplanten Zeitraum geprüft.\n`);
  writeFileSync(join(directory, "facebook-draft.md"), "Eine Krankenfahrt lässt sich mit wenigen vollständigen Angaben verlässlich vorbereiten. Mehr erfahren: {{ARTICLE_URL}}\n");
  writeFileSync(join(directory, "claim-register.csv"), [
    "claim_id,article_slug,claim_text,claim_type,source_id,source_url,source_locator,status,checked_at,review_note",
    ...article.sources.map(({ id, url }: { id: string; url: string }, index: number) =>
      `C-${index + 1},${slug},Belegter Claim ${index + 1},definition,${id},${url},Geprüfter Abschnitt,verified,2026-08-19,Quelle geprüft`,
    ),
  ].join("\n") + "\n");
  writeFileSync(join(directory, "run-status.json"), `${JSON.stringify({
    schemaVersion: 1,
    runId,
    scheduledDate: publicationDate,
    articleSlug: slug,
    topic: article.title,
    status,
    sourceGate: "passed",
    claimGate: "passed",
    serviceGate: "passed",
    legalSensitivityGate: "passed",
    seoGate: "passed",
    livePublishing: false,
    facebookPublishing: false,
    approvedAt: "2026-08-19",
    revalidateAfter,
  }, null, 2)}\n`);
  return { directory, slug };
}

test("wählt genau den freigegebenen und aktuellen Artikel des Tages", () => {
  const root = rootFixture();
  try {
    const { directory, slug } = queueRun(root, "2026-08-24-erster-queue-artikel");
    const result = selectScheduledRun(root, "2026-08-24");
    assert.equal(result.status, "ready");
    assert.equal(result.runDirectory, directory);
    assert.equal(result.slug, slug);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("veröffentlicht weder Entwürfe noch bereits publizierte Artikel erneut", () => {
  const root = rootFixture();
  try {
    queueRun(root, "2026-08-24-entwurf", { status: "draft_ready" });
    assert.equal(selectScheduledRun(root, "2026-08-24").status, "no_scheduled_article");

    const { slug } = queueRun(root, "2026-08-24-bereits-veroeffentlicht");
    copyFileSync(join(root, "automation/blog/articles/2026-08-24-bereits-veroeffentlicht/article.json"), join(root, "automation/blog/published", `${slug}.json`));
    assert.equal(selectScheduledRun(root, "2026-08-24").status, "no_scheduled_article");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("blockiert abgelaufene oder doppelt terminierte Freigaben", () => {
  const expiredRoot = rootFixture();
  try {
    queueRun(expiredRoot, "2026-08-24-abgelaufen", { revalidateAfter: "2026-08-23" });
    assert.throws(() => selectScheduledRun(expiredRoot, "2026-08-24"), /Aktualitätsfreigabe/);
  } finally {
    rmSync(expiredRoot, { recursive: true, force: true });
  }

  const duplicateRoot = rootFixture();
  try {
    queueRun(duplicateRoot, "2026-08-24-erster-artikel");
    queueRun(duplicateRoot, "2026-08-24-zweiter-artikel");
    assert.throws(() => selectScheduledRun(duplicateRoot, "2026-08-24"), /Mehrere freigegebene Artikel/);
  } finally {
    rmSync(duplicateRoot, { recursive: true, force: true });
  }
});

test("stellt sieben freigegebene Artikel bereit und hält Muster 4 zurück", () => {
  const approvedDates = ["2026-08-24", "2026-08-31", "2026-09-03", "2026-09-07", "2026-09-10", "2026-09-14", "2026-09-17"];
  for (const publicationDate of approvedDates) assert.equal(selectScheduledRun(projectRoot, publicationDate).status, "ready");
  assert.equal(selectScheduledRun(projectRoot, "2026-08-27").status, "no_scheduled_article");
});

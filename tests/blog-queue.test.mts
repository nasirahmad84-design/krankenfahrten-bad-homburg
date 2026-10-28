import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { selectScheduledRun, selectDueRun } from "../scripts/lib/blog-queue.mjs";
import { checkPublisherHeartbeat } from "../scripts/check-blog-health.mjs";
import { spawnSync } from "node:child_process";

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

test("holt gültige Freigaben nach und verwendet das tatsächliche Veröffentlichungsdatum", () => {
  const root = rootFixture();
  try {
    const {slug} = queueRun(root, "2026-08-24-nachholen");
    const selected = selectDueRun(root, "2026-08-25");
    assert.ok("slug" in selected);
    assert.equal(selected.slug, slug);
    assert.equal(selected.publicationDate, "2026-08-25");
    assert.equal(selected.plannedDate, "2026-08-24");
    const result = spawnSync(process.execPath, [join(projectRoot, "scripts/promote-blog-run.mjs"), "automation/blog/articles/2026-08-24-nachholen"], {
      cwd: root, env: {...process.env, BLOG_RELEASE_DATE: "2026-08-25"}, encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const published = JSON.parse(readFileSync(join(root, "automation/blog/published", slug + ".json"), "utf8"));
    assert.equal(published.publishedAt, "2026-08-25");
    assert.equal(selectDueRun(root, "2026-08-25").status, "no_scheduled_article");
  } finally { rmSync(root, {recursive: true, force: true}); }
});

test("Nachholen sperrt abgelaufene Freigaben und meldet leere Veröffentlichungstage", () => {
  const root = rootFixture();
  try {
    queueRun(root, "2026-08-24-veraltet", {revalidateAfter: "2026-08-24"});
    assert.throws(() => selectDueRun(root, "2026-08-25"), /Aktualitätsfreigabe/);
  } finally { rmSync(root, {recursive: true, force: true}); }
  const empty = rootFixture();
  try {
    queueRun(empty, "2026-08-24-entwurf", {status: "draft_ready"});
    assert.throws(() => selectDueRun(empty, "2026-08-24"), /Redaktionsvorrat leer/);
    assert.equal(selectDueRun(empty, "2026-08-25").status, "no_scheduled_article");
  } finally { rmSync(empty, {recursive: true, force: true}); }
});

test("Zustandsprüfung erkennt ausbleibende, übersprungene und gescheiterte Starts", () => {
  const now = new Date("2026-10-28T18:00:00Z");
  const healthy = {created_at: "2026-10-28T12:17:00Z", status: "completed", conclusion: "success"};
  assert.doesNotThrow(() => checkPublisherHeartbeat([healthy], now));
  assert.equal(checkPublisherHeartbeat([{...healthy, created_at: "2026-10-28T17:50:00Z", status: "in_progress", conclusion: null}], now), "running");
  assert.throws(() => checkPublisherHeartbeat([{...healthy, status: "in_progress", conclusion: null}], now), /nicht erfolgreich/);
  assert.throws(() => checkPublisherHeartbeat([{...healthy, conclusion: "skipped"}], now), /36 Stunden/);
  assert.throws(() => checkPublisherHeartbeat([{...healthy, created_at: "2026-10-26T08:00:00Z"}], now), /36 Stunden/);
  assert.throws(() => checkPublisherHeartbeat([{...healthy, conclusion: "failure"}], now), /nicht erfolgreich/);
});

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

test("stellt alle acht freigegebenen Artikel zum geplanten Datum bereit", () => {
  const approvedDates = ["2026-08-24", "2026-08-27", "2026-08-31", "2026-09-03", "2026-09-07", "2026-09-10", "2026-09-14", "2026-09-17"];
  for (const publicationDate of approvedDates) {
    const runDirectory = readdirSync(join(projectRoot, "automation/blog/articles"))
      .find((directory) => directory.startsWith(`${publicationDate}-`));
    assert.ok(runDirectory, `Freigegebener Artikellauf für ${publicationDate} fehlt.`);
    const runStatus = JSON.parse(readFileSync(join(projectRoot, "automation/blog/articles", runDirectory, "run-status.json"), "utf8"));
    const alreadyPublished = existsSync(join(projectRoot, "automation/blog/published", `${runStatus.articleSlug}.json`));
    assert.equal(selectScheduledRun(projectRoot, publicationDate).status, alreadyPublished ? "no_scheduled_article" : "ready");
  }
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { validateRun } from "../scripts/lib/blog-pipeline.mjs";
import { selectScheduledRun } from "../scripts/lib/blog-queue.mjs";
import { prepareGoogleBusinessPost } from "../scripts/prepare-google-business-post.mjs";

const root = process.cwd();
const dates = ["2026-09-21", "2026-09-24", "2026-09-28", "2026-10-01", "2026-10-05", "2026-10-08", "2026-10-12", "2026-10-15"];

test("acht neue Entwürfe sind valide und werden ohne Betreiberfreigabe nicht ausgewählt", () => {
  for (const date of dates) {
    const directory = readdirSync(join(root, "automation/blog/articles")).find(name => name.startsWith(date + "-"));
    assert.ok(directory);
    const run = validateRun(join(root, "automation/blog/articles", directory));
    assert.deepEqual(run.errors, []);
    assert.equal(run.status.status, "draft_ready");
    assert.equal(selectScheduledRun(root, date).status, "no_scheduled_article");
    const preview = prepareGoogleBusinessPost(join(root, "automation/blog/articles", directory));
    assert.equal(preview.operatorApproval, "pending");
    assert.equal(preview.status, "preview_only");
    assert.equal(preview.payload.topicType, "STANDARD");
    const url = new URL(preview.payload.callToAction.url);
    assert.equal(url.hostname, "krankenfahrten-bad-homburg.de");
    assert.equal(url.searchParams.get("utm_content"), run.article.slug);
    assert.equal(url.searchParams.get("utm_campaign"), "gbp_ratgeber");
    assert.doesNotMatch(preview.payload.summary, /\{\{|facebook\.com/);
  }
});

test("Prüflauf überspringt alle vier Veröffentlichungsschritte und lässt alten Cron bis Umschaltung aktiv", () => {
  const workflow = readFileSync(join(root, ".github/workflows/blog-manual.yml"), "utf8");
  assert.equal((workflow.match(/if: steps\.queue\.outputs\.status == 'ready' && inputs\.dry_run != true/g) || []).length, 4);
  assert.match(workflow, /github.event_name != 'schedule' \|\| vars.BLOG_EXTERNAL_SCHEDULER_ENABLED != 'true'/);
  const config = JSON.parse(readFileSync(join(root, "automation/blog/external-schedule.example.json"), "utf8"));
  assert.equal(config.job.enabled, false);
  assert.equal(JSON.parse(config.job.extendedData.body).inputs.dry_run, "true");
  assert.deepEqual(config.job.schedule.wdays, [1, 4]);
  assert.equal(config.job.schedule.timezone, "Europe/Berlin");
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const architecture = read("automation/blog/README.md");
const editorialPolicy = read("automation/blog/editorial-policy.md");
const environmentGates = read("automation/blog/environment-gate-matrix.csv");
const reviewerPrompt = read("automation/blog/prompts/review-and-test-publish.md");
const routes = read("automation/blog/route-matrix.csv");
const manualWorkflow = read(".github/workflows/blog-manual.yml");
const cloudRunner = read("scripts/run-blog-cloud.mjs");
const editorialCalendar = read("automation/blog/editorial-calendar.csv");
const approvalRegister = read("automation/blog/content-approval-register.csv");

test("trennt Recherche und Veröffentlichung in zwei Läufe", () => {
  assert.match(architecture, /Recherche und Entwurf/);
  assert.match(architecture, /Claim- und Quellenprüfung/);
  assert.match(architecture, /keine vier vorgeschalteten Testläufe/);
});

test("verhindert Ersatzartikel ohne hinreichende Evidenz", () => {
  assert.match(editorialPolicy, /veröffentlicht die Automatisierung keinen Ersatzartikel/);
  assert.match(editorialPolicy, /no_publishable_topic/);
  assert.match(editorialPolicy, /`blocked` verhindert die Veröffentlichung/);
});

test("erlaubt ausschließlich den geprüften Blog-Delta-Release", () => {
  assert.match(environmentGates, /Vollständiges Website-Deployment,deny,deny,deny,deny,deny/);
  assert.match(environmentGates, /Blog-Delta deployen,deny,allow,allow,allow-after-test-smoke,deny/);
  assert.match(reviewerPrompt, /npm run test:blog/);
  assert.match(reviewerPrompt, /kein `npm test`/);
  assert.match(reviewerPrompt, /keine vier Testläufe/);
});

test("plant statische Ratgeberrouten ohne öffentliches Schreib-API", () => {
  assert.match(routes, /^\/ratgeber\/,/m);
  assert.match(routes, /^\/ratgeber\/\[slug\]\//m);
  assert.match(routes, /^\/api\/blog\/,Runtime-Endpunkt,no,none,rejected/m);
});

test("Queue-Workflow prüft täglich mit Wiederholungsstart ohne bezahlten KI-Aufruf", () => {
  assert.match(manualWorkflow, /workflow_dispatch:/);
  assert.ok(manualWorkflow.includes('cron: "17 8,12 * * *"'));
  assert.doesNotMatch(manualWorkflow, /BLOG_EXTERNAL_SCHEDULER_ENABLED/);
  assert.match(manualWorkflow, /npm run blog:select-scheduled/);
  assert.match(manualWorkflow, /npm run deploy:blog:test/);
  assert.match(manualWorkflow, /npm run deploy:blog:live/);
  assert.match(manualWorkflow, /BLOG_QUEUE_LIVE_ENABLED/);
  assert.doesNotMatch(manualWorkflow, /OPENAI_API_KEY|blog:cloud-run/);
  assert.doesNotMatch(manualWorkflow, /npm test|verify:deployment|deploy:test|deploy:live/);
  assert.match(manualWorkflow, /FTP_PASSWORD: \$\{\{ secrets\.FTP_PASSWORD \}\}/);
  const testDeployment = manualWorkflow.indexOf("Blog-Delta auf Testdomain veröffentlichen");
  const liveDeployment = manualWorkflow.indexOf("Gleiches Blog-Delta live veröffentlichen");
  const documentation = manualWorkflow.indexOf("Erfolgreich live veröffentlichten Inhalt dokumentieren");
  assert.ok(testDeployment < liveDeployment);
  assert.ok(liveDeployment < documentation);
});

test("dokumentiert die Betreiberfreigaben der drei vorbereiteten Achter-Batches", () => {
  const calendarRows = editorialCalendar.trim().split("\n").slice(1);
  const approvalRows = approvalRegister.trim().split("\n").slice(1);
  assert.equal(calendarRows.length, 24);
  assert.equal(approvalRows.length, 24);
  assert.equal(calendarRows.filter((row) => /,\"?approved_for_publish\"?$/.test(row)).length, 24);
  assert.equal(calendarRows.filter((row) => /,\"?draft_ready\"?$/.test(row)).length, 0);
  assert.match(calendarRows.find((row) => row.includes(",muster-4-krankenbefoerderung,")) ?? "", /,approved_for_publish$/);
  assert.equal(approvalRows.filter((row) => row.includes(",approved,2026-08-19,2026-09-17,")).length, 7);
  assert.match(approvalRows.find((row) => row.includes(",muster-4-krankenbefoerderung,")) ?? "", /,approved,2026-08-26,2026-09-17,/);
  assert.equal(approvalRows.filter((row) => /,"?approved"?,"?2026-09-14"?,/.test(row)).length, 8);
  assert.equal(approvalRows.filter((row) => /,"?approved"?,"?2026-10-28"?,/.test(row)).length, 8);
});

test("trennt die aktuelle Artikel- und Google-Textfreigabe von noch offenen Bildern", () => {
  const planned = JSON.parse(read("automation/blog/google-business-planned.json"));
  const googleApprovals = JSON.parse(read("automation/blog/google-business-approvals.json"));
  assert.equal(planned.length, 8);
  for (const item of planned) {
    const status = JSON.parse(read(`automation/blog/articles/${item.date}-${item.slug}/run-status.json`));
    assert.equal(status.status, "approved_for_publish");
    assert.equal(status.approvedAt, "2026-10-28");
    assert.equal(status.scheduledDate, item.date);
    assert.equal(googleApprovals[item.slug].status, "text_approved_image_pending");
    assert.equal(googleApprovals[item.slug].approvedAt, "2026-10-28");
  }
});

test("alarmiert bei operativen Fehlerenden, aber nicht bei absichtlich übersprungenen Läufen", () => {
  const alertWorkflow = read(".github/workflows/blog-failure-alert.yml");
  const alertEndpoint = read("public/api/blog-alert.php");
  assert.match(alertWorkflow, /workflow_run:/);
  assert.match(alertWorkflow, /\["failure","cancelled","timed_out","action_required","startup_failure"\]/);
  assert.doesNotMatch(alertWorkflow, /\[.*"skipped".*\]/);
  assert.match(alertWorkflow, /secrets\.BLOG_ALERT_TOKEN/);
  assert.match(alertWorkflow, /scripts\/send-blog-alert\.sh/);
  assert.match(alertEndpoint, /HTTP_X_BLOG_ALERT_TOKEN/);
  assert.match(alertEndpoint, /\.blog-alert-config\.php/);
});

test("formale Reviewfehler lösen keinen dritten kostenpflichtigen KI-Aufruf aus", () => {
  assert.match(cloudRunner, /Review blockiert; keine kostenpflichtige Reparatur ausgeführt/);
  assert.doesNotMatch(cloudRunner, /Reviewkorrektur|repairedResponse|repairInput/);
});

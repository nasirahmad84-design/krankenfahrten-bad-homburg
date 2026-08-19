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

test("Queue-Workflow läuft montags und donnerstags ohne bezahlten KI-Aufruf", () => {
  assert.match(manualWorkflow, /workflow_dispatch:/);
  assert.match(manualWorkflow, /cron: "0 7 \* \* 1,4"/);
  assert.match(manualWorkflow, /npm run blog:select-scheduled/);
  assert.match(manualWorkflow, /npm run deploy:blog:test/);
  assert.match(manualWorkflow, /npm run deploy:blog:live/);
  assert.match(manualWorkflow, /BLOG_QUEUE_LIVE_ENABLED/);
  assert.doesNotMatch(manualWorkflow, /OPENAI_API_KEY|blog:cloud-run/);
  assert.doesNotMatch(manualWorkflow, /npm test|verify:deployment|deploy:test|deploy:live/);
  assert.match(manualWorkflow, /FTP_PASSWORD: \$\{\{ secrets\.FTP_PASSWORD \}\}/);
  assert.ok(manualWorkflow.indexOf("Blog-Delta auf Testdomain veröffentlichen") < manualWorkflow.indexOf("Erfolgreich getesteten Inhalt dokumentieren"));
});

test("dokumentiert sieben Betreiberfreigaben und hält Muster 4 zurück", () => {
  const calendarRows = editorialCalendar.trim().split("\n").slice(1);
  const approvalRows = approvalRegister.trim().split("\n").slice(1);
  assert.equal(calendarRows.length, 8);
  assert.equal(approvalRows.length, 8);
  assert.equal(calendarRows.filter((row) => row.endsWith(",approved_for_publish")).length, 7);
  assert.equal(calendarRows.filter((row) => row.endsWith(",draft_ready")).length, 1);
  assert.match(calendarRows.find((row) => row.includes(",muster-4-krankenbefoerderung,")) ?? "", /,draft_ready$/);
  assert.equal(approvalRows.filter((row) => row.includes(",approved,2026-08-19,2026-09-17,")).length, 7);
  assert.match(approvalRows.find((row) => row.includes(",muster-4-krankenbefoerderung,")) ?? "", /,pending,,2026-09-17,/);
});

test("formale Reviewfehler lösen keinen dritten kostenpflichtigen KI-Aufruf aus", () => {
  assert.match(cloudRunner, /Review blockiert; keine kostenpflichtige Reparatur ausgeführt/);
  assert.doesNotMatch(cloudRunner, /Reviewkorrektur|repairedResponse|repairInput/);
});

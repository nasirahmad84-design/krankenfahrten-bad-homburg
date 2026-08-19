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

test("Cloud-MVP läuft nur manuell und deployt ausschließlich das geprüfte Blog-Delta", () => {
  assert.match(manualWorkflow, /workflow_dispatch:/);
  assert.doesNotMatch(manualWorkflow, /schedule:/);
  assert.match(manualWorkflow, /npm run blog:cloud-run/);
  assert.match(manualWorkflow, /npm run deploy:blog:test/);
  assert.match(manualWorkflow, /npm run deploy:blog:live/);
  assert.doesNotMatch(manualWorkflow, /npm test|verify:deployment|deploy:test|deploy:live/);
  assert.match(manualWorkflow, /OPENAI_API_KEY: \$\{\{ secrets\.OPENAI_API_KEY \}\}/);
  assert.match(manualWorkflow, /FTP_PASSWORD: \$\{\{ secrets\.FTP_PASSWORD \}\}/);
});

test("formale Reviewfehler lösen keinen dritten kostenpflichtigen KI-Aufruf aus", () => {
  assert.match(cloudRunner, /Review blockiert; keine kostenpflichtige Reparatur ausgeführt/);
  assert.doesNotMatch(cloudRunner, /Reviewkorrektur|repairedResponse|repairInput/);
});

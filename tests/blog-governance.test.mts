import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const architecture = read("automation/blog/README.md");
const editorialPolicy = read("automation/blog/editorial-policy.md");
const environmentGates = read("automation/blog/environment-gate-matrix.csv");
const routes = read("automation/blog/route-matrix.csv");

test("trennt Recherche und Veröffentlichung in zwei Läufe", () => {
  assert.match(architecture, /Recherche und Entwurf/);
  assert.match(architecture, /Review und Veröffentlichung/);
  assert.match(architecture, /ersten vier erfolgreichen Publikationsläufe.*Testdomain/s);
});

test("verhindert Ersatzartikel ohne hinreichende Evidenz", () => {
  assert.match(editorialPolicy, /veröffentlicht die Automatisierung keinen Ersatzartikel/);
  assert.match(editorialPolicy, /no_publishable_topic/);
  assert.match(editorialPolicy, /`blocked` verhindert die Veröffentlichung/);
});

test("hält Live- und Facebook-Veröffentlichung bis BLOG-04 gesperrt", () => {
  assert.match(environmentGates, /Deployment,deny,allow,allow,deny-until-BLOG-04,deny/);
  assert.match(environmentGates, /Facebook-Veröffentlichung,deny,deny,n\/a,requires-success,deny-until-BLOG-04/);
});

test("plant statische Ratgeberrouten ohne öffentliches Schreib-API", () => {
  assert.match(routes, /^\/ratgeber\/,/m);
  assert.match(routes, /^\/ratgeber\/\[slug\]\//m);
  assert.match(routes, /^\/api\/blog\/,Runtime-Endpunkt,no,none,rejected/m);
});

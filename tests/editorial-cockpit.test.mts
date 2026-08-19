import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const root = process.cwd();
const output = resolve(root, "out-editorial");
const articleRuns = readdirSync(resolve(root, "automation/blog/articles"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(root, "automation/blog/articles", entry.name, "run-status.json")));

test("erzeugt eine separate lesbare Redaktionsübersicht für jeden vorbereiteten Artikel", () => {
  const index = readFileSync(join(output, "index.html"), "utf8");
  assert.match(index, /Vorbereitete Ratgeberartikel/);
  assert.match(index, /Alle acht Artikel freigegeben/);

  for (const entry of articleRuns) {
    const directory = resolve(root, "automation/blog/articles", entry.name);
    const article = JSON.parse(readFileSync(join(directory, "article.json"), "utf8"));
    const detail = readFileSync(join(output, "artikel", article.slug, "index.html"), "utf8");
    assert.match(index, new RegExp(`/redaktion/artikel/${article.slug}/`));
    assert.ok(detail.includes(article.title));
    assert.match(detail, /Verwendete Primärquellen/);
    assert.match(detail, /Geprüfte Aussagen/);
    assert.match(detail, /Facebook-Entwurf/);
  }
});

test("hält das Cockpit technisch vom öffentlichen Export getrennt", () => {
  assert.equal(existsSync(resolve(root, "out/redaktion")), false);
  const workflow = readFileSync(resolve(root, ".github/workflows/editorial-cockpit-test.yml"), "utf8");
  assert.doesNotMatch(workflow, /FTP_LIVE_DIRECTORY|LIVE_SITE_URL|deploy:live/);
  assert.match(workflow, /deploy:editorial:test/);
});

test("verlangt echten Verzeichnisschutz statt eines clientseitigen Passwortdialogs", () => {
  const deployScript = readFileSync(resolve(root, "scripts/deploy-editorial-ftp.sh"), "utf8");
  assert.match(deployScript, /preflight_status/);
  assert.match(deployScript, /401/);
  assert.match(deployScript, /WWW-Authenticate: Basic/);
  assert.doesNotMatch(readFileSync(join(output, "index.html"), "utf8"), /password|localStorage|sessionStorage|document\.cookie/i);
});

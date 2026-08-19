import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const root = process.cwd();
const output = resolve(root, "out-editorial");
const articleRuns = readdirSync(resolve(root, "automation/blog/articles"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(root, "automation/blog/articles", entry.name, "run-status.json")));

function generatedContent() {
  const php = readFileSync(join(output, "content.php"), "utf8");
  const match = php.match(/base64_decode\('([A-Za-z0-9+/=]+)'/);
  assert.ok(match);
  return JSON.parse(Buffer.from(match[1], "base64").toString("utf8"));
}

test("erzeugt eine separate lesbare Datenbasis für jeden vorbereiteten Artikel", () => {
  const content = generatedContent();
  assert.equal(content.runs.length, articleRuns.length);
  for (const entry of articleRuns) {
    const article = JSON.parse(readFileSync(resolve(root, "automation/blog/articles", entry.name, "article.json"), "utf8"));
    const run = content.runs.find((candidate) => candidate.article.slug === article.slug);
    assert.ok(run);
    assert.equal(run.article.title, article.title);
    assert.ok(run.claims.length > 0);
    assert.ok(run.researchBrief.length > 0);
    assert.ok(run.facebookDraft.length > 0);
  }
});

test("hält das Cockpit technisch vom öffentlichen Export getrennt", () => {
  assert.equal(existsSync(resolve(root, "out/redaktion")), false);
  const workflow = readFileSync(resolve(root, ".github/workflows/editorial-cockpit-test.yml"), "utf8");
  assert.doesNotMatch(workflow, /FTP_LIVE_DIRECTORY|LIVE_SITE_URL|deploy:live/);
  assert.match(workflow, /deploy:editorial:test/);
});

test("schützt Inhalte mit serverseitigem Einmalcode-Login", () => {
  const controller = readFileSync(join(output, "index.php"), "utf8");
  const auth = readFileSync(join(output, "lib/auth.php"), "utf8");
  const access = readFileSync(join(output, ".htaccess"), "utf8");
  assert.match(controller, /editorial_render_login/);
  assert.match(controller, /session_regenerate_id\(true\)/);
  assert.match(auth, /random_int\(0, 999999\)/);
  assert.match(auth, /hash_hmac\('sha256'/);
  assert.match(auth, /SameSite|samesite/);
  assert.ok(access.includes("content\\.php") && access.includes("lib(?:/|$)"));
  assert.ok(access.includes("login-config\\.php"));
  assert.match(access, /Require all denied/);
  assert.doesNotMatch(controller, /localStorage|sessionStorage/);
  assert.equal(readdirSync(output, { recursive: true }).filter((path) => String(path).endsWith(".html")).length, 0);
});

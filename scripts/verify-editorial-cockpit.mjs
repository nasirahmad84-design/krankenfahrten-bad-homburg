import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outputDirectory = resolve(root, "out-editorial");
const articlesDirectory = resolve(root, "automation/blog/articles");

assert.ok(existsSync(outputDirectory), "out-editorial/ fehlt. Zuerst npm run editorial:build ausführen.");

const runDirectories = readdirSync(articlesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(articlesDirectory, entry.name, "run-status.json")))
  .map((entry) => join(articlesDirectory, entry.name));

assert.ok(runDirectories.length > 0, "Keine Redaktionsläufe gefunden.");
const indexPath = join(outputDirectory, "index.html");
assert.ok(existsSync(indexPath), "Cockpit-Übersicht fehlt.");
assert.ok(existsSync(join(outputDirectory, "assets/editorial.css")), "Cockpit-Styles fehlen.");
assert.ok(existsSync(join(outputDirectory, "assets/logo.svg")), "Cockpit-Logo fehlt.");

const htmlFiles = [indexPath];
for (const runDirectory of runDirectories) {
  const article = JSON.parse(readFileSync(join(runDirectory, "article.json"), "utf8"));
  const status = JSON.parse(readFileSync(join(runDirectory, "run-status.json"), "utf8"));
  const claims = readFileSync(join(runDirectory, "claim-register.csv"), "utf8");
  const detailPath = join(outputDirectory, "artikel", article.slug, "index.html");
  assert.ok(existsSync(detailPath), `Cockpit-Seite für ${article.slug} fehlt.`);
  const detail = readFileSync(detailPath, "utf8");
  htmlFiles.push(detailPath);

  assert.ok(detail.includes(article.title), `Titel fehlt in ${article.slug}.`);
  assert.ok(detail.includes(article.intro), `Einleitung fehlt in ${article.slug}.`);
  assert.ok(detail.includes(status.scheduledDate), `Veröffentlichungstermin fehlt in ${article.slug}.`);
  for (const section of article.sections) assert.ok(detail.includes(section.title), `Abschnitt ${section.id} fehlt in ${article.slug}.`);
  for (const source of article.sources) {
    assert.ok(detail.includes(source.url), `Quelle ${source.id} fehlt in ${article.slug}.`);
  }
  const firstClaim = claims.split(/\r?\n/)[1]?.split(",")[2];
  assert.ok(firstClaim && detail.includes(firstClaim), `Claim-Vorschau fehlt in ${article.slug}.`);
}

const index = readFileSync(indexPath, "utf8");
for (const runDirectory of runDirectories) {
  const article = JSON.parse(readFileSync(join(runDirectory, "article.json"), "utf8"));
  assert.ok(index.includes(article.title), `Übersicht enthält ${article.slug} nicht.`);
  assert.ok(index.includes(`/redaktion/artikel/${article.slug}/`), `Übersichtslink für ${article.slug} fehlt.`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const relative = file.slice(outputDirectory.length + 1);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${relative} benötigt genau eine H1.`);
  assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/, `${relative} benötigt noindex.`);
  assert.doesNotMatch(html, /<script(?:\s|>)/i, `${relative} darf kein JavaScript laden.`);
  assert.doesNotMatch(html, /<form(?:\s|>)/i, `${relative} darf keine ungeschützte Freigabefunktion enthalten.`);
  assert.doesNotMatch(html, /(?:googletagmanager|google-analytics|facebook\.com\/tr|connect\.facebook)/i, `${relative} darf kein Tracking enthalten.`);
  assert.doesNotMatch(html, /(?:OPENAI_API_KEY|FTP_PASSWORD|smtp_password|rate_limit_salt)/i, `${relative} enthält einen Secret-Bezeichner.`);
  assert.doesNotMatch(html, /rel="canonical"/i, `${relative} darf keinen öffentlichen Canonical enthalten.`);
  assert.doesNotMatch(html, /href=(?:""|'')|href="#"/, `${relative} enthält einen leeren Link.`);
}

const unexpectedSources = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (/\.(?:json|csv|md|map|ts|tsx|mjs)$/i.test(entry.name)) unexpectedSources.push(path);
  }
}
walk(outputDirectory);
assert.deepEqual(unexpectedSources, [], "Cockpit-Export enthält interne Quelldateien.");

if (existsSync(resolve(root, "out/redaktion"))) {
  throw new Error("Öffentliches Produktionspaket darf keinen Redaktionsbereich enthalten.");
}

const fileCount = (() => {
  let count = 0;
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) visit(join(directory, entry.name));
      else count += 1;
    }
  };
  visit(outputDirectory);
  return count;
})();
const bytes = (() => {
  let total = 0;
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else total += statSync(path).size;
    }
  };
  visit(outputDirectory);
  return total;
})();

console.log(`Redaktionscockpit geprüft: ${runDirectories.length} Artikel, ${fileCount} Dateien, ${(bytes / 1024).toFixed(0)} KiB.`);

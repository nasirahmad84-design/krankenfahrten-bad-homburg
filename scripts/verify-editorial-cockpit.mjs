import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outputDirectory = resolve(root, "out-editorial");
const articlesDirectory = resolve(root, "automation/blog/articles");

assert.ok(existsSync(outputDirectory), "out-editorial/ fehlt. Zuerst npm run editorial:build ausführen.");
for (const path of ["index.php", "content.php", "lib/auth.php", ".htaccess", "assets/editorial.css", "assets/logo.svg"]) {
  assert.ok(existsSync(join(outputDirectory, path)), `${path} fehlt im Cockpit-Paket.`);
}

const runDirectories = readdirSync(articlesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(articlesDirectory, entry.name, "run-status.json")))
  .map((entry) => join(articlesDirectory, entry.name));
assert.ok(runDirectories.length > 0, "Keine Redaktionsläufe gefunden.");

const contentPhp = readFileSync(join(outputDirectory, "content.php"), "utf8");
const encodedMatch = contentPhp.match(/base64_decode\('([A-Za-z0-9+/=]+)'/);
assert.ok(encodedMatch, "Generierte Redaktionsdaten sind nicht lesbar eingebettet.");
const content = JSON.parse(Buffer.from(encodedMatch[1], "base64").toString("utf8"));
assert.equal(content.runs.length, runDirectories.length, "Nicht alle Redaktionsläufe wurden exportiert.");

for (const runDirectory of runDirectories) {
  const article = JSON.parse(readFileSync(join(runDirectory, "article.json"), "utf8"));
  const exportedRun = content.runs.find((run) => run.article.slug === article.slug);
  assert.ok(exportedRun, `Redaktionsdaten für ${article.slug} fehlen.`);
  assert.equal(exportedRun.article.title, article.title);
  assert.equal(exportedRun.article.intro, article.intro);
  assert.ok(exportedRun.claims.length > 0, `Claims für ${article.slug} fehlen.`);
  assert.ok(exportedRun.researchBrief.length > 0, `Recherchebrief für ${article.slug} fehlt.`);
  assert.ok(exportedRun.facebookDraft.length > 0, `Facebook-Entwurf für ${article.slug} fehlt.`);
}

const controller = readFileSync(join(outputDirectory, "index.php"), "utf8");
const auth = readFileSync(join(outputDirectory, "lib/auth.php"), "utf8");
const htaccess = readFileSync(join(outputDirectory, ".htaccess"), "utf8");
assert.match(controller, /editorial_is_authenticated/);
assert.match(controller, /editorial_render_login/);
assert.match(controller, /session_regenerate_id\(true\)/);
assert.match(auth, /random_int\(0, 999999\)/);
assert.match(auth, /hash_hmac\('sha256'/);
assert.match(auth, /'secure' => true/);
assert.match(auth, /'httponly' => true/);
assert.match(auth, /'samesite' => 'Strict'/);
assert.match(auth, /EDITORIAL_OTP_MAX_ATTEMPTS = 5/);
assert.match(auth, /EDITORIAL_OTP_LIFETIME = 600/);
assert.match(auth, /rate_limit_count'\] = 5/);
assert.ok(htaccess.includes("content\\.php") && htaccess.includes("lib(?:/|$)"), "Direkter Zugriff auf Inhalte und Bibliothek wird nicht geblockt.");
assert.ok(htaccess.includes("login-config\\.php"));
assert.match(htaccess, /Require all denied/);
assert.match(htaccess, /X-Robots-Tag/);
assert.doesNotMatch(controller, /googletagmanager|google-analytics|facebook\.com\/tr|connect\.facebook/i);
assert.doesNotMatch(controller, /localStorage|sessionStorage/i);
assert.doesNotMatch(contentPhp, /smtp_password|FTP_PASSWORD|OPENAI_API_KEY/i);

const unexpectedSources = [];
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else {
      files.push(path);
      if (/\.(?:json|csv|md|map|ts|tsx|mjs)$/i.test(entry.name)) unexpectedSources.push(path);
    }
  }
}
walk(outputDirectory);
assert.deepEqual(unexpectedSources, [], "Cockpit-Export enthält interne Quelldateien.");
assert.equal(files.filter((path) => path.endsWith(".html")).length, 0, "Artikel dürfen nicht als ungeschützte HTML-Dateien exportiert werden.");
assert.equal(files.filter((path) => path.endsWith(".php")).length, 3, "Cockpit enthält unerwartete PHP-Dateien.");

if (existsSync(resolve(root, "out/redaktion"))) throw new Error("Öffentliches Produktionspaket darf keinen Redaktionsbereich enthalten.");

const bytes = files.reduce((total, path) => total + statSync(path).size, 0);
console.log(`Redaktionscockpit geprüft: ${runDirectories.length} Artikel, ${files.length} Dateien, ${(bytes / 1024).toFixed(0)} KiB.`);

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const productionOrigin = "https://krankenfahrten-bad-homburg.de";

assert.ok(existsSync(out) && statSync(out).isDirectory(), "out/ fehlt. Zuerst npm run build ausführen.");

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  ".htaccess",
  "api/fahrtanfrage.php",
  "api/config.example.php",
  "api/lib/validation.php",
  "api/lib/security.php",
  "api/lib/mail.php",
  "icon.png",
  "apple-icon.png",
];
for (const file of requiredFiles) assert.ok(existsSync(join(out, file)), `Erforderliche Datei fehlt: out/${file}`);

assert.ok(!existsSync(join(out, "api/config.php")), "api/config.php darf nicht im Build-Paket liegen.");

const files = collectFiles(out);
const relativeFiles = files.map((file) => relative(out, file).split(sep).join("/"));
for (const file of relativeFiles) {
  assert.ok(!/(^|\/)\.env(?:\.|$)/i.test(file), `Environment-Datei im Export: ${file}`);
  assert.ok(!/\.map$/i.test(file), `Source Map im Export: ${file}`);
  assert.ok(!/\.(?:ts|tsx)$/i.test(file), `TypeScript-Quelle im Export: ${file}`);
  assert.ok(!/(^|\/)(?:tests?|__tests__)(\/|$)/i.test(file), `Testdatei im Export: ${file}`);
  assert.ok(!/(^|\/)(?:server|middleware)\.(?:js|mjs|cjs)$/i.test(file), `Node-Serverdatei im Export: ${file}`);
}

const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, 17, "Die Sitemap muss genau 17 öffentliche URLs enthalten.");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Die Sitemap enthält doppelte URLs.");

const publicPaths = sitemapUrls.map((url) => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, productionOrigin, `Falsche Sitemap-Domain: ${url}`);
  assert.ok(parsed.pathname === "/" || parsed.pathname.endsWith("/"), `Sitemap-URL ohne trailingSlash: ${url}`);
  return parsed.pathname;
});

for (const path of publicPaths) {
  const htmlFile = routeToHtml(path);
  assert.ok(existsSync(htmlFile), `Sitemap-Ziel fehlt: ${path}`);
  const html = readFileSync(htmlFile, "utf8");
  const expectedCanonical = new URL(path, productionOrigin).toString();
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(canonicals, [expectedCanonical], `Canonical stimmt nicht für ${path}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path} muss genau eine H1 enthalten.`);
  assert.match(html, /href="#main-content"/, `Skip-Link fehlt in ${path}`);
  assert.doesNotMatch(html, /localhost|example\.com|TODO|placeholder|development|test mode|technical|mock/i, `Öffentlicher Entwicklungstext in ${path}`);
  auditHtmlLinks(html, htmlFile, path);
}

const notFoundHtml = readFileSync(join(out, "404.html"), "utf8");
assert.equal((notFoundHtml.match(/<h1\b/g) ?? []).length, 1, "404.html muss genau eine H1 enthalten.");
assert.match(notFoundHtml, /Seite nicht gefunden/);
auditHtmlLinks(notFoundHtml, join(out, "404.html"), "/404.html");

const robots = readFileSync(join(out, "robots.txt"), "utf8");
assert.match(robots, /Disallow: \/api\//);
assert.match(robots, new RegExp(`Sitemap: ${escapeRegExp(productionOrigin)}/sitemap\\.xml`));

const publicText = files
  .filter((file) => [".html", ".txt", ".xml"].includes(extname(file)))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
assert.doesNotMatch(publicText, /localhost|example\.com/i, "Lokale oder Beispieldomain im öffentlichen Paket.");
assert.doesNotMatch(publicText, /use server|resend\.com|EMAIL_API_KEY|RESEND_API_KEY/i, "Server-Action-, Resend- oder Secret-Hinweis im Seitenpaket.");
assert.doesNotMatch(publicText, /sk-[A-Za-z0-9]{16,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);

const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`Deployment-Paket geprüft: ${publicPaths.length} öffentliche Routen, ${files.length} Dateien, ${formatBytes(totalBytes)}.`);

function auditHtmlLinks(html, sourceFile, routePath) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/\s(?:href|src|action)="([^"]*)"/g)) {
    const value = match[1];
    assert.notEqual(value, "", `Leerer Link in ${relative(out, sourceFile)}`);
    assert.notEqual(value, "#", `Leerer Fragmentlink in ${relative(out, sourceFile)}`);
    if (/^(?:mailto:|tel:|data:)/.test(value)) continue;

    const parsed = new URL(value, new URL(routePath, productionOrigin));
    assert.equal(parsed.origin, productionOrigin, `Unerwartete externe Ressource in ${relative(out, sourceFile)}: ${value}`);

    if (parsed.hash && parsed.pathname === routePath) {
      assert.ok(ids.has(decodeURIComponent(parsed.hash.slice(1))), `Defektes Fragment ${value} in ${relative(out, sourceFile)}`);
    }

    const target = parsed.pathname;
    if (target.startsWith("/api/") && target.endsWith(".php")) {
      assert.ok(existsSync(join(out, target.slice(1))), `Fehlendes API-Ziel: ${target}`);
    } else if (target.endsWith("/")) {
      assert.ok(existsSync(join(out, target.slice(1), "index.html")), `Fehlendes Routenziel: ${target}`);
    } else {
      assert.ok(existsSync(join(out, target.slice(1))), `Fehlendes Asset oder Dateiziel: ${target}`);
    }
  }
}

function routeToHtml(path) {
  return path === "/" ? join(out, "index.html") : join(out, path.slice(1), "index.html");
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatBytes(bytes) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KiB` : `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

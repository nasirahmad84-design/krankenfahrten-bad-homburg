import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Verwendung: npm run verify:blog-export -- artikel-slug");
  process.exit(2);
}

const root = process.cwd();
const out = join(root, "out");
const articlePath = join(out, "ratgeber", slug, "index.html");
const hubPath = join(out, "ratgeber", "index.html");
const sitemapPath = join(out, "sitemap.xml");
const canonical = `https://krankenfahrten-bad-homburg.de/ratgeber/${slug}/`;

for (const path of [articlePath, hubPath, sitemapPath]) {
  assert.ok(existsSync(path), `Blog-Exportdatei fehlt: ${path}`);
}

const article = readFileSync(articlePath, "utf8");
const hub = readFileSync(hubPath, "utf8");
const sitemap = readFileSync(sitemapPath, "utf8");

assert.equal((article.match(/<h1\b/g) ?? []).length, 1, "Artikel benötigt genau eine H1.");
assert.equal((article.match(/<link[^>]+rel="canonical"/g) ?? []).length, 1, "Artikel benötigt genau einen Canonical.");
assert.ok(article.includes(`href="${canonical}"`), "Artikel-Canonical ist falsch.");
assert.equal((article.match(/"@type":"BlogPosting"/g) ?? []).length, 1, "BlogPosting-Daten fehlen oder sind doppelt.");
assert.ok(article.includes('data-editorial-source="true"'), "Artikel enthält keine gekennzeichnete redaktionelle Quelle.");
assert.ok(hub.includes(`/ratgeber/${slug}/`), "Ratgeber-Hub verlinkt den Artikel nicht.");
assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), "Sitemap enthält den Artikel nicht.");
assert.doesNotMatch(article, /<meta[^>]+name="robots"[^>]+noindex/i, "Artikel ist unerwartet auf noindex gesetzt.");
assert.doesNotMatch(article, /localhost|example\.com|test\.krankenfahrten-bad-homburg\.de/i, "Artikel enthält eine Test- oder Beispieldomain.");

console.log(`Blog-Export geprüft: Hub, Sitemap und /ratgeber/${slug}/.`);

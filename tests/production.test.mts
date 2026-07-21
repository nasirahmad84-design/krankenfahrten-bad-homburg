import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { absoluteUrl, productionOrigin, publicRoutePaths } from "../src/lib/site-url.ts";

test("zentralisiert Produktionsdomain und 17 öffentliche Routen", () => {
  assert.equal(productionOrigin, "https://krankenfahrten-bad-homburg.de");
  assert.equal(publicRoutePaths.length, 17);
  assert.equal(new Set(publicRoutePaths).size, publicRoutePaths.length);
  for (const route of publicRoutePaths) assert.ok(route === "/" || route.endsWith("/"));
});

test("erzeugt normalisierte absolute Produktions-URLs", () => {
  assert.equal(absoluteUrl("/"), "https://krankenfahrten-bad-homburg.de/");
  assert.equal(absoluteUrl("kontakt"), "https://krankenfahrten-bad-homburg.de/kontakt/");
  assert.equal(absoluteUrl("/leistungen/dialysefahrten/"), "https://krankenfahrten-bad-homburg.de/leistungen/dialysefahrten/");
});

test("robots.txt verweist auf Sitemap und sperrt nur den API-Pfad", () => {
  const robots = readFileSync(join(process.cwd(), "public/robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Sitemap: https:\/\/krankenfahrten-bad-homburg\.de\/sitemap\.xml$/m);
});

test("Sitemap enthält jede öffentliche Route genau einmal", () => {
  const sitemap = readFileSync(join(process.cwd(), "public/sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls, publicRoutePaths.map(absoluteUrl));
});

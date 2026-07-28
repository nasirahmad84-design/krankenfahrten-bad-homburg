import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { localBusinessStructuredData } from "../src/lib/local-business-structured-data.ts";
import { absoluteUrl, productionOrigin, publicRoutePaths } from "../src/lib/site-url.ts";
import { regionalLocations } from "../src/content/locations.ts";

test("zentralisiert Produktionsdomain und 26 öffentliche Routen", () => {
  assert.equal(productionOrigin, "https://krankenfahrten-bad-homburg.de");
  assert.equal(publicRoutePaths.length, 26);
  assert.equal(new Set(publicRoutePaths).size, publicRoutePaths.length);
  for (const route of publicRoutePaths) assert.ok(route === "/" || route.endsWith("/"));
});

test("führt den bestätigten regionalen SEO-Cluster mit individuellen Inhalten", () => {
  assert.deepEqual(
    regionalLocations.map(({ name }) => name),
    [
      "Burgholzhausen",
      "Köppern",
      "Friedrichsdorf",
      "Oberursel",
      "Frankfurt-Riedberg",
      "Frankfurt-Bonames",
      "Nieder-Eschbach",
      "Kalbach",
    ],
  );
  assert.equal(new Set(regionalLocations.map(({ slug }) => slug)).size, 8);
  assert.equal(new Set(regionalLocations.map(({ metadataTitle }) => metadataTitle)).size, 8);
  assert.equal(new Set(regionalLocations.map(({ metadataDescription }) => metadataDescription)).size, 8);

  const slugs = new Set(regionalLocations.map(({ slug }) => slug));
  for (const location of regionalLocations) {
    assert.ok(location.metadataTitle.length >= 35 && location.metadataTitle.length <= 60);
    assert.ok(location.metadataDescription.length >= 110 && location.metadataDescription.length <= 160);
    assert.equal(location.sources.length, 2);
    for (const source of location.sources) {
      assert.match(source, /^https:\/\/(?:m\.)?(?:www\.)?(?:friedrichsdorf\.de|oberursel\.de|frankfurt\.de)\//);
    }
    for (const relatedSlug of location.relatedSlugs) assert.ok(slugs.has(relatedSlug));
  }
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

test("pflegt verifizierte LocalBusiness-Daten einschließlich Facebook und 24/7", () => {
  assert.equal(localBusinessStructuredData["@type"], "LocalBusiness");
  assert.equal(localBusinessStructuredData.name, "Krankenfahrten Bad Homburg");
  assert.equal(localBusinessStructuredData.url, "https://krankenfahrten-bad-homburg.de/");
  assert.equal(localBusinessStructuredData.telephone, "+49 175 4142222");
  assert.equal(
    localBusinessStructuredData.logo,
    "https://krankenfahrten-bad-homburg.de/brand/logo.svg",
  );
  assert.deepEqual(localBusinessStructuredData.address, {
    "@type": "PostalAddress",
    streetAddress: "Basler Str. 3",
    postalCode: "61352",
    addressLocality: "Bad Homburg",
    addressCountry: "DE",
  });
  assert.deepEqual(localBusinessStructuredData.sameAs, [
    "https://www.facebook.com/krankenfahrtenbadhomburg",
  ]);
  assert.deepEqual(localBusinessStructuredData.openingHoursSpecification, [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ]);

  const serialized = JSON.stringify(localBusinessStructuredData);
  for (const forbidden of [
    "aggregateRating",
    "review",
    "geo",
    "priceRange",
    "30 km",
    "Rettungsdienst",
    "Rollstuhltransport",
    "Liegendtransport",
  ]) {
    assert.ok(!serialized.includes(forbidden), `Unbestätigte strukturierte Angabe: ${forbidden}`);
  }
  assert.doesNotMatch(serialized, /instagram|linkedin|tiktok|youtube|twitter|x\.com/i);
});

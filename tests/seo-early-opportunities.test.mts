import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { fullFaq } from "../src/content/faq.ts";
import { locationsBySlug } from "../src/content/locations.ts";
import { servicesBySlug } from "../src/content/services.ts";

const root = process.cwd();
const homeHero = readFileSync(join(root, "src/components/sections/home-hero.tsx"), "utf8");
const homeLocations = readFileSync(join(root, "src/components/sections/home-locations.tsx"), "utf8");

test("schärft die Startseite auf die lokale Hauptsuchanfrage", () => {
  assert.match(homeHero, />\s*Sitzende Krankenfahrten in Bad Homburg\s*</);
  assert.match(homeHero, /Zuverlässig zu Ihrer Behandlung und persönlich an Ihrer Seite/);
});

test("verlinkt bereits sichtbare Ortsseiten direkt von der Startseite", () => {
  for (const slug of ["friedrichsdorf", "oberursel", "frankfurt-riedberg"]) {
    assert.match(homeLocations, new RegExp(`/orte/${slug}`));
  }
});

test("beantwortet die frühe Suchnachfrage nach Reha-Heimfahrten am Wochenende", () => {
  const service = servicesBySlug["reha-therapiefahrten"];
  assert.ok(service);
  assert.ok(service.faqs.some(({ question }) => question === "Sind Reha-Heimfahrten am Wochenende möglich?"));
  assert.ok(fullFaq.some(({ question }) => question === "Sind Reha-Heimfahrten am Wochenende möglich?"));
  assert.match(service.metadataDescription, /Wochenendtermine/);
});

test("stärkt Friedrichsdorf ohne neue Leistungsversprechen", () => {
  const location = locationsBySlug.friedrichsdorf;
  assert.equal(location.metadataTitle, "Krankenfahrten Friedrichsdorf | Sitzend & persönlich");
  assert.ok(location.faqs.some(({ question }) => question.includes("ab Friedrichsdorf")));
  assert.match(location.faqs[0].answer, /planbare sitzende Fahrten/);
});

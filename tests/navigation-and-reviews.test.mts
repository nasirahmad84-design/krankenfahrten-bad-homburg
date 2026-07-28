import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { localBusinessStructuredData } from "../src/lib/local-business-structured-data.ts";
import { siteConfig } from "../src/lib/site-config.ts";

const projectRoot = process.cwd();

test("konfiguriert den Google-Rezensionslink genau einmal zentral", () => {
  assert.equal(
    siteConfig.googleReviewUrl,
    "https://g.page/r/CaFwfvm2AJWzEBM/review",
  );

  const reviewSection = readFileSync(
    join(projectRoot, "src/components/sections/home-reviews.tsx"),
    "utf8",
  );
  assert.match(reviewSection, /siteConfig\.googleReviewUrl/);
  assert.match(reviewSection, /Google-Rezension schreiben/);
  assert.match(reviewSection, /target="_blank"/);
  assert.match(reviewSection, /rel="noopener noreferrer"/);
  assert.doesNotMatch(reviewSection, /[★⭐]|Rabatt|Gutschein|Gegenleistung/);
});

test("zeichnet keine erfundenen Bewertungen strukturiert aus", () => {
  const structuredData = JSON.stringify(localBusinessStructuredData);
  assert.doesNotMatch(structuredData, /AggregateRating|aggregateRating|ratingValue|reviewCount/);
  assert.doesNotMatch(structuredData, /g\.page\/r\//);
});

test("mobile Navigation besitzt Dialogsemantik und vollständige Bedienung", () => {
  const navigation = readFileSync(
    join(projectRoot, "src/components/layout/mobile-navigation.tsx"),
    "utf8",
  );

  assert.match(navigation, /aria-expanded=\{isOpen\}/);
  assert.match(navigation, /aria-controls="mobile-navigation-panel"/);
  assert.match(navigation, /id="mobile-navigation-panel"/);
  assert.match(navigation, /aria-modal="true"/);
  assert.match(navigation, /event\.key === "Escape"/);
  assert.match(navigation, /event\.key === "Tab"/);
  assert.match(navigation, /document\.body\.style/);
  assert.match(navigation, /window\.scrollTo/);
  assert.match(navigation, /element\.inert = true/);
  assert.match(navigation, /element\.inert = false/);
  assert.match(navigation, /ResizeObserver/);
});

test("Menü verwendet dynamische Viewport- und Safe-Area-Regeln", () => {
  const styles = readFileSync(join(projectRoot, "src/app/globals.css"), "utf8");
  assert.match(styles, /height: calc\(100dvh - var\(--mobile-header-height\)\)/);
  assert.match(styles, /padding-bottom: env\(safe-area-inset-bottom\)/);
  assert.match(styles, /\.site-body\[data-mobile-menu-open="true"\] \.site-header/);
  assert.match(styles, /\.site-body\[data-mobile-menu-open="true"\] \.mobile-contact-bar/);
});

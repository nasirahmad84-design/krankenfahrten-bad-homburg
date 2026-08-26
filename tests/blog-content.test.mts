import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { publishedBlogPosts } from "../src/content/blog-posts.ts";
import { createBlogPostingStructuredData } from "../src/lib/blog-structured-data.ts";

test("veröffentlicht nur vollständig belegte Ratgeberdaten", () => {
  assert.ok(publishedBlogPosts.length >= 1);
  assert.equal(new Set(publishedBlogPosts.map(({ slug }) => slug)).size, publishedBlogPosts.length);

  for (const post of publishedBlogPosts) {
    assert.ok(post.sources.length >= 2);
    assert.ok(post.sections.length >= 3);
    assert.ok(post.faqs.length >= 2);
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(post.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(post.description.length >= 110 && post.description.length <= 160);
    assert.ok(post.metadataTitle.length >= 25 && post.metadataTitle.length <= 60);
    assert.ok(post.sections.every(({ sourceIds }) => (sourceIds?.length ?? 0) >= 1));
  }
});

test("grenzt den Pilotbeitrag vom qualifizierten Krankentransport ab", () => {
  const post = publishedBlogPosts.find(
    ({ slug }) => slug === "krankenfahrt-oder-krankentransport-unterschied",
  );
  assert.ok(post, "Der Pilotbeitrag fehlt in den veröffentlichten Ratgeberdaten.");
  const text = JSON.stringify(post);
  assert.match(text, /keine medizinisch-fachliche Betreuung/);
  assert.match(text, /ausschließlich planbare sitzende Krankenfahrten/);
  assert.match(text, /Notrufnummer 112/);
  assert.doesNotMatch(text, /wir übernehmen Krankentransporte|Kosten werden garantiert übernommen/i);
});

test("erzeugt ein belegbares BlogPosting ohne erfundene Person", () => {
  const structuredData = createBlogPostingStructuredData(publishedBlogPosts[0]);
  assert.equal(structuredData["@type"], "BlogPosting");
  assert.equal(structuredData.author["@type"], "Organization");
  assert.equal(structuredData.author.name, "Krankenfahrten Bad Homburg");
  assert.equal(structuredData.mainEntityOfPage, `https://krankenfahrten-bad-homburg.de/ratgeber/${publishedBlogPosts[0].slug}/`);
});

test("hält Entwürfe außerhalb der öffentlichen Inhaltsquelle", () => {
  const publicSource = readFileSync(join(process.cwd(), "src/content/blog-posts.ts"), "utf8");
  assert.doesNotMatch(publicSource, /status:\s*["'](?:draft|blocked)/);
});

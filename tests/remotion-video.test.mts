import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {validateArticleVideoProps} from "../remotion/article-video-data.ts";

const article = JSON.parse(
  readFileSync("automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json", "utf8"),
);

test("verwendet ausschließlich einen veröffentlichten und ausreichend belegten Artikel", () => {
  assert.deepEqual(validateArticleVideoProps(article), []);
  assert.equal(article.sources.length, 4);
  assert.match(article.title, /Krankenfahrt oder Krankentransport/);
});

test("blockiert zu lange oder unbelegte Videoeingaben", () => {
  assert.match(validateArticleVideoProps({...article, summary: ["zu kurz"]}).join(" "), /drei geprüfte Kernaussagen/);
  assert.match(validateArticleVideoProps({...article, sources: []}).join(" "), /zwei Quellen/);
  assert.match(validateArticleVideoProps({...article, title: "x".repeat(101)}).join(" "), /20 bis 100/);
});

test("rendert im Pilot keine Nutzer-, Patienten- oder Kontaktdaten", () => {
  const source = readFileSync("remotion/article-video.tsx", "utf8");
  assert.doesNotMatch(source, /phone|telefon|patientenname|email|adresse/i);
  assert.match(source, /Keine medizinische oder versicherungsrechtliche Einzelfallberatung/);
});

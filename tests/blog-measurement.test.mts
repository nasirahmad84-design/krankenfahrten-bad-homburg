import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { analyticsPageContext } from "../src/lib/analytics-page-context.ts";

const origin = "https://krankenfahrten-bad-homburg.de";
const campaign = "utm_source=google&utm_medium=organic&utm_campaign=gbp_ratgeber";

test("übernimmt ausschließlich die feste GBP-Kampagne ohne freie Querydaten", () => {
  const context = analyticsPageContext(`${origin}/ratgeber/artikel/?${campaign}&utm_content=PRIVATE&notes=PRIVATE#PRIVATE`, "https://example.org/patient/PRIVATE?email=PRIVATE");
  assert.deepEqual(context, {
    page_location: `${origin}/ratgeber/artikel/?${campaign}`,
    page_path: "/ratgeber/artikel/",
    page_referrer: "https://example.org",
  });
  assert.doesNotMatch(JSON.stringify(context), /PRIVATE/);
  for (const query of ["utm_campaign=PRIVATE", `${campaign}&utm_source=PRIVATE`, campaign.replace("organic", "PRIVATE")]) {
    assert.equal(analyticsPageContext(`${origin}/ratgeber/artikel/?${query}`)?.page_location, `${origin}/ratgeber/artikel/`);
  }
  assert.equal(analyticsPageContext(`${origin}/kontakt/?${campaign}`)?.page_location, `${origin}/kontakt/`);
});

test("sperrt Testdomain, lokale Vorschau und Redaktion/API", () => {
  for (const href of ["https://test.krankenfahrten-bad-homburg.de/", "http://localhost:3000/", `${origin}/redaktion`, `${origin}/redaktion/index.php`, `${origin}/api/fahrtanfrage.php`]) {
    assert.equal(analyticsPageContext(href), null);
  }
});

function loadAnalytics(href: string, consent: string) {
  const calls: unknown[][] = [];
  const scripts: unknown[] = [];
  const exports = {} as Record<string, (...args: unknown[]) => void>;
  const source = readFileSync("src/lib/analytics-consent.ts", "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const context = {
    exports,
    require: (name: string) => name.includes("site-config") ? { siteConfig: { analytics: { measurementId: "TEST" } } } : { analyticsPageContext },
    window: { location: new URL(href), gtag: (...args: unknown[]) => calls.push(args) },
    document: { cookie: `kfbh_analytics_consent=${consent}`, title: "Artikel", referrer: "https://google.com/?q=PRIVATE", createElement: () => ({}), head: { append: (script: unknown) => scripts.push(script) } },
  };
  vm.runInNewContext(compiled, context);
  return { exports, calls, scripts };
}

test("lädt auch mit Kampagne vor Zustimmung oder auf Test/Redaktion kein Tag", () => {
  for (const [href, consent] of [[`${origin}/ratgeber/artikel/?${campaign}`, "unset"], [`${origin}/ratgeber/artikel/?${campaign}`, "denied"], ["https://test.krankenfahrten-bad-homburg.de/", "granted"], [`${origin}/redaktion/`, "granted"]]) {
    const runtime = loadAnalytics(href, consent);
    runtime.exports.initializeGoogleAnalytics();
    runtime.exports.trackPageView("/");
    runtime.exports.trackAnalyticsEvent("generate_lead");
    assert.equal(runtime.scripts.length, 0);
    assert.equal(runtime.calls.length, 0);
  }
});

test("initialisiert und sendet Seiten/Kontaktaktionen nur mit bereinigtem Kontext", () => {
  const runtime = loadAnalytics(`${origin}/ratgeber/artikel/?${campaign}&notes=PRIVATE`, "granted");
  runtime.exports.initializeGoogleAnalytics();
  runtime.exports.trackPageView("/ratgeber/artikel/");
  runtime.exports.trackAnalyticsEvent("click_phone");
  assert.equal(runtime.scripts.length, 1);
  const configuration = runtime.calls.find(([command]) => command === "config")?.[2] as Record<string, unknown>;
  assert.equal(configuration.send_page_view, false);
  assert.equal(configuration.page_location, `${origin}/ratgeber/artikel/?${campaign}`);
  assert.equal(runtime.calls.filter(([command]) => command === "event").length, 2);
  assert.doesNotMatch(JSON.stringify(runtime.calls), /PRIVATE/);
});

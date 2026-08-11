import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const analytics = readFileSync(join(root, "src/lib/analytics-consent.ts"), "utf8");
const manager = readFileSync(join(root, "src/components/analytics/analytics-consent-manager.tsx"), "utf8");
const settings = readFileSync(join(root, "src/components/analytics/analytics-consent-settings.tsx"), "utf8");
const layout = readFileSync(join(root, "src/app/layout.tsx"), "utf8");
const form = readFileSync(join(root, "src/components/forms/ride-request-form.tsx"), "utf8");

test("zentralisiert GA4 und lädt das Google-Tag ausschließlich nach Einwilligung", () => {
  const siteConfig = readFileSync(join(root, "src/lib/site-config.ts"), "utf8");
  assert.match(siteConfig, /measurementId: "G-WD56RCXD03"/);
  assert.match(analytics, /getAnalyticsConsent\(\) !== "granted"/);
  assert.match(analytics, /document\.createElement\("script"\)/);
  assert.match(analytics, /https:\/\/www\.googletagmanager\.com\/gtag\/js/);
  assert.match(analytics, /dataLayer\?\.push\(arguments\)/);
  assert.doesNotMatch(layout, /googletagmanager|google-analytics|<Script/);
  assert.match(layout, /<AnalyticsConsentManager \/>/);
});

test("setzt Consent Mode v2 werbefrei und ohne automatische Seitenaufrufe", () => {
  assert.match(analytics, /analytics_storage: "denied"/);
  assert.match(analytics, /ad_storage: "denied"/);
  assert.match(analytics, /ad_user_data: "denied"/);
  assert.match(analytics, /ad_personalization: "denied"/);
  assert.match(analytics, /analytics_storage: "granted"/);
  assert.match(analytics, /send_page_view: false/);
  assert.match(analytics, /allow_google_signals: false/);
  assert.match(analytics, /allow_ad_personalization_signals: false/);
});

test("überträgt nur freigegebene Ereignisnamen und keine Formularwerte", () => {
  for (const eventName of ["page_view", "generate_lead", "click_phone", "click_whatsapp", "click_google_review"]) {
    assert.match(`${analytics}\n${manager}\n${form}`, new RegExp(`\\b${eventName}\\b`));
  }
  assert.match(form, /trackAnalyticsEvent\("generate_lead"\)/);
  assert.doesNotMatch(analytics, /pickup|destination|phone:|email:|reason|notes|FormData/);
});

test("bietet gleichwertige Zustimmung, Ablehnung und späteren Widerruf", () => {
  assert.match(manager, /Nur notwendige Cookies/);
  assert.match(manager, /Analyse erlauben/);
  assert.match(manager, /href="\/cookie-einstellungen\/"/);
  assert.match(settings, /Analyse deaktivieren/);
  assert.match(settings, /Analyse erlauben/);
  assert.match(analytics, /removeGoogleAnalyticsCookies\(\)/);
  assert.match(analytics, /Max-Age=\$\{analyticsConsentMaxAgeSeconds\}/);
});

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { consentBannerRequired, privacyInventory } from "../src/content/legal/privacy-inventory.ts";
import { imprintContent } from "../src/content/legal/imprint.ts";
import { privacyContent } from "../src/content/legal/privacy.ts";

const projectRoot = process.cwd();

test("führt alle drei Rechtsseiten in der Footer-Konfiguration", () => {
  const siteConfig = readFileSync(join(projectRoot, "src/lib/site-config.ts"), "utf8");
  for (const route of ["/impressum/", "/datenschutz/", "/cookie-einstellungen/"]) {
    assert.match(siteConfig, new RegExp(route.replaceAll("/", "\\/")));
  }
});

test("stellt alle Legal-Routen als statische App-Seiten bereit", () => {
  for (const route of ["impressum", "datenschutz", "cookie-einstellungen"]) {
    const page = readFileSync(join(projectRoot, `src/app/${route}/page.tsx`), "utf8");
    assert.doesNotMatch(page, /cookies\(|headers\(|use server|force-dynamic/);
    assert.match(page, /export const metadata/);
  }
});

test("bildet den geprüften Cookie- und Storage-Bestand ab", () => {
  assert.equal(privacyInventory.browserStorage.cookies.length, 3);
  assert.match(privacyInventory.browserStorage.cookies.join("\n"), /kfbh_analytics_consent/);
  assert.match(privacyInventory.browserStorage.cookies.join("\n"), /_ga_WD56RCXD03/);
  assert.deepEqual(privacyInventory.browserStorage.localStorage, []);
  assert.deepEqual(privacyInventory.browserStorage.sessionStorage, []);
  assert.equal(privacyInventory.browserStorage.phpSession, false);
  assert.equal(privacyInventory.website.analytics, true);
  assert.equal(privacyInventory.website.trackingPixels, false);
  assert.equal(privacyInventory.browserStorage.consentStorage, true);
  assert.equal(privacyInventory.analytics.measurementId, "G-WD56RCXD03");
  assert.equal(privacyInventory.analytics.advertisingConsent, false);
  assert.equal(privacyInventory.analytics.googleSignals, false);
  assert.equal(consentBannerRequired, true);
});

test("Produktivcode verwendet nur den dokumentierten Consent-Cookie und keinen Browser-Storage", () => {
  const files = collectFiles(join(projectRoot, "src"), [".ts", ".tsx"])
    .filter((file) => !file.includes("/content/legal/"));
  const phpFiles = collectFiles(join(projectRoot, "public/api"), [".php"])
    .filter((file) => !file.includes("/vendor/"));
  const source = [...files, ...phpFiles].map((file) => readFileSync(file, "utf8")).join("\n");
  assert.match(source, /document\.cookie/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|setcookie\s*\(|session_start\s*\(/);
  assert.equal((source.match(/kfbh_analytics_consent/g) ?? []).length, 1);
});

test("verlinkt die Datenschutzerklärung am Anfrageformular", () => {
  const form = readFileSync(join(projectRoot, "src/components/forms/ride-request-form.tsx"), "utf8");
  const contact = readFileSync(join(projectRoot, "src/app/kontakt/page.tsx"), "utf8");
  assert.match(form, /href="\/datenschutz\/"/);
  assert.match(contact, /href="\/datenschutz\/"/);
});

test("weist Rechtsgrundlagen und zuständige Behörden transparent aus", () => {
  const privacy = JSON.stringify(privacyContent);
  const imprint = JSON.stringify(imprintContent);
  assert.match(privacy, /Art\. 6 Abs\. 1 Buchst\. b DSGVO/);
  assert.match(privacy, /Art\. 9 Abs\. 2 Buchst\. a/);
  assert.match(privacy, /Hessische Beauftragte für Datenschutz und Informationsfreiheit/);
  assert.match(privacy, /iCalendar-Datei/);
  assert.match(imprint, /Straßenverkehrsbehörde/);
  assert.match(imprint, /Personenbeförderungsgesetz/);
});

test("holt für mögliche Gesundheitsdaten eine ausdrückliche Einwilligung ein", () => {
  const form = readFileSync(join(projectRoot, "src/components/forms/ride-request-form.tsx"), "utf8");
  assert.match(form, /willige ausdrücklich ein/);
  assert.match(form, /gesundheitsbezogener Angaben/);
  assert.match(form, /jederzeit mit Wirkung für die Zukunft widerrufen/);
});

test("interne Prüfpunkte werden von öffentlichen Seiten nicht importiert", () => {
  const pages = collectFiles(join(projectRoot, "src/app"), [".ts", ".tsx"])
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  assert.doesNotMatch(pages, /legal\/open-items|legalOpenItems/);
});

function collectFiles(directory: string, extensions: readonly string[]): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path, extensions) : extensions.some((extension) => entry.name.endsWith(extension)) ? [path] : [];
  });
}

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { consentBannerRequired, privacyInventory } from "../src/content/legal/privacy-inventory.ts";

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
  assert.deepEqual(privacyInventory.browserStorage.cookies, []);
  assert.deepEqual(privacyInventory.browserStorage.localStorage, []);
  assert.deepEqual(privacyInventory.browserStorage.sessionStorage, []);
  assert.equal(privacyInventory.browserStorage.phpSession, false);
  assert.equal(privacyInventory.website.analytics, false);
  assert.equal(privacyInventory.website.trackingPixels, false);
  assert.equal(consentBannerRequired, false);
});

test("Produktivcode greift nicht auf Cookies oder Browser-Storage zu", () => {
  const files = collectFiles(join(projectRoot, "src"), [".ts", ".tsx"])
    .filter((file) => !file.includes("/content/legal/"));
  const phpFiles = collectFiles(join(projectRoot, "public/api"), [".php"]);
  const source = [...files, ...phpFiles].map((file) => readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|setcookie\s*\(|session_start\s*\(/);
});

test("verlinkt die Datenschutzerklärung am Anfrageformular", () => {
  const form = readFileSync(join(projectRoot, "src/components/forms/ride-request-form.tsx"), "utf8");
  const contact = readFileSync(join(projectRoot, "src/app/kontakt/page.tsx"), "utf8");
  assert.match(form, /href="\/datenschutz\/"/);
  assert.match(contact, /href="\/datenschutz\/"/);
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

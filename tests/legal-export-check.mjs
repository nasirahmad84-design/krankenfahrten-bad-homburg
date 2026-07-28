import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const legalFiles = ["impressum/index.html", "datenschutz/index.html", "cookie-einstellungen/index.html"];
const facebookUrl = "https://www.facebook.com/krankenfahrtenbadhomburg";
const googleReviewUrl = "https://g.page/r/CaFwfvm2AJWzEBM/review";
const whatsappUrl = "https://wa.me/491754142222";

for (const file of legalFiles) assert.ok(existsSync(join(outDir, file)), `Fehlender Export: out/${file}`);

const htmlFiles = collectHtml(outDir);
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  assert.equal(h1Count, 1, `${file} muss genau eine H1 enthalten`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const allowed = url.startsWith("/") || url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:") || url.startsWith("https://krankenfahrten-bad-homburg.de/") || url === facebookUrl || url === googleReviewUrl || url === whatsappUrl;
    assert.ok(allowed, `Unerwartete externe URL in ${file}: ${url}`);
  }
}
console.log(`Legal-Export geprüft: ${legalFiles.length} Rechtsseiten, ${htmlFiles.length} HTML-Dateien, keine externen Laufzeit-URLs.`);

function collectHtml(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}

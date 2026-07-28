import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const productionOrigin = "https://krankenfahrten-bad-homburg.de";
const testOrigin = "https://test.krankenfahrten-bad-homburg.de";
const facebookUrl = "https://www.facebook.com/krankenfahrtenbadhomburg";
const socialImageUrl = `${productionOrigin}/images/social/og-default-1200x630.webp`;
const websiteImages = [
  ["images/home/hero-krankenfahrt.webp", 1800, 1100, 400 * 1024],
  ["images/home/persoenliche-unterstuetzung.webp", 1400, 900, 300 * 1024],
  ["images/services/leistungen-hero.webp", 1400, 900, 300 * 1024],
  ["images/about/betreiber-mit-fahrzeug.webp", 1200, 900, 300 * 1024],
  ["images/social/og-default-1200x630.webp", 1200, 630, 500 * 1024],
];
const informativeImageAlts = new Map([
  ["/images/home/hero-krankenfahrt.webp", "Fahrer öffnet einem älteren Fahrgast die hintere Fahrzeugtür."],
  ["/images/home/persoenliche-unterstuetzung.webp", "Fahrer begleitet einen älteren Fahrgast zum Eingang einer Praxis."],
  ["/images/services/leistungen-hero.webp", "Fahrer und älterer Fahrgast stehen neben einem Fahrzeug vor einer Praxis."],
  ["/images/about/betreiber-mit-fahrzeug.webp", "Fahrer steht neben einem dunklen Fahrzeug des Fahrdienstes."],
]);
const foundInformativeImages = new Set();

assert.ok(existsSync(out) && statSync(out).isDirectory(), "out/ fehlt. Zuerst npm run build ausführen.");

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  ".htaccess",
  "api/fahrtanfrage.php",
  "api/config.example.php",
  "api/lib/validation.php",
  "api/lib/security.php",
  "api/lib/calendar.php",
  "api/lib/mail.php",
  "api/vendor/autoload.php",
  "api/vendor/.htaccess",
  "api/vendor/composer/installed.json",
  "api/vendor/phpmailer/phpmailer/src/Exception.php",
  "api/vendor/phpmailer/phpmailer/src/PHPMailer.php",
  "api/vendor/phpmailer/phpmailer/src/SMTP.php",
  "icon.png",
  "apple-icon.png",
  "brand/logo.svg",
  "brand/logo-mark.svg",
  "service-icons/arztfahrt.svg",
  "service-icons/dialysefahrt.svg",
  "service-icons/entlassungsfahrt.svg",
  "service-icons/krankenhausfahrt.svg",
  "service-icons/reha-fahrt.svg",
  "service-icons/therapiefahrt.svg",
  "service-icons/facebook.svg",
  ...websiteImages.map(([file]) => file),
];
for (const file of requiredFiles) assert.ok(existsSync(join(out, file)), `Erforderliche Datei fehlt: out/${file}`);
for (const [file, width, height, maxBytes] of websiteImages) {
  const imagePath = join(out, file);
  assert.ok(statSync(imagePath).size > 0, `Leere Bilddatei: out/${file}`);
  assert.ok(statSync(imagePath).size <= maxBytes, `Bilddatei überschreitet Warnschwelle: out/${file}`);
  assert.deepEqual(readWebpDimensions(imagePath), { width, height }, `Falsche Bildabmessungen: out/${file}`);
}

assert.ok(!existsSync(join(out, "api/config.php")), "api/config.php darf nicht im Build-Paket liegen.");
assert.ok(!existsSync(join(out, "icons")), "Der auf ALL-INKL reservierte Icon-Ordner darf nicht verwendet werden.");
assert.ok(!existsSync(join(out, "staging.htaccess.example")), "Staging-Regeln dürfen nicht im Produktionspaket liegen.");
assert.ok(!existsSync(join(out, "api/vendor/phpunit")), "Composer-Entwicklungsabhängigkeit im Upload-Paket.");
assert.ok(!existsSync(join(out, "api/vendor/bin")), "Ausführbare Composer-Entwicklungswerkzeuge im Upload-Paket.");

const installedPackages = JSON.parse(readFileSync(join(out, "api/vendor/composer/installed.json"), "utf8")).packages;
assert.deepEqual(
  installedPackages.map(({ name }) => name),
  ["phpmailer/phpmailer"],
  "Das Upload-Paket darf nur die benötigte PHP-Laufzeitabhängigkeit enthalten.",
);

const configExample = readFileSync(join(out, "api/config.example.php"), "utf8");
assert.match(configExample, /'mail_transport'\s*=>\s*'smtp'/);
assert.match(configExample, /'smtp_secure'\s*=>\s*'tls'/);
assert.match(configExample, /'smtp_port'\s*=>\s*587/);
assert.match(configExample, /'smtp_password'\s*=>\s*'HIER-NUR-AUF-DEM-SERVER-EINTRAGEN'/);
assert.match(configExample, /'calendar_event_duration_minutes'\s*=>\s*60/);
assert.match(configExample, /'calendar_reminder_minutes'\s*=>\s*30/);
assert.match(configExample, /'calendar_uid_salt'\s*=>\s*'NUR-AUF-DEM-SERVER-EINTRAGEN'/);
assert.equal(
  [...configExample.matchAll(/'calendar_uid_salt'\s*=>\s*'([^']+)'/g)].map((match) => match[1]).join(""),
  "NUR-AUF-DEM-SERVER-EINTRAGEN",
  "Die Kalenderkonfiguration darf nur den dokumentierten Salt-Platzhalter enthalten.",
);

const mailImplementation = readFileSync(join(out, "api/lib/mail.php"), "utf8");
assert.doesNotMatch(mailImplementation, /\bmail\s*\(/, "Native mail()-Fallback ist noch vorhanden.");
assert.match(mailImplementation, /SMTPAutoTLS\s*=\s*false/, "Automatische TLS-Aushandlung muss deaktiviert sein.");
assert.match(mailImplementation, /ENCRYPTION_STARTTLS/);
assert.match(mailImplementation, /ENCRYPTION_SMTPS/);
assert.match(mailImplementation, /require_once __DIR__ \. '\/calendar\.php'/, "Mail-Implementierung lädt den ICS-Generator nicht.");
assert.match(mailImplementation, /addStringAttachment/);
assert.match(mailImplementation, /text\/calendar; charset=UTF-8; method=PUBLISH/);

const calendarImplementation = readFileSync(join(out, "api/lib/calendar.php"), "utf8");
assert.doesNotMatch(calendarImplementation, /file_put_contents|fopen|tempnam|tmpfile/, "ICS darf nicht ins Dateisystem geschrieben werden.");
assert.doesNotMatch(calendarImplementation, /https?:\/\/|webcal:|calendar\.google|outlook\.live/i, "Externe Kalenderintegration im ICS-Generator.");

const htaccess = readFileSync(join(out, ".htaccess"), "utf8");
const sourceHtaccess = readFileSync(join(root, "public/.htaccess"), "utf8");
assert.equal(htaccess, sourceHtaccess, "public/.htaccess wurde nicht unverändert nach out/ kopiert.");
assert.match(htaccess, /^ErrorDocument 404 \/404\.html$/m, "Apache-404-Fehlerdokument fehlt.");
assert.match(htaccess, /REDIRECT_STATUS\} \^404\$/);
assert.doesNotMatch(htaccess, /^RewriteRule[^\n]*index\.html/im, "Unzulässiger SPA-Fallback in .htaccess.");
assert.match(htaccess, /RewriteRule \^api\/vendor/, "Direkter Zugriff auf Composer-Vendor ist nicht blockiert.");
assert.match(htaccess, /config\(\?:\\\.example\)\?\\\.php/, "Zugriffsschutz für api/config.php fehlt.");
assert.match(readFileSync(join(out, "api/vendor/.htaccess"), "utf8"), /Require all denied/);

const stagingHtaccess = readFileSync(join(root, "deployment/staging.htaccess.example"), "utf8");
assert.match(stagingHtaccess, /X-Robots-Tag "noindex, nofollow, noarchive"/);
assert.doesNotMatch(htaccess, /X-Robots-Tag/, "Staging-noindex wurde in die Produktionskonfiguration übernommen.");

const files = collectFiles(out);
const relativeFiles = files.map((file) => relative(out, file).split(sep).join("/"));
for (const file of relativeFiles) {
  assert.ok(!/(^|\/)\.DS_Store$/i.test(file), `macOS-Metadatendatei im Export: ${file}`);
  assert.ok(!/(^|\/)\.env(?:\.|$)/i.test(file), `Environment-Datei im Export: ${file}`);
  assert.ok(!/\.map$/i.test(file), `Source Map im Export: ${file}`);
  assert.ok(!/\.(?:ts|tsx)$/i.test(file), `TypeScript-Quelle im Export: ${file}`);
  assert.ok(!/(^|\/)(?:tests?|__tests__)(\/|$)/i.test(file), `Testdatei im Export: ${file}`);
  assert.ok(!/(^|\/)(?:server|middleware)\.(?:js|mjs|cjs)$/i.test(file), `Node-Serverdatei im Export: ${file}`);
  assert.ok(!/\.ics$/i.test(file), `Dauerhaft erzeugte Kalenderdatei im Export: ${file}`);
}

const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, 17, "Die Sitemap muss genau 17 öffentliche URLs enthalten.");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Die Sitemap enthält doppelte URLs.");

const publicPaths = sitemapUrls.map((url) => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, productionOrigin, `Falsche Sitemap-Domain: ${url}`);
  assert.ok(parsed.pathname === "/" || parsed.pathname.endsWith("/"), `Sitemap-URL ohne trailingSlash: ${url}`);
  return parsed.pathname;
});

const renderedTitles = [];
const renderedDescriptions = [];
let structuredDataCount = 0;

for (const path of publicPaths) {
  const htmlFile = routeToHtml(path);
  assert.ok(existsSync(htmlFile), `Sitemap-Ziel fehlt: ${path}`);
  const html = readFileSync(htmlFile, "utf8");
  const expectedCanonical = new URL(path, productionOrigin).toString();
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(canonicals, [expectedCanonical], `Canonical stimmt nicht für ${path}`);
  assert.ok(!canonicals.some((canonical) => canonical.startsWith(testOrigin)), `Testdomain-Canonical in ${path}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path} muss genau eine H1 enthalten.`);
  assert.match(html, /href="#main-content"/, `Skip-Link fehlt in ${path}`);
  assert.doesNotMatch(html, /localhost|example\.com|test\.krankenfahrten-bad-homburg\.de|TODO|placeholder|development|test mode|technical|mock/i, `Öffentlicher Entwicklungs- oder Testtext in ${path}`);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `Produktive noindex-Seite: ${path}`);
  const preloadedContentImages = [...html.matchAll(/<link[^>]+rel="preload"[^>]+as="image"[^>]+href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("/images/"));
  assert.deepEqual(
    preloadedContentImages,
    path === "/" ? ["/images/home/hero-krankenfahrt.webp"] : [],
    `Falsche Bild-Preloads in ${path}`,
  );

  const title = decodeHtmlText(matchSingle(html, /<title>(.*?)<\/title>/, `Title fehlt in ${path}`));
  const description = decodeHtmlText(matchSingle(html, /<meta name="description" content="([^"]+)"/, `Description fehlt in ${path}`));
  assert.ok([...title].length >= 25 && [...title].length <= 60, `Title-Länge außerhalb des geprüften Bereichs in ${path}: ${[...title].length}`);
  assert.ok([...description].length >= 110 && [...description].length <= 160, `Description-Länge außerhalb des geprüften Bereichs in ${path}: ${[...description].length}`);
  renderedTitles.push(title);
  renderedDescriptions.push(description);

  assert.equal((html.match(/<meta property="og:title"/g) ?? []).length, 1, `Open-Graph-Titel fehlt in ${path}`);
  assert.equal((html.match(/<meta property="og:description"/g) ?? []).length, 1, `Open-Graph-Description fehlt in ${path}`);
  assert.equal((html.match(/<meta property="og:url"/g) ?? []).length, 1, `Open-Graph-URL fehlt in ${path}`);
  assert.equal((html.match(/<meta property="og:site_name"/g) ?? []).length, 1, `Open-Graph-Site-Name fehlt in ${path}`);
  assert.equal((html.match(/<meta property="og:locale" content="de_DE"/g) ?? []).length, 1, `Open-Graph-Locale fehlt in ${path}`);
  assert.equal((html.match(/<meta property="og:image"/g) ?? []).length, 1, `Open-Graph-Bild fehlt oder ist doppelt in ${path}`);
  assert.match(html, new RegExp(`<meta property="og:image" content="${escapeRegExp(socialImageUrl)}"`), `Falsche Open-Graph-Bild-URL in ${path}`);
  assert.match(html, /<meta property="og:image:width" content="1200"/, `Open-Graph-Bildbreite fehlt in ${path}`);
  assert.match(html, /<meta property="og:image:height" content="630"/, `Open-Graph-Bildhöhe fehlt in ${path}`);
  assert.match(html, /<meta property="og:image:alt" content="Krankenfahrten Bad Homburg – sicher, persönlich und regional\."/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `Twitter-Large-Image-Card fehlt in ${path}`);
  assert.equal((html.match(/<meta name="twitter:image"/g) ?? []).length, 1, `Twitter-Bild fehlt oder ist doppelt in ${path}`);
  assert.match(html, new RegExp(`<meta name="twitter:image" content="${escapeRegExp(socialImageUrl)}"`));

  const jsonLdScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  structuredDataCount += jsonLdScripts.length;
  if (path === "/") {
    assert.equal(jsonLdScripts.length, 1, "Startseite muss genau ein JSON-LD-Skript enthalten.");
    auditLocalBusinessJsonLd(JSON.parse(jsonLdScripts[0][1]));
  } else {
    assert.equal(jsonLdScripts.length, 0, `Unerwartetes zusätzliches JSON-LD in ${path}`);
  }

  auditImageAlternatives(html, path);
  auditHtmlLinks(html, htmlFile, path);
}
assert.equal(new Set(renderedTitles).size, renderedTitles.length, "Doppelte Seitentitel im Export.");
assert.equal(new Set(renderedDescriptions).size, renderedDescriptions.length, "Doppelte Meta-Descriptions im Export.");
assert.equal(structuredDataCount, 1, "Im Export darf genau ein Unternehmensobjekt vorhanden sein.");
assert.deepEqual(foundInformativeImages, new Set(informativeImageAlts.keys()), "Nicht alle informativen Bilder wurden im Export gefunden.");
const homeHtml = readFileSync(join(out, "index.html"), "utf8");
assert.match(homeHtml, new RegExp(`href="${escapeRegExp(facebookUrl)}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"`), "Facebook-Link im Footer fehlt.");

const notFoundHtml = readFileSync(join(out, "404.html"), "utf8");
assert.equal((notFoundHtml.match(/<h1\b/g) ?? []).length, 1, "404.html muss genau eine H1 enthalten.");
assert.match(notFoundHtml, /Seite nicht gefunden/);
assert.match(notFoundHtml, /<meta name="robots" content="noindex"/, "404.html muss noindex enthalten.");
auditHtmlLinks(notFoundHtml, join(out, "404.html"), "/404.html");

const robots = readFileSync(join(out, "robots.txt"), "utf8");
assert.match(robots, /Disallow: \/api\//);
assert.match(robots, new RegExp(`Sitemap: ${escapeRegExp(productionOrigin)}/sitemap\\.xml`));

const publicText = files
  .filter((file) => [".html", ".txt", ".xml"].includes(extname(file)))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
assert.doesNotMatch(publicText, /localhost|example\.com|test\.krankenfahrten-bad-homburg\.de/i, "Lokale, Test- oder Beispieldomain im öffentlichen Paket.");
assert.doesNotMatch(publicText, new RegExp("/" + "icons/"), "Die auf ALL-INKL reservierte Icon-URL ist noch im Seitenpaket enthalten.");
assert.doesNotMatch(publicText, /use server|resend\.com|EMAIL_API_KEY|RESEND_API_KEY/i, "Server-Action-, Resend- oder Secret-Hinweis im Seitenpaket.");
assert.doesNotMatch(publicText, /w01267fe\.kasserver\.com|smtp_password|SMTPDebug/i, "SMTP-Konfiguration ist im Browserpaket sichtbar.");
assert.doesNotMatch(publicText, /calendar_uid_salt|webcal:|calendar\.google|outlook\.live/i, "Kalender-Secret oder externe Kalenderintegration im Browserpaket.");
assert.doesNotMatch(publicText, /sk-[A-Za-z0-9]{16,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);

const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`Deployment-Paket geprüft: ${publicPaths.length} öffentliche Routen, ${files.length} Dateien, ${formatBytes(totalBytes)}.`);
console.log(`Größte JavaScript-Dateien: ${largestFiles(files, /\.(?:js|mjs)$/i, 3).join(", ") || "keine"}.`);
console.log(`Größte Bilddateien: ${largestFiles(files, /\.(?:avif|gif|jpe?g|png|svg|webp)$/i, 3).join(", ") || "keine"}.`);
console.log(`Größte Schriftdateien: ${largestFiles(files, /\.(?:woff2?|ttf|otf)$/i, 3).join(", ") || "keine"}.`);

function auditHtmlLinks(html, sourceFile, routePath) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/\s(?:href|src|action)="([^"]*)"/g)) {
    const value = match[1];
    assert.notEqual(value, "", `Leerer Link in ${relative(out, sourceFile)}`);
    assert.notEqual(value, "#", `Leerer Fragmentlink in ${relative(out, sourceFile)}`);
    if (/^(?:mailto:|tel:|data:)/.test(value)) continue;

    const parsed = new URL(value, new URL(routePath, productionOrigin));
    if (parsed.toString() === facebookUrl) continue;
    assert.equal(parsed.origin, productionOrigin, `Unerwartete externe Ressource in ${relative(out, sourceFile)}: ${value}`);

    if (parsed.hash && parsed.pathname === routePath) {
      assert.ok(ids.has(decodeURIComponent(parsed.hash.slice(1))), `Defektes Fragment ${value} in ${relative(out, sourceFile)}`);
    }

    const target = parsed.pathname;
    if (target.startsWith("/api/") && target.endsWith(".php")) {
      assert.ok(existsSync(join(out, target.slice(1))), `Fehlendes API-Ziel: ${target}`);
    } else if (target.endsWith("/")) {
      assert.ok(existsSync(join(out, target.slice(1), "index.html")), `Fehlendes Routenziel: ${target}`);
    } else {
      assert.ok(existsSync(join(out, target.slice(1))), `Fehlendes Asset oder Dateiziel: ${target}`);
    }
  }
}

function routeToHtml(path) {
  return path === "/" ? join(out, "index.html") : join(out, path.slice(1), "index.html");
}

function matchSingle(value, pattern, message) {
  const matches = [...value.matchAll(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"))];
  assert.equal(matches.length, 1, message);
  return matches[0][1];
}

function decodeHtmlText(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function auditLocalBusinessJsonLd(data) {
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@type"], "LocalBusiness");
  assert.equal(data.name, "Krankenfahrten Bad Homburg");
  assert.equal(data.url, `${productionOrigin}/`);
  assert.equal(data.telephone, "+49 175 4142222");
  assert.deepEqual(data.address, {
    "@type": "PostalAddress",
    streetAddress: "Basler Str. 3",
    postalCode: "61352",
    addressLocality: "Bad Homburg",
    addressCountry: "DE",
  });
  assert.ok(existsSync(join(out, new URL(data.logo).pathname.slice(1))), "JSON-LD-Logo fehlt im Export.");
  assert.deepEqual(data.sameAs, [facebookUrl], "JSON-LD darf nur das verifizierte Facebook-Profil enthalten.");
  assert.deepEqual(data.openingHoursSpecification, [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  }]);

  const serialized = JSON.stringify(data);
  assert.doesNotMatch(serialized, /aggregateRating|review|priceRange|MedicalClinic|Hospital|EmergencyService|TaxiService|Rollstuhl|Liegendtransport|Rettungsdienst|30[\s-]?km/i);
  assert.doesNotMatch(serialized, /instagram|linkedin|tiktok|youtube|twitter|x\.com/i);
}

function auditImageAlternatives(html, routePath) {
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    const alt = tag.match(/\salt="([^"]*)"/);
    assert.ok(alt, `img ohne alt-Attribut in ${routePath}: ${tag}`);
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1] ?? "";
    assert.doesNotMatch(alt[1], /Rollstuhl|Tragestuhl|Liegendtransport|Patient|Mubasher Ahmad/i, `Unzulässige Aussage im Alt-Text in ${routePath}: ${alt[1]}`);
    if (informativeImageAlts.has(src)) {
      assert.equal(alt[1], informativeImageAlts.get(src), `Unerwarteter Alt-Text für ${src}`);
      foundInformativeImages.add(src);
    }
    if (/\.(?:avif|jpe?g|png|webp)(?:\?|$)/i.test(src)) {
      assert.notEqual(alt[1].trim(), "", `Informatives Rasterbild mit leerem alt in ${routePath}: ${src}`);
    }
  }
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatBytes(bytes) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KiB` : `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function largestFiles(allFiles, pattern, count) {
  return allFiles
    .filter((file) => pattern.test(file))
    .map((file) => ({ file, size: statSync(file).size }))
    .sort((a, b) => b.size - a.size)
    .slice(0, count)
    .map(({ file, size }) => `${relative(out, file).split(sep).join("/")} (${formatBytes(size)})`);
}

function readWebpDimensions(file) {
  const bytes = readFileSync(file);
  assert.equal(bytes.subarray(0, 4).toString(), "RIFF", `Keine RIFF-Datei: ${file}`);
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP", `Keine WebP-Datei: ${file}`);
  const format = bytes.subarray(12, 16).toString();

  if (format === "VP8 ") {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  if (format === "VP8L") {
    const bits = bytes.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (format === "VP8X") {
    return {
      width: bytes.readUIntLE(24, 3) + 1,
      height: bytes.readUIntLE(27, 3) + 1,
    };
  }
  assert.fail(`Unbekanntes WebP-Format in ${file}: ${format}`);
}

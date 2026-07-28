import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const productionOrigin = "https://krankenfahrten-bad-homburg.de";

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
  "service-icons/arztfahrt.svg",
  "service-icons/dialysefahrt.svg",
  "service-icons/entlassungsfahrt.svg",
  "service-icons/krankenhausfahrt.svg",
  "service-icons/reha-fahrt.svg",
  "service-icons/therapiefahrt.svg",
];
for (const file of requiredFiles) assert.ok(existsSync(join(out, file)), `Erforderliche Datei fehlt: out/${file}`);

assert.ok(!existsSync(join(out, "api/config.php")), "api/config.php darf nicht im Build-Paket liegen.");
assert.ok(!existsSync(join(out, "icons")), "Der auf ALL-INKL reservierte Icon-Ordner darf nicht verwendet werden.");
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
assert.match(htaccess, /RewriteRule \^api\/vendor/, "Direkter Zugriff auf Composer-Vendor ist nicht blockiert.");
assert.match(readFileSync(join(out, "api/vendor/.htaccess"), "utf8"), /Require all denied/);

const files = collectFiles(out);
const relativeFiles = files.map((file) => relative(out, file).split(sep).join("/"));
for (const file of relativeFiles) {
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

for (const path of publicPaths) {
  const htmlFile = routeToHtml(path);
  assert.ok(existsSync(htmlFile), `Sitemap-Ziel fehlt: ${path}`);
  const html = readFileSync(htmlFile, "utf8");
  const expectedCanonical = new URL(path, productionOrigin).toString();
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(canonicals, [expectedCanonical], `Canonical stimmt nicht für ${path}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path} muss genau eine H1 enthalten.`);
  assert.match(html, /href="#main-content"/, `Skip-Link fehlt in ${path}`);
  assert.doesNotMatch(html, /localhost|example\.com|TODO|placeholder|development|test mode|technical|mock/i, `Öffentlicher Entwicklungstext in ${path}`);
  auditHtmlLinks(html, htmlFile, path);
}

const notFoundHtml = readFileSync(join(out, "404.html"), "utf8");
assert.equal((notFoundHtml.match(/<h1\b/g) ?? []).length, 1, "404.html muss genau eine H1 enthalten.");
assert.match(notFoundHtml, /Seite nicht gefunden/);
auditHtmlLinks(notFoundHtml, join(out, "404.html"), "/404.html");

const robots = readFileSync(join(out, "robots.txt"), "utf8");
assert.match(robots, /Disallow: \/api\//);
assert.match(robots, new RegExp(`Sitemap: ${escapeRegExp(productionOrigin)}/sitemap\\.xml`));

const publicText = files
  .filter((file) => [".html", ".txt", ".xml"].includes(extname(file)))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
assert.doesNotMatch(publicText, /localhost|example\.com/i, "Lokale oder Beispieldomain im öffentlichen Paket.");
assert.doesNotMatch(publicText, new RegExp("/" + "icons/"), "Die auf ALL-INKL reservierte Icon-URL ist noch im Seitenpaket enthalten.");
assert.doesNotMatch(publicText, /use server|resend\.com|EMAIL_API_KEY|RESEND_API_KEY/i, "Server-Action-, Resend- oder Secret-Hinweis im Seitenpaket.");
assert.doesNotMatch(publicText, /w01267fe\.kasserver\.com|smtp_password|SMTPDebug/i, "SMTP-Konfiguration ist im Browserpaket sichtbar.");
assert.doesNotMatch(publicText, /calendar_uid_salt|webcal:|calendar\.google|outlook\.live/i, "Kalender-Secret oder externe Kalenderintegration im Browserpaket.");
assert.doesNotMatch(publicText, /sk-[A-Za-z0-9]{16,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/);

const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`Deployment-Paket geprüft: ${publicPaths.length} öffentliche Routen, ${files.length} Dateien, ${formatBytes(totalBytes)}.`);

function auditHtmlLinks(html, sourceFile, routePath) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/\s(?:href|src|action)="([^"]*)"/g)) {
    const value = match[1];
    assert.notEqual(value, "", `Leerer Link in ${relative(out, sourceFile)}`);
    assert.notEqual(value, "#", `Leerer Fragmentlink in ${relative(out, sourceFile)}`);
    if (/^(?:mailto:|tel:|data:)/.test(value)) continue;

    const parsed = new URL(value, new URL(routePath, productionOrigin));
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

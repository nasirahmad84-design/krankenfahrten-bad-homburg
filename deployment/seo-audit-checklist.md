# SEO-Audit-Checkliste vor Go-live

## 1. Automatisiert bestanden

- [x] statischer Export mit exakt 17 öffentlichen Produktionsrouten
- [x] genau eine H1 und ein Produktions-Canonical je öffentlicher Route
- [x] individuelle Titles und Meta-Descriptions ohne Duplikate
- [x] keine Canonicals oder Links zur Testdomain, zu localhost oder example.com
- [x] keine produktive öffentliche Seite mit `noindex`
- [x] `404.html` vorhanden und mit `noindex`
- [x] `ErrorDocument 404 /404.html`, keine SPA-Fallback-Regel
- [x] `api/config.php` und `api/vendor/` geschützt
- [x] Sitemap und robots.txt konsistent mit den 17 Routen
- [x] interne Links, Fragmentziele, Trailing Slashes und Bildpfade vorhanden
- [x] jedes `img` mit Alt-Attribut; bestehende Leistungs- und Markensymbole dekorativ
- [x] genau ein valides `LocalBusiness`-JSON-LD auf der Startseite
- [x] keine Bewertungen, Social-Profile, Öffnungszeiten, Koordinaten oder nicht angebotenen Transporte im JSON-LD
- [x] keine unerwarteten externen Laufzeitressourcen
- [x] kein nicht freigegebenes `og:image` oder `twitter:image`
- [x] Staging-noindex nicht im produktiven `out/.htaccess`

## 2. Auf ALL-INKL manuell zu prüfen

- [ ] Hauptdomain und `www` zeigen auf das beabsichtigte Webroot
- [ ] SSL-Zertifikat ist gültig; HTTP- und `www`-Redirects sind schleifenfrei
- [ ] existierende URL liefert HTTP 200
- [ ] `/404.html` ist direkt erreichbar und enthält noindex
- [ ] unbekannte URL liefert HTTP 404 statt 500 und zeigt die 404-Seite
- [ ] Testdomain liefert `X-Robots-Tag: noindex, nofollow, noarchive`
- [ ] Produktionsdomain liefert keinen noindex-Header
- [ ] Sicherheits-, Cache- und Kompressionsheader geprüft
- [ ] mobile Lighthouse-Prüfung für Performance, Accessibility, Best Practices und SEO dokumentiert
- [ ] strukturierte Daten mit Schema Markup Validator beziehungsweise Rich Results Test geprüft
- [ ] Cookie-, Storage- und Netzwerk-Scan ohne unerwartete Drittanbieter
- [ ] rechtliche Inhalte fachlich beziehungsweise rechtlich freigegeben

404-Prüfung:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/404.html
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/seo-404-test-nicht-vorhanden
```

Erwartet: 200, 200, 404.

Staging-Prüfung:

```bash
curl -I https://test.krankenfahrten-bad-homburg.de/
curl -I https://krankenfahrten-bad-homburg.de/
```

Nur die Testdomain darf `X-Robots-Tag: noindex, nofollow, noarchive` liefern.

## 3. Vom Betreiber bereitzustellen oder freizugeben

- [ ] echte menschliche Unternehmensfotos
- [ ] finales Open-Graph-Motiv mit 1200×630 Pixeln
- [ ] verifizierte Social-Media-URLs, falls Profile ausgezeichnet werden sollen
- [ ] bestätigte Öffnungszeiten getrennt von bloßer telefonischer Erreichbarkeit
- [ ] rechtliche, aufsichts- und genehmigungsbezogene Angaben und Freigaben

Erwartetes späteres Bildpaket:

- `public/images/home/hero-krankenfahrt.webp`
- `public/images/home/persoenliche-unterstuetzung.webp`
- `public/images/services/leistungen-hero.webp`
- `public/images/about/betreiber-mit-fahrzeug.webp`
- `public/images/social/og-default-1200x630.webp`

Diese Dateien sind derzeit nicht vorhanden und dürfen vor Lieferung und Freigabe weder referenziert noch simuliert werden.

## 4. Nach Go-live auf externen Plattformen

- [ ] Google Search Console einrichten, Property verifizieren und Sitemap einreichen
- [ ] Bing Webmaster Tools einrichten und Sitemap einreichen
- [ ] Google-Unternehmensprofil mit Website, Kontaktdaten, Leistungen und freigegebenen Öffnungszeiten abgleichen
- [ ] Indexierungsstatus und 404-Berichte nach Go-live beobachten
- [ ] freigegebene Social-Profile erst nach Verifikation ergänzen
- [ ] spätere Ortsseiten nur mit eigenständigem, fachlich freigegebenem Inhalt planen
- [ ] spätere Ratgeberinhalte anhand realer Nutzerfragen und fachlicher Prüfung planen

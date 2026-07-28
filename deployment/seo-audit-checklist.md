# SEO-Audit-Checkliste vor Go-live

## 1. Automatisiert bestanden

- [x] statischer Export mit exakt 26 öffentlichen Produktionsrouten
- [x] genau eine H1 und ein Produktions-Canonical je öffentlicher Route
- [x] individuelle Titles und Meta-Descriptions ohne Duplikate
- [x] keine Canonicals oder Links zur Testdomain, zu localhost oder example.com
- [x] keine produktive öffentliche Seite mit `noindex`
- [x] `404.html` vorhanden und mit `noindex`
- [x] `ErrorDocument 404 /404.html`, keine SPA-Fallback-Regel
- [x] `api/config.php` und `api/vendor/` geschützt
- [x] Sitemap und robots.txt konsistent mit den 26 Routen
- [x] acht regionale Ortsseiten mit individuellen Titles, Descriptions und lokalen Hinweisen
- [x] Bad Homburg bleibt zentrale Hauptseite und wird nicht als konkurrierende Ortsseite dupliziert
- [x] interne Links, Fragmentziele, Trailing Slashes und Bildpfade vorhanden
- [x] jedes `img` mit Alt-Attribut; bestehende Leistungs- und Markensymbole dekorativ
- [x] genau ein valides `LocalBusiness`-JSON-LD auf der Startseite
- [x] ausschließlich verifiziertes Facebook-Profil und bestätigte 24/7-Öffnungszeiten im JSON-LD
- [x] keine Bewertungen, weiteren Social-Profile, Koordinaten oder nicht angebotenen Transporte
- [x] keine unerwarteten externen Laufzeitressourcen
- [x] genau ein lokales 1200×630-`og:image` und entsprechendes `twitter:image` je Seite
- [x] fünf erwartete WebP-Dateien mit korrekten Abmessungen und Größenlimits
- [x] informative Bilder mit sachlichem Alt-Text; dekorative Icons mit leerem Alt-Text
- [x] zugänglicher Facebook-Link im Footer ohne Drittanbieter-Skript
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
- [ ] `/orte/` und alle acht Ortsseiten auf Desktop und Mobil geprüft
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

- [ ] echtes, freigegebenes Foto von Mubasher Ahmad als möglicher Ersatz des illustrativen Über-uns-Motivs
- [x] finales grafisches Open-Graph-Motiv mit 1200×630 Pixeln
- [x] verifizierte Facebook-URL
- [ ] Instagram-/LinkedIn-Profile erst nach Verifikation ergänzen
- [x] Erreichbarkeit und Fahrbetrieb rund um die Uhr bestätigt
- [ ] rechtliche, aufsichts- und genehmigungsbezogene Angaben und Freigaben

Integriertes Bildpaket:

- `public/images/home/hero-krankenfahrt.webp`
- `public/images/home/persoenliche-unterstuetzung.webp`
- `public/images/services/leistungen-hero.webp`
- `public/images/about/betreiber-mit-fahrzeug.webp`
- `public/images/social/og-default-1200x630.webp`

Die vier Fotos sind eigens generierte illustrative Darstellungen mit fiktiven Personen. Sie zeigen weder echte Kunden noch den Betreiber. Das OG-Bild ist ein lokal erzeugtes grafisches Markenmotiv.

## 4. Nach Go-live auf externen Plattformen

- [ ] Google Search Console einrichten, Property verifizieren und Sitemap einreichen
- [ ] Bing Webmaster Tools einrichten und Sitemap einreichen
- [ ] Google-Unternehmensprofil mit Website, Kontaktdaten, Leistungen und freigegebenen Öffnungszeiten abgleichen
- [ ] Indexierungsstatus und 404-Berichte nach Go-live beobachten
- [ ] Facebook-Link und Sharing-Vorschau auf der Live-Domain prüfen
- [ ] weitere Social-Profile erst nach Verifikation ergänzen
- [ ] spätere Ortsseiten nur mit eigenständigem, fachlich freigegebenem Inhalt planen
- [ ] spätere Ratgeberinhalte anhand realer Nutzerfragen und fachlicher Prüfung planen

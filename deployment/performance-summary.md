# Performance-Zusammenfassung

## Automatisierter statischer Bestand

- Der vollständige Export umfasst nach dem finalen Batch 6,60 MiB und 367 Dateien. Die exakte Zahl und Dateianzahl gibt `npm run verify:deployment` nach jedem Build erneut aus.
- Die größten JavaScript-Dateien sind aktuell ungefähr 222 KiB, 142 KiB und 110 KiB groß und stammen aus der Next.js-/React-Laufzeit.
- Neue WebP-Bilder: Hero 169 KiB (1800×1100), Über uns 121 KiB (1200×900), Unterstützung 118 KiB (1400×900), Leistungen 99 KiB (1400×900), Open Graph mit finalem Logo 32 KiB (1200×630).
- Die größten lokalen Schriftdateien liegen bei ungefähr 83 KiB, 47 KiB und 25 KiB.
- Inter wird lokal über `next/font` ausgeliefert; Fotos und Sharing-Vorschau liegen lokal als optimierte WebP-Dateien, Marken- und Leistungsicons als SVG beziehungsweise PNG vor.
- Der Export enthält keine Analytics-, Tracking-, Karten-, Video-, Social-Media- oder sonstigen externen Laufzeitressourcen.
- Es wurden keine neue JavaScript-, Bild- oder SEO-Laufzeitbibliothek und kein externes Bild eingebunden. Die einmalige Konvertierung nutzte das bereits lokal verfügbare Sharp.

Nur das Startseiten-Hero wird vorab geladen. Alle übrigen Rasterbilder werden standardmäßig lazy geladen; feste intrinsische Abmessungen, Seitenverhältnisse und `sizes` vermeiden Layoutverschiebung und unnötig große Darstellungen. Die WebP-Dateien enthalten keine EXIF-, GPS- oder personenbezogenen Metadaten.

`npm run verify:deployment` ermittelt Gesamtgröße und jeweils die drei größten JavaScript-, Bild- und Schriftdateien nach jedem Build erneut. Build-Hashes und Dateigrößen können sich bei späteren Änderungen geringfügig verschieben.

## Live-Prüfung vom 28. Juli 2026

Auf der ALL-INKL-Testdomain wurden die vorbereiteten Regeln mit `Accept-Encoding: gzip, br` geprüft:

- HTML: `no-cache, max-age=0, must-revalidate`, Brotli
- CSS und JavaScript: `public, max-age=31536000`, Brotli
- Hero- und Open-Graph-WebP: `public, max-age=31536000`, ohne unnötige zusätzliche Kompression
- PHP-Endpunkt: `no-store, max-age=0`

Das Open-Graph-Bild war mit HTTP 200 erreichbar und wurde lokal als 1200×630 WebP bestätigt. Der statische Export enthält keine unerwarteten externen Laufzeitressourcen.

Lighthouse ist lokal nicht vorhanden und wurde wegen der Vorgabe gegen neue große dauerhafte Abhängigkeiten nicht installiert. Mobile Performance, Accessibility, Best Practices und SEO müssen deshalb nach Deployment mit Lighthouse oder einer gleichwertigen Live-Prüfung erfasst werden. Bis dahin werden keine Lighthouse-Scores angegeben.

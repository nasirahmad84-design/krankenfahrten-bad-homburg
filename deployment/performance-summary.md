# Performance-Zusammenfassung

## Automatisierter statischer Bestand

- Der vollständige Export umfasst mit den finalen Markenassets 4,94 MiB und 287 Dateien. Die exakte Zahl und Dateianzahl gibt `npm run verify:deployment` nach jedem Build erneut aus.
- Die größten JavaScript-Dateien sind aktuell ungefähr 222 KiB, 146 KiB und 110 KiB groß und stammen aus der Next.js-/React-Laufzeit.
- Neue WebP-Bilder: Hero 169 KiB (1800×1100), Über uns 121 KiB (1200×900), Unterstützung 118 KiB (1400×900), Leistungen 99 KiB (1400×900), Open Graph mit finalem Logo 32 KiB (1200×630).
- Die größten lokalen Schriftdateien liegen bei ungefähr 83 KiB, 47 KiB und 25 KiB.
- Inter wird lokal über `next/font` ausgeliefert; Fotos und Sharing-Vorschau liegen lokal als optimierte WebP-Dateien, Marken- und Leistungsicons als SVG beziehungsweise PNG vor.
- Der Export enthält keine Analytics-, Tracking-, Karten-, Video-, Social-Media- oder sonstigen externen Laufzeitressourcen.
- Es wurden keine neue JavaScript-, Bild- oder SEO-Laufzeitbibliothek und kein externes Bild eingebunden. Die einmalige Konvertierung nutzte das bereits lokal verfügbare Sharp.

Nur das Startseiten-Hero wird vorab geladen. Alle übrigen Rasterbilder werden standardmäßig lazy geladen; feste intrinsische Abmessungen, Seitenverhältnisse und `sizes` vermeiden Layoutverschiebung und unnötig große Darstellungen. Die WebP-Dateien enthalten keine EXIF-, GPS- oder personenbezogenen Metadaten.

`npm run verify:deployment` ermittelt Gesamtgröße und jeweils die drei größten JavaScript-, Bild- und Schriftdateien nach jedem Build erneut. Build-Hashes und Dateigrößen können sich bei späteren Änderungen geringfügig verschieben.

## Serverseitig manuell zu prüfen

Die lokale Dateiprüfung belegt keine serverseitige Kompression. Auf ALL-INKL müssen Gzip beziehungsweise Brotli und die vorbereiteten Cache-Header mit Browserwerkzeugen oder beispielsweise `curl --compressed -I` geprüft werden. Es werden keine Kompressionswerte behauptet, bevor diese Prüfung auf dem Live-Server erfolgt ist.

Lighthouse ist lokal nicht vorhanden und wurde wegen der Vorgabe gegen neue große dauerhafte Abhängigkeiten nicht installiert. Mobile Performance, Accessibility, Best Practices und SEO müssen deshalb nach Deployment mit Lighthouse oder einer gleichwertigen Live-Prüfung erfasst werden. Bis dahin werden keine Lighthouse-Scores angegeben.

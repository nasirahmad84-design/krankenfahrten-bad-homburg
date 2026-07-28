# Performance-Zusammenfassung

## Automatisierter statischer Bestand

- Der vollständige Export umfasst aktuell rund 4,38 MiB und 280 Dateien. Darin sind neben der Website auch der PHP-Endpunkt und die für FTP eingebettete PHPMailer-Laufzeit enthalten.
- Die größten JavaScript-Dateien sind aktuell ungefähr 222 KiB, 146 KiB und 110 KiB groß und stammen aus der Next.js-/React-Laufzeit.
- Die größten Bilddateien sind das lokale 512×512-App-Icon mit ungefähr 31 KiB sowie das Apple-Touch-Icon mit ungefähr 13 KiB.
- Die größten lokalen Schriftdateien liegen bei ungefähr 83 KiB, 47 KiB und 25 KiB.
- Inter wird lokal über `next/font` ausgeliefert; Marken- und Leistungsicons liegen lokal als SVG beziehungsweise PNG vor.
- Der Export enthält keine Analytics-, Tracking-, Karten-, Video-, Social-Media- oder sonstigen externen Laufzeitressourcen.
- Es wurden keine neue JavaScript- oder SEO-Laufzeitbibliothek und kein externes Bild eingebunden.

`npm run verify:deployment` ermittelt Gesamtgröße und jeweils die drei größten JavaScript-, Bild- und Schriftdateien nach jedem Build erneut. Build-Hashes und Dateigrößen können sich bei späteren Änderungen geringfügig verschieben.

## Serverseitig manuell zu prüfen

Die lokale Dateiprüfung belegt keine serverseitige Kompression. Auf ALL-INKL müssen Gzip beziehungsweise Brotli und die vorbereiteten Cache-Header mit Browserwerkzeugen oder beispielsweise `curl --compressed -I` geprüft werden. Es werden keine Kompressionswerte behauptet, bevor diese Prüfung auf dem Live-Server erfolgt ist.

Lighthouse ist lokal nicht vorhanden und wurde wegen der Vorgabe gegen neue große dauerhafte Abhängigkeiten nicht installiert. Mobile Performance, Accessibility, Best Practices und SEO müssen deshalb nach Deployment mit Lighthouse oder einer gleichwertigen Live-Prüfung erfasst werden. Bis dahin werden keine Lighthouse-Scores angegeben.

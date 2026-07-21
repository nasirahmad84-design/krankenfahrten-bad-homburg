# Performance-Zusammenfassung

- Der aktuelle Export ist ohne Datenbank, CMS, Analytics, Tracking und externe UI-Bibliothek aufgebaut.
- Inter wird als lokale WOFF2-Dateien durch `next/font` ausgeliefert; es entstehen keine Font-CDN-Anfragen.
- Marken- und Leistungsicons sind lokale SVG- beziehungsweise PNG-Dateien.
- `_next/static` und lokale Assets erhalten vorbereitete Langzeit-Cache-Header; HTML, SEO-Dateien und PHP werden nicht aggressiv gecacht.
- Nicht verwendete Standard-Next-Assets wurden entfernt.
- Die geprüfte Dateisumme liegt bei rund 3,86 MiB für 194 Dateien. Der Wert kann sich mit neuen Build-Hashes geringfügig ändern.
- Es wurden keine Lighthouse-Werte behauptet, da Lighthouse nicht Bestandteil der lokalen Prüfkette ist.

Die größten JavaScript-Chunks liegen aktuell bei rund 227 KiB, 150 KiB und 113 KiB und stammen aus der Next.js-/React-Laufzeit. Zusätzliche große Laufzeitbibliotheken wurden nicht eingeführt. Eine weitere Reduzierung erfordert eine separate Bundleanalyse und ist kein Deployment-Blocker.

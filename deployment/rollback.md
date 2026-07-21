# Rollback

## Vor dem Upload

1. Aktuellen Webroot vollständig in ein datiertes Sicherungsverzeichnis oder lokales Backup kopieren.
2. Aktiven Git-Commit und Zeitpunkt dokumentieren.
3. Produktive `api/config.php` separat sichern; sie gehört nicht in das allgemeine Build-Paket.
4. Neue Version möglichst in ein separates Verzeichnis hochladen und dort prüfen.

## Umschaltung

Wenn das KAS ein Umschalten des Domain-Zielverzeichnisses erlaubt, die Domain erst nach der Abnahme auf das neue Verzeichnis zeigen lassen. Andernfalls Dateien kontrolliert als vollständigen Build ersetzen. Alte und neue `_next`-Assets dürfen nicht gemischt werden.

`api/config.php` darf beim Austausch nicht durch `config.example.php` ersetzt oder gelöscht werden. Rate-Limit-Dateien müssen nicht in die neue Version übernommen werden; ihr Verzeichnis bleibt außerhalb des Webroots.

## Rückkehr zur vorherigen Version

1. Domain-Ziel im KAS auf das gesicherte Verzeichnis zurückstellen oder den neuen Webroot kontrolliert durch die vollständige Sicherung ersetzen.
2. Gesicherte produktive `api/config.php` wiederherstellen, falls sie betroffen war.
3. Dateirechte und `.htaccess` prüfen.
4. Browser- und serverseitige Caches berücksichtigen; keine ungezielte Löschung fremder Daten durchführen.

## Nachprüfung

- primäre Domain und HTTPS
- `www`-Weiterleitung
- Startseite und kritische Unterseiten
- `_next`-Assets und Markenicons
- individuelle 404-Seite
- Formularvalidierung und kontrollierte Testanfrage
- E-Mail-Eingang
- `robots.txt`, Sitemap und Canonical
- `api/config.php` weiterhin gesperrt

Rollback-Grund und Ergebnis dokumentieren, bevor ein weiterer Go-live-Versuch beginnt.

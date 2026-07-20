# ALL-INKL Deployment-Checkliste

- [ ] `npm test`, `npm run lint` und `npm run build` erfolgreich
- [ ] `out/` vollständig und ohne echte Secrets
- [ ] vorheriges Domain-Verzeichnis gesichert
- [ ] Inhalt von `out/` per FTP/SFTP hochgeladen
- [ ] Domain-Zielverzeichnis im KAS korrekt
- [ ] SSL und HTTPS aktiv
- [ ] PHP 8.1+ aktiv; PHP-Dateien werden ausgeführt
- [ ] technisches Absenderpostfach eingerichtet
- [ ] `api/config.php` manuell erstellt
- [ ] Rate-Limit-Verzeichnis beschreibbar und außerhalb Webroot
- [ ] direkter Zugriff auf `config.php` blockiert
- [ ] statische Seiten und `_next`-Assets erreichbar
- [ ] erfolgreiche Testanfrage zugestellt
- [ ] Validierungs-, Rate-Limit- und Mailfehler neutral
- [ ] keine personenbezogenen Daten in Logs
- [ ] Rollback-Sicherung dokumentiert

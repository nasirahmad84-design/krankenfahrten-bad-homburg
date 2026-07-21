# Deployment auf ALL-INKL

Die Anwendung wird lokal als statisches Paket gebaut. Auf dem Zielserver ist kein Node.js-Prozess erforderlich. Nur der Formularendpunkt benötigt PHP 8.1 oder neuer.

## Voraussetzungen

- lokales Node.js mit npm
- FTP- oder SFTP-Zugang zum ALL-INKL-Webspace
- Zugang zum ALL-INKL-KAS
- Domain `krankenfahrten-bad-homburg.de`; `www` wird auf die primäre Domain ohne `www` weitergeleitet
- aktives SSL-Zertifikat
- PHP 8.1 oder neuer
- Postfach `anfrage@krankenfahrten-bad-homburg.de`
- technische Absenderadresse, beispielsweise `formular@krankenfahrten-bad-homburg.de`

## 1. Lokal bauen und prüfen

```bash
npm install
npm test
npm run lint
npm run build
npm run test:export
npm run verify:deployment
```

Anschließend `out/` lokal prüfen. Es muss unter anderem HTML-Seiten, `_next/`, lokale Assets, `service-icons/`, `robots.txt`, `sitemap.xml`, `.htaccess` und `api/fahrtanfrage.php` enthalten. `api/config.php` darf nicht enthalten sein.

Der öffentliche Standardordnername `icons` wird nicht verwendet, weil er auf dem ALL-INKL-Zielhosting durch einen Apache-Alias reserviert sein kann. Sämtliche Leistungsicons werden deshalb ausschließlich unter `/service-icons/` ausgeliefert. Vor dem Upload darf im Export kein gleichnamiger Altordner und keine darauf zeigende URL vorhanden sein.

## 2. Bestehenden Stand sichern

1. Repository und aktuellen Commit dokumentieren.
2. Das bisherige Domain-Zielverzeichnis vollständig sichern.
3. Wenn möglich, die neue Version zunächst in ein separates Verzeichnis hochladen.
4. Die produktive `api/config.php` separat sichern und nicht durch die Beispielkonfiguration überschreiben.

Das genaue Domain-Zielverzeichnis wird im KAS angezeigt und darf nicht aus einer allgemeinen Anleitung abgeleitet werden.

## 3. Domain, PHP, SSL und Postfächer vorbereiten

1. Primärdomain im KAS dem vorgesehenen Zielverzeichnis zuweisen.
2. PHP 8.1 oder neuer aktivieren und mit einer kontrollierten PHP-Versionsprüfung bestätigen.
3. SSL für die Domain und gegebenenfalls `www` aktivieren.
4. HTTPS-Weiterleitung im KAS verwenden, wenn sie dort zuverlässig angeboten wird.
5. Postfach und technische Absenderadresse einrichten.

Die mitgelieferte `.htaccess` enthält hostgebundene Weiterleitungen von HTTP auf HTTPS und von `www` auf non-`www`. Wenn die Weiterleitungen bereits im KAS eingerichtet sind, vor Go-live prüfen, dass keine doppelte oder widersprüchliche Regel besteht. Die Regeln greifen nur auf den Produktionshosts und nicht auf fremden Abnahmehosts.

## 4. Rate-Limit-Verzeichnis und PHP-Konfiguration

Ein nicht öffentlich erreichbares Verzeichnis außerhalb des Webroots anlegen. Der PHP-Prozess benötigt dort Schreibrechte. Den konkreten absoluten Pfad im Hosting ermitteln; keine geratenen Pfade verwenden.

Auf dem Server `api/config.php` anhand von `api/config.example.php` erstellen:

- `mail_to`: festes Anfragepostfach
- `mail_from`: technische Adresse derselben Domain
- `allowed_origin`: `https://krankenfahrten-bad-homburg.de`
- `rate_limit_salt`: mindestens 32 zufällige Bytes, nur serverseitig
- `rate_limit_dir`: absolutes, beschreibbares Verzeichnis außerhalb des Webroots
- `rate_limit_count` und `rate_limit_window`: freigegebene Grenzwerte
- `minimum_form_age_ms` und `maximum_form_age_ms`: freigegebene Zeitgrenzen
- `environment`: `production`
- `mail_transport`: `mail`

Einen Salt lokal oder auf einem geeigneten sicheren System erzeugen:

```bash
openssl rand -hex 32
```

Den Wert niemals committen, per Chat weitergeben oder in öffentlich erreichbare Dateien schreiben.

## 5. Upload

Den vollständigen Inhalt von `out/` per SFTP beziehungsweise FTP in das Zielverzeichnis hochladen. Versteckte Dateien müssen einbezogen werden, insbesondere `.htaccess`. Danach die produktive `api/config.php` serverseitig anlegen beziehungsweise aus der gesicherten, geprüften Konfiguration übernehmen.

Keine gemischten `_next`-Buildstände betreiben. Beim kontrollierten Ersetzen zuerst die neue vollständige Version bereitstellen und erst anschließend das Ziel umschalten beziehungsweise die alte Version austauschen.

## 6. Technische Abnahme

- Startseite, Hauptseiten, sieben Leistungsdetailseiten und rechtliche Seiten aufrufen
- unbekannte URL aufrufen und `404.html` prüfen
- mobile Navigation, Footer und Mobile Contact Bar prüfen
- `robots.txt` und `sitemap.xml` direkt aufrufen
- Canonicals auf die primäre HTTPS-Domain prüfen
- HTTP- und `www`-Weiterleitungen ohne Schleife prüfen
- `_next`-Assets, `/service-icons/`, Markenassets und lokale Fonts prüfen
- direkten Zugriff auf `api/config.php` prüfen; erwartet wird 403
- Directory Listing und Zugriff auf Backup-/Logdateien prüfen
- Sicherheits- und Cache-Header mit Browserwerkzeugen oder `curl -I` kontrollieren
- Cookie-, Storage- und Netzwerk-Scan durchführen

Die vorbereitete CSP und HSTS sind aus Sicherheitsgründen nicht aktiv. CSP erst auf dem Abnahmehost aktivieren und danach alle Seiten, Navigation, Accordion und Formular ohne Browserfehler prüfen. HSTS erst einschalten, wenn HTTPS für alle betroffenen Hosts stabil funktioniert.

## 7. Formularabnahme

Die vollständige Matrix steht in `php-production-check.md`. Mindestens erfolgreiche Anfrage, serverseitige Validierung, Mailfehler, Reply-To, Origin-Prüfung, Zeitgrenzen und Rate Limit testen. Formulardaten dürfen nicht in Webserver- oder Anwendungslogs geschrieben werden.

## 8. Freigabe und Go-live

Vor Go-live `go-live-checklist.md`, `checklist.md` und `legal-review-checklist.md` vollständig bearbeiten. Die rechtlichen Inhalte müssen fachlich beziehungsweise rechtlich geprüft und freigegeben sein. Erst danach Domainziel beziehungsweise Upload freigeben.

## 9. Rollback

Bei Fehlern nach `rollback.md` zur gesicherten Version zurückkehren. `api/config.php` nicht überschreiben und keine gemischten Assetstände hinterlassen. Nach dem Rollback Startseite, Formular, HTTPS, Redirects und rechtliche Seiten erneut prüfen.

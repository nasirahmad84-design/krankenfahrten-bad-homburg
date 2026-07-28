# Deployment auf ALL-INKL

Die Anwendung wird lokal als statisches Paket gebaut. Auf dem Zielserver ist kein Node.js-Prozess erforderlich. Nur der Formularendpunkt benötigt PHP 8.1 oder neuer.

## Voraussetzungen

- lokales Node.js mit npm
- FTP- oder SFTP-Zugang zum ALL-INKL-Webspace
- Zugang zum ALL-INKL-KAS
- Domain `krankenfahrten-bad-homburg.de`; `www` wird auf die primäre Domain ohne `www` weitergeleitet
- aktives SSL-Zertifikat
- PHP 8.1 oder neuer
- PHP-Erweiterung OpenSSL
- Postfach `anfrage@krankenfahrten-bad-homburg.de`
- SMTP-Zugang für `anfrage@krankenfahrten-bad-homburg.de`
- lokales Composer nur zum Erzeugen und Aktualisieren des Upload-Pakets

## 1. Lokal bauen und prüfen

```bash
npm install
composer validate
composer install --no-dev --classmap-authoritative
npm test
npm run lint
npm run build
npm run test:export
npm run verify:deployment
```

Anschließend `out/` lokal prüfen. Es muss unter anderem HTML-Seiten, `_next/`, lokale Assets, `service-icons/`, `robots.txt`, `sitemap.xml`, `.htaccess`, `api/fahrtanfrage.php`, `api/lib/calendar.php`, `api/vendor/autoload.php` und die PHPMailer-Klassen enthalten. `api/config.php` und dauerhaft erzeugte `.ics`-Dateien dürfen nicht enthalten sein. Auf dem Server ist weder ein Composer-Lauf noch ein Node.js-Prozess erforderlich.

Der öffentliche Standardordnername `icons` wird nicht verwendet, weil er auf dem ALL-INKL-Zielhosting durch einen Apache-Alias reserviert sein kann. Sämtliche Leistungsicons werden deshalb ausschließlich unter `/service-icons/` ausgeliefert. Vor dem Upload darf im Export kein gleichnamiger Altordner und keine darauf zeigende URL vorhanden sein.

## 2. Bestehenden Stand sichern

1. Repository und aktuellen Commit dokumentieren.
2. Das bisherige Domain-Zielverzeichnis vollständig sichern.
3. Wenn möglich, die neue Version zunächst in ein separates Verzeichnis hochladen.
4. Die produktive `api/config.php` separat sichern und nicht durch die Beispielkonfiguration überschreiben.

Das genaue Domain-Zielverzeichnis wird im KAS angezeigt und darf nicht aus einer allgemeinen Anleitung abgeleitet werden.

## 3. Domain, PHP, SSL und Postfächer vorbereiten

1. Primärdomain im KAS dem vorgesehenen Zielverzeichnis zuweisen.
2. PHP 8.1 oder neuer sowie OpenSSL aktivieren und kontrolliert bestätigen.
3. SSL für die Domain und gegebenenfalls `www` aktivieren.
4. HTTPS-Weiterleitung im KAS verwenden, wenn sie dort zuverlässig angeboten wird.
5. Postfach und authentifizierten SMTP-Zugang einrichten.

Die mitgelieferte `.htaccess` enthält hostgebundene Weiterleitungen von HTTP auf HTTPS und von `www` auf non-`www`. Wenn die Weiterleitungen bereits im KAS eingerichtet sind, vor Go-live prüfen, dass keine doppelte oder widersprüchliche Regel besteht. Die Regeln greifen nur auf den Produktionshosts und nicht auf fremden Abnahmehosts.

## 4. Rate-Limit-Verzeichnis und PHP-Konfiguration

Ein nicht öffentlich erreichbares Verzeichnis außerhalb des Webroots anlegen. Der PHP-Prozess benötigt dort Schreibrechte. Den konkreten absoluten Pfad im Hosting ermitteln; keine geratenen Pfade verwenden.

Auf dem Server `api/config.php` anhand von `api/config.example.php` erstellen:

- `mail_to`: festes Anfragepostfach
- `mail_from` und `mail_from_name`: fester Absender passend zum authentifizierten Postfach beziehungsweise zur Domain
- `mail_transport`: ausschließlich `smtp`
- `smtp_host`: `w01267fe.kasserver.com`
- `smtp_port`: primär `587`
- `smtp_secure`: primär `tls` für STARTTLS
- `smtp_auth`: `true`
- `smtp_username`: `anfrage@krankenfahrten-bad-homburg.de`
- `smtp_password`: ausschließlich das echte Postfachpasswort in der serverseitigen `config.php`
- `smtp_timeout`: beispielsweise `15`
- `calendar_event_duration_minutes`: Terminlänge zwischen 15 und 1.440 Minuten, standardmäßig `60`
- `calendar_reminder_minutes`: Erinnerung zwischen 0 und 1.440 Minuten; `0` deaktiviert sie
- `calendar_uid_salt`: eigener, zufälliger Salt ausschließlich in der Serverkonfiguration
- `allowed_origin`: `https://krankenfahrten-bad-homburg.de`
- `rate_limit_salt`: mindestens 32 zufällige Bytes, nur serverseitig
- `rate_limit_dir`: absolutes, beschreibbares Verzeichnis außerhalb des Webroots
- `rate_limit_count` und `rate_limit_window`: freigegebene Grenzwerte
- `minimum_form_age_ms` und `maximum_form_age_ms`: freigegebene Zeitgrenzen
- `environment`: `production`

Einen Salt lokal oder auf einem geeigneten sicheren System erzeugen:

```bash
openssl rand -hex 32
```

Den Befehl zweimal ausführen und getrennte Werte für Rate Limit und Kalender-UID verwenden. Die Werte niemals committen, per Chat weitergeben oder in öffentlich erreichbare Dateien schreiben. Fehlt eine gültige Kalenderkonfiguration, wird die Anfrage-E-Mail bewusst nicht ohne Anhang versendet.

Alternativ kann Port `465` mit `smtp_secure` = `smtps` für implizites TLS verwendet werden. Port und Verschlüsselungsmodus müssen zusammenpassen; ein unverschlüsselter Transport und eine automatische Herabstufung sind nicht vorgesehen. Das Passwort niemals in Git, Dokumentation, Tests, Browsercode oder Buildvariablen übernehmen.

Wenn ALL-INKL eine praktikable Konfiguration außerhalb des Webroots erlaubt, dort die eigentliche Konfigurationsdatei ablegen und `api/config.php` lediglich diese feste Serverdatei zurückgeben lassen. Andernfalls verbleibt `api/config.php` im geschützten API-Ordner. In beiden Fällen muss PHP korrekt ausgeführt werden; direkter HTTP-Zugriff auf `config.php`, Beispielkonfigurationen, Backups und `api/vendor/` muss 403 ergeben.

## 5. Upload

Den vollständigen Inhalt von `out/` per SFTP beziehungsweise FTP in das Zielverzeichnis hochladen. Versteckte Dateien müssen einbezogen werden, insbesondere `.htaccess`. Danach die produktive `api/config.php` serverseitig anlegen beziehungsweise aus der gesicherten, geprüften Konfiguration übernehmen.

Keine gemischten `_next`-Buildstände betreiben. Beim kontrollierten Ersetzen zuerst die neue vollständige Version bereitstellen und erst anschließend das Ziel umschalten beziehungsweise die alte Version austauschen.

## 6. Technische Abnahme

- Startseite, Hauptseiten, sieben Leistungsdetailseiten und rechtliche Seiten aufrufen
- vorhandene Seite aufrufen; erwartet wird HTTP 200
- `/404.html` direkt aufrufen; die Datei muss erreichbar sein und `noindex` enthalten
- eine sicher nicht existierende URL aufrufen; erwartet wird HTTP 404 mit dem Inhalt der 404-Seite, nicht 500 und keine Weiterleitung zur Startseite
- bei HTTP 500 Domain-Webroot, Upload von `404.html`, Dateirechte, aktive `.htaccess` und Apache-Fehlerprotokoll im KAS prüfen
- mobile Navigation, Footer und Mobile Contact Bar prüfen
- `robots.txt` und `sitemap.xml` direkt aufrufen
- Canonicals auf die primäre HTTPS-Domain prüfen
- HTTP- und `www`-Weiterleitungen ohne Schleife prüfen
- `_next`-Assets, `/service-icons/`, Markenassets und lokale Fonts prüfen
- direkten Zugriff auf `api/config.php` prüfen; erwartet wird 403
- direkten Zugriff auf `api/vendor/` und `api/vendor/autoload.php` prüfen; erwartet wird 403
- Directory Listing und Zugriff auf Backup-/Logdateien prüfen
- Sicherheits- und Cache-Header mit Browserwerkzeugen oder `curl -I` kontrollieren
- Cookie-, Storage- und Netzwerk-Scan durchführen

Die lokale statische Prüfung kann Apache nicht vollständig nachbilden. Die HTTP-Statusprüfung muss deshalb auf Test- und Produktionshost erfolgen:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/404.html
curl -sS -o /dev/null -w "%{http_code}\n" https://test.krankenfahrten-bad-homburg.de/seo-404-test-nicht-vorhanden
```

Erwartet werden 200, 200 und 404. PHP-Endpunkte behalten ihre eigenen Statuscodes; es gibt keine globale Rewrite-Regel auf `index.html`.

## 7. Testdomain vor Indexierung schützen

Nach dem Upload auf die Testdomain den Block aus `staging.htaccess.example` an die dort bereits aktive `.htaccess` anhängen. Die Beispieldatei nicht als alleinige `.htaccess` hochladen, weil sonst Fehlerseite, Zugriffsschutz, Redirects und Cache-Regeln verloren gingen.

```bash
curl -I https://test.krankenfahrten-bad-homburg.de/
```

Erwartet wird auf allen Testdomain-Antworten:

```text
X-Robots-Tag: noindex, nofollow, noarchive
```

Vor Produktionsfreigabe den Block aus der produktiv verwendeten `.htaccess` entfernen und anschließend prüfen:

```bash
curl -I https://krankenfahrten-bad-homburg.de/
```

Auf der Produktionsdomain darf kein `X-Robots-Tag` mit `noindex` erscheinen. `robots.txt` bleibt auf beiden Hosts kein Ersatz für den Header. Ein zusätzlicher Passwortschutz kann im KAS eingerichtet werden, wird aber nicht mit erfundenen Zugangsdaten vorkonfiguriert.

Die vorbereitete CSP und HSTS sind aus Sicherheitsgründen nicht aktiv. CSP erst auf dem Abnahmehost aktivieren und danach alle Seiten, Navigation, Accordion und Formular ohne Browserfehler prüfen. HSTS erst einschalten, wenn HTTPS für alle betroffenen Hosts stabil funktioniert.

## 8. Formularabnahme

Die vollständige Endpunktmatrix steht in `php-production-check.md`; der ICS-Anhang wird zusätzlich nach `calendar-integration-check.md` auf iPhone, Android/Google Calendar und Outlook geprüft. Mindestens erfolgreiche Anfrage, serverseitige Validierung, SMTP-Anmeldung, kontrollierten Fehler mit bewusst falschem Passwort, Reply-To, Origin-Prüfung, Zeitgrenzen und Rate Limit testen. Umlaute und Spamordner prüfen. Formulardaten, Passwort und SMTP-Transkript dürfen nicht in Webserver- oder Anwendungslogs geschrieben werden. Nach erfolgreicher Zustellung SPF, DKIM und DMARC separat prüfen.

## 9. Freigabe und Go-live

Vor Go-live `go-live-checklist.md`, `checklist.md` und `legal-review-checklist.md` vollständig bearbeiten. Die rechtlichen Inhalte müssen fachlich beziehungsweise rechtlich geprüft und freigegeben sein. Erst danach Domainziel beziehungsweise Upload freigeben.

## 10. Rollback

Bei Fehlern nach `rollback.md` zur gesicherten Version zurückkehren. `api/config.php` nicht überschreiben und keine gemischten Assetstände hinterlassen. Nach dem Rollback Startseite, Formular, HTTPS, Redirects und rechtliche Seiten erneut prüfen.

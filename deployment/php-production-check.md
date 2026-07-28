# PHP-Produktionsprüfung

Diese Prüfung ist auf dem ALL-INKL-Abnahmehost vor Go-live zwingend. Keine echten Fahrt- oder Gesundheitsdaten als Testwerte verwenden und keine Secrets in Testergebnisse kopieren.

## Laufzeit und Syntax

```bash
php -v
php -l api/fahrtanfrage.php
php -l api/lib/validation.php
php -l api/lib/security.php
php -l api/lib/mail.php
php -r "require 'api/vendor/autoload.php'; exit(class_exists('PHPMailer\\\\PHPMailer\\\\PHPMailer') ? 0 : 1);"
```

Erwartet wird PHP 8.1 oder neuer mit OpenSSL, ohne Syntaxfehler und mit ladbarer PHPMailer-Klasse. Relative Includes müssen nach dem FTP-Upload ausgehend von `api/` funktionieren.

## Konfiguration und Dateirechte

- [ ] `api/config.php` aus der Vorlage erstellt, aber nicht in Git oder im Build-Paket
- [ ] `environment` ist `production`
- [ ] `mail_transport` ist `smtp`
- [ ] Host ist `w01267fe.kasserver.com`
- [ ] primär Port 587 mit `smtp_secure` = `tls` (STARTTLS), alternativ Port 465 mit `smtp_secure` = `smtps`
- [ ] `smtp_auth` ist `true`
- [ ] SMTP-Benutzer und festes Absenderpostfach passen zusammen
- [ ] echtes Passwort steht ausschließlich in der serverseitigen Konfiguration
- [ ] OpenSSL ist aktiv
- [ ] `allowed_origin` ist die primäre Domain ohne `www`
- [ ] Empfänger und technischer Absender sind fest konfiguriert
- [ ] sicherer, nicht öffentlicher Salt eingetragen
- [ ] Rate-Limit-Verzeichnis liegt außerhalb des Webroots
- [ ] PHP kann dort Dateien anlegen und sperren
- [ ] Dateien werden mit restriktiven Rechten angelegt
- [ ] HTTP-Zugriff auf `api/config.php` und `api/config.example.php` ergibt 403
- [ ] HTTP-Zugriff auf `api/vendor/` und `api/vendor/autoload.php` ergibt 403

## Endpunktmatrix

- [ ] `GET /api/fahrtanfrage.php` ergibt 405 und JSON
- [ ] falscher Content-Type ergibt 415
- [ ] Anfrage über 16 KiB ergibt 413
- [ ] fehlende Pflichtfelder ergeben 400 mit Feldfehlern
- [ ] ungültige E-Mail, Überlängen, Auswahlwerte, Datum und Uhrzeit ergeben 400
- [ ] gefüllter Honeypot wird neutral beantwortet und versendet keine Mail
- [ ] zu schnelles und zu altes Formular werden abgewiesen
- [ ] korrekter Origin wird akzeptiert
- [ ] abweichender Origin wird abgewiesen
- [ ] fehlender Origin bleibt für kompatible Clients zulässig
- [ ] Rate Limit ergibt nach Überschreitung 429
- [ ] Mailfehler ergibt 500 ohne Warnung oder Stacktrace
- [ ] gültige Anfrage ergibt 200 und genau eine Betreiber-E-Mail
- [ ] absichtlich falsches SMTP-Passwort ergibt 500 und keine Erfolgsmeldung
- [ ] Browser- und PHP-Antworten verwenden `Cache-Control: no-store`

## E-Mail-Prüfung

- [ ] Empfänger ist ausschließlich das konfigurierte Anfragepostfach
- [ ] From ist die technische Adresse derselben Domain
- [ ] gültige optionale Nutzeradresse erscheint nur als Reply-To
- [ ] CRLF-Eingaben erzeugen keine zusätzlichen Header
- [ ] UTF-8-Umlaute werden korrekt zugestellt
- [ ] keine automatische Nutzerbestätigung
- [ ] Hinweis „Diese Anfrage ist noch keine bestätigte Buchung.“ vorhanden
- [ ] HTML-Eingaben werden nicht als ausführbarer HTML-Inhalt versendet
- [ ] SMTP-Debugging ist deaktiviert und kein SMTP-Transkript wird ausgegeben
- [ ] kein Rückfall auf die native PHP-Funktion `mail()`
- [ ] Spamordner geprüft
- [ ] SPF, DKIM und DMARC geprüft beziehungsweise als Nacharbeit dokumentiert

## Logs und Fehler

- [ ] keine vollständigen Formulardaten in PHP-, Mail- oder Webserver-Logs
- [ ] kein SMTP-Passwort und keine vollständige SMTP-Serverantwort in Response oder Logs
- [ ] keine vollständigen IP-Adressen in Rate-Limit-Dateien
- [ ] keine PHP-Warnungen, Pfade oder Stacktraces im JSON
- [ ] technische Logs und ihre Aufbewahrung mit ALL-INKL geprüft

## Testmatrix auf der ALL-INKL-Testdomain

1. `api/config.php` ist ausschließlich serverseitig mit den produktiven Werten vorhanden.
2. Direkter HTTP-Zugriff auf `api/config.php` ergibt 403.
3. `GET /api/fahrtanfrage.php` ergibt 405 und eine neutrale JSON-Antwort.
4. Ungültige Formulardaten ergeben 400 mit Feldfehlern.
5. Eine gültige Anfrage ergibt 200.
6. Genau eine E-Mail kommt im fest konfigurierten Anfragepostfach an.
7. Umlaute werden in Betreff und Text korrekt dargestellt.
8. Eine optionale gültige Nutzeradresse erscheint ausschließlich als Reply-To.
9. Ein bewusst falsches SMTP-Passwort ergibt kontrolliert HTTP 500 und keine Erfolgsmeldung; anschließend sofort wieder den korrekten Wert herstellen.
10. Weder Zugangsdaten noch SMTP-Serverantworten erscheinen in Browserantwort oder Logs.
11. Das Rate Limit beantwortet eine Überschreitung mit 429.
12. Das Kontaktformular zeigt bei Transportfehlern die neutrale Fehlermeldung und niemals den Erfolgszustand.

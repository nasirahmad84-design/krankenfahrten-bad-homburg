# PHP-Produktionsprüfung

Diese Prüfung ist auf dem ALL-INKL-Abnahmehost vor Go-live zwingend. Keine echten Fahrt- oder Gesundheitsdaten als Testwerte verwenden und keine Secrets in Testergebnisse kopieren.

## Laufzeit und Syntax

```bash
php -v
php -l api/fahrtanfrage.php
php -l api/lib/validation.php
php -l api/lib/security.php
php -l api/lib/mail.php
```

Erwartet wird PHP 8.1 oder neuer ohne Syntaxfehler. Relative Includes müssen nach dem FTP-Upload ausgehend von `api/` funktionieren.

## Konfiguration und Dateirechte

- [ ] `api/config.php` aus der Vorlage erstellt, aber nicht in Git oder im Build-Paket
- [ ] `environment` ist `production`
- [ ] `mail_transport` ist `mail`
- [ ] `allowed_origin` ist die primäre Domain ohne `www`
- [ ] Empfänger und technischer Absender sind fest konfiguriert
- [ ] sicherer, nicht öffentlicher Salt eingetragen
- [ ] Rate-Limit-Verzeichnis liegt außerhalb des Webroots
- [ ] PHP kann dort Dateien anlegen und sperren
- [ ] Dateien werden mit restriktiven Rechten angelegt
- [ ] HTTP-Zugriff auf `api/config.php` und `api/config.example.php` ergibt 403

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

## Logs und Fehler

- [ ] keine vollständigen Formulardaten in PHP-, Mail- oder Webserver-Logs
- [ ] keine vollständigen IP-Adressen in Rate-Limit-Dateien
- [ ] keine PHP-Warnungen, Pfade oder Stacktraces im JSON
- [ ] technische Logs und ihre Aufbewahrung mit ALL-INKL geprüft

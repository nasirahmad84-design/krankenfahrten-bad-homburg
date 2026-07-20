# Deployment auf ALL-INKL

## Voraussetzungen

- Node.js nur lokal beziehungsweise im Build-System
- FTP-/SFTP-Zugang zum ALL-INKL-Webspace
- PHP 8.1 oder neuer auf dem Zielhosting
- aktive Domain mit SSL-Zertifikat
- eingerichtete technische Absenderadresse, zum Beispiel `formular@krankenfahrten-bad-homburg.de`

## Build und Upload

1. `npm install` und `npm run build` lokal ausführen.
2. Kontrollieren, dass `out/` HTML-Seiten, `_next/`, Assets, `.htaccess` und `api/fahrtanfrage.php` enthält.
3. Das bisherige Domain-Zielverzeichnis im KAS sichern.
4. Den vollständigen Inhalt von `out/` per FTP/SFTP in das im KAS konfigurierte Domain-Zielverzeichnis hochladen.
5. Im KAS SSL aktivieren und HTTPS-Weiterleitung konfigurieren.
6. Prüfen, dass PHP 8.1 oder neuer aktiv ist und `.php` ausgeführt statt als Klartext ausgeliefert wird.

## PHP-Konfiguration

`api/config.example.php` als Vorlage verwenden und auf dem Server `api/config.php` anlegen. Mindestens `mail_to`, `mail_from`, `allowed_origin`, ein langes zufälliges `rate_limit_salt`, ein beschreibbares Rate-Limit-Verzeichnis außerhalb des öffentlichen Webroots, `environment=production` und `mail_transport=mail` setzen. Keine Passwörter oder SMTP-Zugänge im Repository speichern.

Die Zieladresse und der Absender dürfen nicht aus Request-Daten stammen. `config.php` muss durch die mitgelieferte `.htaccess` gesperrt sein. Vor dem Produktivstart den direkten HTTP-Zugriff auf `api/config.php` testen; erwartet wird 403. Falls PHP oder `.htaccess` nicht korrekt verarbeitet werden, nicht live schalten.

## Abnahme

- `/`, `/kontakt/`, `/leistungen/`, `/leistungen/dialysefahrten/` und `/_next/` aufrufen.
- `POST /api/fahrtanfrage.php` mit einer Testanfrage prüfen.
- Falsche Methode, ungültige Daten, Mailfehler und Rate Limit kontrollieren.
- Eingang im Postfach `anfrage@krankenfahrten-bad-homburg.de` verifizieren.
- Prüfen, dass keine Formulardaten oder vollständigen IP-Adressen protokolliert werden.
- PHP-/Webserver-Logs nur auf technische Statuscodes prüfen und Aufbewahrung begrenzen.

Da die Entwicklungsumgebung kein PHP enthält, muss auf dem Hosting folgende Endpunktmatrix geprüft werden: GET ergibt 405; falscher Content-Type 415; Request über 16 KiB 413; fehlende Felder, ungültige E-Mail, Überlänge und ungültige Zeitangaben 400; gefüllter Honeypot eine neutrale 200-Antwort ohne Mail; überschrittenes Limit 429; Mailfehler 500; gültige Anfrage 200 und genau eine interne E-Mail. Zusätzlich CRLF in E-Mail-Werten, HTML in Hinweisen, abweichenden Origin und fehlende Konfiguration prüfen. Antworten dürfen keine Warnungen oder Stacktraces enthalten.

## Rollback

Vor jedem Upload das bisherige Zielverzeichnis sichern. Bei Fehlern die neue Version vollständig entfernen und die gesicherte Version zurückspielen; keine gemischten `_next`-Buildstände betreiben.

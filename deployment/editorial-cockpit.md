# Redaktionscockpit

## Zweck

Das Redaktionscockpit macht vorbereitete Ratgeberartikel lesbar, ohne sie als öffentliche Websiteinhalte zu veröffentlichen. Es ist eine separate, kleine PHP-Anwendung unter `out-editorial/` und gehört weder zur Produktions-Sitemap noch zum normalen `out/`-Paket.

## Inhalt

- Artikelübersicht nach geplantem Veröffentlichungsdatum
- vollständige, mobil lesbare Artikelvorschau
- Veröffentlichungs- und Freigabestatus
- Quellen einschließlich Prüfdatum
- Claim-Register in lesbarer Tabellenform
- Recherchebrief
- vorbereiteter Facebook-Text

Das Cockpit ist absichtlich nur lesend. Es besitzt keine Datenbank und keinen Freigabe-Endpunkt. Die verbindliche Betreiberfreigabe wird anschließend versioniert im Repository dokumentiert.

## Anmeldung

Es gibt keinen KAS-Verzeichnisschutz und kein festes Cockpit-Passwort. Der Server versendet einen sechsstelligen Einmalcode ausschließlich an das in `api/config.php` fest hinterlegte interne Anfragepostfach. Das Cockpit verwendet dafür dieselbe serverseitige SMTP-Konfiguration und PHPMailer-Installation wie das Fahrtanfrageformular. SMTP-Zugangsdaten werden weder kopiert noch in den Cockpit-Export geschrieben.

- Codegültigkeit: 10 Minuten
- höchstens fünf Prüfversuche pro Code
- erneuter Versand frühestens nach 60 Sekunden
- höchstens fünf Codeanforderungen je IP und Stunde
- Sitzungsende nach 30 Minuten Inaktivität oder spätestens nach acht Stunden
- Sitzungs-ID-Wechsel nach erfolgreicher Anmeldung
- CSRF-Schutz für Codeanforderung, Anmeldung und Abmeldung
- notwendiges Session-Cookie: `Secure`, `HttpOnly`, `SameSite=Strict`, Pfad `/redaktion/`

## Lokale Prüfung

```bash
npm run editorial:build
npm run editorial:verify
```

Zusätzlich:

```bash
php -l out-editorial/index.php
php -l out-editorial/lib/auth.php
php tests/php/editorial-auth-test.php
```

Die vollständige lokale Anmeldung benötigt eine lokale, nicht versionierte `public/api/config.php` und einen PHP-Webserver. Der automatisierte Test versendet keine echte E-Mail.

## Testdomain

Ziel ist ausschließlich:

```text
https://test.krankenfahrten-bad-homburg.de/redaktion/
```

Der manuelle GitHub-Workflow heißt `Redaktionscockpit auf Testdomain`. Er verwendet die vorhandenen FTP-Variablen und das vorhandene `FTP_PASSWORD`-Secret. Es ist kein OpenAI-Schlüssel erforderlich.

Der Deploymentprozess prüft vor dem Upload, dass `api/config.php` auf der Testdomain HTTP 403 liefert. Anschließend prüft er die Loginseite, den `X-Robots-Tag`, die Sperre von `content.php` und `lib/auth.php` sowie einen direkten Artikelaufruf ohne Sitzung. Eine echte Code-E-Mail wird dabei bewusst nicht ausgelöst.

## Sicherheitsgrenzen

- kein Upload auf die Hauptdomain
- kein Eintrag in Sitemap oder öffentliche Navigation
- `noindex, nofollow, noarchive` als HTTP-Header und Metaangabe
- kein JavaScript, Tracking oder Browser-Storage
- ausschließlich ein technisch notwendiges Session-Cookie nach PHP-Sessionstart
- keine JSON-, CSV-, Markdown- oder statischen Artikel-HTML-Dateien im Export
- Artikel werden erst nach erfolgreicher serverseitiger Sitzung aus `content.php` gerendert
- direkter HTTP-Zugriff auf `content.php` und `lib/` liefert 403
- keine Freigabe- oder Schreibfunktion
- keine Zugangsdaten im Repository

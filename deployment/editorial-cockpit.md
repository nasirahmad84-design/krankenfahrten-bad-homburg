# Redaktionscockpit

## Zweck

Das Redaktionscockpit macht vorbereitete Ratgeberartikel lesbar, ohne sie als öffentliche Websiteinhalte zu veröffentlichen. Es ist ein eigener statischer Export unter `out-editorial/` und gehört weder zur Produktions-Sitemap noch zum normalen `out/`-Paket.

## Inhalt

- Artikelübersicht nach geplantem Veröffentlichungsdatum
- vollständige, mobil lesbare Artikelvorschau
- Veröffentlichungs- und Freigabestatus
- Quellen einschließlich Prüfdatum
- Claim-Register in lesbarer Tabellenform
- Recherchebrief
- vorbereiteter Facebook-Text

Das Cockpit ist absichtlich nur lesend. Es besitzt keine Datenbank, keinen Freigabe-Endpunkt und keine Secrets. Die verbindliche Betreiberfreigabe wird anschließend versioniert im Repository dokumentiert.

## Lokale Prüfung

```bash
npm run editorial:build
npm run editorial:verify
```

Danach kann `out-editorial/index.html` lokal betrachtet werden.

## Testdomain

Ziel ist ausschließlich:

```text
https://test.krankenfahrten-bad-homburg.de/redaktion/
```

Vor dem Deployment muss im ALL-INKL-KAS für das Unterverzeichnis `/redaktion/` ein HTTP-Verzeichnisschutz eingerichtet sein. Der Deploymentprozess verlangt vor und nach dem Upload HTTP 401 und überschreibt weder `.htaccess` noch Passwortdateien.

Der manuelle GitHub-Workflow heißt `Redaktionscockpit auf Testdomain`. Er verwendet die vorhandenen FTP-Variablen und das vorhandene `FTP_PASSWORD`-Secret. Es ist kein OpenAI-Schlüssel erforderlich.

## Sicherheitsgrenzen

- kein Upload auf die Hauptdomain
- kein Eintrag in Sitemap oder öffentliche Navigation
- `noindex, nofollow, noarchive` in jeder HTML-Datei
- kein JavaScript, Tracking, Cookie oder Browser-Storage
- keine JSON-, CSV-, Markdown- oder Quelldateien im Export
- keine Freigabe- oder Schreibfunktion
- keine Zugangsdaten im Repository

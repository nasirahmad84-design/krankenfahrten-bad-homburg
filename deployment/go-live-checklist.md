# Go-live-Checkliste

## Domain und HTTPS

- [ ] `krankenfahrten-bad-homburg.de` zeigt auf den geprüften Webroot
- [ ] `www` leitet dauerhaft auf die Domain ohne `www` weiter
- [ ] HTTP leitet dauerhaft auf HTTPS weiter
- [ ] Zertifikat ist gültig
- [ ] keine Redirect-Schleife
- [ ] keine Mixed-Content-Fehler

## Website

- [ ] Startseite
- [ ] Leistungen, Kosten & Abrechnung, Ablauf, Über uns, FAQ und Kontakt
- [ ] alle sieben Leistungsdetailseiten
- [ ] Impressum, Datenschutz und Cookie-Einstellungen
- [ ] individuelle 404-Seite
- [ ] mobile Navigation und Accordion per Tastatur
- [ ] Footer und Mobile Contact Bar
- [ ] Druckansicht der rechtlichen Seiten

## Formular

- [ ] Pflichtfelder und clientseitige Feldfehler
- [ ] serverseitige Validierung
- [ ] erfolgreicher Mailversand
- [ ] authentifizierter und TLS-verschlüsselter SMTP-Versand
- [ ] SMTP-Fehler erzeugt HTTP 500 und keine Erfolgsmeldung
- [ ] Umlaute, Spamordner und Zustellbarkeit geprüft
- [ ] optionales Reply-To
- [ ] Rate Limit und technische Zeitgrenzen
- [ ] neutrale Fehlermeldungen
- [ ] Hinweis, keine Diagnosen oder Notfalldaten einzugeben
- [ ] keine vollständigen Formulardaten in Logs
- [ ] keine automatische Nutzerbestätigung

## SEO

- [ ] individuelle Title und Description
- [ ] genau ein korrekter Canonical je öffentlicher Seite
- [ ] `sitemap.xml` mit 17 URLs
- [ ] `robots.txt` erlaubt Seiten und sperrt `/api/`
- [ ] Open-Graph-Titel, -Beschreibung, -URL, Locale und Site Name
- [ ] kein defektes Social-Sharing-Bild referenziert
- [ ] Markenfavicon und Apple-Touch-Icon

## Datenschutz

- [ ] rechtliche Inhalte fachlich beziehungsweise rechtlich freigegeben
- [ ] alle Punkte aus `legal-review-checklist.md` geschlossen
- [ ] Cookie-Scan ohne unerwartete Cookies
- [ ] Local- und Session-Storage geprüft
- [ ] Netzwerk-Scan ohne unerwartete Drittanbieter
- [ ] Hostinginformationen und Auftragsverarbeitung geprüft
- [ ] Log- und E-Mail-Löschfristen festgelegt

## Sicherheit

- [ ] `api/config.php` ergibt 403
- [ ] Directory Listing deaktiviert
- [ ] keine Secrets oder Backups öffentlich erreichbar
- [ ] `api/vendor/` und Konfigurationsdateien ergeben 403
- [ ] SMTP-Passwort liegt ausschließlich in der serverseitigen Konfiguration
- [ ] SPF, DKIM und DMARC geprüft beziehungsweise Nacharbeit dokumentiert
- [ ] Sicherheits- und Cache-Header geprüft
- [ ] CSP auf Abnahmehost getestet oder bewusst weiterhin deaktiviert
- [ ] HSTS erst nach stabiler HTTPS-Prüfung aktiviert
- [ ] PHP-Version und Dateirechte geprüft
- [ ] Backup und Rollbackweg vorhanden

## Freigabe

- [ ] technische Freigabe dokumentiert
- [ ] fachliche beziehungsweise rechtliche Freigabe dokumentiert
- [ ] verantwortliche Person hat Go-live bestätigt

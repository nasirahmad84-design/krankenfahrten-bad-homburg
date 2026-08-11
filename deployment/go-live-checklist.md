# Go-live-Checkliste

## Domain und HTTPS

- [ ] `krankenfahrten-bad-homburg.de` zeigt auf den geprüften Webroot
- [ ] `www` leitet dauerhaft auf die Domain ohne `www` weiter – am 28.07.2026 liefert HTTPS-www noch 200; KAS-Weiterleitung erforderlich
- [x] HTTP leitet dauerhaft auf HTTPS weiter
- [ ] Zertifikat ist gültig
- [ ] keine Redirect-Schleife
- [ ] keine Mixed-Content-Fehler

## Website

- [ ] Startseite
- [ ] Leistungen, Kosten & Abrechnung, Ablauf, Über uns, FAQ und Kontakt
- [ ] alle sieben Leistungsdetailseiten
- [ ] Impressum, Datenschutz und Cookie-Einstellungen
- [ ] individuelle 404-Seite
- [ ] unbekannte Test-URL liefert wirklich HTTP 404 statt 500
- [x] mobile Navigation mit Escape, Fokusbegrenzung und Fokus-Rückgabe lokal geprüft
- [x] Scroll-Lock, vorherige Scrollposition, interne Panel-Höhe und ausgeblendete Mobile Contact Bar lokal geprüft
- [ ] Footer und Mobile Contact Bar
- [ ] finales Wortlogo im mobilen und Desktop-Header vollständig und scharf
- [ ] Hero-, Unterstützungs-, Leistungs- und Über-uns-Bilder bei 390, 768, 1024, 1280 und 1440 Pixeln
- [ ] keine abgeschnittenen Gesichter, Verzerrung, horizontale Überbreite oder Layoutverschiebung
- [ ] Druckansicht der rechtlichen Seiten

## Formular

- [ ] Pflichtfelder und clientseitige Feldfehler
- [ ] serverseitige Validierung
- [ ] erfolgreicher Mailversand
- [ ] authentifizierter und TLS-verschlüsselter SMTP-Versand
- [ ] SMTP-Fehler erzeugt HTTP 500 und keine Erfolgsmeldung
- [ ] Umlaute, Spamordner und Zustellbarkeit geprüft
- [ ] genau ein ICS-Anhang mit korrektem Abholtermin vorhanden
- [ ] Kalenderdauer, Erinnerung, Ort und Beschreibung geprüft
- [ ] kein erfundener Rückfahrttermin
- [ ] manuelle Kalender-Testmatrix dokumentiert
- [ ] optionales Reply-To
- [ ] Rate Limit und technische Zeitgrenzen
- [ ] neutrale Fehlermeldungen
- [ ] Hinweis, keine Diagnosen oder Notfalldaten einzugeben
- [ ] keine vollständigen Formulardaten in Logs
- [ ] keine automatische Nutzerbestätigung

## SEO

- [ ] individuelle Title und Description
- [ ] genau ein korrekter Canonical je öffentlicher Seite
- [ ] `sitemap.xml` mit 26 URLs
- [ ] `/orte/` und alle acht regionalen Ortsseiten erreichbar
- [ ] `robots.txt` erlaubt Seiten und sperrt `/api/`
- [ ] Open-Graph-Titel, -Beschreibung, -URL, Locale und Site Name
- [ ] Open-Graph-Bild unter der absoluten Produktions-URL erreichbar und 1200×630
- [ ] Markenfavicon und Apple-Touch-Icon
- [ ] Open-Graph-Vorschau enthält das finale korrigierte Wortlogo
- [ ] genau ein valides `LocalBusiness`-JSON-LD auf der Startseite
- [ ] keine produktive Seite mit `noindex`
- [ ] Staging-`X-Robots-Tag` vor Produktionsfreigabe entfernt
- [ ] Produktionsantwort enthält keinen noindex-Header
- [ ] Facebook-Link im Footer und `sameAs` geprüft
- [ ] Facebook-/WhatsApp-Linkvorschau geprüft
- [x] Google-Rezensions-CTA verwendet zentral konfigurierte URL, neuen Tab und `noopener noreferrer`
- [x] keine Bewertungsanreize, Sterne, Bewertungszahlen oder Bewertungsschema
- [ ] Lighthouse beziehungsweise gleichwertige Live-Prüfung dokumentiert

## Datenschutz

- [ ] rechtliche Inhalte fachlich beziehungsweise rechtlich freigegeben
- [ ] alle Punkte aus `legal-review-checklist.md` geschlossen
- [ ] Cookie-Scan ohne unerwartete Cookies
- [ ] Local- und Session-Storage geprüft
- [ ] Netzwerk-Scan ohne unerwartete Drittanbieter
- [ ] Hostinginformationen und Auftragsverarbeitung geprüft
- [ ] Log- und E-Mail-Löschfristen festgelegt
- [ ] Google-Analytics-Property und Consent gemäß `google-analytics-checklist.md` geprüft
- [ ] vor Zustimmung keine Google-Requests oder `_ga`-Cookies
- [ ] Widerruf und Cookie-Löschung geprüft

## Sicherheit

- [ ] `api/config.php` ergibt 403
- [ ] Directory Listing deaktiviert
- [ ] keine Secrets oder Backups öffentlich erreichbar
- [ ] `api/vendor/` und Konfigurationsdateien ergeben 403
- [ ] SMTP-Passwort liegt ausschließlich in der serverseitigen Konfiguration
- [ ] SPF und DMARC geprüft
- [x] DKIM laut Betreiberangabe für die Hauptdomain eingerichtet; keine separate Test-Subdomain-Konfiguration erforderlich
- [x] Cache- und Kompressionsheader auf der Testdomain geprüft
- [ ] CSP auf Abnahmehost getestet oder bewusst weiterhin deaktiviert
- [ ] HSTS erst nach stabiler HTTPS-Prüfung aktiviert
- [ ] PHP-Version und Dateirechte geprüft
- [ ] Backup und Rollbackweg vorhanden

## Freigabe

- [ ] technische Freigabe dokumentiert
- [ ] fachliche beziehungsweise rechtliche Freigabe dokumentiert
- [ ] verantwortliche Person hat Go-live bestätigt

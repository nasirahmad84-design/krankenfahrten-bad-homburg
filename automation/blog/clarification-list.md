# Verbleibende Punkte

## Laufender Queue-Betrieb

- Aktualitätsprüfung der Primärquellen unmittelbar vor der jeweiligen Freigabe
- alle acht vorbereiteten Beiträge sind als `approved_for_publish` mit `approvedAt` dokumentiert
- der Muster-4-Beitrag wird ohne unfreigegebene Formularabbildung veröffentlicht
- `BLOG_QUEUE_LIVE_ENABLED` ist nach erfolgreichem Testdomain-Smoke-Test aktiviert
- Fehlschläge des Publishers werden über den geschützten ALL-INKL-Endpunkt an die interne Alarmadresse gemeldet

Ein OpenAI-API-Schlüssel ist für den Queue-Betrieb nicht erforderlich. Das vorhandene Secret kann nach Abschluss des Experiments aus GitHub entfernt werden.

## Für Facebook

- administrativer Zugriff auf die Facebook-Seite
- geeigneter Veröffentlichungszugang und sicher gespeichertes Page Access Token
- aktuelle Prüfung der benötigten Meta-Berechtigungen
- Datenschutzprüfung der Plattformverbindung

## Bewusst nicht benötigt

- kein Node.js-Prozess bei ALL-INKL
- keine Datenbank
- kein vollständiges Website-Deployment pro Artikel
- keine globalen 49 Projektprüfungen pro Artikel
- keine vier erfolgreichen Testveröffentlichungen vor Live
- keine Google-Analytics- oder Search-Console-Zugangsdaten für die Artikelerstellung
- kein dauerhaft eingeschalteter lokaler Rechner
- kein bezahlter Modellaufruf zum Veröffentlichungszeitpunkt

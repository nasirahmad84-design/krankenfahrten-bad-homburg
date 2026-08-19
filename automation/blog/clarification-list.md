# Verbleibende Punkte

## Vor Aktivierung des Queue-Runners

- ausdrückliche Betreiberfreigabe der acht vorbereiteten Beiträge im Content-Approval-Register
- Aktualitätsprüfung der Primärquellen unmittelbar vor der jeweiligen Freigabe
- Umstellung der freigegebenen Läufe von `draft_ready` auf `approved_for_publish` mit `approvedAt`
- Entscheidung, ob `BLOG_QUEUE_LIVE_ENABLED` nach dem Testdomain-Smoke-Test aktiviert werden darf
- erneute Prüfung, dass der GitHub-Workflow bis zu dieser Entscheidung deaktiviert bleibt

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

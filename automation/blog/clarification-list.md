# Verbleibende Punkte nach BLOG-00

## Nicht blockierend für BLOG-01 und BLOG-02

- Der öffentliche Bereich verwendet vorläufig die Bezeichnung **Ratgeber**. Diese ist verständlicher und vertrauenswürdiger als „Blog“.
- Vorgeschlagene Laufzeiten sind 06:30 und 08:30 Uhr in `Europe/Berlin`. Sie können vor BLOG-03 geändert werden.
- Artikel verwenden zunächst das bestehende Open-Graph-Motiv. Eigene Beitragsbilder sind kein MVP-Zwang.
- RSS und E-Mail-Newsletter werden zurückgestellt.

## Blockierend für BLOG-03

- Die lokale Projektzuordnung für die Scheduled Tasks muss in der Desktop-App verfügbar sein.
- Rechner und Desktop-App müssen montags und donnerstags während der Läufe eingeschaltet sein.
- Ein manueller kompletter Recherche-/Review-/Testdeployment-Lauf muss bestanden sein.
- Die lokale FTPS-Konfiguration muss für den Hintergrundlauf erreichbar bleiben, ohne Zugangsdaten ins Repository zu übernehmen.

## Blockierend für BLOG-04

- Entscheidung nach mindestens vier erfolgreichen Testläufen, ob die Qualitätsgates für unbeaufsichtigtes Live-Publishing ausreichen.
- verifizierter administrativer Zugriff auf die Facebook-Seite
- Meta-App beziehungsweise geeigneter Veröffentlichungszugang, benötigte Seitenberechtigungen und ein sicher gespeichertes Page Access Token
- praktische Prüfung der aktuellen Meta-Pages-API-Dokumentation; der offizielle Dokumentationsabruf war am 11. August 2026 wegen HTTP 429 nicht vollständig möglich
- Datenschutzprüfung für die verwendete Plattformverbindung
- Rollback- und Fehlerbenachrichtigung für bereits live veröffentlichte Beiträge

## Bewusst nicht benötigt

- kein OpenAI-API-Key für den nativen Codex-MVP
- keine Datenbank
- kein Node.js-Prozess bei ALL-INKL
- kein ALL-INKL-Cronjob
- keine Google-Search-Console- oder Analytics-Zugangsdaten für die Artikelerstellung

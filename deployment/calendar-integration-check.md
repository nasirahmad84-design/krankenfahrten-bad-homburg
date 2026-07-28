# Manuelle Prüfung des Kalenderanhangs

Diese Prüfung auf der ALL-INKL-Testdomain verwendet ausschließlich kontrollierte Testdaten. Keine echten Gesundheitsdaten, produktiven Zugangsdaten oder Kalenderzugänge dokumentieren. Der Import erfolgt bewusst durch den internen Empfänger; die Anwendung greift auf keine externe Kalender-API zu.

1. Testanfrage mit eindeutigem Datum, Uhrzeit und unkritischen Testwerten absenden.
2. Interne Anfrage-E-Mail auf einem iPhone öffnen.
3. ICS-Anhang antippen.
4. Titel aus Fahrgastname und Fahrtanlass prüfen.
5. Datum und lokale Uhrzeit mit der Anfrage vergleichen.
6. Zeitzonenbehandlung für `Europe/Berlin` einschließlich Sommer- beziehungsweise Winterzeit prüfen.
7. Abholadresse als Ort prüfen.
8. Beschreibung einschließlich Ziel, Fahrtart und Verbindlichkeitshinweis prüfen.
9. konfigurierte Erinnerung prüfen.
10. Termin testweise hinzufügen und anschließend wieder löschen.
11. denselben Anhang auf Android beziehungsweise mit Google Calendar Import prüfen.
12. denselben Anhang mit Outlook unter Windows beziehungsweise im verwendeten Outlook-Client prüfen.
13. Umlaute, Sonderzeichen und lange Hinweise prüfen.
14. Bei „Hin- und Rückfahrt“ den Beschreibungshinweis prüfen und sicherstellen, dass kein zweiter oder geschätzter Rückfahrttermin entsteht.

Apple Calendar, Google Calendar und Outlook gelten erst nach dokumentierter Durchführung dieser Matrix als praktisch geprüft. Automatisierte Strukturtests allein belegen keine vollständige Clientkompatibilität.

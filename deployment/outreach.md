# Outreach – Kontakte und Kampagnen

Stand: 28.09.2026. Eigenes Modul im vorhandenen Einmalcode-Cockpit unter `/redaktion/outreach.php`. PHP + PDO SQLite + cURL; kein Next.js-Build erforderlich. Enthalten im separaten `editorial:build`-Paket. Auf der Testdomain eingerichtet; kein produktiver Firmenversand.

## Serverabnahme 28.09.2026

- Geschütztes Testcockpit, Konfiguration HTTP 403, unauthentifizierter Worker HTTP 403 und Noindex geprüft.
- Isolierte Konfiguration `outreach-config.php`, privater Speicher außerhalb des Test-Webroots, nur `nahmad@outlook.de` erlaubt, höchstens eine Kampagnenmail am Tag.
- GitHub-Lauf 36416434626: interne Testmail vom SMTP-Server angenommen, öffentlicher Abmeldeprozess erfolgreich, Empfänger danach gesperrt; erneuter Lauf ohne doppelte Mail. Posteingang/Spamordner noch vom Empfänger zu bestätigen.
- Ein erster Versuch scheiterte vor SMTP durch Variablenüberschreibung beim Einlesen der Outreach-Konfiguration. Behoben, Regressionstest ergänzt; genau dieser belegte Vor-SMTP-Fehler wurde einmalig zurückgesetzt. Wiederholungsmechanismus anschließend entfernt.
- Workflow `outreach-test-worker.yml` prüft alle 15 Minuten, sofern `OUTREACH_TEST_SCHEDULER_ENABLED=true`. Keine lokale Rechnerabhängigkeit. GitHub-Zeitpläne können verspätet laufen. Fehler werden als fehlgeschlagener Lauf sichtbar; eine separate E-Mail-Alarmierung wurde noch nicht eingerichtet.
- Rechercheanbieter Private.coffee auch vom ALL-INKL-Server nicht erreichbar. Manuelle Kontakterfassung funktioniert; automatische Recherche noch offen. Keine fremden Organisationen angeschrieben.
- Keine Änderungen an Produktion oder am öffentlichen Website-Export.

## Ablauf

1. Region durchsuchen: Krankenhäuser/Kliniken, Praxen, Pflege, Therapie oder Unternehmen, 15 km um Bad Homburg. Bis 150 OSM-Kandidaten pro Suche, höchstens eine Anfrage je Minute. Provider Private.coffee, keine API-Schlüssel und keine bezahlten Modellaufrufe. Quelle und Recherchezeit werden gespeichert. Nach OSM-Objekt dedupliziert; Objekte derselben Organisation können doppelt auftreten und müssen geprüft werden. Attribution bleibt im Cockpit; bei Datenexport ODbL beachten.
2. Organisation und tatsächliche Zuständigkeit anhand Originalwebsite prüfen. Fehlende E-Mail ergänzen, Pool und Pipeline-Stufe auswählen. Firmen sind Recherchekandidaten, nicht automatisch relevante Partner. Keine Patientendaten speichern.
3. Versandberechtigung belegen. Öffentliches Postfach ist keine Einwilligung. § 7 Abs. 2 Nr. 2 UWG verlangt grundsätzlich ausdrückliche vorherige Einwilligung auch bei B2B. Die enge Ausnahme nach Abs. 3 erfordert alle vier Voraussetzungen; UI verlangt deren Bestätigung. Datenschutzrechtliche Grundlage für Kontaktspeicherung, Informationspflichten (insbesondere Art. 14 DSGVO bei Fremderhebung), Löschfristen und Empfängertext sind vor Betrieb festzulegen. Der Checkbox-Nachweis ist keine rechtliche Prüfung.
4. Vorlage Information/Angebotsgespräch wählen oder neue Textvorlage anlegen; keine erfundenen Preise, Zulassungen oder Kooperationen. Platzhalter `{{organisation}}`.
5. Pool auswählen, Kampagne für 1–14 Kalendertage planen. Standard drei Tage. Eine Nachricht pro Adresse und Kampagne, verteilt ab 09:00 Europe/Berlin. Empfänger und Texte werden eingefroren. In der Detailansicht prüfen und ausdrücklich freigeben. Neue Kontakte nach Entwurfserstellung werden nicht automatisch ergänzt. Änderungen erfordern einen neuen Entwurf.
6. Scheduler ruft den Worker auf. Erneute Prüfung von Sperre, Einwilligung, E-Mail, Pipeline und Quellenprüfung (max. 90 Tage). Jede Adresse wird kampagnenübergreifend höchstens einmal in 30 Tagen kontaktiert. Globale Obergrenze initial 20/Tag, serverseitig 1–50; eine Zustellung je Workeraufruf, damit normale PHP-Laufzeitgrenzen eingehalten werden. Mehr als 24 Stunden überfällige Mails werden blockiert statt später gesammelt gesendet.
7. Antwortpostfach manuell betreuen. Antworten/Partnerschaft am Kontakt erfassen. Abmeldungen per Link oder Antwort sperren kampagnenübergreifend. Kein automatischer IMAP-Abruf, keine Lesepixel, keine Öffnungsraten. `sent` bedeutet SMTP-Annahme, nicht garantierte Zustellung. Rückläufer müssen manuell gesperrt werden.

## Serverseitige Einrichtung

Privates Datenverzeichnis außerhalb **aller** öffentlich erreichbaren Domain-Verzeichnisse anlegen (0700), nicht im Repository/Export und nicht im flüchtigen System-Temp. PHP-Prüfung kann nur den aktuellen Webroot erkennen; bei mehreren Domains muss die tatsächliche Nicht-Erreichbarkeit durch den Administrator geprüft werden. SQLite, Journal und Lock bleiben dort. Staging und Produktion müssen getrennte Ordner und Token erhalten; nur eine Umgebung darf echte Kampagnen versenden.

Diese Schlüssel gehören in die vorhandene serverseitige `api/config.php`, innerhalb des zurückgegebenen Arrays:

```php
'outreach_data_directory' => '/ABSOLUTER/PRIVATER/PFAD/outreach-test',
'outreach_send_enabled' => false,
'outreach_daily_limit' => 20,
'outreach_runner_token' => 'EIGENES-ZUFAELLIGES-SECRET-MINDESTENS-32-ZEICHEN',
'outreach_public_base_url' => 'https://test.krankenfahrten-bad-homburg.de/redaktion',
'outreach_sender_footer' => 'Vollständige bestätigte Unternehmensidentität, Postanschrift, Kontakt, Impressum- und Datenschutzlink mit Outreach-Informationen',
```

Der Platzhalter-Token darf nicht produktiv eingesetzt werden. Bestehende geprüfte SMTP-Konfiguration wird verwendet; kein `mail()`-Fallback. Vor Aktivierung Absenderpostfach, Zustellbarkeit und beim Host erlaubte Versandmengen prüfen. Abmeldeseite muss öffentlich per HTTPS erreichbar bleiben; GET zeigt Bestätigung, POST sperrt (verhindert automatische Abmeldung durch Mail-Linkscanner). Bereits während SMTP laufende Zustellung kann nicht zurückgeholt werden.

## Zeitplan

`POST https://…/redaktion/outreach-run.php` mit `Authorization: Bearer <outreach_runner_token>`, z. B. alle 15 Minuten über den vorhandenen externen Scheduler. Token nur in geschütztem Header, nie URL/Repository. Bei Apache muss Authorization an PHP weitergereicht werden. Keine Registrierung eines kostenpflichtigen Dienstes notwendig. Der Scheduler muss HTTP 4xx/5xx alarmieren; `unknown`-Zustellungen zusätzlich im Cockpit prüfen. Einmaliger Test mit einer eigenen freigegebenen Adresse vor echtem Kampagnenstart. Der Worker wird durch Browserseitenaufrufe niemals gestartet.

Der Prozess speichert vor SMTP `unknown`; auch nach Verbindungsabbruch/Prozessende findet kein automatischer Retry statt. Unklare Zustellungen erzeugen HTTP 503 für die Scheduler-Alarmierung. Nach Postfach-/Hostprotokollprüfung lässt sich das Ergebnis in der Kampagnenansicht mit Prüfnachweis dokumentieren; dies löst keine neue Mail aus. Ein privates Dateilock serialisiert Worker, Kontaktänderungen und Abmeldungen. SQLite-Transaktionen reservieren einzelne Zustellungen. Die Datenschutzhinweise des öffentlichen Auftritts wurden nicht pauschal für einen noch nicht aktivierten Prozess verändert.

Lokale Abnahme: Funktions- und Loginprüfungen bestanden. Der echte Aufruf von Private.coffee lieferte am 28.09.2026 einen Timeout; automatisierte Recherche ist daher noch nicht erfolgreich Ende-zu-Ende abgenommen. Die Oberfläche behandelt diesen Fall kontrolliert nach maximal 15 Sekunden. Importlogik wurde mit Testdaten geprüft.

## Betrieb und nächste Ausbaustufen

- Vor Betrieb: privater Speicher, Sicherung und Löschprozess, Absender-Footer, Datenschutzinformation, eigene Testadresse, Scheduler-/Alarmtest, abschließende Kampagnenfreigabe.
- Regelmäßig: Rückläufer, Antworten, unbekannte/gesperrte Zustellungen bearbeiten; Datenbestand auf Aktualität und Erforderlichkeit prüfen. Sperrliste nur zur Verhinderung weiterer Kontakte vorhalten.
- Ausbau nach Nutzung: CSV-Import mit Validierung, Empfängersuche/Paginierung (Übersicht derzeit bis 500 Kontakte / 100 Kampagnen), automatische Rückläufer-Verarbeitung, Antwortzuordnung, mehrere Nutzerrollen, zusätzliche Rechercheanbieter und geplante Follow-ups nach ausdrücklicher Freigabe.
- Keine Behauptung von Vollständigkeit der Recherche oder garantierter rechtlicher Zulässigkeit einer konkreten Kampagne.

## Prüfung

`php tests/php/outreach-test.php`, `php tests/php/editorial-auth-test.php`, `npm run editorial:build`, `npm run editorial:verify` und PHP-Syntaxprüfung. Tests verwenden ausschließlich Fake-Sender und In-Memory-SQLite. Vor Serverfreigabe außerdem Login/CSRF, Sperre von `lib/`, öffentlicher Abmeldelink, Worker ohne/mit falschem Token, privater Speicher und ein echtes internes Testmail prüfen.

Quellen: https://www.gesetze-im-internet.de/uwg_2004/__7.html ; https://wiki.openstreetmap.org/wiki/Overpass_API ; https://www.openstreetmap.org/copyright

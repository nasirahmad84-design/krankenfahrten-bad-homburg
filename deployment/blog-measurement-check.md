# Blog / Google Business: Messabnahme

Stand: 14.09.2026. Implementiert und lokal getestet bedeutet **nicht**, dass GA4 die Kampagne bereits empfangen oder attribuiert hat. Kein GA4-Administrationsfilter wurde geändert.

## Eng begrenzte Implementierung

- Tag weiterhin erst nach ausdrücklicher Analyse-Zustimmung. Keine neue Speicherung, keine Erweiterung der Events.
- Nur HTTPS-Produktionsorigin; Testdomain und lokale Vorschau laden kein Tag. Redaktion und API sind zusätzlich ausgeschlossen.
- `page_location` wird bereits bei der Initialisierung und bei eigenen Seiten-/Kontaktaktionen bereinigt.
- Nur auf `/ratgeber/…` bleibt der vollständige feste Dreiklang `utm_source=google&utm_medium=organic&utm_campaign=gbp_ratgeber` erhalten. Abweichende oder doppelte Kampagnenwerte werden verworfen.
- `utm_content`, `utm_term`, alle anderen Querywerte und Fragmente werden nie übernommen. Artikelunterscheidung erfolgt über den vorhandenen Seitenpfad. Ein unverändertes GBP-Linkformat mit `utm_content` funktioniert trotzdem; der freie Wert wird bewusst nicht an GA4 weitergegeben.
- Referrer wird auf die HTTP(S)-Origin reduziert; keine Suchbegriffe, Pfade oder Querywerte daraus.
- Bereits erfasste Test-/Redaktionsaufrufe werden dadurch nicht rückwirkend entfernt. Eigene Besuche auf der Produktionsseite bleiben ohne zusätzliche GA4-Testkennzeichnung normale Messereignisse.

## Prüfung nach Freigabe / Deployment

1. Tatsächlich veröffentlichten Artikel mit dem festen UTM-Dreiklang öffnen, zunächst ohne Zustimmung: keine Google-Tag-/Collect-Anfrage erwarten.
2. Analyse erlauben. Netzwerkrequest kontrollieren: richtige Mess-ID, `page_view`, bereinigtes `page_location`, feste Kampagnenwerte, kein beliebiger Query-/Fragmentinhalt. Nur harmlose Testmarker verwenden, keine Patientendaten.
3. In GA4 Echtzeit den Artikelaufruf prüfen; nach Verarbeitung in Akquisition nach **Sitzung – Kampagne = gbp_ratgeber** und Quelle/Medium `google / organic` filtern. Eingang und Attribution getrennt dokumentieren; keine sofortigen Standardberichtswerte versprechen.
4. Vom Artikel zur Kontaktseite wechseln: deren URL enthält keine mitgeschleppten Artikel-/Querywerte. Telefonklick kann getestet werden; für `generate_lead` nur ausdrücklich erlaubte, klar markierte Testanfrage senden.
5. Zustimmung widerrufen: eigene Analytics-Events bleiben aus. Testdomain und `/redaktion/` mit bestehendem Consent separat kontrollieren.
6. In GA4 unter Seiten/Bildschirme und Akquisition zusätzlich **Hostname = krankenfahrten-bad-homburg.de** verwenden. Eigene Tests zeitlich protokollieren; historische zwei Schlüsselereignisse nicht ohne Prüfung als echte Kundenanfragen interpretieren.

Noch offen: reale Netzwerk-/GA4-Abnahme nach Deployment, Administratorprüfung der erweiterten Messung (insbesondere automatische History-/Formularmessung), eventuelle zusätzliche GA4-interne Testfilter. Die lokalen Tests prüfen unsere eigenen Aufrufe, nicht das Verhalten des extern geladenen Google-Scripts.

## Betriebscheck: erster externer Zeitplan

### Offene Übergangslücke vom 14.09.2026

Der bereits freigegebene Lauf `2026-09-14-reha-therapiefahrten-kosten-vorab-klaeren` ist noch nicht veröffentlicht. Beim Check am 14.09. liefert seine Live-URL HTTP 404, die lokale Queue wählt ihn weiterhin aus. Der einzige heutige GitHub-Lauf war ein absichtlicher Dry Run. Der neue Cronjob beginnt erst am 17.09.; er holt den 14.09. nicht automatisch nach. Vor gezieltem Nachholen Quellenaktualität und wiederherstellbare Sicherung des Blog-Deltas prüfen. Nicht als erledigt behandeln.

- Nächster freigegebener Lauf laut `automation/blog/articles/2026-09-17-patientensicherheit-regelmaessige-krankenfahrten/run-status.json`: **Donnerstag, 17.09.2026, 09:00 Europe/Berlin**.
- Erwartete Live-URL: `https://krankenfahrten-bad-homburg.de/ratgeber/patientensicherheit-regelmaessige-krankenfahrten/`.
- Ab 09:00 cron-job.org-Ausführung und zugehörigen GitHub-Run prüfen. Erfolgreiche Dispatch-Antwort allein beweist noch keinen erfolgreichen Publisher. Runner-/Builddauer kann den tatsächlichen Veröffentlichungstermin verschieben.
- Bei GitHub-Erfolg: URL per GET auf 200, richtige Überschrift und Datum prüfen; Ratgeberindex, Sitemap und veröffentlichter Status müssen denselben Artikel führen. Kein manueller Zusatzlauf parallel zu einem noch laufenden Publisher.
- Bei fehlendem Run oder Fehler: Zustell-/Workflowhistorie und vorhandene Alarmierung an `nahmad@outlook.de` prüfen. Nicht blind wiederholt starten; zunächst Zustand und vorhandene Veröffentlichung abgleichen.
- Dieser Plan legt keinen zusätzlichen automatischen Monitor an. Die tatsächliche Kontrolle vom 17.09. wurde am 14.09. noch nicht durchgeführt.

## Token-Erneuerung vor dem 14.10.2026

Der externe GitHub-Token läuft am **14.10.2026** ab. Erneuerung spätestens **12.10.2026** durchführen, nicht erst beim ersten fehlgeschlagenen Dispatch.

1. In GitHub neuen Fine-grained Token ausschließlich für `krankenfahrten-bad-homburg`, Berechtigung Actions Lesen/Schreiben, anlegen. Kein Contents-Schreibzugriff; Secret nicht im Chat oder Repository speichern.
2. cron-job.org-Zeitplan für den Austausch kurz deaktivieren. Authorization-Header durch neuen Token ersetzen.
3. Einmal `dry_run: true` starten. Dispatch und tatsächlich erfolgreich abgeschlossenen GitHub-Prüflauf kontrollieren; keine Veröffentlichung erwarten.
4. Payload wieder `dry_run: false`, Montag/Donnerstag 09:00 und Zeitzone Berlin kontrollieren; Zeitplan wieder aktivieren.
5. Erst danach alten Token widerrufen. Neues Ablaufdatum dokumentieren; vorhandene Fehlerbenachrichtigungen beibehalten. Kein neuer kostenpflichtiger Dienst nötig.

## Quellen

- [Google: Konfigurationsfelder page_location und page_referrer](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
- [Google: benutzerdefinierte Kampagnendaten](https://support.google.com/analytics/answer/11259997)

## Lokale Checks

`node --test --experimental-strip-types tests/analytics-consent.test.mts tests/blog-measurement.test.mts`

`npx eslint src/lib/analytics-consent.ts src/lib/analytics-page-context.ts tests/blog-measurement.test.mts`

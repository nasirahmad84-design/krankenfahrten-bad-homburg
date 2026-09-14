# Externer Zeitplan – Stand 14.09.2026

## Verifiziert

ALL-INKL-KAS meldet beim vorhandenen Konto unter Tools → Cronjobs: „Diese Funktion ist in Ihrem aktuellen Tarif leider nicht enthalten“. Es sind 0 Cronjobs verfügbar. Kein Tarifwechsel beauftragt.

Der bestehende GitHub-Zeitplan bleibt aktiv, bis ein externer Auslöser erfolgreich geprüft und ausdrücklich eingeschaltet ist. Ein anderer Auslöser beseitigt die Verzögerung des GitHub-Cronereignisses, garantiert jedoch keine sekundengenaue Runner-Zuteilung oder fertige Veröffentlichung um 09:00 Uhr.

## Kleinste kostenfreie Alternative

cron-job.org sendet montags und donnerstags um 09:00 Europe/Berlin einen HTTPS-POST direkt an den vorhandenen GitHub-Workflow. Auf ALL-INKL sind weder ein neuer PHP-Endpunkt noch GitHub-Zugangsdaten erforderlich. Es gibt keinen zusätzlichen KI-Aufruf. Der Provider beschreibt den Dienst als kostenlos; bestehende GitHub-Actions-Verbrauchsgrenzen bleiben unabhängig davon bestehen.

Konkrete Vorlage: `automation/blog/external-schedule.example.json`. Sie ist standardmäßig ausgeschaltet und benutzt `dry_run: true`.

## Einrichtung und Umschaltung

1. Konto bei cron-job.org anmelden/erstellen. Die Annahme von Vertragsbedingungen erfolgt durch den Betreiber.
2. Auf GitHub einen Fine-grained Personal Access Token für **nur** `nasirahmad84-design/krankenfahrten-bad-homburg` mit **Actions: Read and write** erstellen. Keine Contents-Schreibrechte erforderlich. Ablaufdatum notieren. Der Token kann Actions in diesem Repository steuern; er ist nicht auf einen einzelnen Workflow einschränkbar.
3. Token ausschließlich im Authorization-Header des Cronjobs hinterlegen. Weder URL noch Git noch Logausgaben dürfen ihn enthalten. Damit erhält cron-job.org Zugriff zum Auslösen der Repository-Workflows; diese Zugriffsfreigabe muss vom Betreiber bestätigt sein.
4. Den ausgeschalteten Job mit dem Prüflauf-Body einmal testen. GitHub bestätigt die Annahme der Anfrage; anschließend muss der tatsächlich entstandene Actions-Lauf erfolgreich sein. Eine HTTP-Erfolgsantwort allein belegt keine Veröffentlichung.
5. Body auf `{"ref":"main","inputs":{"dry_run":"false"}}` ändern, Zeitplan prüfen und aktivieren.
6. Erst danach GitHub-Variable `BLOG_EXTERNAL_SCHEDULER_ENABLED=true` setzen. Sie deaktiviert nur den alten `schedule`-Auslöser im Job, nicht `workflow_dispatch`.
7. Beim ersten echten Veröffentlichungstermin Live-URL, Sitemap und Publish-Commit prüfen. Bestehende Fehleralarmierung bleibt aktiv. Die Cronjob-Alarmierung meldet Probleme beim Auslösen, die GitHub-Alarmierung Probleme beim Publizieren.

## Rückkehr zum bisherigen Zeitplan

Externen Cronjob deaktivieren und `BLOG_EXTERNAL_SCHEDULER_ENABLED=false` setzen. Eine bereits laufende Veröffentlichung nicht abbrechen. Der vorhandene Publisher verhindert Doppelpublikationen bereits versionierter Artikel und serialisiert gleichzeitige Läufe über `blog-publishing`.

## Noch offen

Konto und zugriffsbegrenzter Token; aktivierter Job und erfolgreicher End-to-End-Test. Diese Datei ist eine geprüfte Einrichtungsvorlage, kein Nachweis einer aktiven Umstellung.

## Quellen

- https://all-inkl.com/wichtig/anleitungen/kas/tools/cronjobs/einrichtung_479.html
- https://cron-job.org/en/
- https://docs.cron-job.org/rest-api.html
- https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event

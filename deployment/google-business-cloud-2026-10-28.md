# Google-Business-Pipeline – Betrieb ab 28.10.2026

Diese Dokumentation ersetzt die früheren Aussagen „Zeitplan noch nicht aktiviert“ für die acht Beiträge vom 29.10. bis 23.11.2026. Ältere fünf Beiträge mit offenem Bild bleiben unverändert gesperrt und werden nicht ungefragt nachgeholt.

## Freigabe und Bilder

Finale Artikel-/Textfreigabe am 28.10.2026, anschließend ausdrücklicher Betreiberauftrag zur vollständigen Finalisierung. Die bereits vorgestellten Motive wurden als eigene sachliche Informationsgrafiken mit bestehendem Logo umgesetzt, ohne fremde Fotos, Personen, Kliniklogos oder neue Leistungsversprechen. Acht JPEGs, jeweils 1200 × 900 px, circa 55–64 KiB. Generator: scripts/render-google-business-images.mjs. Rechte, Dateigröße und SHA-256 stehen in automation/blog/google-business-images.json. Vollständige Text-/Bild-/CTA-Payloadhashes und Ausführungsauftrag stehen im Google-Freigaberegister.

## Ablauf

1. Der vorhandene Blogpublisher veröffentlicht einen freigegebenen fälligen Artikel zunächst auf Test, dann auf Produktion und dokumentiert den Erfolg.
2. Sein erfolgreicher Workflow startet unabhängig davon Google-Business-Pipeline. Zusätzlich täglicher Abgleich um 09:10 und 13:10 UTC (im Winter 10:10 und 14:10 Uhr Berlin, im Sommer 11:10 und 15:10 Uhr). GitHub kann Starts verzögern; keine minutengenaue Zustellgarantie.
3. Nur explizit mit automaticPublishing freigegebene Beiträge kommen in diese Queue. Vor dem Artikeltermin passiert kein POST. Fällige Artikel ohne Live-Register warten; überfällige fehlende Artikel lösen einen Fehler aus.
4. Der tatsächliche Live-Artikel muss HTTP 200, passenden Canonical und passendes Article/BlogPosting-JSON-LD ohne noindex liefern. Das eigene JPEG muss erreichbar sein und bytegenau dem freigegebenen Hash entsprechen.
5. Die Google-API wird über OAuth angesprochen. Vorhandene Beiträge werden vollständig paginiert nach Artikel-URL abgeglichen. Änderungen am Text oder Ziellink werden nicht still überschrieben.
6. Vor einem neuen POST muss sending_unknown erfolgreich in den separaten GitHub-Branch gbp-state gepusht sein. Erst danach darf ein Beitrag erzeugt werden. Bei abgebrochenem oder unklarem Sendeversuch wird ausschließlich abgeglichen, nie blind wiederholt.
7. LIVE, PROCESSING und REJECTED werden getrennt behandelt. Unveränderte bestätigte Zustände erzeugen keinen neuen Commit. Nach Statusänderung wird das geschützte Cockpit automatisch aktualisiert. PROCESSING ist noch keine bestätigte Sichtbarkeit; nach über 24 Stunden wird alarmiert.

## Dauerhafter Zustand und Geheimnisse

Eine eigene Workflow-Concurrency-Gruppe verhindert parallele Google-Schreibläufe. Der Zustand liegt nicht nur in Cache oder Artefakten, sondern als nicht erzwungener Git-Push auf gbp-state. Pushfehler sperren den POST. Gespeichert werden nur Slug, Post-ID, Standort, Hash und Status; keine Tokens oder Artikeltexte. Der Branch darf nicht gelöscht oder zurückgesetzt werden. Ein neuer Branch mit leerem Ledger darf nicht als Fehlerbehebung dienen.

GBP_CLIENT_ID, GBP_CLIENT_SECRET und GBP_REFRESH_TOKEN sind GitHub Secrets. Das konkrete Unternehmensprofil ist im Queue-Skript fest begrenzt. GBP_QUEUE_ENABLED ist der zentrale Abschalter. Kein Profilpasswort, keine bezahlte OpenAI-API, kein vollständiger Website-Build im Google-Lauf. Der alte Einzelpost-CLI bleibt ein ausdrückliches manuelles Werkzeug und darf nicht parallel mit der Cloud verwendet werden.

## Alarmierung und Überwachung

Fehlgeschlagene Google-Läufe verwenden den vorhandenen serverseitigen Mailalarm an nahmad@outlook.de; im Ereignistext steht der tatsächliche Google-Workflow mit Run-Link. Die bestehende E-Mail-Betreffzeile lautet weiterhin Blog-Veröffentlichung fehlgeschlagen, weil derselbe abgesicherte Endpoint verwendet wird. Die tägliche Blog-Publisher-Gesundheit prüft zusätzlich tatsächliche Google-Starts innerhalb von 36 Stunden und fehlende/abgelehnte/zu lange laufende fällige Beiträge. Ein Google-Fehler rollt keinen Websiteartikel zurück.

## Wiederherstellung und Pausieren

- Pausieren: Repository-Variable GBP_QUEUE_ENABLED auf false setzen. Blogveröffentlichung bleibt aktiv.
- Bei unklarem Versand: zuerst Google-Bestand und gbp-state abgleichen. Keine Zustandsdatei löschen, keine neuen POSTs erzwingen.
- Bilder: eigener Workflow sichert vorhandene öffentliche Fassungen 30 Tage als Artefakt, lädt ausschließlich die acht JPEGs auf Test und Live und prüft die Bytes per HTTPS.
- Cockpit: bestehende Sicherung vor jedem Upload. Es bleibt mit Einmalcode und noindex geschützt; Bilder und Google-Status sind dort lesbar.
- Ein echter POST der neuen Runde wird nicht vor dem 29.10.2026 als Test ausgelöst. OAuth und Bestand sind read-only prüfbar; Schreibpfade, Timeout, fehlgeschlagene Sicherung, Duplikate und Ablehnung sind automatisiert mit simuliertem Google getestet.

## Referenzen, geprüft 28.10.2026

Abschlussprüfung am 28.10.2026:

- 31 Blogtests und 11 Google-Publisher-/Queue-Tests bestanden, ESLint, PHP-Syntax und Cockpit-Paketprüfung erfolgreich.
- Bildbereitstellung mit Sicherung und Prüfung sämtlicher 16 Test-/Live-Dateien erfolgreich: GitHub-Lauf 40688298716.
- Cloud-Prüflauf mit OAuth und persistentem Zustandsbranch erfolgreich: 40688341123.
- Versand aktiviert (GBP_QUEUE_ENABLED=true); aktiver Lauf 40688618638 erfolgreich, vor Fälligkeit korrekterweise kein POST.
- Blog-/Google-Gesundheitsprüfung 40688796768 erfolgreich.
- Geschütztes Cockpit mit Bildern erfolgreich bereitgestellt: 40688550639. Keine Produktionsseiten oder Formulare neu gebaut.
- Bestehender Herbstferien-Beitrag erneut read-only als LIVE geprüft und sein tatsächlicher Zustand dauerhaft im Ledger gespeichert. Kein neuer Google-Beitrag als Test angelegt.
- Ein beim ersten Cloudstart erkannter GitHub-Kontextfehler wurde vor Aktivierung behoben; Abschlusstests und neuester Lauf sind erfolgreich.

- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media
- https://support.google.com/business/answer/6103862

Googles Annahme, Darstellung und Sichtbarkeit bleiben vom Anbieter abhängig; weder Rankings noch eine erfolgreiche Darstellung jedes Motivs werden zugesagt.

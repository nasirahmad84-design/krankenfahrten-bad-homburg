# Redaktionsrunde 29. Oktober bis 23. November 2026

Stand: 28.10.2026. Finale Betreiberfreigabe im Codex-Chat für alle acht Artikel und Google-Kurztexte erteilt, anschließend ausdrücklicher Finalisierungsauftrag. Artikelstatus: **approved_for_publish**. Die vorgestellten Motive sind als eigene Informationsgrafiken umgesetzt; vollständige Google-Payloads sind mit SHA-256 und Ausführungsauftrag im Freigaberegister hinterlegt. Keine Artikelveröffentlichung vorgezogen.

| Plantermin | Artikel | Bildidee für Google (noch nicht freigegeben) |
| --- | --- | --- |
| 2026-10-29 | Arzttermin und Abholzeit: Zwei Uhrzeiten mit unterschiedlicher Bedeutung | Zwei beschriftete Uhrzeiten, neutrale eigene Grafik |
| 2026-11-02 | Klinikfahrt nach Usingen: Den richtigen Standort angeben | Eigene Standort-Textgrafik, keine Klinikfotos oder Kliniklogos |
| 2026-11-05 | Wetterwarnung vor der Krankenfahrt: Was organisatorisch zu klären ist | Neutrale eigene Warnhinweis-Grafik, keine tatsächliche Wetterkarte |
| 2026-11-09 | Fahrtanfrage per Nachricht: Keine Befunde und Diagnosen mitschicken | Eigene Grafik: Fahrtdaten statt Befunde, ohne echte Patientendaten |
| 2026-11-12 | Anfrage gesendet – ist die Fahrt schon gebucht? | Eigene Grafik: Angefragt → Rückfrage → Bestätigt |
| 2026-11-16 | Abholung bei Dunkelheit: Einen gut auffindbaren Treffpunkt vereinbaren | Eigene Eingangsskizze ohne Personen |
| 2026-11-19 | Stufen am Hauseingang: Unterstützung vor der Krankenfahrt klären | Neutrale eigene Zugangsskizze ohne Tragesituation |
| 2026-11-23 | Klinikfahrt bei Demenz: Zuständigkeiten und Absprachen vorab klären | Eigene Kontaktplan-Grafik ohne echte Personen oder Patientendaten |

## Änderungen gegenüber der alten Planung

Der Zeitumstellungsbeitrag wird nach dem 25.10.2026 nicht mehr vorbereitet. Stufen und Dunkelheit erhalten zukünftige Plantermine. Der Demenzbeitrag ist zeitlos neu ausgearbeitet; ein früherer lokaler Entwurf mit vergangenem Veranstaltungsbezug wird nicht veröffentlicht. Slugs und Plantermine in der Google-Themenliste stimmen mit den neuen Läufen überein. Alte freigegebene Veröffentlichungen und Freigaberegister bleiben unverändert.

## Erteilte Freigabe und noch offene Google-Voraussetzungen

Die finale Freigabe vom 28.10.2026 ist in allen acht Laufstatusdateien, Kalender, Inhaltsfreigaberegister und Google-Freigaberegister dokumentiert. Die Artikel sind für ihre bestehenden Montag-/Donnerstag-Termine vorgesehen. Vor Freischaltung Quellen nochmals prüfen und Prüfdaten fortschreiben. Bei bereits verstrichenem Termin neu einplanen, nicht rückdatieren.

Google-Zielplan: ebenfalls 29.10., 02.11., 05.11., 09.11., 12.11., 16.11., 19.11. und 23.11.2026, jeweils erst nach nachgewiesenem Livegang des zugehörigen Artikels. Ein unabhängiger Nachlauf und tägliche Wiederholungsstarts übernehmen den Abgleich. Dauerhafter Duplikatschutz liegt im Branch gbp-state. Keine minutengenaue Google-Sichtbarkeit zugesagt. Betriebsanleitung: deployment/google-business-cloud-2026-10-28.md.

## Google-Business-Bilder

Obige Motive wurden im ausdrücklichen Finalisierungsauftrag vom 28.10.2026 als eigene sachliche Textgrafiken mit dem bestehenden Betreiberlogo umgesetzt. Keine fremden Klinik-, BBK- oder Beratungsstellenlogos, keine echten Personen oder Patientendaten. Bilder und Kurztexte sind im geschützten Cockpit sichtbar. Alte Google-Freigaben bleiben unverändert; diese Runde enthält keine Facebook-Veröffentlichung.

## Technische Erstabnahme am 28.10.2026 vor Betreiberfreigabe

- Alle acht Läufe mit dem bestehenden Validator geprüft; Status jeweils draft_ready, keine Betreiberfreigabe gesetzt.
- Acht Google-Vorschauen erzeugbar: preview_only, operatorApproval pending, LEARN_MORE-CTA mit produktiver Artikel-URL und UTM.
- 30 Blogtests, ESLint, statischer Build, Blog-Exportprüfung, Legal-Exportprüfung und Deployment-Verifikation bestanden.
- Öffentlicher Export unverändert 17 Artikel / 47 öffentliche URLs; alle acht Entwurfsrouten fehlen im öffentlichen Export.
- Geschütztes Cockpit enthält 24 Redaktionsläufe einschließlich der acht neuen Entwürfe. Doppelte Themenzeilen werden ausgeblendet, sobald ein vollständiger Lauf vorliegt.
- Cockpit-Paketprüfung, PHP-Syntax und Login-/Outreach-Tests bestanden. Keine echte Mail und kein bezahlter KI-Aufruf für diese Runde ausgelöst.
- Ziel ist ausschließlich das bestehende geschützte Test-Cockpit. Der Deployment-Workflow sichert den bisherigen Stand als wiederherstellbares Artefakt vor dem Überschreiben; HTTP-Schutz wird nach dem Upload geprüft. Website und Google-Veröffentlichung bleiben unverändert.

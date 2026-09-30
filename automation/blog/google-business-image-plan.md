# Bildplan für die nächsten Google-Business-Beiträge

Stand 30.09.2026. Der Betreiber hat die fünf vorhandenen Google-Kurztexte freigegeben. Die Bildmotive sind Vorschläge, noch nicht geliefert oder freigegeben. Deshalb bleiben alle fünf Beiträge technisch gesperrt. Acht weitere Themen ab 19.10. sind lediglich Planung und noch keine fertigen Beiträge.

| Termin | Beitrag | Bildmotiv | Prüfpunkt |
|---|---|---|---|
| 01.10. | Begleitperson abstimmen | Zwei leere Sitzplätze im Fahrzeug oder reale, freigegebene Begleitperson am Fahrzeug | Keine abgebildete Person ohne Nutzungs-/Einwilligungsnachweis; keine Mitfahrtgarantie suggerieren |
| 05.10. | Rückfahrt bei offenem Behandlungsende | Neutrale Aufnahme eines Abholpunkts oder Kalenderdetail ohne Namen | Keine Klinik oder feste Rückfahrtzeit suggerieren |
| 08.10. | Verschobener Arzttermin | Kalenderblatt mit verschobenem Termin, ohne echte Patienten- oder Arztangaben | Keine Diagnose oder personenbezogenen Daten im Bild |
| 12.10. | Unterlagen und Fahrtdaten trennen | Neutrale Mappe neben separater Fahrtnotiz | Keine echten Formulare, Versichertennummern oder Befunde |
| 15.10. | Serienfahrten zum Monatswechsel | Abstrakte Monatsübersicht mit mehreren markierten Tagen | Keine feste Verfügbarkeit, Abrechnung oder Buchung suggerieren |

## Bild- und Freigabegate

- Bevorzugt echte eigene, passend freigegebene Fotos. Alternativ sachliche, eigens gestaltete Informationsgrafik; Illustrationen nicht als reale Kunden, Fahrer oder Einrichtungen ausgeben.
- Pro Beitrag ein eigenständiges JPG/PNG, öffentlich per HTTPS von der Produktionsdomain abrufbar. Vor dem API-Post HTTP 200, richtigen Bild-MIME-Typ, Rechte, Zuschnitt und Mobilansicht prüfen.
- Als Arbeitsziel mindestens 720 × 720 px, 10 KB bis 5 MB, gut lesbar und ohne überladene Schrift. Google kann das Bild anders zuschneiden.
- Nach finaler Bildwahl den vollständigen API-Payload mit `media: [{"mediaFormat":"PHOTO","sourceUrl":"..."}]` vorbereiten. Text, Bild und Ziellink gemeinsam anzeigen; erst nach ausdrücklicher finaler Freigabe den neuen Payloadhash im Freigaberegister eintragen. Bis dahin bleibt der Publisher blockiert.
- Falls bis zum Termin kein freigegebenes Bild vorhanden ist: nicht stillschweigend text-only veröffentlichen, sondern Termin verschieben oder eine explizite Text-only-Freigabe einholen.

Quellen: [Google-Hilfe zu Beiträgen](https://support.google.com/business/answer/7342169?hl=de), [Google-Fotorichtlinien](https://support.google.com/business/answer/6103862?hl=de), [GBP-API-Beispiel mit `media.sourceUrl`](https://developers.google.com/my-business/content/posts-data).

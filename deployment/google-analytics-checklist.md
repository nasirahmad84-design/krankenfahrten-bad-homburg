# Google Analytics 4 – Einrichtungs- und Abnahmecheckliste

Diese Checkliste dokumentiert die technische und organisatorische Freigabe für die GA4-Property `G-WD56RCXD03`. Sie ist eine Prüfgrundlage und keine Rechtsberatung.

## Property-Einstellungen

- [ ] Richtige Property und richtiger Web-Datenstream für `https://krankenfahrten-bad-homburg.de` bestätigt
- [ ] Optimierte Analysen deaktiviert; Ereignisse werden bewusst über die Website gesteuert
- [ ] Optionale Datenfreigaben an Google geprüft und nur erforderliche Freigaben aktiviert
- [ ] Google Signals deaktiviert
- [ ] Personalisierte Werbung und Verknüpfungen mit Werbeprodukten deaktiviert
- [ ] Granulare Standort- und Gerätedaten für Deutschland beziehungsweise den EWR geprüft und möglichst deaktiviert
- [ ] Aufbewahrungsdauer für Nutzer- und Ereignisdaten bewusst festgelegt und dokumentiert
- [ ] Kontaktdaten und anwendbare Datenverarbeitungsbedingungen im Analytics-Konto geprüft
- [ ] `generate_lead` nach dem ersten Eingang in GA4 als Schlüsselereignis markiert
- [ ] Eigene beziehungsweise interne Zugriffe nach Möglichkeit als interner Traffic definiert

## Consent-Abnahme auf der Testdomain

- [ ] Frischer Browser ohne gespeicherte Auswahl: Banner erscheint
- [ ] „Nur notwendige Cookies“ und „Analyse erlauben“ sind gleichwertig erreichbar
- [ ] Vor einer Zustimmung keine Requests zu `googletagmanager.com` oder `google-analytics.com`
- [ ] Bei Ablehnung nur `kfbh_analytics_consent=denied`, keine `_ga`-Cookies
- [ ] Nach Zustimmung wird genau der Stream `G-WD56RCXD03` geladen
- [ ] Consent Mode v2: `analytics_storage=granted`, Werbeparameter bleiben `denied`
- [ ] Nach Zustimmung entstehen `_ga`-Cookies mit begrenzter Laufzeit
- [ ] Cookie-Einstellungen zeigen den aktuellen Status
- [ ] Widerruf entfernt erreichbare `_ga`-Cookies und verhindert weitere Website-Ereignisse
- [ ] Banner und Einstellungen funktionieren mit Tastatur bei 390, 768 und 1440 px

## Ereignisse und Datenschutz

- [ ] `page_view` enthält nur den Pfad ohne Query-Parameter
- [ ] Erfolgreiche Fahrtanfrage erzeugt einmal `generate_lead`
- [ ] Fehlgeschlagene oder nur begonnene Anfrage erzeugt keinen Lead
- [ ] Telefon-, WhatsApp- und Rezensionsklicks werden ohne URL- oder Formulardaten gemessen
- [ ] Keine Namen, Telefonnummern, E-Mail-Adressen, Adressen, Fahrtanlässe oder Freitexte in DebugView oder Realtime
- [ ] Datenschutzerklärung und Cookie-Einstellungen fachlich beziehungsweise rechtlich freigegeben

## Produktivabnahme

- [ ] Erneuter Cookie-, Storage- und Netzwerk-Scan auf der Hauptdomain
- [ ] Google Tag Assistant bestätigt Consent-Reihenfolge und richtige Mess-ID
- [ ] Realtime-Bericht zeigt ausschließlich bewusst ausgelöste Testereignisse
- [ ] Testdaten anschließend in der Auswertung kenntlich gemacht beziehungsweise bei Bedarf gelöscht

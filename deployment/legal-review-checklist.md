# Legal Review Checklist

Diese Checkliste ist eine technische Freigabe- und Prüfgrundlage, keine Rechtsberatung. Alle rechtlichen Inhalte müssen vor der Veröffentlichung fachlich beziehungsweise rechtlich geprüft und freigegeben werden.

## Anbieterangaben

- [ ] Rechtsform prüfen
- [ ] Umsatzsteuer-ID und Wirtschafts-ID prüfen
- [ ] Registerangaben prüfen
- [x] zuständige Genehmigungsbehörde für Taxi-/Mietwagenverkehr anhand der amtlichen Stadtseite ermittelt
- [ ] Nummer und genauer Umfang der vorhandenen Taxi- beziehungsweise Mietwagengenehmigung intern prüfen
- [ ] Verantwortlichen für Inhalte prüfen
- [ ] bekannte Anschrift, Telefon- und E-Mail-Daten bestätigen

## Datenschutz

- [ ] dokumentierte Rechtsgrundlagen und ausdrückliche Formulareinwilligung fachlich beziehungsweise rechtlich freigeben
- [x] technische Vollständigkeit von Art. 6 Abs. 1 Buchst. b, c und f sowie Art. 9 Abs. 2 Buchst. a DSGVO geprüft
- [x] Widerrufshinweis, Kontaktaufnahme, Datenschutzerklärung und Unverbindlichkeit im Formular technisch geprüft
- [ ] Speicherdauer der E-Mail-Anfragen verbindlich festlegen
- [ ] Umfang und Speicherdauer der Server-Logfiles bei ALL-INKL prüfen
- [ ] Auftragsverarbeitungsvertrag und weitere Vertragsdetails mit ALL-INKL prüfen
- [x] zuständige Datenschutzaufsichtsbehörde anhand der amtlichen HBDI-Seite ermittelt
- [ ] betriebliches Löschkonzept festlegen
- [ ] technische und organisatorische Maßnahmen dokumentieren
- [ ] Rate-Limit-Aufbewahrung und Bereinigung auf dem Produktivserver verifizieren
- [ ] technischen Absender und Empfänger der Formular-E-Mail bestätigen
- [ ] sicherstellen, dass keine personenbezogenen Formulardaten protokolliert werden

## Cookies und externe Ressourcen

- [ ] finalen Cookie-Scan nach dem Deployment durchführen
- [ ] Local Storage und Session Storage im Produktivsystem prüfen
- [ ] Netzwerkaufrufe auf Drittanbieterrequests prüfen
- [ ] lokale Auslieferung von Inter, Bildern, SVGs und Skripten bestätigen
- [ ] Entscheidung gegen ein Consent-Banner nach der Produktionsprüfung bestätigen

## Veröffentlichung

- [ ] Impressum fachlich beziehungsweise rechtlich freigeben
- [x] Betreiber, Geschäftsbezeichnung, Anschrift, Kontakt, Genehmigungsbehörde, PBefG und BOKraft technisch vorhanden
- [ ] Datenschutzerklärung fachlich beziehungsweise rechtlich freigeben
- [ ] Cookie-Information fachlich beziehungsweise rechtlich freigeben
- [ ] alle Footerlinks und Fragmentlinks auf der Produktionsdomain prüfen
- [ ] Rechtsseiten bei 390, 768, 1024 und 1440 px sowie in der Druckvorschau prüfen
- [ ] Datum und tatsächlichen technischen Stand unmittelbar vor Veröffentlichung abgleichen

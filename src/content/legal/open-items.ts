export const legalOpenItems = {
  providerInformation: [
    "Rechtsform prüfen",
    "Umsatzsteuer-ID und Wirtschafts-ID prüfen",
    "Registerangaben prüfen",
    "Nummer und genauer Umfang der vorhandenen Taxi- beziehungsweise Mietwagengenehmigung intern prüfen",
    "Verantwortlichen für Inhalte prüfen",
  ],
  privacy: [
    "Speicherdauer der E-Mail-Anfragen festlegen",
    "Logfile-Speicherdauer und Auftragsverarbeitungsvertrag bei ALL-INKL prüfen",
    "Löschkonzept und technische sowie organisatorische Maßnahmen dokumentieren",
    "Rate-Limit-Aufbewahrung im Produktivsystem verifizieren",
    "Rechtsgrundlagen und ausdrückliche Formulareinwilligung vor Veröffentlichung fachlich beziehungsweise rechtlich freigeben",
  ],
  cookies: [
    "finalen Cookie- und Storage-Scan nach Deployment durchführen",
    "Drittanbieterrequests im Produktivsystem prüfen",
    "Entscheidung gegen ein Consent-Banner nach Produktionsprüfung bestätigen",
  ],
} as const;

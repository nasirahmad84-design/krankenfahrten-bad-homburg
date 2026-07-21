export const legalOpenItems = {
  providerInformation: [
    "Rechtsform prüfen",
    "Umsatzsteuer-ID und Wirtschafts-ID prüfen",
    "Registerangaben prüfen",
    "zuständige Aufsichtsbehörde prüfen",
    "Genehmigungs- oder Konzessionsangaben prüfen",
    "Berufsrecht und branchenspezifische Pflichtangaben prüfen",
    "Verantwortlichen für Inhalte prüfen",
  ],
  privacy: [
    "Rechtsgrundlagen fachlich prüfen und freigeben",
    "Speicherdauer der E-Mail-Anfragen festlegen",
    "Logfile-Speicherdauer und Auftragsverarbeitungsvertrag bei ALL-INKL prüfen",
    "zuständige Datenschutzaufsicht prüfen",
    "Löschkonzept und technische sowie organisatorische Maßnahmen dokumentieren",
    "Rate-Limit-Aufbewahrung im Produktivsystem verifizieren",
    "Kontaktformular-Einwilligung rechtlich prüfen",
  ],
  cookies: [
    "finalen Cookie- und Storage-Scan nach Deployment durchführen",
    "Drittanbieterrequests im Produktivsystem prüfen",
    "Entscheidung gegen ein Consent-Banner nach Produktionsprüfung bestätigen",
  ],
} as const;

export const billingRequirements = [
  "Ärztliche Verordnung einer Krankenbeförderung, sofern erforderlich",
  "Vorherige Genehmigung der Krankenkasse, sofern erforderlich",
  "Versicherten- und Kontaktdaten",
  "Fahrtdaten und Anlass der Fahrt",
] as const;

export const billingSteps = [
  { title: "Unterlagen nennen", description: "Teilen Sie uns mit, welche Verordnung oder Genehmigung bereits vorliegt." },
  { title: "Voraussetzungen prüfen", description: "Die mögliche Kostenübernahme wird anhand Ihrer persönlichen Situation geklärt." },
  { title: "Abrechnung abstimmen", description: "Vor Fahrtbeginn wird geklärt, ob eine direkte Abrechnung oder Selbstzahlung vorgesehen ist." },
] as const;

export const billingFaq = [
  "Auch bei Serienfahrten können Verordnung und vorherige Genehmigung erforderlich sein.",
  "Ohne bestätigte Kostenübernahme kann eine Fahrt als Selbstzahlerleistung abgestimmt werden.",
] as const;

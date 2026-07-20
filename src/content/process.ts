export const processSteps = [
  {
    title: "Fahrt anfragen",
    description:
      "Rufen Sie uns an oder senden Sie Ihre Fahrtdaten über die Kontaktseite.",
  },
  {
    title: "Details abstimmen",
    description:
      "Wir prüfen Termin, Strecke, Wartezeit und gegebenenfalls die Voraussetzungen zur Kostenübernahme.",
  },
  {
    title: "Bestätigung erhalten",
    description:
      "Erst nach unserer ausdrücklichen Bestätigung ist die Fahrt verbindlich gebucht.",
  },
] as const;

export const fullProcessSteps = [
  { title: "Anfrage senden", description: "Teilen Sie uns die benötigten Fahrtdaten telefonisch oder über das Anfrageformular mit." },
  { title: "Fahrtdaten abstimmen", description: "Wir stimmen Abholort, Ziel, Termin, Uhrzeit und eine mögliche Rückfahrt mit Ihnen ab." },
  { title: "Voraussetzungen klären", description: "Falls eine Abrechnung angefragt wird, klären wir vorhandene Verordnung, Genehmigung und weitere Angaben." },
  { title: "Bestätigung erhalten", description: "Die Fahrt ist erst nach unserer ausdrücklichen Bestätigung verbindlich vereinbart." },
  { title: "Abholung", description: "Wir holen Sie zum bestätigten Zeitpunkt am vereinbarten Ort ab und unterstützen beim Einsteigen." },
  { title: "Fahrt zum Ziel", description: "Sie werden sitzend und ohne medizinische Betreuung zum abgestimmten Ziel gefahren." },
  { title: "Gegebenenfalls Rückfahrt", description: "Eine Rückfahrt kann vorab oder nach Absprache geplant werden und ist ebenfalls zu bestätigen." },
] as const;

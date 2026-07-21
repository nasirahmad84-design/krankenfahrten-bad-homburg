import type { LegalSectionContent } from "@/content/legal/types";

export const cookieContent = {
  eyebrow: "Cookies & Speicher",
  title: "Cookie-Einstellungen",
  description: "Informationen zu Cookies und ähnlichen Technologien auf dieser Website.",
  status: "Diese Website verwendet derzeit keine Analyse-, Marketing- oder Tracking-Cookies. Technisch erforderliche Verarbeitungen erfolgen nur, soweit sie für Betrieb, Sicherheit und die Anfragefunktion notwendig sind.",
  sections: [
    {
      id: "aktueller-status",
      title: "Aktueller Status",
      paragraphs: [
        "Die technische Prüfung der Website und des Anfrageformulars hat keine Cookies und keine Nutzung von Local Storage oder Session Storage ergeben. Deshalb ist derzeit keine Auswahl oder Einwilligung in optionale Kategorien erforderlich.",
        "Es werden keine Einstellungen im Browser gespeichert, nur um diese Information anzuzeigen. Ein Consent-Banner und funktionslose Einstellungsschalter werden bewusst nicht eingesetzt.",
      ],
    },
    {
      id: "kategorien",
      title: "Kategorien im Überblick",
      definitions: [
        { term: "Technisch erforderlich", description: "Derzeit werden keine Cookies gesetzt. Für die statische Seitendarstellung und das Anfrageformular ist keine Browser-Speicherung erforderlich." },
        { term: "Analyse", description: "Nicht verwendet." },
        { term: "Marketing", description: "Nicht verwendet." },
        { term: "Externe Medien", description: "Nicht verwendet." },
      ],
    },
    {
      id: "anfragefunktion",
      title: "Anfragefunktion und Sicherheit",
      paragraphs: [
        "Das Anfrageformular übermittelt die eingegebenen Daten per HTTPS an einen PHP-Endpunkt derselben Website. Der Missbrauchsschutz benötigt keine PHP-Session und setzt kein Cookie. Eine kurzlebige, gehashte Kennung wird ausschließlich serverseitig für das Rate Limiting verarbeitet.",
      ],
    },
    {
      id: "weitere-informationen",
      title: "Weitere Informationen",
      paragraphs: [
        "Ausführliche Angaben zur Verarbeitung beim Websiteaufruf und bei einer Fahrtanfrage finden Sie in der Datenschutzerklärung.",
      ],
    },
  ] satisfies readonly LegalSectionContent[],
} as const;

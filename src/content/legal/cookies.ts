import type { LegalSectionContent } from "@/content/legal/types";

export const cookieContent = {
  eyebrow: "Cookies & Speicher",
  title: "Cookie-Einstellungen",
  description: "Informationen zu notwendigen und optionalen Cookies auf dieser Website.",
  status: "Google Analytics wird erst geladen, wenn Sie die optionale Analyse ausdrücklich erlauben. Ohne Zustimmung werden keine Daten an Google Analytics übertragen.",
  sections: [
    {
      id: "aktueller-status",
      title: "Aktueller Status",
      paragraphs: [
        "Zur anonymisierten Reichweiten- und Nutzungsanalyse kann Google Analytics 4 eingesetzt werden. Die dafür erforderliche Verbindung zu Google und die Analytics-Cookies werden erst nach Ihrer aktiven Zustimmung aktiviert.",
        "Eine Ablehnung beeinträchtigt weder die Nutzung der Website noch die Fahrtanfrage. Ihre Auswahl kann jederzeit weiter unten geändert werden.",
      ],
    },
    {
      id: "notwendige-speicherung",
      title: "Technisch notwendige Speicherung",
      definitions: [
        { term: "kfbh_analytics_consent", description: "Speichert für 180 Tage ausschließlich, ob Sie die optionale Analyse erlaubt oder abgelehnt haben. Dadurch muss die Abfrage nicht bei jedem Seitenaufruf erneut erscheinen. Der Cookie wird von dieser Website gesetzt und ist für die Verwaltung Ihrer Auswahl erforderlich." },
      ],
    },
    {
      id: "analyse",
      title: "Optionale Analyse mit Google Analytics",
      paragraphs: [
        "Nach Ihrer Zustimmung lädt die Website das Google-Tag für die Mess-ID G-WD56RCXD03. Gemessen werden Seitenaufrufe sowie Klicks auf Telefon, WhatsApp und den Google-Rezensionslink. Eine erfolgreich übermittelte Fahrtanfrage wird als Lead gezählt.",
        "Abhol- und Zieladressen, Namen, Telefonnummern, E-Mail-Adressen, Fahrtanlässe, Freitexte und sonstige Formularinhalte werden nicht an Google Analytics übermittelt.",
      ],
      definitions: [
        { term: "_ga", description: "Optionale, pseudonyme Wiedererkennung eines Browsers für statistische Auswertungen; konfigurierte Laufzeit bis zu 180 Tage." },
        { term: "_ga_WD56RCXD03", description: "Optionale Speicherung des Sitzungszustands für diese GA4-Property; konfigurierte Laufzeit bis zu 180 Tage." },
      ],
    },
    {
      id: "weitere-kategorien",
      title: "Weitere Kategorien",
      definitions: [
        { term: "Marketing und personalisierte Werbung", description: "Nicht verwendet. Werbespeicherung, Werbenutzerdaten und Anzeigenpersonalisierung bleiben technisch auf „abgelehnt“ gesetzt." },
        { term: "Externe Medien", description: "Keine eingebetteten Karten, Videos, Social-Media-Feeds oder externen Schriftarten." },
        { term: "PHP-Session", description: "Nicht verwendet. Das Anfrageformular benötigt keine serverseitige Sitzung." },
      ],
    },
    {
      id: "auswahl-aendern",
      title: "Auswahl ändern und widerrufen",
      paragraphs: [
        "Sie können Ihre Entscheidung mit den Schaltflächen unterhalb dieser Informationen jederzeit für die Zukunft ändern. Bei einer Deaktivierung setzt die Website den Analytics-Einwilligungsstatus auf abgelehnt und entfernt vorhandene Google-Analytics-Cookies dieser Domain, soweit sie technisch erreichbar sind.",
        "Die Rechtmäßigkeit einer Verarbeitung bis zum Widerruf bleibt unberührt. Weitere Datenschutzrechte und Kontaktmöglichkeiten finden Sie in der Datenschutzerklärung.",
      ],
    },
    {
      id: "anfragefunktion",
      title: "Anfragefunktion und Sicherheit",
      paragraphs: [
        "Das Anfrageformular übermittelt die eingegebenen Daten per HTTPS an einen PHP-Endpunkt derselben Website. Der Missbrauchsschutz benötigt keine PHP-Session. Eine kurzlebige, gehashte Kennung wird ausschließlich serverseitig für das Rate Limiting verarbeitet.",
      ],
    },
  ] satisfies readonly LegalSectionContent[],
} as const;

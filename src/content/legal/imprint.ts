import type { LegalSectionContent } from "@/content/legal/types";

export const imprintContent = {
  eyebrow: "Rechtliche Informationen",
  title: "Impressum",
  description: "Sachliche Anbieterkennzeichnung der Website Krankenfahrten Bad Homburg.",
  sections: [
    {
      id: "anbieter",
      title: "Anbieterkennzeichnung",
      definitions: [
        { term: "Geschäftsbezeichnung", description: "Krankenfahrten Bad Homburg" },
        { term: "Anbieter", description: "Mubasher Ahmad" },
        { term: "Anschrift", description: "Basler Str. 3, 61352 Bad Homburg, Deutschland" },
      ],
    },
    {
      id: "kontakt",
      title: "Kontakt",
      definitions: [
        { term: "Telefon", description: "0175 4142222" },
        { term: "E-Mail", description: "anfrage@krankenfahrten-bad-homburg.de" },
      ],
    },
    {
      id: "inhalte",
      title: "Hinweise zu den Inhalten",
      paragraphs: [
        "Die Informationen auf dieser Website beschreiben das Angebot für sitzende Krankenfahrten. Sie ersetzen keine medizinische Beratung und richten sich nicht an medizinische Notfälle.",
        "Eine über das Formular übermittelte Anfrage ist noch keine bestätigte Buchung. Eine Fahrt gilt erst nach ausdrücklicher Bestätigung als vereinbart.",
      ],
    },
  ] satisfies readonly LegalSectionContent[],
} as const;

export type BlogSource = Readonly<{
  id: string;
  title: string;
  publisher: string;
  url: string;
  checkedAt: string;
}>;

export type BlogSection = Readonly<{
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  sourceIds?: readonly string[];
}>;

export type BlogFaq = Readonly<{
  question: string;
  answer: string;
}>;

export type BlogPost = Readonly<{
  slug: string;
  title: string;
  metadataTitle: string;
  description: string;
  format: "Ratgeber" | "Aktuelle Information" | "Einordnung";
  publishedAt: string;
  updatedAt: string;
  reviewedAt: string;
  readingTimeMinutes: number;
  intro: string;
  summary: readonly string[];
  sections: readonly BlogSection[];
  faqs: readonly BlogFaq[];
  sources: readonly BlogSource[];
  relatedServiceSlugs: readonly string[];
}>;

export const publishedBlogPosts: readonly BlogPost[] = [
  {
    slug: "krankenfahrt-oder-krankentransport-unterschied",
    title: "Krankenfahrt oder Krankentransport: Was ist der Unterschied?",
    metadataTitle: "Krankenfahrt oder Krankentransport? Unterschiede",
    description:
      "Eine Krankenfahrt erfolgt ohne medizinische Betreuung, ein Krankentransport mit Spezialfahrzeug. So unterscheiden sich Beförderung und Zuständigkeit.",
    format: "Ratgeber",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    reviewedAt: "2026-08-11",
    readingTimeMinutes: 5,
    intro:
      "Die Begriffe Krankenfahrt und Krankentransport werden im Alltag oft gleich verwendet. Fachlich bezeichnen sie jedoch unterschiedliche Beförderungsarten. Entscheidend ist vor allem, ob während der Fahrt eine medizinisch-fachliche Betreuung oder eine besondere Ausstattung benötigt wird.",
    summary: [
      "Eine Krankenfahrt kann mit Taxi oder Mietwagen erfolgen; eine medizinisch-fachliche Betreuung findet dabei nicht statt.",
      "Ein Krankentransport erfolgt mit einem Krankentransportfahrzeug, wenn Betreuung oder besondere Ausstattung medizinisch erforderlich ist.",
      "Welches Beförderungsmittel verordnet wird, richtet sich nach Gesundheitszustand, Gehfähigkeit und medizinischer Notwendigkeit.",
    ],
    sections: [
      {
        id: "krankenfahrt",
        title: "Was ist eine Krankenfahrt?",
        paragraphs: [
          "Die Kassenärztliche Bundesvereinigung ordnet Fahrten mit öffentlichen Verkehrsmitteln, privaten Fahrzeugen, Mietwagen oder Taxen als Krankenfahrten ein. Während einer solchen Fahrt findet keine medizinisch-fachliche Betreuung statt.",
          "Krankenfahrten Bad Homburg bietet ausschließlich planbare sitzende Krankenfahrten an. Dazu gehören keine Rollstuhl-, Tragestuhl- oder Liegendtransporte und keine medizinische Überwachung während der Fahrt.",
        ],
        sourceIds: ["KBV-KRANKENBEFOERDERUNG", "GBA-KRANKENBEFOERDERUNG"],
      },
      {
        id: "krankentransport",
        title: "Wann ist ein Krankentransport gemeint?",
        paragraphs: [
          "Ein Krankentransport nutzt ein dafür vorgesehenes Krankentransportfahrzeug. Er kann erforderlich sein, wenn unterwegs medizinisch-fachliche Betreuung, eine besondere Fahrzeugausstattung oder eine besondere Lagerung notwendig ist.",
          "Wer eine solche Betreuung oder Ausstattung benötigt, braucht einen dafür geeigneten Anbieter. Dieser Leistungsbereich gehört nicht zum Angebot von Krankenfahrten Bad Homburg.",
        ],
        sourceIds: ["KBV-KRANKENBEFOERDERUNG", "GBA-RICHTLINIE"],
      },
      {
        id: "entscheidung",
        title: "Wer legt das passende Beförderungsmittel fest?",
        paragraphs: [
          "Die Auswahl richtet sich nach dem individuellen Bedarf, dem aktuellen Gesundheitszustand und der Gehfähigkeit. Wird eine Krankenbeförderung ärztlich verordnet, erfolgt dies grundsätzlich über das Muster 4. Ob zusätzlich eine Genehmigung der Krankenkasse nötig ist, hängt vom Einzelfall und dem Behandlungsanlass ab.",
          "Wenn Sie unsicher sind, sollte der Beförderungsbedarf vor der Buchung mit der behandelnden Praxis und gegebenenfalls mit der Krankenkasse geklärt werden. Ein Fahrdienst ersetzt diese medizinische oder versicherungsrechtliche Entscheidung nicht.",
        ],
        sourceIds: ["KBV-KRANKENBEFOERDERUNG", "GBA-RICHTLINIE", "BMG-FAHRKOSTEN"],
      },
      {
        id: "vor-anfrage",
        title: "Was sollte vor einer Anfrage geklärt sein?",
        paragraphs: [
          "Für eine passende und ehrliche Abstimmung helfen wenige klare Angaben. Teilen Sie nur Informationen mit, die für die Organisation der Fahrt erforderlich sind.",
        ],
        bullets: [
          "Kann der Fahrgast während der Fahrt selbstständig sitzen?",
          "Wird medizinische Betreuung, Überwachung oder eine besondere Transportausstattung benötigt?",
          "Liegen Termin, Abholadresse und Ziel vollständig vor?",
          "Ist eine ärztliche Verordnung vorhanden und wurde eine möglicherweise nötige Genehmigung geklärt?",
          "Wird Unterstützung beim Ein- und Aussteigen oder eine Begleitung bis zur Anmeldung gewünscht?",
        ],
        sourceIds: ["KBV-KRANKENBEFOERDERUNG", "BMG-FAHRKOSTEN"],
      },
    ],
    faqs: [
      {
        question: "Ist jede Taxifahrt zu einem Arzt automatisch eine Krankenfahrt auf Kassenkosten?",
        answer:
          "Nein. Eine Fahrt zu einem medizinischen Termin wird nicht automatisch von der Krankenkasse übernommen. Medizinische Notwendigkeit, Verordnung und eine mögliche Genehmigung müssen im Einzelfall geklärt werden.",
      },
      {
        question: "Bietet Krankenfahrten Bad Homburg Krankentransporte an?",
        answer:
          "Nein. Angeboten werden ausschließlich planbare sitzende Krankenfahrten ohne medizinisch-fachliche Betreuung. Rollstuhl-, Tragestuhl- und Liegendtransporte gehören ebenfalls nicht zum Angebot.",
      },
      {
        question: "Was gilt in einem medizinischen Notfall?",
        answer:
          "In einem medizinischen Notfall ist ein planbarer Fahrdienst nicht der richtige Ansprechpartner. Wählen Sie die Notrufnummer 112.",
      },
    ],
    sources: [
      {
        id: "GBA-RICHTLINIE",
        title: "Krankentransport-Richtlinie",
        publisher: "Gemeinsamer Bundesausschuss",
        url: "https://www.g-ba.de/richtlinien/25/",
        checkedAt: "2026-08-11",
      },
      {
        id: "GBA-KRANKENBEFOERDERUNG",
        title: "Krankenbeförderung",
        publisher: "Gemeinsamer Bundesausschuss",
        url: "https://www.g-ba.de/themen/veranlasste-leistungen/krankenbefoerderung/",
        checkedAt: "2026-08-11",
      },
      {
        id: "KBV-KRANKENBEFOERDERUNG",
        title: "Krankenbeförderung",
        publisher: "Kassenärztliche Bundesvereinigung",
        url: "https://www.kbv.de/praxis/verordnungen/krankenbefoerderung",
        checkedAt: "2026-08-11",
      },
      {
        id: "BMG-FAHRKOSTEN",
        title: "Fahrkosten",
        publisher: "Bundesministerium für Gesundheit",
        url: "https://www.bundesgesundheitsministerium.de/fahrkosten",
        checkedAt: "2026-08-11",
      },
    ],
    relatedServiceSlugs: ["sitzende-krankenfahrten", "arzt-klinikfahrten"],
  },
] as const;

export const blogPostsBySlug = Object.fromEntries(
  publishedBlogPosts.map((post) => [post.slug, post]),
) as Readonly<Record<string, BlogPost>>;

validatePublishedBlogPosts(publishedBlogPosts);

function validatePublishedBlogPosts(posts: readonly BlogPost[]) {
  const slugs = new Set<string>();

  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Ungültiger Ratgeber-Slug: ${post.slug}`);
    }
    if (slugs.has(post.slug)) throw new Error(`Doppelter Ratgeber-Slug: ${post.slug}`);
    slugs.add(post.slug);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)) {
      throw new Error(`Ungültiges Ratgeber-Datum: ${post.slug}`);
    }
    if (post.sources.length < 2) throw new Error(`Zu wenige Quellen: ${post.slug}`);
    if (post.sections.length < 3) throw new Error(`Zu wenige Abschnitte: ${post.slug}`);

    const sourceIds = new Set(post.sources.map(({ id }) => id));
    if (sourceIds.size !== post.sources.length) throw new Error(`Doppelte Quellen-ID: ${post.slug}`);
    for (const section of post.sections) {
      for (const sourceId of section.sourceIds ?? []) {
        if (!sourceIds.has(sourceId)) throw new Error(`Unbekannte Quelle ${sourceId}: ${post.slug}`);
      }
    }
  }
}

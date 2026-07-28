export type RegionalLocation = Readonly<{
  slug: string;
  name: string;
  displayName: string;
  administrativeContext: string;
  description: string;
  intro: string;
  localOrientation: string;
  pickupGuidance: readonly string[];
  connections: readonly string[];
  faqs: readonly Readonly<{ question: string; answer: string }>[];
  relatedSlugs: readonly string[];
  metadataTitle: string;
  metadataDescription: string;
  sources: readonly string[];
}>;

export const regionalLocations = [
  {
    slug: "burgholzhausen",
    name: "Burgholzhausen",
    displayName: "Burgholzhausen bei Friedrichsdorf",
    administrativeContext: "Stadtteil von Friedrichsdorf",
    description: "Persönlich abgestimmte sitzende Krankenfahrten ab Burgholzhausen zu Arztpraxen, Kliniken, Therapie- und Serienterminen.",
    intro: "Burgholzhausen ist ein räumlich eigenständiger Friedrichsdorfer Stadtteil mit historischem Ortskern und gewachsenen Wohnbereichen. Für die Abholung benötigen wir deshalb die vollständige Adresse und bei schwer auffindbaren Eingängen einen eindeutigen Treffpunkt.",
    localOrientation: "Je nach Termin kann das Ziel innerhalb Friedrichsdorfs, in Bad Homburg oder an einem anderen bestätigten Behandlungsort in der Region liegen. Entscheidend sind nicht pauschale Ortszusagen, sondern die konkrete Strecke, Uhrzeit und verfügbare Kapazität.",
    pickupGuidance: [
      "Vollständige Abholadresse einschließlich Hausnummer und gegebenenfalls Gebäudeteil angeben",
      "Bei verwinkelten Straßen oder rückwärtigen Eingängen einen klaren Treffpunkt vereinbaren",
      "Benötigte Hilfe beim Ein- und Aussteigen bereits in der Anfrage beschreiben",
    ],
    connections: [
      "Einzelne Arzt- und Kliniktermine in Friedrichsdorf oder Bad Homburg",
      "Wiederkehrende Dialyse-, Therapie-, Reha- oder Bestrahlungstermine",
      "Geplante Entlassungsfahrten zurück nach Burgholzhausen",
    ],
    faqs: [
      { question: "Holen Sie direkt an einer Wohnadresse in Burgholzhausen ab?", answer: "Ja, eine Abholung an der angegebenen Adresse kann angefragt werden. Bitte nennen Sie Hausnummer, Zugang und einen geeigneten Treffpunkt. Die Fahrt wird erst nach unserer Bestätigung verbindlich." },
      { question: "Sind regelmäßige Fahrten ab Burgholzhausen möglich?", answer: "Planbare Terminserien können gesammelt angefragt werden. Wir prüfen jeden Termin nach Strecke, Uhrzeit und Verfügbarkeit und bestätigen die möglichen Fahrten ausdrücklich." },
    ],
    relatedSlugs: ["friedrichsdorf", "koeppern", "nieder-eschbach"],
    metadataTitle: "Krankenfahrten Burgholzhausen | Sitzend & persönlich",
    metadataDescription: "Sitzende Krankenfahrten ab Burgholzhausen zu Arzt, Klinik, Dialyse und Therapie – persönlich abgestimmt und erst nach Bestätigung verbindlich.",
    sources: [
      "https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/stadtteile",
      "https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/stadtteile/burgholzhausen",
    ],
  },
  {
    slug: "koeppern",
    name: "Köppern",
    displayName: "Köppern bei Friedrichsdorf",
    administrativeContext: "Stadtteil von Friedrichsdorf",
    description: "Sitzende Krankenfahrten ab Köppern für planbare Behandlungs-, Therapie- und Entlassungstermine in der Region.",
    intro: "Köppern liegt als eigener Friedrichsdorfer Stadtteil im Erlenbachtal. Ortskern, Wohnlagen und Ziele außerhalb des Stadtteils erfordern eine genaue Abstimmung von Adresse, Terminbeginn und gewünschter Unterstützung.",
    localOrientation: "Wir planen Anfragen ab Köppern anhand der tatsächlichen Abhol- und Zieladresse. Fahrten können beispielsweise nach Friedrichsdorf, Bad Homburg oder zu einem anderen vereinbarten Ziel führen; eine pauschale Zusage für jede Strecke gibt es nicht.",
    pickupGuidance: [
      "Ortsteil Köppern und vollständige Straße nennen, um Verwechslungen innerhalb Friedrichsdorfs zu vermeiden",
      "Bei Einrichtungen den konkreten Eingang oder vereinbarten Abholbereich mitteilen",
      "Für Rückfahrten die voraussichtliche Endzeit möglichst früh angeben",
    ],
    connections: [
      "Planbare Fahrten zu Arztpraxen und ambulanten Einrichtungen",
      "Abgestimmte Einzel- oder Serienfahrten zu Dialyse, Therapie und Reha",
      "Rückfahrten nach Entlassungen oder abgeschlossenen Behandlungen",
    ],
    faqs: [
      { question: "Kann ich eine Hin- und Rückfahrt ab Köppern anfragen?", answer: "Ja. Geben Sie Terminbeginn und voraussichtliches Ende an. Hin- und Rückfahrt werden getrennt nach Verfügbarkeit geprüft und ausdrücklich bestätigt." },
      { question: "Fahren Sie von Köppern auch nach Bad Homburg?", answer: "Eine konkrete Fahrt nach Bad Homburg kann angefragt werden. Ob sie möglich ist, hängt von Adresse, Terminzeit, Unterstützungsbedarf und verfügbarer Kapazität ab." },
    ],
    relatedSlugs: ["friedrichsdorf", "burgholzhausen", "oberursel"],
    metadataTitle: "Krankenfahrten Köppern | Sitzende Beförderung",
    metadataDescription: "Sitzende Krankenfahrten ab Köppern für Arzt-, Klinik-, Dialyse- und Therapietermine, mit persönlicher Abstimmung und klarer Bestätigung.",
    sources: [
      "https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/stadtteile",
      "https://m.friedrichsdorf.de/lebeninfriedrichsdorf/unserestadt/geschichte/stadtundstadtteile/koeppern.php",
    ],
  },
  {
    slug: "friedrichsdorf",
    name: "Friedrichsdorf",
    displayName: "Friedrichsdorf",
    administrativeContext: "Nachbarstadt von Bad Homburg",
    description: "Persönliche sitzende Krankenfahrten ab Friedrichsdorf und seinen Stadtteilen zu planbaren medizinischen Terminen.",
    intro: "Friedrichsdorf besteht aus den Stadtteilen Friedrichsdorf, Köppern, Burgholzhausen und Seulberg. Damit wir die Abholung zuverlässig einordnen können, sollte neben der Straße immer auch der Stadtteil genannt werden.",
    localOrientation: "Anfragen können sowohl Ziele innerhalb Friedrichsdorfs als auch Behandlungsorte in Bad Homburg und der umliegenden Region betreffen. Wir prüfen die konkrete Verbindung anhand der vollständigen Fahrtdaten statt mit einem pauschalen Orts- oder Radiusversprechen.",
    pickupGuidance: [
      "Stadtteil, Straße, Hausnummer und gegebenenfalls Gebäudeteil vollständig angeben",
      "Bei Adressen rund um Zentrum oder Hugenottenstraße den erreichbaren Eingang beziehungsweise Treffpunkt nennen",
      "Terminserien mit wiederkehrenden Adressen und Uhrzeiten möglichst gesammelt übermitteln",
    ],
    connections: [
      "Fahrten zwischen Friedrichsdorfer Wohnlagen und regionalen Arzt- oder Klinikzielen",
      "Regelmäßige Termine für Dialyse, Therapie, Reha oder Bestrahlung",
      "Geplante Abholung nach einer Entlassung mit Rückfahrt nach Friedrichsdorf",
    ],
    faqs: [
      { question: "Gilt die Seite auch für Köppern und Burgholzhausen?", answer: "Ja, beide gehören zu Friedrichsdorf. Für die lokale Planung gibt es zusätzlich eigene Hinweise. Nennen Sie in der Anfrage immer den konkreten Stadtteil und die vollständige Adresse." },
      { question: "Sind Fahrten zwischen Friedrichsdorf und Bad Homburg möglich?", answer: "Solche Fahrten können angefragt werden. Die Durchführung hängt von der konkreten Strecke, dem Termin und unserer Verfügbarkeit ab und wird ausdrücklich bestätigt." },
    ],
    relatedSlugs: ["burgholzhausen", "koeppern", "oberursel"],
    metadataTitle: "Krankenfahrten Friedrichsdorf | Persönlich geplant",
    metadataDescription: "Sitzende Krankenfahrten ab Friedrichsdorf und seinen Stadtteilen zu Arzt, Klinik, Dialyse oder Therapie – individuell geprüft und bestätigt.",
    sources: [
      "https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/stadtteile",
      "https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/stadtteile/gesamtstadt-friedrichsdorf",
    ],
  },
  {
    slug: "oberursel",
    name: "Oberursel",
    displayName: "Oberursel (Taunus)",
    administrativeContext: "Direkte Nachbarstadt von Bad Homburg",
    description: "Sitzende Krankenfahrten ab Oberursel zu planbaren Arzt-, Klinik-, Dialyse-, Therapie- und Rehaterminen.",
    intro: "Oberursel und Bad Homburg liegen unmittelbar nebeneinander und sind regional eng verbunden. Da Oberursel aus Kernstadt und mehreren Stadtteilen besteht, sind Stadtteil und vollständige Abholadresse für die Planung besonders wichtig.",
    localOrientation: "Mögliche Ziele können in Oberursel selbst, in Bad Homburg oder an einem anderen abgestimmten Behandlungsort liegen. Wir versprechen keine festen Fahrtzeiten, sondern stimmen Termin, Zugang, Rückfahrt und Unterstützung individuell ab.",
    pickupGuidance: [
      "Kernstadt oder Stadtteil zusammen mit der vollständigen Adresse nennen",
      "In Altstadt- oder Innenstadtlagen einen gut erreichbaren Eingang beziehungsweise Treffpunkt abstimmen",
      "Bei mehreren Terminen wiederkehrende Abhol- und Zieladressen gesammelt angeben",
    ],
    connections: [
      "Regionale Arzt- und Klinikfahrten zwischen Oberursel und Bad Homburg",
      "Planbare Einzel- und Serienfahrten innerhalb des Hochtaunus-Umfelds",
      "Entlassungsfahrten zu einer bestätigten Wohn- oder Zieladresse in Oberursel",
    ],
    faqs: [
      { question: "Fahren Sie in allen Oberurseler Stadtteilen?", answer: "Eine Fahrt aus der Kernstadt oder einem Stadtteil kann angefragt werden. Bitte nennen Sie die genaue Adresse; die mögliche Durchführung bestätigen wir nach individueller Prüfung." },
      { question: "Kann die Rückfahrt aus Bad Homburg direkt mitgeplant werden?", answer: "Ja. Teilen Sie die voraussichtliche Endzeit mit. Die Rückfahrt wird separat geprüft und ist erst nach ausdrücklicher Bestätigung vereinbart." },
    ],
    relatedSlugs: ["friedrichsdorf", "frankfurt-riedberg", "kalbach"],
    metadataTitle: "Krankenfahrten Oberursel | Sitzend & zuverlässig",
    metadataDescription: "Sitzende Krankenfahrten ab Oberursel zu Arzt, Klinik, Dialyse und Therapie in der Region – persönlich abgestimmt und ausdrücklich bestätigt.",
    sources: [
      "https://www.oberursel.de/de/rathaus/stadtportrait/oberursel-taunus/",
      "https://www.oberursel.de/de/presse-artikel/2025-05/interkommunale-verknuepfung-mit-fuss-und-fahrrad-staerken/",
    ],
  },
  {
    slug: "frankfurt-riedberg",
    name: "Frankfurt-Riedberg",
    displayName: "Frankfurt-Riedberg",
    administrativeContext: "Wohnquartier im Stadtteil Kalbach-Riedberg",
    description: "Sitzende Krankenfahrten ab Frankfurt-Riedberg für planbare Termine in Frankfurt, Bad Homburg und der Region.",
    intro: "Riedberg ist ein großes, modernes Wohnquartier im Frankfurter Stadtteil Kalbach-Riedberg. Unterschiedliche Quartiere, Neubauadressen und Gebäudeeingänge machen präzise Abholangaben wichtiger als eine allgemeine Ortsbezeichnung.",
    localOrientation: "Wir prüfen Fahrten ab Riedberg zu bestätigten Arzt-, Klinik- oder Therapiezielen in Frankfurt, Bad Homburg und der näheren Region. Die konkrete Möglichkeit richtet sich nach Strecke, Uhrzeit und Unterstützungsbedarf.",
    pickupGuidance: [
      "Straße, Hausnummer, Quartier und erreichbaren Gebäudeeingang vollständig nennen",
      "Bei größeren Wohnanlagen Hinweise zu Zufahrt, Innenhof oder Abholpunkt ergänzen",
      "Rückfahrt und mögliche Wartezeit nicht voraussetzen, sondern separat abstimmen",
    ],
    connections: [
      "Planbare Behandlungsfahrten innerhalb des Frankfurter Nordens",
      "Arzt- und Kliniktermine in Bad Homburg oder anderen bestätigten Zielen",
      "Wiederkehrende Dialyse-, Therapie- oder Rehatermine",
    ],
    faqs: [
      { question: "Holen Sie an Wohnanlagen auf dem Riedberg ab?", answer: "Eine Abholung kann angefragt werden. Bei größeren Anlagen benötigen wir den erreichbaren Eingang oder einen eindeutig vereinbarten Treffpunkt." },
      { question: "Ist Riedberg dasselbe Einsatzgebiet wie Kalbach?", answer: "Beide gehören administrativ zum Stadtteil Kalbach-Riedberg, haben aber unterschiedliche Ortslagen. Deshalb führen wir getrennte Abholhinweise und benötigen immer die genaue Adresse." },
    ],
    relatedSlugs: ["kalbach", "nieder-eschbach", "oberursel"],
    metadataTitle: "Krankenfahrten Frankfurt-Riedberg | Sitzend",
    metadataDescription: "Sitzende Krankenfahrten ab Frankfurt-Riedberg zu planbaren Arzt-, Klinik- und Therapieterminen – mit genauer Abholung und Bestätigung.",
    sources: [
      "https://frankfurt.de/frankfurt-entdecken-und-erleben/stadtportrait/stadtteile/kalbach-riedberg",
      "https://frankfurt.de/frankfurt-entdecken-und-erleben/stadtportrait/versteckte-orte/historische-orte/bonifatiusbrunnen",
    ],
  },
  {
    slug: "frankfurt-bonames",
    name: "Frankfurt-Bonames",
    displayName: "Frankfurt-Bonames",
    administrativeContext: "Stadtteil im Frankfurter Norden",
    description: "Persönlich abgestimmte sitzende Krankenfahrten ab Bonames zu planbaren Behandlungs- und Therapieterminen.",
    intro: "Bonames verbindet einen kleinräumigen, dörflich geprägten Ortskern mit überwiegender Wohnnutzung. Enge Straßenabschnitte und unterschiedliche Zugänge können einen vorher vereinbarten Abholpunkt sinnvoll machen.",
    localOrientation: "Fahrten ab Bonames können zu bestätigten Zielen im Frankfurter Norden, nach Bad Homburg oder in die umliegende Region angefragt werden. Wir stimmen die tatsächliche Route und den geeigneten Treffpunkt individuell ab.",
    pickupGuidance: [
      "Vollständige Adresse und bei engen Straßen einen gut erreichbaren Treffpunkt angeben",
      "Besondere Zugangssituationen, Stufen oder rückwärtige Eingänge vorher mitteilen",
      "Für Entlassungsfahrten den Abholbereich der Einrichtung und die Zieladresse getrennt nennen",
    ],
    connections: [
      "Arzt- und Therapietermine im Frankfurter Norden",
      "Planbare Termine in Bad Homburg oder an anderen bestätigten Behandlungsorten",
      "Hin- und Rückfahrten sowie Terminserien nach individueller Abstimmung",
    ],
    faqs: [
      { question: "Was ist bei einer engen Straße im Bonameser Ortskern wichtig?", answer: "Nennen Sie uns die genaue Adresse und einen erreichbaren Treffpunkt. Falls eine direkte Vorfahrt nicht möglich ist, stimmen wir eine geeignete Alternative mit Ihnen ab." },
      { question: "Kann eine regelmäßige Therapiefahrt ab Bonames geplant werden?", answer: "Ja, wiederkehrende Termine können gesammelt angefragt werden. Die einzelnen Fahrten bleiben von Verfügbarkeit und ausdrücklicher Bestätigung abhängig." },
    ],
    relatedSlugs: ["nieder-eschbach", "kalbach", "frankfurt-riedberg"],
    metadataTitle: "Krankenfahrten Frankfurt-Bonames | Persönlich",
    metadataDescription: "Sitzende Krankenfahrten ab Frankfurt-Bonames zu Arzt, Klinik, Dialyse oder Therapie – mit abgestimmtem Treffpunkt und Bestätigung.",
    sources: [
      "https://frankfurt.de/aktuelle-meldung/strassenverkehrsamt/36_fussverkehrsstrategie/",
      "https://frankfurt.de/frankfurt-entdecken-und-erleben/stadtportrait/versteckte-orte/orte-der-industriegeschichte/nidda-bruecke",
    ],
  },
  {
    slug: "nieder-eschbach",
    name: "Nieder-Eschbach",
    displayName: "Frankfurt-Nieder-Eschbach",
    administrativeContext: "Nördlicher Frankfurter Stadtteil",
    description: "Sitzende Krankenfahrten ab Nieder-Eschbach zu Arzt-, Klinik-, Dialyse-, Therapie- und Entlassungsterminen.",
    intro: "Nieder-Eschbach umfasst einen dörflich geprägten Ortskern, die Wohnsiedlung Am Bügel und größere Gewerbebereiche. Die genaue Ortslage ist deshalb für eine eindeutige Abholung unverzichtbar.",
    localOrientation: "Durch die Lage im Frankfurter Norden können Termine sowohl in Frankfurt als auch in Bad Homburg oder an anderen abgestimmten Zielen relevant sein. Wir prüfen jede Anfrage anhand der tatsächlichen Adressen und Zeiten.",
    pickupGuidance: [
      "Ortskern, Am Bügel oder Gewerbebereich zusammen mit der vollständigen Adresse angeben",
      "Bei größeren Einrichtungen den konkreten Eingang oder Abholbereich nennen",
      "Telefonische Erreichbarkeit rund um den vereinbarten Abholzeitpunkt sicherstellen",
    ],
    connections: [
      "Planbare Fahrten zwischen Nieder-Eschbach und Bad Homburg",
      "Behandlungstermine im Frankfurter Norden und weiteren bestätigten Zielen",
      "Regelmäßige Terminserien oder geplante Entlassungsfahrten",
    ],
    faqs: [
      { question: "Warum muss ich die genaue Ortslage in Nieder-Eschbach nennen?", answer: "Ortskern, Am Bügel und Gewerbebereiche liegen räumlich unterschiedlich. Eine vollständige Adresse verhindert Missverständnisse und ermöglicht eine realistische Planung." },
      { question: "Kann ich eine Fahrt nach Bad Homburg anfragen?", answer: "Ja. Bitte übermitteln Sie Abholadresse, Ziel, Terminzeit und Unterstützungsbedarf. Wir prüfen die Fahrt und bestätigen sie bei Verfügbarkeit ausdrücklich." },
    ],
    relatedSlugs: ["frankfurt-bonames", "kalbach", "burgholzhausen"],
    metadataTitle: "Krankenfahrten Nieder-Eschbach | Persönlich",
    metadataDescription: "Sitzende Krankenfahrten ab Nieder-Eschbach für planbare Arzt-, Klinik- und Therapietermine – mit genauer Adresse und Bestätigung.",
    sources: [
      "https://frankfurt.de/frankfurt-entdecken-und-erleben/stadtportrait/stadtteile/nieder-eschbach",
      "https://frankfurt.de/service-und-rathaus/stadtpolitik/ortsbeiraete/ortsbeirat-15/",
    ],
  },
  {
    slug: "kalbach",
    name: "Kalbach",
    displayName: "Frankfurt-Kalbach",
    administrativeContext: "Ortslage im Stadtteil Kalbach-Riedberg",
    description: "Sitzende Krankenfahrten ab Frankfurt-Kalbach zu planbaren Behandlungs-, Therapie- und Serienterminen.",
    intro: "Kalbach bildet die historisch gewachsene Ortslage innerhalb des Frankfurter Stadtteils Kalbach-Riedberg. Für die Abholung unterscheiden wir sie klar vom neueren Riedberg und benötigen die vollständige Adresse.",
    localOrientation: "Anfragen ab Kalbach können Ziele im Frankfurter Norden, in Bad Homburg oder an einem anderen bestätigten Ort betreffen. Strecke und Termin werden einzeln geprüft; die Zugehörigkeit zum regionalen Cluster ist keine automatische Beförderungszusage.",
    pickupGuidance: [
      "Kalbach ausdrücklich als Ortslage nennen und nicht nur Kalbach-Riedberg angeben",
      "Straße, Hausnummer und gegebenenfalls einen gut erreichbaren Treffpunkt übermitteln",
      "Bei Serienfahrten alle Terminzeiten und möglichen Rückfahrten vorab zusammenstellen",
    ],
    connections: [
      "Arzt-, Klinik- und Therapietermine im Frankfurter Norden",
      "Planbare Fahrten zu bestätigten Zielen in Bad Homburg",
      "Wiederkehrende Dialyse-, Reha- oder Bestrahlungstermine",
    ],
    faqs: [
      { question: "Warum gibt es getrennte Seiten für Kalbach und Riedberg?", answer: "Beide gehören zum Stadtteil Kalbach-Riedberg, sind aber unterschiedliche Ortslagen. Getrennte Hinweise erleichtern eine eindeutige Abholung und vermeiden Adressmissverständnisse." },
      { question: "Sind Rückfahrten nach Kalbach möglich?", answer: "Eine Rückfahrt kann zusammen mit der Hinfahrt oder separat angefragt werden. Sie wird nach Endzeit und Verfügbarkeit geprüft und ausdrücklich bestätigt." },
    ],
    relatedSlugs: ["frankfurt-riedberg", "nieder-eschbach", "frankfurt-bonames"],
    metadataTitle: "Krankenfahrten Frankfurt-Kalbach | Sitzend",
    metadataDescription: "Sitzende Krankenfahrten ab Frankfurt-Kalbach zu Arzt, Klinik, Dialyse und Therapie – individuell abgestimmt und ausdrücklich bestätigt.",
    sources: [
      "https://frankfurt.de/frankfurt-entdecken-und-erleben/stadtportrait/stadtteile/kalbach-riedberg",
      "https://frankfurt.de/themen/umwelt-und-gruen/orte/stadtgewaesser/baeche-und-graeben/kalbach",
    ],
  },
] as const satisfies readonly RegionalLocation[];

export const locationsBySlug = Object.fromEntries(
  regionalLocations.map((location) => [location.slug, location]),
) as Readonly<Record<string, RegionalLocation>>;

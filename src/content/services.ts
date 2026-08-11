export type ServiceFaq = Readonly<{ question: string; answer: string }>;
export type ServiceProcessStep = Readonly<{ title: string; description: string }>;

export type Service = Readonly<{
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  intro: string;
  suitableFor: readonly string[];
  typicalDestinations: readonly string[];
  supportItems: readonly string[];
  processSteps: readonly ServiceProcessStep[];
  billingNote?: string;
  serviceNote?: string;
  faqs: readonly ServiceFaq[];
  relatedServiceSlugs: readonly string[];
  metadataTitle: string;
  metadataDescription: string;
  icon: string;
  ctaTitle: string;
  ctaText: string;
}>;

export const commonServiceLimits = [
  "Ausschließlich Beförderung von Fahrgästen, die während der Fahrt sitzen können",
  "Keine Rollstuhl-, Tragestuhl- oder Liegendtransporte",
  "Keine medizinische Betreuung oder medizinische Überwachung",
] as const;

const commonSupport = [
  "Persönliche Abholung an der abgestimmten Adresse",
  "Hilfe beim Ein- und Aussteigen",
  "Begleitung bis zur Anmeldung, zum Empfang oder vereinbarten Ziel nach Absprache",
] as const;

export const allServices: readonly Service[] = [
  {
    slug: "sitzende-krankenfahrten",
    title: "Sitzende Krankenfahrten",
    shortTitle: "Sitzende Krankenfahrten",
    eyebrow: "Grundlage unserer Leistungen",
    description: "Persönlich abgestimmte Beförderung für Fahrgäste, die während der gesamten Fahrt sitzen können.",
    intro: "Wir holen Sie an der vereinbarten Adresse ab und bringen Sie sitzend zum abgestimmten Ziel. Eine Hin- und Rückfahrt sowie eine Begleitung bis zur Anmeldung oder zum Empfang können vorab vereinbart werden.",
    suitableFor: ["Fahrgäste, die selbstständig oder mit vereinbarter Hilfe ein- und aussteigen können", "Einzelne oder wiederkehrende planbare Termine", "Hin- und Rückfahrten, deren Zeiten vorab abgestimmt werden können"],
    typicalDestinations: ["Arztpraxen und Facharztpraxen", "Kliniken und ambulante Einrichtungen", "Dialyse-, Therapie- und Rehabilitationseinrichtungen"],
    supportItems: [...commonSupport, "Abgestimmte Hin- und Rückfahrt"],
    processSteps: [
      { title: "Fahrtdaten senden", description: "Abholadresse, Ziel, Termin und gewünschten Unterstützungsumfang mitteilen." },
      { title: "Details abstimmen", description: "Hin- und Rückfahrt sowie mögliche Begleitung gemeinsam festlegen." },
      { title: "Bestätigung abwarten", description: "Die Fahrt ist erst nach unserer ausdrücklichen Bestätigung verbindlich." },
    ],
    serviceNote: "Alle Fahrten erfolgen nach Verfügbarkeit. Kurzfristige Anfragen können nur nach individueller Abstimmung bestätigt werden.",
    faqs: [
      { question: "Kann eine Rückfahrt vereinbart werden?", answer: "Ja. Eine Rückfahrt kann vorab abgestimmt werden und muss wie die Hinfahrt ausdrücklich bestätigt sein." },
      { question: "Ist eine Anfrage bereits verbindlich?", answer: "Nein. Die Anfrage ist zunächst unverbindlich. Erst unsere ausdrückliche Bestätigung begründet die Vereinbarung." },
      { question: "Welche Beförderungsarten werden nicht angeboten?", answer: "Wir bieten keine Rollstuhl-, Tragestuhl- oder Liegendtransporte und keine medizinische Betreuung oder Überwachung an." },
    ],
    relatedServiceSlugs: ["arzt-klinikfahrten", "reha-therapiefahrten", "serienfahrten"],
    metadataTitle: "Sitzende Krankenfahrten Bad Homburg",
    metadataDescription: "Sitzende Krankenfahrten in Bad Homburg mit persönlicher Abholung, Einstiegshilfe und abgestimmter Hin- und Rückfahrt nach Bestätigung.",
    icon: "/service-icons/arztfahrt.svg",
    ctaTitle: "Sitzende Krankenfahrt abstimmen",
    ctaText: "Senden Sie Ihre Fahrtdaten unverbindlich oder rufen Sie an. Die Durchführung erfolgt nach Verfügbarkeit und ausdrücklicher Bestätigung.",
  },
  {
    slug: "arzt-klinikfahrten",
    title: "Arzt- und Klinikfahrten",
    shortTitle: "Arzt und Klinik",
    eyebrow: "Planbare Termine",
    description: "Sitzende Fahrten zu ambulanten Arztterminen, Untersuchungen und geplanten Klinikterminen.",
    intro: "Wir stimmen Abholung und Zieladresse für ambulante Termine, Facharzttermine, Untersuchungen, Nachsorge oder eine geplante Aufnahme mit Ihnen ab. Eine Rückfahrt oder Wartezeit muss vorab individuell vereinbart werden.",
    suitableFor: ["Ambulante Arzt- und Facharzttermine", "Untersuchungen, Nachsorge und geplante Kliniktermine", "Geplante Aufnahmen für sitzende Fahrgäste"],
    typicalDestinations: ["Haus- und Facharztpraxen", "Ambulante Untersuchungsstellen", "Klinikaufnahme, Anmeldung oder Empfang"],
    supportItems: [...commonSupport, "Hin- und Rückfahrt nach vorheriger Absprache"],
    processSteps: [
      { title: "Termin mitteilen", description: "Terminzeit, Abholort, Ziel und gewünschte Rückfahrt angeben." },
      { title: "Zeiten abstimmen", description: "Abholung, Übergabepunkt und gegebenenfalls Rückfahrt individuell vereinbaren." },
      { title: "Fahrt bestätigen", description: "Erst die ausdrückliche Bestätigung macht die Fahrten verbindlich." },
    ],
    serviceNote: "Wir begleiten nicht während der Behandlung und können keine pauschale Wartezeit vor Ort zusagen. Rückfahrt und Wartezeit werden individuell abgestimmt.",
    faqs: [
      { question: "Wird während der Behandlung gewartet?", answer: "Eine Wartezeit wird nicht pauschal zugesagt. Bitte teilen Sie den voraussichtlichen Zeitraum mit, damit Hin- und Rückfahrt individuell abgestimmt werden können." },
      { question: "Begleiten Sie bis zur Anmeldung?", answer: "Nach Absprache begleiten wir Sie bis zur Anmeldung, zum Empfang oder einem vereinbarten Übergabepunkt." },
      { question: "Kann die Rückfahrt später festgelegt werden?", answer: "Das ist nur nach vorheriger Abstimmung und verfügbarer Kapazität möglich. Auch die Rückfahrt benötigt eine ausdrückliche Bestätigung." },
    ],
    relatedServiceSlugs: ["entlassungsfahrten", "reha-therapiefahrten", "sitzende-krankenfahrten"],
    metadataTitle: "Arzt- & Klinikfahrten Bad Homburg",
    metadataDescription: "Sitzende Arzt- und Klinikfahrten in Bad Homburg für ambulante Termine, Untersuchungen und geplante Aufnahmen nach Abstimmung.",
    icon: "/service-icons/krankenhausfahrt.svg",
    ctaTitle: "Fahrt zum Arzt oder zur Klinik anfragen",
    ctaText: "Teilen Sie uns Termin, Abholort und gewünschte Rückfahrt mit. Ihre Anfrage wird erst nach ausdrücklicher Bestätigung verbindlich.",
  },
  {
    slug: "dialysefahrten",
    title: "Dialysefahrten",
    shortTitle: "Dialysefahrten",
    eyebrow: "Wiederkehrende Termine",
    description: "Planbare sitzende Hin- und Rückfahrten zu regelmäßig wiederkehrenden Dialyseterminen.",
    intro: "Wiederkehrende Abholzeiten und Zieladressen können als Terminserie organisiert werden. Änderungen der Behandlungszeit sollten möglichst früh mitgeteilt werden, damit jede Fahrt neu abgestimmt werden kann.",
    suitableFor: ["Regelmäßig wiederkehrende Dialysetermine", "Planbare Abholzeiten und Zieladressen", "Sitzende Fahrgäste ohne medizinischen Betreuungsbedarf während der Fahrt"],
    typicalDestinations: ["Dialysepraxen", "Dialysezentren", "Ambulante Dialyseabteilungen in Kliniken"],
    supportItems: [...commonSupport, "Abgestimmte Hin- und Rückfahrten als mögliche Terminserie"],
    processSteps: [
      { title: "Terminserie angeben", description: "Wochentage, Behandlungszeiten, Adressen und Rückfahrtbedarf mitteilen." },
      { title: "Fahrten planen", description: "Wiederkehrende Zeiten und mögliche Abweichungen gemeinsam abstimmen." },
      { title: "Termine bestätigen", description: "Jede Fahrt bleibt von Verfügbarkeit und ausdrücklicher Bestätigung abhängig." },
    ],
    billingNote: "Je nach persönlicher Voraussetzung kann eine Verordnung oder Genehmigung erforderlich und eine Abrechnung mit der Krankenkasse möglich sein. Die Kostenübernahme muss im Einzelfall geklärt werden.",
    serviceNote: "Eine Terminserie erleichtert die Planung, garantiert aber keine tägliche Kapazität. Änderungen bitte möglichst früh mitteilen.",
    faqs: [
      { question: "Sind regelmäßige Dialysefahrten möglich?", answer: "Regelmäßige Termine können als Serie abgestimmt werden. Jeder Termin bleibt von Verfügbarkeit und ausdrücklicher Bestätigung abhängig." },
      { question: "Was passiert bei einer Terminänderung?", answer: "Bitte teilen Sie geänderte Behandlungszeiten möglichst früh mit. Wir prüfen anschließend, ob die angepasste Fahrt bestätigt werden kann." },
      { question: "Ist eine Krankenkassenabrechnung möglich?", answer: "Das kann je nach persönlicher Voraussetzung, Verordnung und Genehmigung möglich sein. Eine Kostenübernahme muss individuell geklärt werden." },
    ],
    relatedServiceSlugs: ["serienfahrten", "sitzende-krankenfahrten", "reha-therapiefahrten"],
    metadataTitle: "Dialysefahrten Bad Homburg",
    metadataDescription: "Sitzende Dialysefahrten in Bad Homburg mit planbaren Abholzeiten und abgestimmten Hin- und Rückfahrten nach Bestätigung.",
    icon: "/service-icons/dialysefahrt.svg",
    ctaTitle: "Dialysefahrten persönlich planen",
    ctaText: "Senden Sie die wiederkehrenden Termine unverbindlich. Wir prüfen die Verfügbarkeit und bestätigen die einzelnen Fahrten ausdrücklich.",
  },
  {
    slug: "chemo-strahlentherapiefahrten",
    title: "Chemo- und Strahlentherapiefahrten",
    shortTitle: "Chemo und Strahlentherapie",
    eyebrow: "Abgestimmte Terminserien",
    description: "Ruhige und respektvolle sitzende Beförderung zu wiederkehrenden Behandlungsterminen.",
    intro: "Wir stimmen persönliche Abholung, Zieladresse und mögliche Rückfahrt für einzelne oder wiederkehrende Termine ab. Änderungen sollten möglichst früh mitgeteilt werden.",
    suitableFor: ["Wiederkehrende Chemo- oder Strahlentherapietermine", "Im Voraus planbare Einzel- und Terminserien", "Fahrgäste, die während der Fahrt sitzen können"],
    typicalDestinations: ["Ambulante Behandlungszentren", "Strahlentherapeutische Einrichtungen", "Kliniken und medizinische Versorgungszentren"],
    supportItems: [...commonSupport, "Respektvolle Beförderung und Rückfahrt nach Absprache"],
    processSteps: [
      { title: "Termine mitteilen", description: "Behandlungstermine, Adressen und gewünschten Rückfahrtbedarf angeben." },
      { title: "Serie abstimmen", description: "Abholzeiten und Änderungen möglichst früh gemeinsam koordinieren." },
      { title: "Fahrten bestätigen", description: "Nur ausdrücklich bestätigte Einzeltermine sind verbindlich vereinbart." },
    ],
    billingNote: "Je nach persönlicher Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Verordnung, Genehmigung und Kostenübernahme müssen individuell geklärt werden.",
    serviceNote: "Wir leisten keine medizinische oder pflegerische Betreuung, bewerten keine Fahrtüchtigkeit und begleiten nicht während der Behandlung. Bei akuten Beschwerden oder Notfällen kontaktieren Sie 112 beziehungsweise das medizinische Personal.",
    faqs: [
      { question: "Können mehrere Behandlungstermine gemeinsam geplant werden?", answer: "Ja. Eine Terminserie kann im Voraus abgestimmt werden. Einzelne Fahrten werden erst durch unsere ausdrückliche Bestätigung verbindlich." },
      { question: "Wird während der Behandlung betreut oder gewartet?", answer: "Wir übernehmen keine Betreuung während der Behandlung. Eine mögliche Rückfahrt oder Wartezeit muss individuell vereinbart und bestätigt werden." },
      { question: "Was ist bei akuten Beschwerden zu tun?", answer: "Wir sind kein medizinischer Notfalldienst. Bitte kontaktieren Sie bei akuten Beschwerden das medizinische Personal oder wählen Sie in einem Notfall 112." },
    ],
    relatedServiceSlugs: ["serienfahrten", "sitzende-krankenfahrten", "dialysefahrten"],
    metadataTitle: "Chemo- & Strahlentherapiefahrten Bad Homburg",
    metadataDescription: "Sitzende Fahrten zu Chemo- und Strahlentherapieterminen in Bad Homburg, persönlich abgestimmt und nach Bestätigung.",
    icon: "/service-icons/therapiefahrt.svg",
    ctaTitle: "Behandlungstermine abstimmen",
    ctaText: "Teilen Sie uns Ihre Termine unverbindlich mit. Änderungen und Rückfahrten stimmen wir nach Verfügbarkeit individuell ab.",
  },
  {
    slug: "reha-therapiefahrten",
    title: "Reha- und Therapiefahrten",
    shortTitle: "Reha und Therapie",
    eyebrow: "Einzel- und Serienfahrten",
    description: "Sitzende Reha- und Therapiefahrten in Bad Homburg zu Rehabilitation, Physiotherapie, Ergotherapie und ambulanten Therapieeinrichtungen.",
    intro: "Planbare Einzeltermine und wiederkehrende Terminserien können mit abgestimmter Hin- und Rückfahrt organisiert werden. Auch eine Heim- oder Rückfahrt nach einem Reha- oder Therapietermin am Wochenende kann angefragt werden. Unser Fahrdienst übernimmt die Beförderung und vereinbarte persönliche Unterstützung, nicht die therapeutische Betreuung.",
    suitableFor: ["Physiotherapie und Ergotherapie", "Ambulante Rehabilitation", "Planbare Einzeltermine, wiederkehrende Therapieserien und bestätigte Wochenendfahrten"],
    typicalDestinations: ["Physio- und Ergotherapiepraxen", "Ambulante Rehabilitationseinrichtungen", "Weitere abgestimmte Therapieeinrichtungen"],
    supportItems: [...commonSupport, "Abgestimmte Hin- und Rückfahrt für Einzel- oder Serientermine"],
    processSteps: [
      { title: "Termine anfragen", description: "Einzeltermin oder Terminserie mit Adressen und Uhrzeiten übermitteln." },
      { title: "Unterstützung klären", description: "Abholung, Einstiegshilfe und Rückfahrt gemeinsam abstimmen." },
      { title: "Bestätigung erhalten", description: "Die angefragten Termine gelten erst nach Bestätigung als vereinbart." },
    ],
    billingNote: "Je nach persönlicher Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Ob eine Verordnung oder Genehmigung erforderlich ist, muss individuell geklärt werden.",
    serviceNote: "Wir bieten keine medizinische Begleitung und keine Unterstützung bei der Therapie selbst. Unsere Leistung endet bei der vereinbarten Beförderung und persönlichen Hilfe rund um die Fahrt.",
    faqs: [
      { question: "Sind regelmäßige Therapiefahrten möglich?", answer: "Ja. Planbare Termine können als Serie angefragt werden. Jeder Termin muss verfügbar sein und ausdrücklich bestätigt werden." },
      { question: "Sind Reha-Heimfahrten am Wochenende möglich?", answer: "Eine sitzende Heim- oder Rückfahrt am Wochenende kann angefragt werden. Sie ist nur nach Verfügbarkeit und unserer ausdrücklichen Bestätigung möglich." },
      { question: "Unterstützen Sie während der Therapie?", answer: "Nein. Wir übernehmen die Beförderung und vereinbarte Hilfe rund um die Fahrt, jedoch keine therapeutische oder medizinische Betreuung." },
      { question: "Kann eine Rückfahrt vereinbart werden?", answer: "Ja. Teilen Sie die voraussichtliche Endzeit möglichst früh mit. Die Rückfahrt wird individuell abgestimmt und bestätigt." },
    ],
    relatedServiceSlugs: ["serienfahrten", "arzt-klinikfahrten", "sitzende-krankenfahrten"],
    metadataTitle: "Reha- & Therapiefahrten Bad Homburg",
    metadataDescription: "Sitzende Reha- und Therapiefahrten in Bad Homburg für Einzel-, Serien- und mögliche Wochenendtermine nach persönlicher Bestätigung.",
    icon: "/service-icons/reha-fahrt.svg",
    ctaTitle: "Reha- oder Therapiefahrt anfragen",
    ctaText: "Senden Sie einzelne oder wiederkehrende Termine unverbindlich. Wir stimmen Hin- und Rückfahrt nach Verfügbarkeit ab.",
  },
  {
    slug: "entlassungsfahrten",
    title: "Entlassungsfahrten",
    shortTitle: "Entlassungsfahrten",
    eyebrow: "Geplante Abholung",
    description: "Sitzende Beförderung nach einer geplanten Entlassung aus Klinik oder Einrichtung.",
    intro: "Wir stimmen Abholzeit und genauen Abholort mit Ihnen ab und fahren Sie nach Hause oder zu einer vereinbarten Zieladresse. Übliches Gepäck kann nach vorheriger Abstimmung berücksichtigt werden.",
    suitableFor: ["Geplante Entlassungen sitzender Fahrgäste", "Fahrten nach Hause oder zu einer abgestimmten Zieladresse", "Abholungen mit vorher geklärtem Treffpunkt und Zeitfenster"],
    typicalDestinations: ["Eigene Wohnadresse", "Abgestimmte Wohn- oder Betreuungseinrichtung", "Andere vorab vereinbarte Zieladresse"],
    supportItems: [...commonSupport, "Übliches Gepäck in vorher abgestimmtem Umfang"],
    processSteps: [
      { title: "Entlassung ankündigen", description: "Einrichtung, Abholort, geplante Zeit und Zieladresse mitteilen." },
      { title: "Zeitfenster abstimmen", description: "Mögliche Änderungen der Entlassungszeit und Gepäckumfang besprechen." },
      { title: "Abholung bestätigen", description: "Die Fahrt ist erst nach ausdrücklicher Bestätigung verbindlich." },
    ],
    billingNote: "Je nach persönlicher Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Eine Kostenübernahme ist nicht pauschal zugesagt und muss individuell geklärt werden.",
    serviceNote: "Entlassungszeiten können sich ändern. Bitte informieren Sie uns möglichst früh. Medizinische Unterlagen oder Medikamente übernehmen wir nur, wenn dies vorher ausdrücklich abgestimmt und zulässig ist.",
    faqs: [
      { question: "Was passiert, wenn sich die Entlassungszeit ändert?", answer: "Bitte informieren Sie uns möglichst früh. Wir prüfen dann erneut die Verfügbarkeit; die geänderte Abholzeit benötigt eine Bestätigung." },
      { question: "Kann Gepäck mitgenommen werden?", answer: "Übliches Gepäck kann nach vorheriger Abstimmung mitgenommen werden. Umfang und sichere Unterbringung müssen vor der Fahrt geklärt sein." },
      { question: "Sind Liegendfahrten nach einer Entlassung möglich?", answer: "Nein. Wir befördern ausschließlich Fahrgäste, die während der Fahrt sitzen können, ohne medizinische Betreuung oder Überwachung." },
    ],
    relatedServiceSlugs: ["arzt-klinikfahrten", "sitzende-krankenfahrten", "reha-therapiefahrten"],
    metadataTitle: "Entlassungsfahrten Bad Homburg",
    metadataDescription: "Sitzende Entlassungsfahrten in Bad Homburg von Klinik oder Einrichtung zu einer abgestimmten Zieladresse nach Bestätigung.",
    icon: "/service-icons/entlassungsfahrt.svg",
    ctaTitle: "Geplante Entlassungsfahrt abstimmen",
    ctaText: "Teilen Sie Abholort, voraussichtliche Entlassungszeit und Zieladresse mit. Verbindlich wird die Fahrt erst nach Bestätigung.",
  },
  {
    slug: "serienfahrten",
    title: "Serienfahrten",
    shortTitle: "Serienfahrten",
    eyebrow: "Wiederkehrende Fahrten",
    description: "Vorausschauende Organisation regelmäßig wiederkehrender sitzender Fahrten.",
    intro: "Wiederkehrende Abhol- und Zieladressen sowie Terminzeiten können im Voraus abgestimmt werden, etwa für Dialyse, Therapie, Bestrahlung oder Reha. Änderungen und Ausfälle sollten möglichst früh mitgeteilt werden.",
    suitableFor: ["Regelmäßig wiederkehrende Dialyse- oder Therapietermine", "Bestrahlungs- und Rehatermine", "Terminfolgen mit planbaren Adressen und Zeiten"],
    typicalDestinations: ["Dialyse- und Behandlungszentren", "Therapie- und Rehabilitationseinrichtungen", "Wiederkehrende Arzt- oder Kliniktermine"],
    supportItems: [...commonSupport, "Gemeinsame Abstimmung wiederkehrender Abhol- und Zieladressen"],
    processSteps: [
      { title: "Terminplan senden", description: "Termine, wiederkehrende Adressen und Rückfahrten gesammelt mitteilen." },
      { title: "Serie koordinieren", description: "Verfügbare Termine abstimmen und Änderungen möglichst früh einplanen." },
      { title: "Einzelfahrten bestätigen", description: "Nur ausdrücklich bestätigte Termine sind verbindlich vereinbart." },
    ],
    billingNote: "Je nach persönlicher Voraussetzung können eine Verordnung oder Genehmigung und eine Abrechnung mit der Krankenkasse möglich sein. Die Kostenübernahme muss individuell geklärt werden.",
    serviceNote: "Eine Terminserie erleichtert die Organisation, stellt aber ohne ausdrückliche Bestätigung keine pauschale Beförderungsgarantie dar.",
    faqs: [
      { question: "Welche Termine können als Serie geplant werden?", answer: "Beispielsweise regelmäßig wiederkehrende Dialyse-, Therapie-, Bestrahlungs- oder Rehatermine können gesammelt angefragt werden." },
      { question: "Sind alle Termine einer Serie automatisch verbindlich?", answer: "Nein. Die Terminserie unterstützt die Planung. Einzelne Fahrten bleiben von Verfügbarkeit und ausdrücklicher Bestätigung abhängig." },
      { question: "Wie werden Änderungen oder Ausfälle mitgeteilt?", answer: "Bitte teilen Sie Änderungen oder Ausfälle möglichst früh telefonisch mit, damit die weitere Planung angepasst werden kann." },
    ],
    relatedServiceSlugs: ["dialysefahrten", "chemo-strahlentherapiefahrten", "reha-therapiefahrten"],
    metadataTitle: "Serienfahrten Bad Homburg",
    metadataDescription: "Sitzende Serienfahrten in Bad Homburg für regelmäßig wiederkehrende Termine, individuell geplant und einzeln bestätigt.",
    icon: "/service-icons/therapiefahrt.svg",
    ctaTitle: "Terminserie unverbindlich anfragen",
    ctaText: "Übermitteln Sie wiederkehrende Termine und Adressen. Wir prüfen die Verfügbarkeit und bestätigen die möglichen Einzelfahrten.",
  },
] as const;

export const servicesBySlug = Object.fromEntries(allServices.map((service) => [service.slug, service])) as Readonly<Record<string, Service>>;

export const services = [
  { title: "Arztfahrten", description: "Zu ambulanten Untersuchungen und Arztterminen.", href: "/leistungen/arzt-klinikfahrten", icon: "/service-icons/arztfahrt.svg" },
  { title: "Krankenhausfahrten", description: "Sitzende Fahrten zu geplanten Terminen in Klinik und Krankenhaus.", href: "/leistungen/arzt-klinikfahrten", icon: "/service-icons/krankenhausfahrt.svg" },
  { title: "Dialysefahrten", description: "Regelmäßig und abgestimmt zu Dialyseterminen.", href: "/leistungen/dialysefahrten", icon: "/service-icons/dialysefahrt.svg" },
  { title: "Chemo- und Strahlentherapiefahrten", description: "Persönliche Fahrten zu wiederkehrenden Behandlungsterminen.", href: "/leistungen/chemo-strahlentherapiefahrten", icon: "/service-icons/therapiefahrt.svg" },
  { title: "Reha- und Therapiefahrten", description: "Zu Physiotherapie, Rehabilitation und weiteren Therapieterminen.", href: "/leistungen/reha-therapiefahrten", icon: "/service-icons/reha-fahrt.svg" },
  { title: "Entlassungs- und Serienfahrten", description: "Nach Hause oder als abgestimmte Terminserie.", href: "/leistungen/entlassungsfahrten", icon: "/service-icons/entlassungsfahrt.svg" },
] as const;

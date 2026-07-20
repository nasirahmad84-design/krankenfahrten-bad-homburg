export type Service = Readonly<{
  title: string;
  description: string;
  href: string;
  icon: string;
  detailHref?: string;
}>;

export const services: readonly Service[] = [
  {
    title: "Arztfahrten",
    description: "Zuverlässig zu ambulanten Untersuchungen und Arztterminen.",
    href: "/leistungen",
    icon: "/icons/arztfahrt.svg",
  },
  {
    title: "Krankenhausfahrten",
    description: "Sitzende Fahrten zu geplanten Terminen in Klinik und Krankenhaus.",
    href: "/leistungen",
    icon: "/icons/krankenhausfahrt.svg",
  },
  {
    title: "Dialysefahrten",
    description: "Regelmäßig und abgestimmt zu Ihren Dialyseterminen.",
    href: "/leistungen",
    icon: "/icons/dialysefahrt.svg",
  },
  {
    title: "Chemo- und Strahlentherapiefahrten",
    description: "Persönliche Fahrten zu wiederkehrenden Behandlungsterminen.",
    href: "/leistungen",
    icon: "/icons/therapiefahrt.svg",
  },
  {
    title: "Reha- und Therapiefahrten",
    description: "Zu Physiotherapie, Rehabilitation und weiteren Behandlungen.",
    href: "/leistungen",
    icon: "/icons/reha-fahrt.svg",
  },
  {
    title: "Entlassungs- und Serienfahrten",
    description: "Sicher nach Hause oder als verlässlich organisierte Terminserie.",
    href: "/leistungen",
    icon: "/icons/entlassungsfahrt.svg",
  },
];

export const allServices: readonly Service[] = [
  { title: "Sitzende Krankenfahrten", description: "Beförderung für Fahrgäste, die während der Fahrt sicher sitzen können.", href: "/leistungen/sitzende-krankenfahrten", detailHref: "/leistungen/sitzende-krankenfahrten", icon: "/icons/arztfahrt.svg" },
  { title: "Arzt- und Klinikfahrten", description: "Fahrten zu ambulanten Terminen, Untersuchungen und geplanten Klinikaufenthalten.", href: "/leistungen/arzt-klinikfahrten", detailHref: "/leistungen/arzt-klinikfahrten", icon: "/icons/krankenhausfahrt.svg" },
  { title: "Dialysefahrten", description: "Abgestimmte Fahrten zu regelmäßig wiederkehrenden Dialyseterminen.", href: "/leistungen/dialysefahrten", detailHref: "/leistungen/dialysefahrten", icon: "/icons/dialysefahrt.svg" },
  { title: "Chemo- und Strahlentherapiefahrten", description: "Persönlich abgestimmte Fahrten zu wiederkehrenden Behandlungsterminen.", href: "/leistungen/chemo-strahlentherapiefahrten", detailHref: "/leistungen/chemo-strahlentherapiefahrten", icon: "/icons/therapiefahrt.svg" },
  { title: "Reha- und Therapiefahrten", description: "Fahrten zu Rehabilitation, Physiotherapie und weiteren Therapieterminen.", href: "/leistungen/reha-therapiefahrten", detailHref: "/leistungen/reha-therapiefahrten", icon: "/icons/reha-fahrt.svg" },
  { title: "Entlassungsfahrten", description: "Sitzende Beförderung von Klinik oder Einrichtung zum abgestimmten Ziel.", href: "/leistungen/entlassungsfahrten", detailHref: "/leistungen/entlassungsfahrten", icon: "/icons/entlassungsfahrt.svg" },
  { title: "Serienfahrten", description: "Planung wiederkehrender Fahrten für eine abgestimmte Terminserie.", href: "/leistungen/serienfahrten", detailHref: "/leistungen/serienfahrten", icon: "/icons/therapiefahrt.svg" },
];

export type Service = Readonly<{
  title: string;
  description: string;
  href: string;
}>;

export const services: readonly Service[] = [
  {
    title: "Arztfahrten",
    description: "Zuverlässig zu ambulanten Untersuchungen und Arztterminen.",
    href: "/leistungen",
  },
  {
    title: "Krankenhausfahrten",
    description: "Sitzende Fahrten zu geplanten Terminen in Klinik und Krankenhaus.",
    href: "/leistungen",
  },
  {
    title: "Dialysefahrten",
    description: "Regelmäßig und abgestimmt zu Ihren Dialyseterminen.",
    href: "/leistungen",
  },
  {
    title: "Chemo- und Strahlentherapiefahrten",
    description: "Persönliche Fahrten zu wiederkehrenden Behandlungsterminen.",
    href: "/leistungen",
  },
  {
    title: "Reha- und Therapiefahrten",
    description: "Zu Physiotherapie, Rehabilitation und weiteren Behandlungen.",
    href: "/leistungen",
  },
  {
    title: "Entlassungs- und Serienfahrten",
    description: "Sicher nach Hause oder als verlässlich organisierte Terminserie.",
    href: "/leistungen",
  },
];

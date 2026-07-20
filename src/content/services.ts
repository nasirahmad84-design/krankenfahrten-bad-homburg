export type Service = Readonly<{
  title: string;
  description: string;
  href: string;
  icon: string;
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

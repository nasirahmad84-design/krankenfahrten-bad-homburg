export type SiteLink = Readonly<{
  label: string;
  href: string;
}>;

export const siteConfig = {
  name: "Krankenfahrten Bad Homburg",
  operator: "Mubasher Ahmad",
  phone: {
    display: "0175 4142222",
    href: "tel:+491754142222",
  },
  email: {
    address: "anfrage@krankenfahrten-bad-homburg.de",
    href: "mailto:anfrage@krankenfahrten-bad-homburg.de",
  },
  address: {
    street: "Basler Str. 3",
    postalCode: "61352",
    city: "Bad Homburg",
  },
  navigation: [
    { label: "Startseite", href: "/" },
    { label: "Leistungen", href: "/leistungen" },
    { label: "Kosten & Abrechnung", href: "/kosten-abrechnung" },
    { label: "Ablauf", href: "/ablauf" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "FAQ", href: "/faq" },
  ] satisfies readonly SiteLink[],
  contactLink: { label: "Fahrt anfragen", href: "/kontakt" },
  legalLinks: [
    { label: "Impressum", href: "/impressum/" },
    { label: "Datenschutz", href: "/datenschutz/" },
    { label: "Cookie-Einstellungen", href: "/cookie-einstellungen/" },
  ] satisfies readonly SiteLink[],
} as const;

import { absoluteUrl, productionOrigin } from "./site-url.ts";

type PostalAddressData = Readonly<{
  "@type": "PostalAddress";
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: "DE";
}>;

type ServiceOffer = Readonly<{
  "@type": "Offer";
  itemOffered: Readonly<{
    "@type": "Service";
    name: string;
    serviceType: "Sitzende Krankenfahrt";
    areaServed: "Bad Homburg und Umgebung";
  }>;
}>;

type LocalBusinessData = Readonly<{
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  "@id": string;
  name: string;
  legalName: string;
  url: string;
  logo: string;
  telephone: string;
  email: string;
  address: PostalAddressData;
  areaServed: "Bad Homburg und Umgebung";
  sameAs: readonly ["https://www.facebook.com/krankenfahrtenbadhomburg"];
  openingHoursSpecification: readonly [
    Readonly<{
      "@type": "OpeningHoursSpecification";
      dayOfWeek: readonly [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      opens: "00:00";
      closes: "23:59";
    }>,
  ];
  hasOfferCatalog: Readonly<{
    "@type": "OfferCatalog";
    name: "Sitzende Krankenfahrten";
    itemListElement: readonly ServiceOffer[];
  }>;
}>;

const serviceNames = [
  "Arzt- und Klinikfahrten",
  "Dialysefahrten",
  "Chemo- und Strahlentherapiefahrten",
  "Reha- und Therapiefahrten",
  "Entlassungsfahrten",
  "Serienfahrten",
] as const;

export const localBusinessStructuredData: LocalBusinessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${absoluteUrl("/")}#unternehmen`,
  name: "Krankenfahrten Bad Homburg",
  legalName: "Mubasher Ahmad",
  url: absoluteUrl("/"),
  logo: new URL("/brand/logo.svg", productionOrigin).toString(),
  telephone: "+49 175 4142222",
  email: "anfrage@krankenfahrten-bad-homburg.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Basler Str. 3",
    postalCode: "61352",
    addressLocality: "Bad Homburg",
    addressCountry: "DE",
  },
  areaServed: "Bad Homburg und Umgebung",
  sameAs: ["https://www.facebook.com/krankenfahrtenbadhomburg"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Sitzende Krankenfahrten",
    itemListElement: serviceNames.map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        serviceType: "Sitzende Krankenfahrt",
        areaServed: "Bad Homburg und Umgebung",
      },
    })),
  },
};

export const serializedLocalBusinessStructuredData = JSON.stringify(localBusinessStructuredData).replaceAll("<", "\\u003c");

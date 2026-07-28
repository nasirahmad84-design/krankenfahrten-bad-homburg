import { HomeBenefits } from "@/components/sections/home-benefits";
import { HomeBilling } from "@/components/sections/home-billing";
import { HomeCta } from "@/components/sections/home-cta";
import { HomeFaq } from "@/components/sections/home-faq";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeProcess } from "@/components/sections/home-process";
import { HomeLocations } from "@/components/sections/home-locations";
import { HomeReviews } from "@/components/sections/home-reviews";
import { HomeServices } from "@/components/sections/home-services";
import { HomeSupport } from "@/components/sections/home-support";
import { serializedLocalBusinessStructuredData } from "@/lib/local-business-structured-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Krankenfahrten Bad Homburg | Persönlich und zuverlässig",
  "Sitzende Krankenfahrten in Bad Homburg für Arzt-, Klinik-, Dialyse-, Therapie- und Entlassungstermine. Persönliche Unterstützung und Anfrage rund um die Uhr.",
  "/",
);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedLocalBusinessStructuredData }}
      />
      <HomeHero />
      <HomeBenefits />
      <HomeServices />
      <HomeSupport />
      <HomeLocations />
      <HomeProcess />
      <HomeBilling />
      <HomeFaq />
      <HomeReviews />
      <HomeCta />
    </>
  );
}

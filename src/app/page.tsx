import type { Metadata } from "next";

import { HomeBenefits } from "@/components/sections/home-benefits";
import { HomeBilling } from "@/components/sections/home-billing";
import { HomeCta } from "@/components/sections/home-cta";
import { HomeFaq } from "@/components/sections/home-faq";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeProcess } from "@/components/sections/home-process";
import { HomeServices } from "@/components/sections/home-services";
import { HomeSupport } from "@/components/sections/home-support";

export const metadata: Metadata = {
  title: "Krankenfahrten Bad Homburg | Persönlich und zuverlässig",
  description: "Sitzende Krankenfahrten in Bad Homburg für Arzt-, Klinik-, Dialyse-, Therapie- und Entlassungstermine. Persönliche Unterstützung und Anfrage rund um die Uhr.",
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeBenefits />
      <HomeServices />
      <HomeSupport />
      <HomeProcess />
      <HomeBilling />
      <HomeFaq />
      <HomeCta />
    </>
  );
}

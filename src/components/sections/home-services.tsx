import Image from "next/image";

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { services } from "@/content/services";

export function HomeServices() {
  return (
    <section className="home-section bg-[#f6f9fc]" aria-labelledby="services-title">
      <SiteContainer>
        <SectionHeading titleId="services-title" eyebrow="Unsere Leistungen" title="Sitzende Krankenfahrten für unterschiedliche Behandlungssituationen" description="Alle Fahrten erfolgen für sitzende Fahrgäste. Medizinisch ausgestattete Transporte bieten wir nicht an." className="home-section-heading" />
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => <ServiceCard key={service.title} {...service} linkText="Mehr erfahren" icon={<Image src={service.icon} alt="" width={34} height={34} />} className="rounded-[20px] p-6 lg:p-8" />)}
        </div>
        <Button href="/leistungen" variant="outline" size="large" className="mt-8 min-h-[52px] w-full rounded-xl text-base sm:w-auto">Alle Leistungen ansehen</Button>
      </SiteContainer>
    </section>
  );
}

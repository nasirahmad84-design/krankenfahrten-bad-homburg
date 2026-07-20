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
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => <ServiceCard key={service.title} {...service} linkText="Mehr erfahren" icon={<span className="text-xl">→</span>} className="rounded-[18px] p-5 sm:p-6" />)}
        </div>
        <Button href="/leistungen" variant="outline" size="large" className="mt-6 w-full rounded-xl sm:w-auto">Alle Leistungen ansehen</Button>
      </SiteContainer>
    </section>
  );
}

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const documents = ["Verordnung einer Krankenbeförderung", "Genehmigung, falls erforderlich", "Versicherten- und Kontaktdaten"];

export function HomeBilling() {
  return (
    <section className="home-section bg-[#f6f9fc]" aria-labelledby="billing-title">
      <SiteContainer className="grid gap-9 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
        <SectionHeading titleId="billing-title" eyebrow="Kosten & Abrechnung" title="Abrechnung individuell klären" description="Je nach Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Eine Kostenübernahme muss im Einzelfall geklärt werden; alternativ ist eine Fahrt als Selbstzahler möglich." className="home-section-heading" />
        <aside className="rounded-[22px] border border-[#dce2e9] bg-white p-6 shadow-[0_12px_32px_rgba(2,31,88,0.07)] sm:p-8 lg:p-10" aria-label="Unterlagen zur Abrechnung">
          <h3 className="text-[22px] font-semibold text-navy">Bitte bereithalten</h3>
          <ul className="mt-6 grid gap-4 text-base leading-relaxed text-[#5b697a]">
            {documents.map((document) => <li key={document} className="flex gap-2"><span className="font-bold text-green" aria-hidden="true">✓</span>{document}</li>)}
          </ul>
          <Button href="/kosten-abrechnung" variant="outline" size="large" className="mt-8 w-full rounded-xl text-base sm:w-auto">Abrechnung klären</Button>
        </aside>
      </SiteContainer>
    </section>
  );
}

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const documents = ["Verordnung einer Krankenbeförderung", "Genehmigung, falls erforderlich", "Versicherten- und Kontaktdaten"];

export function HomeBilling() {
  return (
    <section className="home-section bg-[#f6f9fc]" aria-labelledby="billing-title">
      <SiteContainer className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <SectionHeading titleId="billing-title" eyebrow="Kosten & Abrechnung" title="Abrechnung individuell klären" description="Je nach Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Eine Kostenübernahme muss im Einzelfall geklärt werden; alternativ ist eine Fahrt als Selbstzahler möglich." className="home-section-heading" />
        <aside className="rounded-[18px] border border-[#dce2e9] bg-white p-5 sm:p-6" aria-label="Unterlagen zur Abrechnung">
          <h3 className="text-lg font-semibold text-navy">Bitte bereithalten</h3>
          <ul className="mt-4 grid gap-3 text-[15px] text-[#5b697a]">
            {documents.map((document) => <li key={document} className="flex gap-2"><span className="font-bold text-green" aria-hidden="true">✓</span>{document}</li>)}
          </ul>
          <Button href="/kosten-abrechnung" variant="outline" className="mt-6 w-full rounded-xl sm:w-auto">Abrechnung klären</Button>
        </aside>
      </SiteContainer>
    </section>
  );
}

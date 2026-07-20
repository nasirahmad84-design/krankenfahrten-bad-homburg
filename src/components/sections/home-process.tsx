import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/process";

export function HomeProcess() {
  return (
    <section className="home-section bg-white" aria-labelledby="process-title">
      <SiteContainer>
        <SectionHeading titleId="process-title" eyebrow="So funktioniert es" title="In drei Schritten zur bestätigten Fahrt" description="Eine Anfrage ist zunächst unverbindlich. Die Fahrt gilt erst nach unserer ausdrücklichen Bestätigung als gebucht." className="home-section-heading" />
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className="flex size-11 items-center justify-center rounded-full bg-green text-lg font-bold text-white">{index + 1}</span>
              <h3 className="mt-4 text-[21px] font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-[#5b697a]">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/ablauf" variant="outline">Ablauf ansehen</Button>
          <Button href="/kontakt">Fahrt anfragen</Button>
        </div>
      </SiteContainer>
    </section>
  );
}

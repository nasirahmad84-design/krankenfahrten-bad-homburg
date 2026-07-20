import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/process";

export function HomeProcess() {
  return (
    <section className="home-section bg-white" aria-labelledby="process-title">
      <SiteContainer>
        <SectionHeading titleId="process-title" eyebrow="So funktioniert es" title="In drei Schritten zur bestätigten Fahrt" description="Eine Anfrage ist zunächst unverbindlich. Die Fahrt gilt erst nach unserer ausdrücklichen Bestätigung als gebucht." className="home-section-heading" />
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-10 before:absolute before:top-7 before:right-[16%] before:left-[16%] before:hidden before:h-0.5 before:bg-[#dce2e9] md:before:block">
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative pl-16 md:pl-0">
              <span className="absolute top-0 left-0 z-10 flex size-14 items-center justify-center rounded-full border-4 border-white bg-green text-xl font-bold text-white shadow-md md:relative">{index + 1}</span>
              <h3 className="pt-1 text-[22px] font-semibold text-navy md:mt-6 md:pt-0">{step.title}</h3>
              <p className="mt-3 text-base leading-[1.65] text-[#5b697a]">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/ablauf" variant="outline">Ablauf ansehen</Button>
          <Button href="/kontakt">Fahrt anfragen</Button>
        </div>
      </SiteContainer>
    </section>
  );
}

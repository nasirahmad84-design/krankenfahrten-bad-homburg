import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeFaq } from "@/content/faq";

export function HomeFaq() {
  return (
    <section className="home-section bg-white" aria-labelledby="faq-title">
      <SiteContainer>
        <SectionHeading titleId="faq-title" eyebrow="Häufige Fragen" title="Was Patienten und Angehörige häufig wissen möchten" className="home-section-heading" />
        <div className="mt-9"><FaqAccordion items={homeFaq} /></div>
        <Button href="/faq" variant="link" className="mt-8 text-base">Alle Fragen ansehen →</Button>
      </SiteContainer>
    </section>
  );
}

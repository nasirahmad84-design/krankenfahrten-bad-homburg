import { SiteContainer } from "@/components/layout/site-container";
import { BenefitCard } from "@/components/ui/benefit-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/content/home";

export function HomeBenefits() {
  return (
    <section className="home-section bg-white" aria-labelledby="benefits-title">
      <SiteContainer>
        <SectionHeading titleId="benefits-title" eyebrow="Warum wir" title="Verlässlich organisiert. Persönlich begleitet." description="Bei medizinischen Fahrten zählen Pünktlichkeit, Ruhe und ein klarer Ablauf." className="home-section-heading" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
        </div>
      </SiteContainer>
    </section>
  );
}

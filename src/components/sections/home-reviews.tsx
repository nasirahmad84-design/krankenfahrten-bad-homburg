import { SiteContainer } from "@/components/layout/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site-config";

export function HomeReviews() {
  return (
    <section className="home-section bg-white" aria-labelledby="reviews-title">
      <SiteContainer>
        <div className="rounded-card border border-navy/12 bg-[#f6f9fc] p-6 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-11">
          <SectionHeading
            titleId="reviews-title"
            eyebrow="Ihre Erfahrung"
            title="Ehrliche Rückmeldung auf Google"
            description="Sie haben unseren Fahrdienst genutzt? Ihre ehrliche Rückmeldung hilft anderen Fahrgästen und Angehörigen bei der Auswahl."
            className="max-w-3xl home-section-heading"
          />
          <a
            href={siteConfig.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-navy/30 px-6 py-3 text-center text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5 lg:mt-0"
          >
            Google-Rezension schreiben
          </a>
        </div>
      </SiteContainer>
    </section>
  );
}

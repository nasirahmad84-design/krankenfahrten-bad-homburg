import { SiteContainer } from "@/components/layout/site-container";
import { NoticeBox } from "@/components/ui/notice-box";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceLimits, supportPoints } from "@/content/home";

export function HomeSupport() {
  return (
    <section className="home-section bg-white" aria-labelledby="support-title">
      <SiteContainer className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading titleId="support-title" eyebrow="Persönliche Unterstützung" title="Vom Fahrzeug bis zum vereinbarten Ziel" description="Wir stimmen die Fahrt mit Ihnen ab und unterstützen Sie respektvoll und zuverlässig." className="home-section-heading" />
          <ul className="mt-6 grid gap-3 text-[#5b697a] sm:grid-cols-2">
            {supportPoints.map((point) => <li key={point} className="flex gap-2"><span className="font-bold text-green" aria-hidden="true">✓</span>{point}</li>)}
          </ul>
        </div>
        <NoticeBox title="Unsere Leistungsgrenzen" variant="information">
          <p>Wir befördern ausschließlich sitzende Fahrgäste:</p>
          <ul className="mt-3 grid gap-1">
            {serviceLimits.map((limit) => <li key={limit}>• {limit}</li>)}
          </ul>
        </NoticeBox>
      </SiteContainer>
    </section>
  );
}

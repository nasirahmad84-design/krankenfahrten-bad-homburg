import { SiteContainer } from "@/components/layout/site-container";
import { NoticeBox } from "@/components/ui/notice-box";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceLimits, supportPoints } from "@/content/home";

export function HomeSupport() {
  return (
    <section className="home-section bg-white" aria-labelledby="support-title">
      <SiteContainer className="grid gap-9 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-20">
        <div className="rounded-[24px] bg-[#f6f9fc] p-6 sm:p-9 lg:p-11">
          <SectionHeading titleId="support-title" eyebrow="Persönliche Unterstützung" title="Vom Fahrzeug bis zum vereinbarten Ziel" description="Wir stimmen die Fahrt mit Ihnen ab und unterstützen Sie respektvoll und zuverlässig." className="home-section-heading" />
          <ul className="mt-8 grid gap-5 text-[17px] leading-relaxed text-[#5b697a] sm:grid-cols-2">
            {supportPoints.map((point) => <li key={point} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white" aria-hidden="true">✓</span>{point}</li>)}
          </ul>
        </div>
        <NoticeBox title="Unsere Leistungsgrenzen" variant="information" className="rounded-[20px] p-6 lg:p-8">
          <p>Wir befördern ausschließlich sitzende Fahrgäste:</p>
          <ul className="mt-3 grid gap-1">
            {serviceLimits.map((limit) => <li key={limit}>• {limit}</li>)}
          </ul>
        </NoticeBox>
      </SiteContainer>
    </section>
  );
}

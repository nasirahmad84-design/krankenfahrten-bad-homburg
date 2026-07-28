import { SiteContainer } from "@/components/layout/site-container";
import { NoticeBox } from "@/components/ui/notice-box";
import { SectionImage } from "@/components/ui/section-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceLimits, supportPoints } from "@/content/home";

export function HomeSupport() {
  return (
    <section className="home-section bg-white" aria-labelledby="support-title">
      <SiteContainer>
        <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <SectionImage
            src="/images/home/persoenliche-unterstuetzung.webp"
            alt="Fahrer begleitet einen älteren Fahrgast zum Eingang einer Praxis."
            width={1400}
            height={900}
            sizes="(max-width: 1023px) calc(100vw - 48px), 43vw"
            className="aspect-[4/3]"
            imageClassName="object-[52%_center]"
          />
          <div className="rounded-[24px] bg-[#f6f9fc] p-6 sm:p-9 lg:p-11">
          <SectionHeading titleId="support-title" eyebrow="Persönliche Unterstützung" title="Vom Fahrzeug bis zum vereinbarten Ziel" description="Wir stimmen die Fahrt mit Ihnen ab und unterstützen Sie respektvoll und zuverlässig." className="home-section-heading" />
          <ul className="mt-8 grid gap-5 text-[17px] leading-relaxed text-[#5b697a] sm:grid-cols-2">
            {supportPoints.map((point) => <li key={point} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white" aria-hidden="true">✓</span>{point}</li>)}
          </ul>
          </div>
        </div>
        <NoticeBox title="Unsere Leistungsgrenzen" variant="information" className="mt-9 rounded-[20px] p-6 lg:p-8">
          <p>Wir befördern ausschließlich sitzende Fahrgäste:</p>
          <ul className="mt-3 grid gap-1">
            {serviceLimits.map((limit) => <li key={limit}>• {limit}</li>)}
          </ul>
        </NoticeBox>
      </SiteContainer>
    </section>
  );
}

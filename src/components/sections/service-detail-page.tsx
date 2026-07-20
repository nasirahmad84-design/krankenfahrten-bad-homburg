import Image from "next/image";
import Link from "next/link";

import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ProcessStep } from "@/components/ui/process-step";
import { ServiceCard } from "@/components/ui/service-card";
import { commonServiceLimits, servicesBySlug, type Service } from "@/content/services";

type ServiceDetailPageProps = { service: Service };

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const relatedServices = service.relatedServiceSlugs.map((slug) => servicesBySlug[slug]).filter(Boolean);

  return (
    <>
      <Breadcrumbs current={service.title} />
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.description} />

      <ContentSection id="service-overview" title="Die Leistung im Überblick" description={service.intro}>
        <div className="grid gap-5 lg:grid-cols-2">
          <DetailList title="Für wen geeignet?" items={service.suitableFor} />
          <DetailList title="Typische Ziele und Anlässe" items={service.typicalDestinations} />
        </div>
      </ContentSection>

      <ContentSection id="personal-support" eyebrow="Persönlich abgestimmt" title="Unterstützung rund um die Fahrt" muted>
        <InfoList items={service.supportItems} columns={2} />
      </ContentSection>

      <ContentSection id="service-process" title="So läuft die Abstimmung ab" description="Von der unverbindlichen Anfrage bis zur ausdrücklich bestätigten Fahrt.">
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-10 before:absolute before:top-7 before:right-[16%] before:left-[16%] before:hidden before:h-0.5 before:bg-[#dce2e9] md:before:block">
          {service.processSteps.map((step, index) => <ProcessStep key={step.title} number={index + 1} {...step} horizontal />)}
        </ol>
      </ContentSection>

      <ContentSection id="service-limits" title="Klare Leistungsgrenzen" muted>
        <NoticeBox title="Ausschließlich sitzende Beförderung" variant="warning">
          <ul className="grid gap-2 sm:grid-cols-2">
            {commonServiceLimits.map((limit) => <li key={limit} className="flex gap-2"><span aria-hidden="true">–</span><span>{limit}</span></li>)}
          </ul>
          {service.serviceNote && <p className="mt-4 border-t border-current/15 pt-4">{service.serviceNote}</p>}
        </NoticeBox>
      </ContentSection>

      {service.billingNote && (
        <ContentSection id="billing-note" title="Kosten und Abrechnung">
          <NoticeBox title="Individuell klären" variant="billing">
            <p>{service.billingNote}</p>
            <Link className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4" href="/kosten-abrechnung">Hinweise zu Kosten und Abrechnung</Link>
          </NoticeBox>
        </ContentSection>
      )}

      <ContentSection id="service-faq" eyebrow="Häufige Fragen" title={`Fragen zu ${service.shortTitle}`} muted>
        <FaqAccordion items={service.faqs} />
      </ContentSection>

      <ContentSection id="related-services" title="Passende weitere Leistungen">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {relatedServices.map((related) => (
            <ServiceCard key={related.slug} title={related.title} description={related.description} href={`/leistungen/${related.slug}`} linkText="Leistung ansehen" icon={<Image src={related.icon} alt="" width={34} height={34} />} className="min-h-[270px]" />
          ))}
        </div>
      </ContentSection>

      <PageCta title={service.ctaTitle} description={service.ctaText} />
    </>
  );
}

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className="rounded-card border border-navy/12 bg-white p-6 shadow-[0_8px_24px_rgba(2,31,88,0.06)] sm:p-8">
      <h3 className="text-[22px] leading-snug font-bold text-navy">{title}</h3>
      <ul className="mt-5 grid gap-4 text-base leading-[1.65] text-[#5b697a]">
        {items.map((item) => <li key={item} className="flex gap-3"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f7eb] font-bold text-green" aria-hidden="true">✓</span><span>{item}</span></li>)}
      </ul>
    </article>
  );
}

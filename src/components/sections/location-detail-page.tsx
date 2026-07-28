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
import { locationsBySlug, type RegionalLocation } from "@/content/locations";

type LocationDetailPageProps = { location: RegionalLocation };

const processSteps = [
  { title: "Fahrtdaten nennen", description: "Teilen Sie uns Abholadresse, Ziel, Terminzeit und benötigte Unterstützung mit." },
  { title: "Anfrage prüfen lassen", description: "Wir prüfen die konkrete Strecke, Uhrzeit und verfügbare Kapazität." },
  { title: "Bestätigung erhalten", description: "Die Fahrt ist erst nach unserer ausdrücklichen Bestätigung verbindlich vereinbart." },
] as const;

const serviceLinks = [
  {
    title: "Arzt- und Klinikfahrten",
    description: "Planbare Hin- oder Rückfahrten zu Praxen, Kliniken und ambulanten Einrichtungen.",
    href: "/leistungen/arzt-klinikfahrten",
  },
  {
    title: "Dialysefahrten",
    description: "Regelmäßige sitzende Fahrten zu abgestimmten Dialyseterminen.",
    href: "/leistungen/dialysefahrten",
  },
  {
    title: "Therapie- und Rehafahrten",
    description: "Einzelne oder wiederkehrende Fahrten zu planbaren Therapie- und Rehaterminen.",
    href: "/leistungen/reha-therapiefahrten",
  },
] as const;

export function LocationDetailPage({ location }: LocationDetailPageProps) {
  const relatedLocations = location.relatedSlugs
    .map((slug) => locationsBySlug[slug])
    .filter(Boolean);

  return (
    <>
      <Breadcrumbs
        current={location.name}
        parent={{ label: "Einsatzgebiet", href: "/orte" }}
      />
      <PageHero
        eyebrow={`Sitzende Krankenfahrten · ${location.administrativeContext}`}
        title={`Krankenfahrten ${location.displayName}`}
        description={location.description}
      />

      <ContentSection
        id="location-pickup"
        eyebrow="Abholung vor Ort"
        title={`Fahrten ab ${location.name} konkret abstimmen`}
        description={location.intro}
      >
        <InfoList items={location.pickupGuidance} columns={3} />
      </ContentSection>

      <ContentSection
        id="regional-orientation"
        eyebrow="Regionale Orientierung"
        title="Mögliche Anlässe und Verbindungen"
        description={location.localOrientation}
        muted
      >
        <InfoList items={location.connections} columns={3} />
      </ContentSection>

      <ContentSection
        id="location-services"
        title="Diese Fahrten können Sie anfragen"
        description="Unser Angebot umfasst ausschließlich planbare sitzende Beförderungen ohne medizinische Betreuung."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceLinks.map((service) => (
            <ServiceCard
              key={service.href}
              {...service}
              linkText="Leistung ansehen"
              className="min-h-[250px]"
            />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="location-process"
        title="So wird aus der Anfrage eine bestätigte Fahrt"
        muted
      >
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-10 before:absolute before:top-7 before:right-[16%] before:left-[16%] before:hidden before:h-0.5 before:bg-[#dce2e9] md:before:block">
          {processSteps.map((step, index) => (
            <ProcessStep key={step.title} number={index + 1} {...step} horizontal />
          ))}
        </ol>
      </ContentSection>

      <ContentSection id="location-limits" title="Was wir nicht anbieten">
        <NoticeBox title="Ausschließlich sitzende Krankenfahrten" variant="warning">
          <p>
            Wir übernehmen keine liegenden Transporte, Rollstuhltransporte,
            Tragestuhl- oder Treppenhilfe und keine medizinisch betreuten
            Notfallfahrten. In einem Notfall wählen Sie bitte 112.
          </p>
        </NoticeBox>
      </ContentSection>

      <ContentSection
        id="location-faq"
        eyebrow="Häufige Fragen"
        title={`Fragen zu Fahrten ab ${location.name}`}
        muted
      >
        <FaqAccordion items={location.faqs} />
      </ContentSection>

      <ContentSection id="related-locations" title="Orte in der Nähe">
        <div className="grid gap-5 md:grid-cols-3">
          {relatedLocations.map((related) => (
            <ServiceCard
              key={related.slug}
              title={related.displayName}
              description={related.description}
              href={`/orte/${related.slug}`}
              linkText="Ort ansehen"
              className="min-h-[230px]"
            />
          ))}
        </div>
        <Link
          className="mt-7 inline-flex min-h-11 items-center font-semibold text-green-dark underline underline-offset-4"
          href="/orte"
        >
          Gesamtes Einsatzgebiet ansehen
        </Link>
      </ContentSection>

      <PageCta
        title={`Fahrt ab ${location.name} anfragen`}
        description="Senden Sie uns die vollständigen Fahrtdaten. Wir prüfen Ihre Anfrage persönlich und bestätigen die Fahrt ausdrücklich."
      />
    </>
  );
}

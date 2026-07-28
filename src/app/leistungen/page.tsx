import Image from "next/image";

import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ProcessStep } from "@/components/ui/process-step";
import { ServiceCard } from "@/components/ui/service-card";
import { supportPoints } from "@/content/home";
import { allServices } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Leistungen | Krankenfahrten Bad Homburg", "Übersicht der sitzenden Krankenfahrten in Bad Homburg für Arzt, Klinik, Dialyse, Therapie, Entlassung und wiederkehrende Termine.", "/leistungen/");

export default function ServicesPage() {
  return <>
    <PageHero
      eyebrow="Unsere Leistungen"
      title="Sitzende Krankenfahrten passend zu Ihrem Termin"
      description="Wir organisieren Fahrten für Personen, die während der Beförderung sicher sitzen können. Jede Fahrt wird persönlich abgestimmt und erst nach ausdrücklicher Bestätigung verbindlich."
      image={{
        src: "/images/services/leistungen-hero.webp",
        alt: "Fahrer und älterer Fahrgast stehen neben einem Fahrzeug vor einer Praxis.",
        width: 1400,
        height: 900,
        position: "object-[40%_center]",
      }}
    />
    <ContentSection id="service-overview" title="Fahrten für unterschiedliche Behandlungssituationen" description="Die Durchführung erfolgt nach Verfügbarkeit und auf Grundlage der bestätigten Fahrtdaten.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{allServices.map((service, index) => <ServiceCard key={service.slug} title={service.title} description={service.description} href={`/leistungen/${service.slug}`} linkText="Details ansehen" icon={<Image src={service.icon} alt="" width={34} height={34} />} className={index === allServices.length - 1 ? "lg:col-span-2 lg:min-h-[260px]" : undefined} />)}</div>
    </ContentSection>
    <ContentSection id="personal-support" eyebrow="Persönliche Unterstützung" title="Unterstützung rund um die Fahrt" muted><InfoList items={supportPoints} /></ContentSection>
    <ContentSection id="service-limits" title="Klare Leistungsgrenzen">
      <NoticeBox title="Ausschließlich sitzende Beförderung" variant="warning"><p>Keine Rollstuhl-, Tragestuhl- oder Liegendtransporte. Keine medizinische Betreuung oder Überwachung während der Fahrt.</p></NoticeBox>
    </ContentSection>
    <ContentSection id="service-process" title="Von der Anfrage zur bestätigten Fahrt" description="Sie senden Ihre Fahrtdaten, wir stimmen die Details ab und bestätigen die Fahrt ausdrücklich." muted><ol className="relative grid gap-8 md:grid-cols-3 md:gap-10 before:absolute before:top-7 before:right-[16%] before:left-[16%] before:hidden before:h-0.5 before:bg-[#dce2e9] md:before:block">{[{title:"Anfrage senden",description:"Anfrage zunächst unverbindlich senden"},{title:"Details abstimmen",description:"Fahrtdaten und mögliche Rückfahrt abstimmen"},{title:"Bestätigung erhalten",description:"Ausdrückliche Bestätigung abwarten"}].map((step,index)=><ProcessStep key={step.title} number={index+1} {...step} horizontal />)}</ol></ContentSection>
    <PageCta />
  </>;
}

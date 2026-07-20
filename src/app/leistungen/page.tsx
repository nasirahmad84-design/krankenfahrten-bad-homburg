import type { Metadata } from "next";
import Image from "next/image";

import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ServiceCard } from "@/components/ui/service-card";
import { supportPoints } from "@/content/home";
import { allServices } from "@/content/services";

export const metadata: Metadata = { title: "Leistungen | Krankenfahrten Bad Homburg", description: "Übersicht der sitzenden Krankenfahrten in Bad Homburg für Arzt, Klinik, Dialyse, Therapie, Entlassung und wiederkehrende Termine." };

export default function ServicesPage() {
  return <>
    <PageHero eyebrow="Unsere Leistungen" title="Sitzende Krankenfahrten passend zu Ihrem Termin" description="Wir organisieren Fahrten für Personen, die während der Beförderung sicher sitzen können. Jede Fahrt wird persönlich abgestimmt und erst nach ausdrücklicher Bestätigung verbindlich." />
    <ContentSection id="service-overview" title="Fahrten für unterschiedliche Behandlungssituationen" description="Die Durchführung erfolgt nach Verfügbarkeit und auf Grundlage der bestätigten Fahrtdaten.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{allServices.map((service) => <ServiceCard key={service.title} {...service} linkText="Details vormerken" icon={<Image src={service.icon} alt="" width={34} height={34} />} />)}</div>
    </ContentSection>
    <ContentSection id="personal-support" eyebrow="Persönliche Unterstützung" title="Unterstützung rund um die Fahrt" muted><InfoList items={supportPoints} /></ContentSection>
    <ContentSection id="service-limits" title="Klare Leistungsgrenzen">
      <NoticeBox title="Ausschließlich sitzende Beförderung" variant="warning"><p>Keine Rollstuhl-, Tragestuhl- oder Liegendtransporte. Keine medizinische Betreuung oder Überwachung während der Fahrt.</p></NoticeBox>
    </ContentSection>
    <ContentSection id="service-process" title="Von der Anfrage zur bestätigten Fahrt" description="Sie senden Ihre Fahrtdaten, wir stimmen die Details ab und bestätigen die Fahrt ausdrücklich." muted><InfoList items={["Anfrage zunächst unverbindlich senden", "Fahrtdaten und mögliche Rückfahrt abstimmen", "Ausdrückliche Bestätigung abwarten"]} columns={3} /></ContentSection>
    <PageCta />
  </>;
}

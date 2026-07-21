import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ProcessStep } from "@/components/ui/process-step";
import { fullProcessSteps } from "@/content/process";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Ablauf einer Krankenfahrt | Krankenfahrten Bad Homburg", "Vom unverbindlichen Fahrtwunsch über Abstimmung und Bestätigung bis zur sitzenden Hin- und möglichen Rückfahrt.", "/ablauf/");

export default function ProcessPage() {
  return <>
    <PageHero eyebrow="So funktioniert es" title="Klar abgestimmt von der Anfrage bis zur Rückfahrt" description="Die Anfrage ist zunächst unverbindlich. Erst nach unserer ausdrücklichen Bestätigung gilt eine Fahrt als vereinbart." />
    <ContentSection id="full-process" title="Der Ablauf in sieben Schritten"><ol className="relative grid gap-11 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-0.5 before:bg-[#dce2e9] sm:before:left-7">{fullProcessSteps.map((step, index) => <ProcessStep key={step.title} number={index + 1} {...step} />)}</ol></ContentSection>
    <ContentSection id="needed-details" title="Diese Angaben helfen bei der Abstimmung" muted><InfoList items={["Abholadresse und Zieladresse", "Datum, Uhrzeit und Terminbeginn", "Telefonische Erreichbarkeit", "Fahrtanlass ohne medizinische Diagnose", "Gewünschte Hin- oder Rückfahrt", "Vorhandene Verordnung oder Genehmigung, falls relevant"]} /></ContentSection>
    <ContentSection id="preparation" title="Vorbereitung und Änderungen"><InfoList items={["Bitte zum bestätigten Abholzeitpunkt bereit sein.", "Änderungen an Termin, Ort oder Rückfahrt möglichst früh mitteilen.", "Kurzfristige Änderungen und zusätzliche Fahrten bleiben von der Verfügbarkeit abhängig."]} columns={3} /></ContentSection>
    <ContentSection id="binding-notice" title="Wann ist die Fahrt verbindlich?" muted><NoticeBox title="Bestätigung abwarten" variant="information"><p>Eine abgesendete oder telefonisch aufgenommene Anfrage ist noch keine Buchung. Maßgeblich ist unsere ausdrückliche Bestätigung.</p></NoticeBox></ContentSection>
    <PageCta />
  </>;
}

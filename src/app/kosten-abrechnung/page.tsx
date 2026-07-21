import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ProcessStep } from "@/components/ui/process-step";
import { billingFaq, billingRequirements, billingSteps } from "@/content/billing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Kosten & Abrechnung | Krankenfahrten Bad Homburg", "Sachliche Hinweise zu Verordnung, Genehmigung, möglicher Krankenkassenabrechnung und Selbstzahlung bei Krankenfahrten in Bad Homburg.", "/kosten-abrechnung/");

export default function BillingPage() {
  return <>
    <PageHero eyebrow="Kosten & Abrechnung" title="Kostenübernahme immer individuell klären" description="Je nach persönlicher Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Ob und in welchem Umfang Kosten übernommen werden, muss im Einzelfall geklärt werden." />
    <ContentSection id="billing-requirements" title="Mögliche Voraussetzungen und Unterlagen"><InfoList items={billingRequirements} /></ContentSection>
    <ContentSection id="billing-process" title="So kann die Kostenklärung ablaufen" muted><ol className="relative grid gap-8 md:grid-cols-3 md:gap-10 before:absolute before:top-7 before:right-[16%] before:left-[16%] before:hidden before:h-0.5 before:bg-[#dce2e9] md:before:block">{billingSteps.map((step, index) => <ProcessStep key={step.title} number={index + 1} {...step} horizontal />)}</ol></ContentSection>
    <ContentSection id="self-pay" title="Selbstzahlung und Serienfahrten"><InfoList items={billingFaq} columns={2} /></ContentSection>
    <ContentSection id="billing-notice" title="Wichtiger Abrechnungshinweis" muted><NoticeBox title="Keine automatische Kostenübernahme" variant="billing"><p>Eine Verordnung allein ist keine pauschale Kostenzusage. Bitte klären Sie die Voraussetzungen und die vorgesehene Abrechnung vor Fahrtbeginn.</p></NoticeBox></ContentSection>
    <PageCta title="Abrechnung und Fahrt vorab abstimmen" />
  </>;
}

import type { Metadata } from "next";

import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { ProcessStep } from "@/components/ui/process-step";
import { billingFaq, billingRequirements, billingSteps } from "@/content/billing";

export const metadata: Metadata = { title: "Kosten & Abrechnung | Krankenfahrten Bad Homburg", description: "Sachliche Hinweise zu Verordnung, Genehmigung, möglicher Krankenkassenabrechnung und Selbstzahlung bei Krankenfahrten in Bad Homburg." };

export default function BillingPage() {
  return <>
    <PageHero eyebrow="Kosten & Abrechnung" title="Kostenübernahme immer individuell klären" description="Je nach persönlicher Voraussetzung kann eine Abrechnung mit der Krankenkasse möglich sein. Ob und in welchem Umfang Kosten übernommen werden, muss im Einzelfall geklärt werden." />
    <ContentSection id="billing-requirements" title="Mögliche Voraussetzungen und Unterlagen"><InfoList items={billingRequirements} /></ContentSection>
    <ContentSection id="billing-process" title="So kann die Kostenklärung ablaufen" muted><ol className="relative grid gap-10 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-0.5 before:bg-[#dce2e9] sm:before:left-7">{billingSteps.map((step, index) => <ProcessStep key={step.title} number={index + 1} {...step} />)}</ol></ContentSection>
    <ContentSection id="self-pay" title="Selbstzahlung und Serienfahrten"><InfoList items={billingFaq} columns={2} /></ContentSection>
    <ContentSection id="billing-notice" title="Wichtiger Abrechnungshinweis" muted><NoticeBox title="Keine automatische Kostenübernahme" variant="billing"><p>Eine Verordnung allein ist keine pauschale Kostenzusage. Bitte klären Sie die Voraussetzungen und die vorgesehene Abrechnung vor Fahrtbeginn.</p></NoticeBox></ContentSection>
    <PageCta title="Abrechnung und Fahrt vorab abstimmen" />
  </>;
}

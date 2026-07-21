import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { fullFaq } from "@/content/faq";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Häufige Fragen | Krankenfahrten Bad Homburg", "Antworten zu sitzenden Krankenfahrten, Anfrage, Verfügbarkeit, Hin- und Rückfahrt, Kostenklärung und Leistungsgrenzen.", "/faq/");

export default function FaqPage() {
  return <>
    <PageHero eyebrow="Häufige Fragen" title="Antworten für Fahrgäste und Angehörige" description="Hier finden Sie sachliche Hinweise zu Leistungen, Ablauf, Abrechnung, Verfügbarkeit und den Grenzen unseres Fahrdienstes." />
    <ContentSection id="all-faq" title="Fragen rund um Ihre Fahrt"><FaqAccordion items={fullFaq} /></ContentSection>
    <PageCta title="Ihre Frage ist noch offen?" description="Rufen Sie uns an oder senden Sie eine unverbindliche Anfrage. Wir klären die Fahrtdetails persönlich mit Ihnen." />
  </>;
}

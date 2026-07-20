import type { Metadata } from "next";

import { RideRequestForm } from "@/components/forms/ride-request-form";
import { ContentSection } from "@/components/sections/content-section";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { contactAvailability } from "@/content/contact";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Fahrt anfragen | Krankenfahrten Bad Homburg", description: "Kontakt und technisch vorbereitete Anfrage für eine sitzende Krankenfahrt in Bad Homburg. Verbindlich erst nach ausdrücklicher Bestätigung." };

export default function ContactPage() {
  return <>
    <PageHero eyebrow="Kontakt & Fahrt anfragen" title="Ihre Fahrt unverbindlich anfragen" description="Rufen Sie uns direkt an oder tragen Sie die Fahrtdaten in das technisch vorbereitete Formular ein. Es findet noch keine Übermittlung statt." />
    <ContentSection id="contact-options" title="Direkter Kontakt">
      <div className="grid gap-5 md:grid-cols-3">
        <ContactCard label="Telefon" value={siteConfig.phone.display} href={siteConfig.phone.href} />
        <ContactCard label="E-Mail" value={siteConfig.email.address} href={siteConfig.email.href} breakText />
        <ContactCard label="Adresse" value={`${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`} />
      </div>
      <div className="mt-6"><InfoList items={contactAvailability} columns={3} /></div>
    </ContentSection>
    <ContentSection id="request-form" title="Fahrtdaten eingeben" description="Pflichtfelder dienen ausschließlich der lokalen technischen Prüfung. Das Formular sendet und speichert keine Daten." muted><RideRequestForm /></ContentSection>
    <ContentSection id="contact-notices" title="Wichtige Hinweise">
      <div className="grid gap-5 lg:grid-cols-2">
        <NoticeBox title="Datenschutz und Verbindlichkeit" variant="information"><p>Bitte übermitteln Sie keine medizinischen Diagnosen oder Notfalldaten. Die Anfrage wird erst nach ausdrücklicher Bestätigung verbindlich. Hinweise zum Datenschutz finden Sie unter <a className="font-semibold underline" href="/datenschutz">Datenschutz</a>.</p></NoticeBox>
        <NoticeBox title="Kein medizinischer Notfalldienst" variant="warning"><p>In akuten Notfällen wählen Sie <strong className="text-xl">112</strong>.</p></NoticeBox>
      </div>
    </ContentSection>
  </>;
}

function ContactCard({ label, value, href, breakText }: { label: string; value: string; href?: string; breakText?: boolean }) {
  const content = <><span className="text-sm font-semibold tracking-widest text-green uppercase">{label}</span><span className={`mt-3 text-[18px] leading-relaxed font-semibold text-navy ${breakText ? "break-all" : ""}`}>{value}</span></>;
  return href ? <a href={href} className="flex min-h-36 flex-col rounded-[20px] border border-[#dce2e9] bg-white p-6 transition hover:border-green hover:shadow-md">{content}</a> : <div className="flex min-h-36 flex-col rounded-[20px] border border-[#dce2e9] bg-white p-6">{content}</div>;
}

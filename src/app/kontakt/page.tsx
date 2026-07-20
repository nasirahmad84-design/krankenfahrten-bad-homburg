import type { Metadata } from "next";

import { RideRequestForm } from "@/components/forms/ride-request-form";
import { ContentSection } from "@/components/sections/content-section";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { contactAvailability } from "@/content/contact";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Fahrt anfragen | Krankenfahrten Bad Homburg", description: "Sitzende Krankenfahrt in Bad Homburg sicher und unverbindlich anfragen. Die Fahrt wird erst nach ausdrücklicher Bestätigung vereinbart." };
export const dynamic = "force-dynamic";

export default function ContactPage() {
  // Request-specific value for the server-validated minimum form completion time.
  // eslint-disable-next-line react-hooks/purity
  const formStartedAt = Date.now();
  return <>
    <PageHero eyebrow="Kontakt & Fahrt anfragen" title="Ihre Fahrt unverbindlich anfragen" description="Rufen Sie uns direkt an oder übermitteln Sie Ihre Fahrtdaten sicher über das Formular. Eine Fahrt gilt erst nach unserer ausdrücklichen Bestätigung als vereinbart." />
    <ContentSection id="contact-options" title="Direkter Kontakt">
      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        <ContactCard icon="☎" label="Telefon" value={siteConfig.phone.display} href={siteConfig.phone.href} />
        <ContactCard icon="@" label="E-Mail" value={siteConfig.email.address} href={siteConfig.email.href} breakText />
        <ContactCard icon="⌂" label="Adresse" value={`${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`} />
      </div>
      <div className="mt-5 rounded-2xl border border-[#dce2e9] bg-[#f6f9fc] px-4 py-2 md:mt-6 md:bg-transparent md:p-0"><InfoList items={contactAvailability} columns={3} compactMobile /></div>
    </ContentSection>
    <ContentSection id="request-form" title="Fahrtdaten eingeben" description="Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung der unverbindlichen Fahrtanfrage und speichern sie nicht in einer Datenbank." muted><RideRequestForm formStartedAt={formStartedAt} /></ContentSection>
    <ContentSection id="contact-notices" title="Wichtige Hinweise">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <NoticeBox title="Datenschutz und Verbindlichkeit" variant="information" className="rounded-2xl p-5 text-[17px] leading-[1.7] sm:p-7"><p>Bitte übermitteln Sie keine medizinischen Diagnosen oder Notfalldaten. Die Anfrage wird erst nach ausdrücklicher Bestätigung verbindlich. Hinweise zum Datenschutz finden Sie unter <a className="font-semibold underline" href="/datenschutz">Datenschutz</a>.</p></NoticeBox>
        <NoticeBox title="Kein medizinischer Notfalldienst" variant="warning" className="rounded-2xl p-5 text-[17px] leading-[1.7] sm:p-7"><p>In akuten Notfällen wählen Sie <strong className="ml-1 text-[26px] text-navy">112</strong>.</p></NoticeBox>
      </div>
    </ContentSection>
  </>;
}

function ContactCard({ icon, label, value, href, breakText }: { icon: string; label: string; value: string; href?: string; breakText?: boolean }) {
  const content = <><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f7eb] text-lg font-bold text-green" aria-hidden="true">{icon}</span><span className="min-w-0"><span className="block text-[13px] font-semibold tracking-[0.12em] text-green uppercase">{label}</span><span className={`mt-1 block text-[17px] leading-[1.45] font-semibold text-navy md:mt-3 md:text-[18px] ${breakText ? "break-words [overflow-wrap:anywhere]" : ""}`}>{value}</span></span></>;
  const classes = "flex min-h-[72px] items-center gap-4 rounded-2xl border border-[#dce2e9] bg-white p-4 transition md:min-h-36 md:flex-col md:items-start md:gap-0 md:rounded-[20px] md:p-6";
  return href ? <a href={href} className={`${classes} hover:border-green hover:shadow-md`}>{content}</a> : <div className={classes}>{content}</div>;
}

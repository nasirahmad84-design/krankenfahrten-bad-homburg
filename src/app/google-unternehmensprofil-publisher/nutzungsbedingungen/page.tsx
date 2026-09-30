import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Publisher-Nutzungsbedingungen | Krankenfahrten Bad Homburg",
  "Nutzungsbedingungen für den internen Google-Unternehmensprofil-Publisher von Krankenfahrten Bad Homburg mit Angaben zu Zugriff und Kontakt.",
  "/google-unternehmensprofil-publisher/nutzungsbedingungen/",
);

export default function PublisherTermsPage() {
  return <>
    <PageHero eyebrow="Redaktionelles Werkzeug" title="Nutzungsbedingungen des Publishers" description="Diese Bedingungen betreffen nur das interne Werkzeug zur Veröffentlichung freigegebener Beiträge im Google-Unternehmensprofil." />
    <section className="bg-white py-12 sm:py-16" aria-labelledby="terms-scope">
      <SiteContainer className="max-w-4xl space-y-8 text-base leading-7 text-[#344256]">
        <div>
          <h2 id="terms-scope" className="text-2xl font-bold text-navy">Nutzung und Zugang</h2>
          <p className="mt-4">Das Werkzeug ist nur für den Betreiber und von ihm berechtigte Personen vorgesehen. Ein Google-Konto darf nur verbunden werden, wenn die nutzende Person zur Verwaltung des betreffenden Unternehmensprofils berechtigt ist. Für Websitebesucher besteht kein Zugang und keine Nutzungspflicht.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Veröffentlichungen</h2>
          <p className="mt-4">Veröffentlicht werden ausschließlich redaktionell freigegebene Kurzbeiträge mit Link zum Ratgeber. Die Verbindung kann über die Einstellungen des Google-Kontos widerrufen werden. Ein Widerruf verhindert weitere Zugriffe über die Verbindung, entfernt aber bereits veröffentlichte Beiträge nicht automatisch.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Betreiber und Hinweise</h2>
          <p className="mt-4">Betreiber ist {siteConfig.operator}, Krankenfahrten Bad Homburg. Das Werkzeug steht in keiner Partnerschaft oder Sponsoringbeziehung mit Google. Es ist kein Buchungssystem und ersetzt keine persönliche Bestätigung einer Fahrt. Fragen richten Sie bitte an <a className="text-navy underline underline-offset-4" href={siteConfig.email.href}>{siteConfig.email.address}</a>.</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link className="font-semibold text-navy underline underline-offset-4" href="/google-unternehmensprofil-publisher/">Zur App-Beschreibung</Link>
            <Link className="font-semibold text-navy underline underline-offset-4" href="/datenschutz/">Datenschutzerklärung</Link>
            <Link className="font-semibold text-navy underline underline-offset-4" href="/impressum/">Impressum</Link>
          </div>
        </div>
      </SiteContainer>
    </section>
  </>;
}

import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

const path = "/google-unternehmensprofil-publisher/";

export const metadata = createPageMetadata(
  "Unternehmensprofil-Publisher | Krankenfahrten Bad Homburg",
  "Informationen zur internen Redaktion von Krankenfahrten Bad Homburg: Zweck, Google-Profilzugriff, Datenschutz und Kontakt für berechtigte Nutzer.",
  path,
);

export default function GoogleBusinessPublisherPage() {
  return <>
    <PageHero eyebrow="Redaktionelles Werkzeug" title="Krankenfahrten Bad Homburg Redaktion" description="Der Unternehmensprofil-Publisher hilft uns, freigegebene Ratgeberinhalte im eigenen Google-Unternehmensprofil zu veröffentlichen." />
    <section className="bg-white py-12 sm:py-16" aria-labelledby="publisher-purpose">
      <SiteContainer className="max-w-4xl space-y-8 text-base leading-7 text-[#344256]">
        <div>
          <h2 id="publisher-purpose" className="text-2xl font-bold text-navy">Zweck und Funktionsweise</h2>
          <p className="mt-4">Dieses Werkzeug ist ausschließlich für {siteConfig.operator} und berechtigte Mitwirkende der Redaktion bestimmt. Es prüft bestehende Beiträge, um doppelte Veröffentlichungen zu vermeiden, und kann freigegebene Artikelzusammenfassungen mit einem Link zum vollständigen Ratgeber im Google-Unternehmensprofil veröffentlichen.</p>
          <p className="mt-4">Für den Zugriff ist eine gesonderte Google-Autorisierung erforderlich. Die Berechtigung <code>business.manage</code> ermöglicht technisch die Verwaltung des Unternehmensprofils; unser Publisher ist auf das Lesen vorhandener Beiträge und das Erstellen freigegebener Beiträge ausgelegt. Die automatische Veröffentlichung ist derzeit noch nicht aktiviert.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Keine Fahrgastdaten</h2>
          <p className="mt-4">Fahrtanfragen, Kontaktdaten von Fahrgästen und Gesundheitsangaben sind nicht Teil dieses Veröffentlichungsablaufs. Besucher dieser Website müssen sich weder bei Google anmelden noch den Publisher verwenden.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Betreiber und Kontakt</h2>
          <p className="mt-4">Betreiber: {siteConfig.operator}, Krankenfahrten Bad Homburg. Bei Fragen zur App oder zum Zugriff schreiben Sie an <a className="text-navy underline underline-offset-4" href={siteConfig.email.href}>{siteConfig.email.address}</a>.</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link className="font-semibold text-navy underline underline-offset-4" href="/datenschutz/">Datenschutzerklärung</Link>
            <Link className="font-semibold text-navy underline underline-offset-4" href="/google-unternehmensprofil-publisher/nutzungsbedingungen/">Nutzungsbedingungen</Link>
            <Link className="font-semibold text-navy underline underline-offset-4" href="/impressum/">Impressum</Link>
          </div>
        </div>
      </SiteContainer>
    </section>
  </>;
}

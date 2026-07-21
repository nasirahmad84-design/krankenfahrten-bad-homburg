import { LegalPage } from "@/components/legal/legal-page";
import { imprintContent } from "@/content/legal/imprint";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata("Impressum | Krankenfahrten Bad Homburg", "Sachliche Anbieterkennzeichnung der Website Krankenfahrten Bad Homburg.", "/impressum/");

export default function ImprintPage() {
  return (
    <LegalPage {...imprintContent} afterSections={
      <p className="mt-10 text-[17px] leading-relaxed text-[#475569]">
        Kontakt per <a className="font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href={siteConfig.phone.href}>Telefon</a> oder <a className="font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href={siteConfig.email.href}>E-Mail</a>.
      </p>
    } />
  );
}

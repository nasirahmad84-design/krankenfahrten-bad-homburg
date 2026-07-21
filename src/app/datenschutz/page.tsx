import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
import { privacyContent } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Datenschutz | Krankenfahrten Bad Homburg",
  description: "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website und bei Fahrtanfragen.",
};

export default function PrivacyPage() {
  return (
    <LegalPage {...privacyContent} afterSections={
      <p className="mt-10 rounded-xl bg-[#f0f7eb] p-5 text-[16px] leading-relaxed text-navy">
        Den aktuellen technischen Cookie- und Speicherstatus finden Sie unter <Link className="font-semibold underline decoration-green-dark decoration-2 underline-offset-4" href="/cookie-einstellungen/">Cookie-Einstellungen</Link>.
      </p>
    } />
  );
}

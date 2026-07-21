import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/legal-page";
import { cookieContent } from "@/content/legal/cookies";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen | Krankenfahrten Bad Homburg",
  description: "Informationen zu Cookies und ähnlichen Technologien auf dieser Website.",
};

export default function CookieSettingsPage() {
  return (
    <LegalPage
      {...cookieContent}
      introduction={<p className="mb-8 rounded-2xl border border-green/40 bg-[#f0f7eb] p-5 text-[17px] leading-[1.7] font-semibold text-navy sm:p-6">{cookieContent.status}</p>}
      afterSections={<p className="mt-10 text-[17px] leading-relaxed text-[#475569]">Mehr über die damit verbundenen Datenverarbeitungen erfahren Sie in der <Link className="font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href="/datenschutz/">Datenschutzerklärung</Link>.</p>}
    />
  );
}

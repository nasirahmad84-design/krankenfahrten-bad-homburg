"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import {
  getAnalyticsConsent,
  initializeGoogleAnalytics,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  trackAnalyticsEvent,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";

export function AnalyticsConsentManager() {
  const pathname = usePathname();
  const consent = useSyncExternalStore<AnalyticsConsent>(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    () => "unset",
  );
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "granted") return;
    initializeGoogleAnalytics();
    if (lastTrackedPath.current !== pathname) {
      trackPageView(pathname);
      lastTrackedPath.current = pathname;
    }
  }, [consent, pathname]);

  useEffect(() => {
    function handleTrackedLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackAnalyticsEvent("click_phone");
      else if (href.startsWith("https://wa.me/")) trackAnalyticsEvent("click_whatsapp");
      else if (href.startsWith("https://g.page/")) trackAnalyticsEvent("click_google_review");
    }

    document.addEventListener("click", handleTrackedLink);
    return () => document.removeEventListener("click", handleTrackedLink);
  }, []);

  if (consent !== "unset") return null;

  return (
    <aside className="analytics-consent-banner fixed inset-x-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-[#cfd7e3] bg-white p-5 shadow-[0_18px_60px_rgba(2,31,88,0.24)] sm:p-6" aria-labelledby="analytics-consent-title">
      <h2 id="analytics-consent-title" className="text-xl font-bold text-navy">
        Dürfen wir die Nutzung der Website messen?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
        Mit Ihrer Zustimmung verwenden wir Google Analytics, um Seitenaufrufe und Kontaktaktionen auszuwerten. Fahrtangaben und Formularinhalte werden nicht an Google übermittelt.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" className="min-h-12 rounded-xl border border-navy/30 px-5 py-3 font-semibold text-navy transition-colors hover:bg-navy/5" onClick={() => setAnalyticsConsent("denied")}>
          Nur notwendige Cookies
        </button>
        <button type="button" className="min-h-12 rounded-xl bg-green px-5 py-3 font-semibold text-navy transition-colors hover:bg-green-light" onClick={() => setAnalyticsConsent("granted")}>
          Analyse erlauben
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#5b697a]">
        Ihre Auswahl können Sie jederzeit in den <Link className="font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href="/cookie-einstellungen/">Cookie-Einstellungen</Link> ändern.
      </p>
    </aside>
  );
}

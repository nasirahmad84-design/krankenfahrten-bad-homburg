"use client";

import { useSyncExternalStore } from "react";

import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";

const statusLabels: Record<AnalyticsConsent, string> = {
  granted: "Analyse ist erlaubt.",
  denied: "Analyse ist abgelehnt.",
  unset: "Es wurde noch keine Auswahl gespeichert.",
};

export function AnalyticsConsentSettings() {
  const consent = useSyncExternalStore<AnalyticsConsent>(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    () => "unset",
  );

  return (
    <section className="mt-10 rounded-2xl border border-[#dce2e9] bg-[#f6f9fc] p-5 sm:p-7" aria-labelledby="analytics-settings-title">
      <h2 id="analytics-settings-title" className="text-xl font-bold text-navy">Analyse-Einstellung ändern</h2>
      <p className="mt-2 text-[16px] leading-relaxed text-[#475569]" aria-live="polite">{statusLabels[consent]}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" className="min-h-12 rounded-xl border border-navy/30 px-5 py-3 font-semibold text-navy transition-colors hover:bg-navy/5" onClick={() => setAnalyticsConsent("denied")}>
          Analyse deaktivieren
        </button>
        <button type="button" className="min-h-12 rounded-xl bg-green px-5 py-3 font-semibold text-navy transition-colors hover:bg-green-light" onClick={() => setAnalyticsConsent("granted")}>
          Analyse erlauben
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#5b697a]">Eine Änderung gilt für zukünftige Seitenaufrufe. Beim Deaktivieren entfernen wir vorhandene Google-Analytics-Cookies dieser Website.</p>
    </section>
  );
}

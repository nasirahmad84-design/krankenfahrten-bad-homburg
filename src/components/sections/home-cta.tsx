import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-24" aria-labelledby="contact-cta-title">
      <div className="absolute -top-32 -right-24 size-96 rounded-full border-[48px] border-white/5" aria-hidden="true" />
      <SiteContainer className="relative">
        <p className="home-eyebrow">Fahrt anfragen</p>
        <h2 id="contact-cta-title" className="mt-4 max-w-4xl text-[34px] leading-[1.2] font-bold sm:text-[44px] lg:text-5xl">Sie benötigen eine sitzende Krankenfahrt?</h2>
        <p className="mt-6 max-w-3xl text-[18px] leading-[1.7] text-white/85">Rufen Sie uns direkt an oder senden Sie Ihre Fahrtdaten über die Kontaktseite. Ihre Anfrage ist unverbindlich und wird erst nach unserer ausdrücklichen Bestätigung zur Buchung.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={siteConfig.phone.href} size="large" className="min-h-[54px] w-full rounded-xl px-7 text-base sm:w-auto">Jetzt anrufen</Button>
          <Button href="/kontakt" variant="outline" size="large" className="min-h-[54px] w-full rounded-xl border-white bg-white px-7 text-base text-navy hover:bg-white/90 sm:w-auto">Fahrt online anfragen</Button>
        </div>
        <aside className="mt-10 max-w-4xl rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm sm:p-6" role="note" aria-label="Notfallhinweis">
          <p className="text-base leading-relaxed font-semibold"><span className="mr-2" aria-hidden="true">⚠</span>Kein medizinischer Notfalldienst. In akuten Notfällen wählen Sie <strong className="ml-1 text-2xl text-white">112</strong>.</p>
        </aside>
      </SiteContainer>
    </section>
  );
}

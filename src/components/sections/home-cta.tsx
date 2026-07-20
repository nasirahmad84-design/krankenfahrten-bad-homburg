import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function HomeCta() {
  return (
    <section className="bg-navy py-12 text-white sm:py-16" aria-labelledby="contact-cta-title">
      <SiteContainer>
        <p className="home-eyebrow">Fahrt anfragen</p>
        <h2 id="contact-cta-title" className="mt-3 max-w-3xl text-[30px] leading-[1.25] font-bold sm:text-4xl">Sie benötigen eine sitzende Krankenfahrt?</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85">Rufen Sie uns direkt an oder senden Sie Ihre Fahrtdaten über die Kontaktseite. Ihre Anfrage ist unverbindlich und wird erst nach unserer ausdrücklichen Bestätigung zur Buchung.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={siteConfig.phone.href} size="large" className="w-full rounded-xl sm:w-auto">Jetzt anrufen</Button>
          <Button href="/kontakt" variant="outline" size="large" className="w-full rounded-xl border-white bg-white text-navy hover:bg-white/90 sm:w-auto">Fahrt online anfragen</Button>
        </div>
        <aside className="mt-8 rounded-xl border border-white/30 bg-white/10 p-4" role="note" aria-label="Notfallhinweis">
          <p className="font-semibold"><span aria-hidden="true">⚠ </span>Kein medizinischer Notfalldienst. In akuten Notfällen wählen Sie <strong className="text-xl text-white">112</strong>.</p>
        </aside>
      </SiteContainer>
    </section>
  );
}

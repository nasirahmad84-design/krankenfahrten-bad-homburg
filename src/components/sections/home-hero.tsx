import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function HomeHero() {
  return (
    <section className="bg-[#f6f9fc] py-10 sm:py-14 lg:py-[72px]" aria-labelledby="home-hero-title">
      <SiteContainer className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,480px)] lg:gap-16">
        <div>
          <p className="home-eyebrow">Sitzende Krankenfahrten in Bad Homburg</p>
          <h1 id="home-hero-title" className="mt-5 max-w-[680px] text-[36px] leading-[1.18] font-bold tracking-[-0.025em] text-navy sm:text-5xl lg:text-[58px] lg:leading-[1.12]">
            Zuverlässig zu Ihrer Behandlung. Persönlich an Ihrer Seite.
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.55] text-[#5b697a] lg:text-lg">
            Wir bringen Sie sicher zu Arzt, Klinik, Dialyse, Therapie und Reha – mit Unterstützung beim Ein- und Aussteigen und auf Wunsch bis zur Anmeldung.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/kontakt" size="large" className="w-full rounded-xl sm:w-auto">Fahrt anfragen</Button>
            <Button href={siteConfig.phone.href} variant="outline" size="large" className="w-full rounded-xl sm:w-auto">{siteConfig.phone.display}</Button>
          </div>
          <ul className="mt-7 grid gap-2 text-[15px] text-[#5b697a] sm:grid-cols-3" aria-label="Hinweise zur Anfrage">
            {["24/7 erreichbar", "Kurzfristig nach Verfügbarkeit", "Abrechnung im Einzelfall möglich"].map((item) => (
              <li key={item} className="flex gap-2"><span className="font-bold text-green" aria-hidden="true">✓</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[20px] bg-navy p-7 text-center text-white lg:min-h-[420px] lg:rounded-3xl">
          <span className="text-7xl font-bold" aria-hidden="true">✚</span>
          <p className="mt-4 text-[22px] font-semibold">Sicher. Persönlich. Regional.</p>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/80">Sitzende Krankenfahrten in Bad Homburg und Umgebung.</p>
        </div>
      </SiteContainer>
    </section>
  );
}

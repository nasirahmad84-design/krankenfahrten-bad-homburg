import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function HomeHero() {
  return (
    <section className="overflow-hidden bg-[#f6f9fc] py-12 sm:py-16 lg:py-20" aria-labelledby="home-hero-title">
      <SiteContainer className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.22fr)_minmax(420px,500px)] lg:gap-16 xl:gap-20">
        <div>
          <p className="home-eyebrow">Sitzende Krankenfahrten in Bad Homburg</p>
          <h1 id="home-hero-title" className="mt-5 max-w-[720px] text-[38px] leading-[1.16] font-bold tracking-[-0.035em] text-navy sm:text-5xl lg:text-[62px] lg:leading-[1.08] xl:text-[66px]">
            Zuverlässig zu Ihrer Behandlung. Persönlich an Ihrer Seite.
          </h1>
          <p className="mt-7 max-w-[660px] text-[18px] leading-[1.65] text-[#5b697a] lg:text-xl">
            Wir bringen Sie sicher zu Arzt, Klinik, Dialyse, Therapie und Reha – mit Unterstützung beim Ein- und Aussteigen und auf Wunsch bis zur Anmeldung.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/kontakt" size="large" className="min-h-[54px] w-full rounded-xl px-7 text-base sm:w-auto">Fahrt anfragen</Button>
            <Button href={siteConfig.phone.href} variant="outline" size="large" className="min-h-[54px] w-full rounded-xl px-7 text-base sm:w-auto">{siteConfig.phone.display}</Button>
          </div>
          <ul className="mt-8 grid gap-3 text-base leading-snug text-[#5b697a] sm:grid-cols-3" aria-label="Hinweise zur Anfrage">
            {["24/7 erreichbar", "Kurzfristig nach Verfügbarkeit", "Abrechnung im Einzelfall möglich"].map((item) => (
              <li key={item} className="flex gap-2"><span className="font-bold text-green" aria-hidden="true">✓</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[24px] bg-navy p-8 text-white shadow-[0_24px_60px_rgba(2,31,88,0.2)] lg:min-h-[460px] lg:p-10">
          <div className="absolute -top-20 -right-20 size-64 rounded-full border-[36px] border-white/7" aria-hidden="true" />
          <div className="absolute top-12 left-10 size-32 rounded-[28px] bg-green shadow-[0_18px_35px_rgba(0,0,0,0.18)] lg:size-36" aria-hidden="true">
            <span className="absolute inset-0 flex items-center justify-center text-[76px] leading-none font-bold text-white">+</span>
          </div>
          <div className="absolute top-[118px] right-10 flex h-28 w-44 rotate-[-5deg] items-end rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm" aria-hidden="true">
            <span className="h-2 w-full rounded-full bg-white/35" />
          </div>
          <div className="relative mt-52 border-t border-white/20 pt-7">
            <p className="text-[24px] font-semibold lg:text-[27px]">Sicher. Persönlich. Regional.</p>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-white/80">Sitzende Krankenfahrten in Bad Homburg und Umgebung.</p>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

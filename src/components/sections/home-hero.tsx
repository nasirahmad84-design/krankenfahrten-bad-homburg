import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionImage } from "@/components/ui/section-image";
import { siteConfig } from "@/lib/site-config";

export function HomeHero() {
  return (
    <section className="overflow-hidden bg-[#f6f9fc] py-12 sm:py-16 lg:py-20" aria-labelledby="home-hero-title">
      <SiteContainer className="grid items-center gap-12 xl:grid-cols-[minmax(0,1.22fr)_minmax(420px,500px)] xl:gap-20">
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
        <SectionImage
          src="/images/home/hero-krankenfahrt.webp"
          alt="Fahrer öffnet einem älteren Fahrgast die hintere Fahrzeugtür."
          width={1800}
          height={1100}
          sizes="(max-width: 1279px) calc(100vw - 48px), 500px"
          preload
          className="aspect-[3/2] xl:aspect-[10/9]"
          imageClassName="object-[58%_center] xl:object-[55%_center]"
        />
      </SiteContainer>
    </section>
  );
}

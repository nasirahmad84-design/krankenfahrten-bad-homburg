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
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/kontakt" size="large" className="min-h-[54px] w-full rounded-xl px-7 text-base sm:w-auto">Fahrt anfragen</Button>
            <Button href={siteConfig.phone.href} variant="outline" size="large" className="min-h-[54px] w-full rounded-xl px-7 text-base sm:w-auto">{siteConfig.phone.display}</Button>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-[#25d366] px-7 py-3 text-base font-semibold text-navy transition-colors hover:bg-[#25d366]/10 sm:w-auto"
              aria-label="Krankenfahrten Bad Homburg über WhatsApp kontaktieren"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5 shrink-0 fill-[#128c7e]"
              >
                <path d="M12.04 2a9.84 9.84 0 0 0-8.45 14.86L2 22l5.28-1.55A9.98 9.98 0 1 0 12.04 2Zm0 17.98a8.06 8.06 0 0 1-4.1-1.12l-.3-.18-3.13.92.94-3.05-.2-.31a8.03 8.03 0 1 1 6.79 3.74Zm4.42-6.02c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.23 7.23 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
              WhatsApp
            </a>
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

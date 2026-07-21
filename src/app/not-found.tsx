import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center bg-[#f6f9fc] py-16 sm:py-24" aria-labelledby="not-found-title">
      <SiteContainer>
        <div className="mx-auto max-w-3xl rounded-[24px] border border-[#dce2e9] bg-white p-6 shadow-[0_16px_40px_rgba(2,31,88,0.08)] sm:p-10 lg:p-14">
          <p className="home-eyebrow">Fehler 404</p>
          <h1 id="not-found-title" className="mt-4 text-[38px] leading-[1.12] font-bold tracking-[-0.035em] text-navy sm:text-5xl">Seite nicht gefunden</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-[#5b697a]">Die aufgerufene Seite ist nicht verfügbar. Nutzen Sie die folgenden Wege, um zu den gewünschten Informationen zurückzukehren.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/" size="large">Zur Startseite</Button>
            <Button href="/leistungen/" variant="outline" size="large">Leistungen ansehen</Button>
            <Button href="/kontakt/" variant="outline" size="large">Kontakt aufnehmen</Button>
          </div>
          <p className="mt-8 border-t border-[#dce2e9] pt-6 text-[17px] leading-relaxed text-[#5b697a]">Sie erreichen uns auch telefonisch unter <a className="inline-flex min-h-11 items-center font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href={siteConfig.phone.href}>{siteConfig.phone.display}</a>.</p>
        </div>
      </SiteContainer>
    </section>
  );
}

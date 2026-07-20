import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type PageCtaProps = { title?: string; description?: string };

export function PageCta({ title = "Ihre Fahrt persönlich abstimmen", description = "Rufen Sie uns an oder senden Sie eine unverbindliche Anfrage. Eine Fahrt gilt erst nach unserer ausdrücklichen Bestätigung als vereinbart." }: PageCtaProps) {
  return (
    <section className="bg-navy py-14 text-white sm:py-18 lg:py-20" aria-labelledby="page-cta-title">
      <SiteContainer>
        <h2 id="page-cta-title" className="max-w-3xl text-[32px] leading-tight font-bold sm:text-[42px]">{title}</h2>
        <p className="mt-5 max-w-3xl text-[18px] leading-[1.7] text-white/80">{description}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button href="/kontakt" size="large" className="min-h-[54px] rounded-xl text-base">Fahrt anfragen</Button>
          <Button href={siteConfig.phone.href} variant="outline" size="large" className="min-h-[54px] rounded-xl border-white bg-white text-base text-navy hover:bg-white/90">{siteConfig.phone.display}</Button>
        </div>
      </SiteContainer>
    </section>
  );
}

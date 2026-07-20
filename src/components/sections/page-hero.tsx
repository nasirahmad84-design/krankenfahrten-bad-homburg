import { SiteContainer } from "@/components/layout/site-container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#f6f9fc] py-14 sm:py-20 lg:py-24" aria-labelledby="page-title">
      <div className="absolute -top-32 -right-24 size-96 rounded-full border-[48px] border-navy/5" aria-hidden="true" />
      <SiteContainer className="relative">
        <p className="home-eyebrow">{eyebrow}</p>
        <h1 id="page-title" className="mt-4 max-w-4xl text-[38px] leading-[1.12] font-bold tracking-[-0.035em] text-navy sm:text-5xl lg:text-[62px]">{title}</h1>
        <p className="mt-6 max-w-3xl text-[18px] leading-[1.7] text-[#5b697a] sm:text-xl">{description}</p>
      </SiteContainer>
    </section>
  );
}

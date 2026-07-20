import { SiteContainer } from "@/components/layout/site-container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#f6f9fc] py-14 sm:py-18 lg:py-20" aria-labelledby="page-title">
      <div className="absolute -top-28 -right-24 size-96 rounded-full border-[48px] border-navy/5" aria-hidden="true" />
      <div className="absolute top-1/2 right-[9%] hidden size-28 -translate-y-1/2 rotate-6 rounded-[28px] bg-green/15 lg:block" aria-hidden="true"><span className="flex size-full items-center justify-center text-6xl font-bold text-green/50">+</span></div>
      <SiteContainer className="relative">
        <div className="max-w-4xl lg:max-w-[68%]">
          <p className="home-eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="mt-4 text-[38px] leading-[1.12] font-bold tracking-[-0.035em] text-navy sm:text-5xl lg:text-[60px]">{title}</h1>
          <p className="mt-6 max-w-3xl text-[18px] leading-[1.7] text-[#5b697a] sm:text-xl">{description}</p>
        </div>
      </SiteContainer>
    </section>
  );
}

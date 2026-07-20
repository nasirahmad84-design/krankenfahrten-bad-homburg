type BenefitCardProps = {
  symbol: string;
  title: string;
  description: string;
};

export function BenefitCard({ symbol, title, description }: BenefitCardProps) {
  return (
    <article className="h-full min-h-[260px] rounded-[20px] border border-[#dce2e9] bg-white p-6 shadow-[0_8px_24px_rgba(2,31,88,0.05)] sm:p-7 lg:p-8">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-[#f0f7eb] text-[26px] font-semibold text-green" aria-hidden="true">
        {symbol}
      </span>
      <h3 className="mt-6 text-[22px] leading-[1.35] font-semibold text-navy">{title}</h3>
      <p className="mt-4 text-base leading-[1.65] text-[#5b697a]">{description}</p>
    </article>
  );
}

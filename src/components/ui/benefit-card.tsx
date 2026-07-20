type BenefitCardProps = {
  symbol: string;
  title: string;
  description: string;
};

export function BenefitCard({ symbol, title, description }: BenefitCardProps) {
  return (
    <article className="h-full rounded-[18px] border border-[#dce2e9] bg-white p-5 sm:p-6">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#f0f7eb] text-xl font-semibold text-green" aria-hidden="true">
        {symbol}
      </span>
      <h3 className="mt-4 text-[21px] leading-[1.45] font-semibold text-navy">{title}</h3>
      <p className="mt-3 text-[15px] leading-[1.55] text-[#5b697a]">{description}</p>
    </article>
  );
}

type ProcessStepProps = { number: number; title: string; description: string };

export function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <li className="relative pl-16 sm:pl-20">
      <span className="absolute top-0 left-0 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-green text-lg font-bold text-white shadow-md sm:size-14">{number}</span>
      <h3 className="pt-1 text-[21px] font-semibold text-navy sm:text-[22px]">{title}</h3>
      <p className="mt-3 text-base leading-[1.65] text-[#5b697a]">{description}</p>
    </li>
  );
}

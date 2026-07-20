import { classNames } from "@/lib/class-names";

type ProcessStepProps = { number: number; title: string; description: string; horizontal?: boolean };

export function ProcessStep({ number, title, description, horizontal = false }: ProcessStepProps) {
  return (
    <li className={classNames("relative pl-16 sm:pl-20", horizontal && "md:pl-0")}>
      <span className={classNames("absolute top-0 left-0 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-green text-lg font-bold text-white shadow-md sm:size-14", horizontal && "md:relative")}>{number}</span>
      <h3 className={classNames("pt-1 text-[21px] font-semibold text-navy sm:text-[22px]", horizontal && "md:mt-5 md:pt-0")}>{title}</h3>
      <p className="mt-3 text-base leading-[1.65] text-[#5b697a]">{description}</p>
    </li>
  );
}

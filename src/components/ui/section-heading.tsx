import { classNames } from "@/lib/class-names";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  headingLevel?: 2 | 3 | 4;
  titleId?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  headingLevel = 2,
  titleId,
  className,
}: SectionHeadingProps) {
  const Heading = headingLevel === 3 ? "h3" : headingLevel === 4 ? "h4" : "h2";

  return (
    <div
      className={classNames(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-[14px] font-semibold tracking-[0.12em] text-green-dark uppercase">
          {eyebrow}
        </p>
      )}
      <Heading id={titleId} className="text-section-title text-navy">{title}</Heading>
      {description && (
        <p className="mt-5 text-[18px] leading-[1.7] text-[#5b697a]">{description}</p>
      )}
    </div>
  );
}

import { classNames } from "@/lib/class-names";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  headingLevel = 2,
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
        <p className="mb-3 text-sm font-semibold tracking-widest text-green-dark uppercase">
          {eyebrow}
        </p>
      )}
      <Heading className="text-section-title text-navy">{title}</Heading>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-navy/70">{description}</p>
      )}
    </div>
  );
}

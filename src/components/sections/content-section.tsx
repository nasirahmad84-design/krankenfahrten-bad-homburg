import { SiteContainer } from "@/components/layout/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { classNames } from "@/lib/class-names";

type ContentSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
};

export function ContentSection({ id, eyebrow, title, description, children, muted, className }: ContentSectionProps) {
  return (
    <section className={classNames("home-section", muted ? "bg-[#f6f9fc]" : "bg-white", className)} aria-labelledby={id}>
      <SiteContainer>
        <SectionHeading titleId={id} eyebrow={eyebrow} title={title} description={description} className="home-section-heading" />
        <div className="mt-9">{children}</div>
      </SiteContainer>
    </section>
  );
}

import { SiteContainer } from "@/components/layout/site-container";
import { PageHero } from "@/components/sections/page-hero";
import type { LegalSectionContent } from "@/content/legal/types";

import { LegalSection } from "./legal-section";

type LegalPageProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly LegalSectionContent[];
  introduction?: React.ReactNode;
  afterSections?: React.ReactNode;
}>;

export function LegalPage({ eyebrow, title, description, sections, introduction, afterSections }: LegalPageProps) {
  return (
    <div className="legal-page">
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <SiteContainer className="py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-[52rem]">
          {introduction}
          <nav className="legal-jump-nav mb-12 rounded-2xl border border-[#dce2e9] bg-[#f6f9fc] p-5 sm:p-7" aria-label={`Inhaltsverzeichnis ${title}`}>
            <h2 className="text-lg font-bold text-navy">Auf dieser Seite</h2>
            <ol className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a className="inline-flex min-h-11 items-center py-1 text-[15px] leading-snug font-semibold text-navy underline decoration-green decoration-2 underline-offset-4 hover:text-green-dark" href={`#${section.id}`}>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-9 sm:space-y-11">
            {sections.map((section) => <LegalSection key={section.id} section={section} />)}
          </div>
          {afterSections}
        </div>
      </SiteContainer>
    </div>
  );
}

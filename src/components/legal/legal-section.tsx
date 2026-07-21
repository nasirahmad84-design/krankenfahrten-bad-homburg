import type { LegalSectionContent } from "@/content/legal/types";

import { LegalDefinitionList } from "./legal-definition-list";

export function LegalSection({ section }: { section: LegalSectionContent }) {
  return (
    <section id={section.id} className="legal-section scroll-mt-28 border-t border-[#dce2e9] pt-9 first:border-t-0 first:pt-0 sm:pt-11">
      <h2 className="text-[25px] leading-[1.25] font-bold tracking-[-0.02em] text-navy sm:text-[30px]">{section.title}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-[17px] leading-[1.8] text-[#475569]">{paragraph}</p>)}
      {section.definitions && <div className="mt-5"><LegalDefinitionList items={section.definitions} /></div>}
      {section.items && (
        <ul className="mt-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.75] text-[#475569] marker:text-green">
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </section>
  );
}

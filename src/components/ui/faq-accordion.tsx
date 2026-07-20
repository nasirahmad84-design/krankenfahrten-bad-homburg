"use client";

import { useId, useState } from "react";

type FaqAccordionProps = {
  items: readonly Readonly<{ question: string; answer: string }>[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <article key={item.question} className="rounded-[14px] border border-[#dce2e9] bg-white px-[18px]">
            <h3>
              <button
                type="button"
                className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-[17px] leading-snug font-semibold text-navy"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                {item.question}
                <span className="shrink-0 text-[22px] text-green" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen} className="pb-[18px] text-[15px] leading-[1.55] text-[#5b697a]">
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
}

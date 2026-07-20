"use client";

import { useId, useState } from "react";

type FaqAccordionProps = {
  items: readonly Readonly<{ question: string; answer: string }>[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <article key={item.question} className="rounded-[16px] border border-[#dce2e9] bg-white px-5 transition-[border-color,box-shadow] hover:border-green/50 hover:shadow-[0_8px_24px_rgba(2,31,88,0.06)] sm:px-6">
            <h3>
              <button
                type="button"
                className="flex min-h-[76px] w-full items-center justify-between gap-5 py-5 text-left text-[18px] leading-snug font-semibold text-navy sm:text-[19px]"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                {item.question}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f7eb] text-[25px] leading-none text-green" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen} className="max-w-4xl pb-6 text-base leading-[1.7] text-[#5b697a]">
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
}

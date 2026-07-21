import type { LegalDefinition } from "@/content/legal/types";

export function LegalDefinitionList({ items }: { items: readonly LegalDefinition[] }) {
  return (
    <dl className="divide-y divide-[#dce2e9] rounded-xl border border-[#dce2e9] bg-[#f8fafc] px-4 sm:px-5">
      {items.map((item) => (
        <div key={item.term} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-5">
          <dt className="font-semibold text-navy">{item.term}</dt>
          <dd className="min-w-0 break-words text-[#475569] [overflow-wrap:anywhere]">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

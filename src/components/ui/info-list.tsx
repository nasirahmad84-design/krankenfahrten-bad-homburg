type InfoListProps = { items: readonly string[]; columns?: 1 | 2 | 3 };

export function InfoList({ items, columns = 2 }: InfoListProps) {
  const grid = columns === 3 ? "lg:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";
  return (
    <ul className={`grid gap-4 ${grid}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-2xl border border-[#dce2e9] bg-white p-5 text-base leading-[1.65] text-[#5b697a]">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f7eb] font-bold text-green" aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

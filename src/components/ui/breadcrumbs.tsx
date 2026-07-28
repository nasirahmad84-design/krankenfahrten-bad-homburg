import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";

type BreadcrumbsProps = {
  current: string;
  parent?: {
    label: string;
    href: string;
  };
};

export function Breadcrumbs({
  current,
  parent = { label: "Leistungen", href: "/leistungen" },
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Brotkrümelnavigation" className="border-b border-navy/8 bg-[#f6f9fc] py-4">
      <SiteContainer>
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-[#5b697a] sm:text-base">
          <li><Link className="inline-flex min-h-11 items-center font-medium text-navy hover:text-green-dark" href="/">Startseite</Link></li>
          <li aria-hidden="true" className="text-navy/40">/</li>
          <li><Link className="inline-flex min-h-11 items-center font-medium text-navy hover:text-green-dark" href={parent.href}>{parent.label}</Link></li>
          <li aria-hidden="true" className="text-navy/40">/</li>
          <li className="min-w-0 break-words font-medium text-[#5b697a]" aria-current="page">{current}</li>
        </ol>
      </SiteContainer>
    </nav>
  );
}

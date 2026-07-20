import Link from "next/link";
import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  linkText: string;
  icon?: ReactNode;
  className?: string;
};

export function ServiceCard({
  title,
  description,
  href,
  linkText,
  icon,
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={classNames(
        "group flex h-full min-h-[300px] flex-col rounded-card border border-navy/12 bg-white p-6 text-navy shadow-[0_8px_24px_rgba(2,31,88,0.06)] transition-[border-color,box-shadow,transform] hover:-translate-y-1.5 hover:border-green/60 hover:shadow-[0_18px_36px_rgba(2,31,88,0.12)] sm:p-8",
        className,
      )}
    >
      {icon && (
        <span
          className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#f0f7eb] text-green-dark"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <h3 className="text-[21px] leading-snug font-bold">{title}</h3>
      <p className="mt-4 flex-1 text-base leading-[1.65] text-[#5b697a]">{description}</p>
      <span className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-green-dark">
        {linkText}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

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
        "group flex h-full flex-col rounded-card border border-navy/12 bg-white p-6 text-navy shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-green/60 hover:shadow-lg sm:p-8",
        className,
      )}
    >
      {icon && (
        <span
          className="mb-5 flex size-12 items-center justify-center rounded-xl bg-green/12 text-green-dark"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <h3 className="text-xl leading-snug font-bold">{title}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-navy/70">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green-dark">
        {linkText}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

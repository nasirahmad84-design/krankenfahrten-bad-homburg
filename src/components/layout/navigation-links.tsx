"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "@/lib/class-names";
import type { SiteLink } from "@/lib/site-config";

type NavigationLinksProps = {
  links: readonly SiteLink[];
};

export function NavigationLinks({ links }: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames(
                "inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-navy/8 text-navy"
                  : "text-navy/75 hover:bg-navy/5 hover:text-navy",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

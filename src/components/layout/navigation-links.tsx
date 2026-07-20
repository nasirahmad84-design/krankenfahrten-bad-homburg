"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import type { SiteLink } from "@/lib/site-config";

type NavigationLinksProps = {
  links: readonly SiteLink[];
};

export function NavigationLinks({ links }: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-0 xl:gap-1">
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
                "relative inline-flex min-h-[51px] items-center rounded-lg px-1.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors xl:px-2 xl:text-[15px]",
                isActive
                  ? "font-semibold text-navy after:absolute after:right-1.5 after:bottom-0 after:left-1.5 after:h-[3px] after:rounded-full after:bg-green xl:after:right-2 xl:after:left-2"
                  : "text-[#121a29] hover:bg-[#f7fafc] hover:text-navy",
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

type HeaderContactButtonProps = {
  label: string;
  href: string;
};

export function HeaderContactButton({
  label,
  href,
}: HeaderContactButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Button
      href={href}
      size="large"
      className="min-h-[50px] shrink-0 rounded-xl px-3 text-[13px] whitespace-nowrap xl:px-5 xl:text-[15px]"
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Button>
  );
}

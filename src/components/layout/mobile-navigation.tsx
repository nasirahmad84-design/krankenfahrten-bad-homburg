"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { classNames } from "@/lib/class-names";
import { siteConfig } from "@/lib/site-config";

export function MobileNavigation() {
  const pathname = usePathname();

  return <MobileMenu key={pathname} pathname={pathname} />;
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-lg border border-navy/20 text-navy transition-colors hover:bg-navy/5 active:bg-navy/10"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isOpen ? "Navigation schließen" : "Navigation öffnen"}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        id="mobile-navigation-panel"
        className={classNames(
          "absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-navy/10 bg-white shadow-xl",
          !isOpen && "hidden",
        )}
      >
        <nav
          className="container-page py-5"
          aria-label="Mobile Hauptnavigation"
        >
          <ul className="flex flex-col gap-1">
            {siteConfig.navigation.map((link, index) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    className={classNames(
                      "flex min-h-12 items-center rounded-lg px-4 py-3 font-semibold",
                      isActive
                        ? "bg-navy text-white"
                        : "text-navy hover:bg-navy/5",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid gap-3 border-t border-navy/10 pt-5 sm:grid-cols-2">
            <a
              href={siteConfig.phone.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-navy/20 px-4 font-semibold text-navy"
            >
              {siteConfig.phone.display}
            </a>
            <Link
              href={siteConfig.contactLink.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-green px-4 font-semibold text-navy hover:bg-green-light"
              onClick={() => setIsOpen(false)}
            >
              {siteConfig.contactLink.label}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

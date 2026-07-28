"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChevronIcon, PhoneIcon } from "@/components/layout/header-icons";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import { siteConfig, type SiteLink } from "@/lib/site-config";

export function MobileNavigation() {
  const pathname = usePathname();

  return <MobileMenu key={pathname} pathname={pathname} />;
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    return () => setGlobalMenuState(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const mobileLinks: readonly SiteLink[] = [
    ...siteConfig.navigation,
    { label: "Kontakt", href: siteConfig.contactLink.href },
  ];

  function openMenu() {
    setGlobalMenuState(true);
    setIsOpen(true);
  }

  function closeMenu() {
    setGlobalMenuState(false);
    setIsOpen(false);
  }

  return (
    <div className="flex shrink-0 items-center gap-2 xl:hidden">
      {!isOpen && (
        <a
          href={siteConfig.phone.href}
          className="inline-flex size-11 items-center justify-center rounded-[10px] bg-[#f7fafc] text-navy transition-colors hover:bg-navy/10"
          aria-label={`Anrufen: ${siteConfig.phone.display}`}
        >
          <PhoneIcon />
        </a>
      )}

      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-[10px] text-navy transition-colors hover:bg-[#f7fafc] active:bg-navy/10"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isOpen ? "Navigation schließen" : "Navigation öffnen"}
        onClick={isOpen ? closeMenu : openMenu}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        id="mobile-navigation-panel"
        className={classNames(
          "fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-white xl:hidden",
          !isOpen && "hidden",
        )}
      >
        <nav
          className="container-page flex min-h-full flex-col py-3"
          aria-label="Mobile Hauptnavigation"
        >
          <ul className="flex flex-col gap-1">
            {mobileLinks.map((link, index) => {
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
                      "flex min-h-12 items-center justify-between rounded-[10px] px-3 py-3 text-base font-medium text-[#121a29] transition-colors hover:bg-[#f7fafc]",
                      isActive && "bg-[#f7fafc] font-semibold text-navy",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    <span>{link.label}</span>
                    <ChevronIcon />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto border-t border-[#dbe0e8] pt-4 pb-1">
            <Button
              href={siteConfig.contactLink.href}
              size="large"
              className="min-h-[52px] w-full rounded-xl text-[15px]"
              onClick={closeMenu}
            >
              {siteConfig.contactLink.label}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}

function setGlobalMenuState(isOpen: boolean) {
  if (isOpen) {
    document.body.dataset.mobileMenuOpen = "true";
  } else {
    delete document.body.dataset.mobileMenuOpen;
  }
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="M2 4h20M2 12h20M2 20h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="m5 5 14 14M19 5 5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

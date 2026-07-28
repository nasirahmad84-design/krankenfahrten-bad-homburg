"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const bodyStylesRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    return () => setGlobalMenuState(false);
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    setGlobalMenuState(false);
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = [
          buttonRef.current,
          ...panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((element): element is HTMLElement => Boolean(element));
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    const header = buttonRef.current?.closest("header");
    const updateHeaderHeight = () => {
      if (header) {
        document.documentElement.style.setProperty(
          "--mobile-header-height",
          `${header.getBoundingClientRect().height}px`,
        );
      }
    };
    const resizeObserver = header ? new ResizeObserver(updateHeaderHeight) : null;
    updateHeaderHeight();
    if (header) resizeObserver?.observe(header);

    scrollPositionRef.current = window.scrollY;
    bodyStylesRef.current = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    Object.assign(document.body.style, {
      position: "fixed",
      top: `-${scrollPositionRef.current}px`,
      left: "0",
      right: "0",
      width: "100%",
      overflow: "hidden",
    });

    const backgroundElements = [
      document.querySelector<HTMLElement>(".skip-link"),
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>("footer"),
      document.querySelector<HTMLElement>(".mobile-contact-bar"),
    ].filter((element): element is HTMLElement => Boolean(element));
    for (const element of backgroundElements) element.inert = true;

    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => firstLinkRef.current?.focus());

    return () => {
      resizeObserver?.disconnect();
      document.removeEventListener("keydown", handleKeyDown);
      for (const element of backgroundElements) element.inert = false;
      const previousStyles = bodyStylesRef.current;
      if (previousStyles) Object.assign(document.body.style, previousStyles);
      document.documentElement.style.removeProperty("--mobile-header-height");
      window.scrollTo({ top: scrollPositionRef.current, behavior: "instant" });
    };
  }, [closeMenu, isOpen]);

  const mobileLinks: readonly SiteLink[] = [
    ...siteConfig.navigation,
    { label: "Kontakt", href: siteConfig.contactLink.href },
  ];

  function openMenu() {
    setGlobalMenuState(true);
    setIsOpen(true);
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
        onClick={isOpen ? () => closeMenu(true) : openMenu}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        id="mobile-navigation-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={classNames(
          "mobile-navigation-panel fixed inset-x-0 z-50 overflow-y-auto overscroll-contain bg-white xl:hidden",
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
                    onClick={() => closeMenu()}
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
              onClick={() => closeMenu()}
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

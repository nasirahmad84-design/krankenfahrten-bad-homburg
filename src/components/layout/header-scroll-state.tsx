"use client";

import { useSyncExternalStore } from "react";

import { classNames } from "@/lib/class-names";

const SCROLL_THRESHOLD = 24;

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return window.scrollY >= SCROLL_THRESHOLD;
}

function getServerSnapshot() {
  return false;
}

export function HeaderScrollState({ children }: { children: React.ReactNode }) {
  const isScrolled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <header
      className={classNames(
        "site-header sticky top-0 z-40 border-b border-[#dbe0e8] bg-white transition-[height,box-shadow] duration-200",
        "h-[72px]",
        isScrolled ? "xl:h-[76px] xl:shadow-md" : "xl:h-[92px]",
      )}
      data-scrolled={isScrolled ? "true" : "false"}
    >
      {children}
    </header>
  );
}

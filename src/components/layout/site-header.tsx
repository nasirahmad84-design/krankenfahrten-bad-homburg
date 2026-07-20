import Link from "next/link";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-navy/10 bg-white">
      <SiteContainer className="flex min-h-20 items-center justify-between gap-5">
        <Link
          href="/"
          className="max-w-52 text-base leading-tight font-bold text-navy sm:max-w-none sm:text-lg"
          aria-label={`${siteConfig.name} – Startseite`}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 xl:flex">
          <nav aria-label="Hauptnavigation">
            <NavigationLinks links={siteConfig.navigation} />
          </nav>
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold whitespace-nowrap text-navy hover:bg-navy/5"
          >
            {siteConfig.phone.display}
          </a>
          <Link
            href={siteConfig.contactLink.href}
            className="inline-flex min-h-11 items-center rounded-lg bg-green px-4 text-sm font-semibold whitespace-nowrap text-navy transition-colors hover:bg-green-light active:bg-green-light"
          >
            {siteConfig.contactLink.label}
          </Link>
        </div>

        <MobileNavigation />
      </SiteContainer>
    </header>
  );
}

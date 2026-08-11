import { HeaderScrollState } from "@/components/layout/header-scroll-state";
import { PhoneIcon } from "@/components/layout/header-icons";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import {
  HeaderContactButton,
  NavigationLinks,
} from "@/components/layout/navigation-links";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <HeaderScrollState>
      <SiteContainer className="flex h-full items-center justify-between gap-3">
        <SiteLogo compact className="2xl:hidden" />
        <SiteLogo className="hidden 2xl:flex" />

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 xl:flex">
          <nav aria-label="Hauptnavigation">
            <NavigationLinks links={siteConfig.navigation} />
          </nav>
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] font-bold whitespace-nowrap text-navy transition-colors hover:bg-[#f7fafc] xl:px-3.5 xl:text-[16px]"
            aria-label={`Anrufen: ${siteConfig.phone.display}`}
          >
            <PhoneIcon />
            {siteConfig.phone.display}
          </a>
          <HeaderContactButton {...siteConfig.contactLink} />
        </div>

        <MobileNavigation />
      </SiteContainer>
    </HeaderScrollState>
  );
}

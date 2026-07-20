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
        <SiteLogo compact className="lg:hidden" />
        <SiteLogo className="hidden lg:flex" />

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 lg:flex xl:gap-[18px]">
          <nav aria-label="Hauptnavigation">
            <NavigationLinks links={siteConfig.navigation} />
          </nav>
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] px-2 text-[13px] font-semibold whitespace-nowrap text-navy transition-colors hover:bg-[#f7fafc] xl:px-3 xl:text-[15px]"
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

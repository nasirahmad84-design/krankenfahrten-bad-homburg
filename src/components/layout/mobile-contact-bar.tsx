import Link from "next/link";

import { PhoneIcon } from "@/components/layout/header-icons";
import { siteConfig } from "@/lib/site-config";

const actionClass =
  "flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[15px] font-bold";

export function MobileContactBar() {
  return (
    <aside
      className="mobile-contact-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-navy px-3 pt-3 md:hidden"
      aria-label="Schnellkontakt"
    >
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href={siteConfig.phone.href}
          className={`${actionClass} border border-white/40 text-white`}
        >
          <PhoneIcon className="size-5 brightness-0 invert" />
          Anrufen
        </a>
        <Link
          href={siteConfig.contactLink.href}
          className={`${actionClass} bg-green text-navy`}
        >
          Fahrt anfragen
        </Link>
      </div>
    </aside>
  );
}

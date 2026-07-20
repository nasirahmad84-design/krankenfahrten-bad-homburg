import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

const actionClass =
  "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold";

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
          <PhoneIcon />
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

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <path d="M7.1 3.5 9.3 7l-1.8 2a14 14 0 0 0 7.5 7.5l2-1.8 3.5 2.2-.7 3.2c-.2.8-.9 1.4-1.8 1.4A15.5 15.5 0 0 1 2.5 6c0-.9.6-1.6 1.4-1.8l3.2-.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

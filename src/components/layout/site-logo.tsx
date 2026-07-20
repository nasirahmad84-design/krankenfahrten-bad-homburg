import Image from "next/image";
import Link from "next/link";

import { classNames } from "@/lib/class-names";
import { siteConfig } from "@/lib/site-config";

type SiteLogoProps = {
  compact?: boolean;
  className?: string;
};

export function SiteLogo({ compact = false, className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={classNames(
        "flex shrink-0 items-center overflow-hidden whitespace-nowrap",
        compact ? "h-11 w-[154px] gap-[5px]" : "h-[52px] w-[190px] gap-1.5",
        className,
      )}
      aria-label={`${siteConfig.name} – Startseite`}
    >
      <Image
        src="/brand/logo-mark.svg"
        alt=""
        width={compact ? 44 : 52}
        height={compact ? 44 : 52}
        className={classNames("shrink-0", compact ? "size-11" : "size-[52px]")}
        priority
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={classNames(
            "font-bold text-navy",
            compact ? "text-[15px]" : "text-lg",
          )}
        >
          Krankenfahrten
        </span>
        <span
          className={classNames(
            "mt-0.5 font-normal text-green",
            compact ? "text-xs" : "text-sm",
          )}
        >
          Bad Homburg
        </span>
      </span>
    </Link>
  );
}

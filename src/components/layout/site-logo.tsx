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
        compact ? "h-[52px] w-[161px]" : "h-[66px] w-[204px]",
        className,
      )}
      aria-label={`${siteConfig.name} – Startseite`}
    >
      <Image
        src="/brand/logo.svg"
        alt=""
        width={2040}
        height={660}
        sizes={compact ? "161px" : "204px"}
        className="h-auto w-full shrink-0"
        preload
      />
    </Link>
  );
}

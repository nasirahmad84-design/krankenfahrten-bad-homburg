import type { ComponentPropsWithoutRef } from "react";

import { classNames } from "@/lib/class-names";

type SiteContainerProps = ComponentPropsWithoutRef<"div">;

export function SiteContainer({ className, ...props }: SiteContainerProps) {
  return <div className={classNames("container-page", className)} {...props} />;
}

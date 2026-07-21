import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site-url";

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Krankenfahrten Bad Homburg",
      locale: "de_DE",
      type: "website",
    },
  };
}

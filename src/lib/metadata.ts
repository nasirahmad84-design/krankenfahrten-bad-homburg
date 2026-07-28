import type { Metadata } from "next";

import { absoluteUrl, productionOrigin } from "@/lib/site-url";

const socialImage = {
  url: new URL("/images/social/og-default-1200x630.webp", productionOrigin).toString(),
  width: 1200,
  height: 630,
  alt: "Krankenfahrten Bad Homburg – sicher, persönlich und regional.",
} as const;

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
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}

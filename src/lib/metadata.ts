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
  const socialDescription = shortenSocialDescription(description);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: socialDescription,
      url,
      siteName: "Krankenfahrten Bad Homburg",
      locale: "de_DE",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: socialDescription,
      images: [socialImage.url],
    },
  };
}

function shortenSocialDescription(description: string): string {
  if (description.length <= 125) return description;

  const shortened = description.slice(0, 124);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 95 ? lastSpace : 124).trimEnd()}…`;
}

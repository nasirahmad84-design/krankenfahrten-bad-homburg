import { notFound } from "next/navigation";

import { LocationDetailPage } from "@/components/sections/location-detail-page";
import { locationsBySlug, regionalLocations } from "@/content/locations";
import { createPageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return regionalLocations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locationsBySlug[slug];

  if (!location) return {};

  return createPageMetadata(
    location.metadataTitle,
    location.metadataDescription,
    `/orte/${location.slug}`,
  );
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locationsBySlug[slug];

  if (!location) notFound();

  return <LocationDetailPage location={location} />;
}

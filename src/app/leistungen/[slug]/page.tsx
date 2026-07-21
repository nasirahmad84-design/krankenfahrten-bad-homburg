import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { allServices, servicesBySlug } from "@/content/services";
import { createPageMetadata } from "@/lib/metadata";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesBySlug[slug];
  if (!service) return { title: "Leistung nicht gefunden", robots: { index: false, follow: false } };
  return createPageMetadata(service.metadataTitle, service.metadataDescription, `/leistungen/${service.slug}/`);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesBySlug[slug];
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}

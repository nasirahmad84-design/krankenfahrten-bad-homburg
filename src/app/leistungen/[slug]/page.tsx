import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { allServices, servicesBySlug } from "@/content/services";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesBySlug[slug];
  if (!service) return { title: "Leistung nicht gefunden" };
  return { title: service.metadataTitle, description: service.metadataDescription };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesBySlug[slug];
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}

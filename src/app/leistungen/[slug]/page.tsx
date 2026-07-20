import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlannedPage } from "@/components/layout/planned-page";
import { allServices } from "@/content/services";

const routes = Object.fromEntries(allServices.map((service) => [service.href.split("/").at(-1), service.title]));

export function generateStaticParams() { return Object.keys(routes).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = routes[slug];
  return { title: title ? `${title} | Krankenfahrten Bad Homburg` : "Leistung nicht gefunden" };
}

export default async function ServiceDetailPlaceholder({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = routes[slug];
  if (!title) notFound();
  return <PlannedPage title={title} />;
}

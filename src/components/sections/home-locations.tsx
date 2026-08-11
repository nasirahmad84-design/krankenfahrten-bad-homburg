import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const priorityLocations = [
  { label: "Friedrichsdorf", href: "/orte/friedrichsdorf" },
  { label: "Oberursel", href: "/orte/oberursel" },
  { label: "Frankfurt-Riedberg", href: "/orte/frankfurt-riedberg" },
] as const;

export function HomeLocations() {
  return (
    <section className="home-section bg-[#f6f9fc]" aria-labelledby="home-locations-title">
      <SiteContainer>
        <SectionHeading
          titleId="home-locations-title"
          eyebrow="Regional für Sie da"
          title="Bad Homburg und ausgewählte Nachbarorte"
          description="Von Bad Homburg aus prüfen wir Fahrten im direkten Umfeld und im Frankfurter Norden. Jede Strecke wird anhand Ihrer konkreten Fahrtdaten persönlich abgestimmt."
          className="home-section-heading"
        />
        <ul className="mt-8 flex flex-wrap gap-3" aria-label="Ausgewählte Orte im Einsatzgebiet">
          {priorityLocations.map((location) => (
            <li key={location.href}>
              <Link
                href={location.href}
                className="inline-flex min-h-11 items-center rounded-full border border-navy/15 bg-white px-5 py-2 font-semibold text-navy transition-colors hover:border-green hover:bg-[#f0f7eb] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-green"
              >
                Krankenfahrten {location.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button href="/orte" className="mt-8">
          Einsatzgebiet ansehen
        </Button>
      </SiteContainer>
    </section>
  );
}

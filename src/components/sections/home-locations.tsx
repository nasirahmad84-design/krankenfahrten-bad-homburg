import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

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
        <Button href="/orte" className="mt-8">
          Einsatzgebiet ansehen
        </Button>
      </SiteContainer>
    </section>
  );
}

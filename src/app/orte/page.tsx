import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { ContentSection } from "@/components/sections/content-section";
import { ServiceCard } from "@/components/ui/service-card";
import { regionalLocations, type RegionalLocation } from "@/content/locations";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Einsatzgebiet | Krankenfahrten rund um Bad Homburg",
  "Sitzende Krankenfahrten ab Bad Homburg und ausgewählten Nachbarorten im Hochtaunus und Frankfurter Norden – jede Strecke wird individuell geprüft.",
  "/orte",
);

const neighborSlugs = new Set([
  "burgholzhausen",
  "koeppern",
  "friedrichsdorf",
  "oberursel",
]);

export default function LocationsPage() {
  const neighbors = regionalLocations.filter(({ slug }) => neighborSlugs.has(slug));
  const frankfurtNorth = regionalLocations.filter(({ slug }) => !neighborSlugs.has(slug));

  return (
    <>
      <PageHero
        eyebrow="Einsatzgebiet"
        title="Krankenfahrten rund um Bad Homburg"
        description="Unser Ausgangspunkt ist Bad Homburg. Von dort erschließen wir das Einsatzgebiet schrittweise über direkte Nachbarorte bis in den Frankfurter Norden."
      />

      <ContentSection
        id="bad-homburg"
        eyebrow="Zentraler Standort"
        title="Bad Homburg"
        description="In Bad Homburg liegt der Schwerpunkt unseres Angebots. Alle Leistungen, Abläufe und Kontaktmöglichkeiten finden Sie auf der Hauptseite."
      >
        <ServiceCard
          title="Krankenfahrten Bad Homburg"
          description="Sitzende Krankenfahrten zu planbaren Arzt-, Klinik-, Dialyse-, Therapie- und Entlassungsterminen."
          href="/"
          linkText="Zur Hauptseite"
          className="max-w-xl min-h-[230px]"
        />
      </ContentSection>

      <LocationGrid
        id="direct-neighbors"
        title="Direktes Umfeld von Bad Homburg"
        description="Zunächst betrachten wir die unmittelbaren Nachbarstädte und die eigenständigen Friedrichsdorfer Ortslagen."
        locations={neighbors}
        muted
      />

      <LocationGrid
        id="frankfurt-north"
        title="Frankfurter Norden"
        description="Im nächsten Ring folgen ausgewählte nördliche Frankfurter Ortslagen mit jeweils eigenen Hinweisen zur Abholung."
        locations={frankfurtNorth}
      />

      <ContentSection
        id="availability"
        eyebrow="Wichtig"
        title="Jede Fahrt wird individuell bestätigt"
        description="Die Nennung eines Ortes ist keine pauschale Beförderungszusage. Entscheidend sind die konkrete Abhol- und Zieladresse, der Termin, der Unterstützungsbedarf und unsere Verfügbarkeit."
        muted
      >
        <p className="max-w-3xl text-base leading-[1.7] text-[#5b697a]">
          Weitere Orte nehmen wir erst auf, wenn dafür ein echter regionaler
          Informationswert und eine verlässlich prüfbare Nachfrage bestehen.
        </p>
      </ContentSection>

      <PageCta title="Fahrt im regionalen Einsatzgebiet anfragen" />
    </>
  );
}

function LocationGrid({
  id,
  title,
  description,
  locations,
  muted = false,
}: {
  id: string;
  title: string;
  description: string;
  locations: readonly RegionalLocation[];
  muted?: boolean;
}) {
  return (
    <ContentSection id={id} title={title} description={description} muted={muted}>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {locations.map((location) => (
          <ServiceCard
            key={location.slug}
            title={location.displayName}
            description={location.description}
            href={`/orte/${location.slug}`}
            linkText="Ort ansehen"
            className="min-h-[270px]"
          />
        ))}
      </div>
    </ContentSection>
  );
}

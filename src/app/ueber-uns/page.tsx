import { ContentSection } from "@/components/sections/content-section";
import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { InfoList } from "@/components/ui/info-list";
import { NoticeBox } from "@/components/ui/notice-box";
import { SectionImage } from "@/components/ui/section-image";
import { aboutLimits, workingPrinciples } from "@/content/about";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata("Über uns | Krankenfahrten Bad Homburg", "Krankenfahrten Bad Homburg: lokaler Fahrdienst von Mubasher Ahmad für persönlich abgestimmte sitzende Krankenfahrten.", "/ueber-uns/");

export default function AboutPage() {
  return <>
    <PageHero eyebrow="Über uns" title="Persönlich unterwegs in Bad Homburg" description={`${siteConfig.name} ist der lokale Fahrdienst von ${siteConfig.operator}. Im Mittelpunkt stehen klare Absprachen, respektvoller Umgang und eine zuverlässige Durchführung bestätigter Fahrten.`} />
    <ContentSection id="our-approach" title="Unsere Haltung und Arbeitsweise">
      <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-14">
        <SectionImage
          src="/images/about/betreiber-mit-fahrzeug.webp"
          alt="Fahrer steht neben einem dunklen Fahrzeug des Fahrdienstes."
          width={1200}
          height={900}
          sizes="(max-width: 1023px) calc(100vw - 48px), 42vw"
          className="aspect-[4/3]"
          imageClassName="object-[48%_center]"
        />
        <InfoList items={workingPrinciples} />
      </div>
    </ContentSection>
    <ContentSection id="regional-service" title="Regional erreichbar" description="Aus Bad Homburg heraus stimmen wir sitzende Krankenfahrten in der Region persönlich mit Fahrgästen und Angehörigen ab." muted>
      <div className="rounded-[24px] bg-navy p-7 text-white sm:p-10"><p className="text-[22px] font-semibold">{siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}</p><p className="mt-4 max-w-2xl text-base leading-[1.7] text-white/80">Anfragen sind rund um die Uhr möglich. Die Durchführung erfolgt nach Verfügbarkeit und ausdrücklicher Bestätigung.</p></div>
    </ContentSection>
    <ContentSection id="about-limits" title="Was unser Fahrdienst nicht leistet"><NoticeBox title="Keine medizinische oder pflegerische Leistung" variant="warning"><ul className="grid gap-2">{aboutLimits.map((limit) => <li key={limit}>• {limit}</li>)}</ul></NoticeBox></ContentSection>
    <PageCta title="Fahrt persönlich mit uns abstimmen" />
  </>;
}

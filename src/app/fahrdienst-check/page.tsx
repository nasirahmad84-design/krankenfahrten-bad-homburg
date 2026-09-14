import {PageHero} from '@/components/sections/page-hero';
import {SiteContainer} from '@/components/layout/site-container';
import {ServiceFitCheck} from '@/components/sections/service-fit-check';
import {createPageMetadata} from '@/lib/metadata';

export const metadata = createPageMetadata('Fahrdienst-Check | Krankenfahrten Bad Homburg', 'Passt eine sitzende Krankenfahrt zu Ihrem Transportbedarf? Vier kurze Fragen helfen bei der Orientierung – ohne Speicherung Ihrer Antworten.', '/fahrdienst-check/');

export default function FitPage() {
  return <>
    <PageHero eyebrow="In weniger als einer Minute" title="Passt unser Fahrdienst zu Ihrer Situation?" description="Für Fahrgäste, Angehörige und Einrichtungen: Prüfen Sie, ob unser Angebot grundsätzlich zu Ihrem Transportbedarf passt. Wir bieten sitzende Krankenfahrten ohne medizinische Betreuung an." />
    <section className="home-section bg-[#f6f9fc]"><SiteContainer><div className="mx-auto max-w-3xl"><ServiceFitCheck /></div></SiteContainer></section>
  </>;
}

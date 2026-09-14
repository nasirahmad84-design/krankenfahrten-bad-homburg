import {SiteContainer} from '@/components/layout/site-container';
import {ServiceFitCheck} from '@/components/sections/service-fit-check';
import {createPageMetadata} from '@/lib/metadata';

export const metadata = createPageMetadata('Fahrdienst-Check | Krankenfahrten Bad Homburg', 'Passt eine sitzende Krankenfahrt zu Ihrem Transportbedarf? Vier kurze Fragen helfen bei der Orientierung – ohne Speicherung Ihrer Antworten.', '/fahrdienst-check/');

export default function FitPage() {
  return <>
    <section className="bg-[#f6f9fc] px-0 pt-5 pb-24 sm:pt-8 sm:pb-12"><SiteContainer><div className="mx-auto max-w-xl">
      <p className="text-xs font-bold tracking-wider text-green-dark uppercase">Fahrdienst-Check · ca. 30 Sekunden</p>
      <h1 className="mt-2 text-2xl leading-tight font-bold text-navy sm:text-3xl">Passt unser Fahrdienst zu Ihnen?</h1>
      <p className="mt-2 mb-5 text-sm text-navy/75">Vier kurze Fragen. Danach direkt zur Anfrage.</p>
      <ServiceFitCheck />
    </div></SiteContainer></section>
  </>;
}

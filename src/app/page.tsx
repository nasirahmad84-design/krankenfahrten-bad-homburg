import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <section className="flex flex-1 items-center bg-navy py-section text-white">
      <SiteContainer>
        <div className="max-w-3xl rounded-card border border-white/15 bg-white/5 p-8 sm:p-12">
          <p className="mb-4 text-sm font-semibold tracking-widest text-green-light uppercase">
            Technische Basis
          </p>
          <h1 className="text-heading">{siteConfig.name}</h1>
          <p className="mt-6 max-w-2xl text-lead text-white/80">
            Die technische Grundlage ist eingerichtet. Die Umsetzung der Website
            folgt in den nächsten Entwicklungsschritten.
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}

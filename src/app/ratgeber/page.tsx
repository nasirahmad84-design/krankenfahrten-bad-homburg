import { PageCta } from "@/components/sections/page-cta";
import { PageHero } from "@/components/sections/page-hero";
import { BlogPostCard } from "@/components/ui/blog-post-card";
import { SiteContainer } from "@/components/layout/site-container";
import { publishedBlogPosts } from "@/content/blog-posts";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Ratgeber zu Krankenfahrten in Bad Homburg",
  "Geprüfte Informationen zu sitzenden Krankenfahrten, Verordnung, Kosten und Ablauf in Bad Homburg – verständlich erklärt und transparent belegt.",
  "/ratgeber",
);

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Ratgeber"
        title="Krankenfahrten verständlich erklärt"
        description="Orientierung für Patienten und Angehörige: sachlich, nachvollziehbar und mit transparenten Quellen. Individuelle Entscheidungen klären Sie bitte mit Praxis, Krankenkasse oder dem zuständigen Leistungserbringer."
      />

      <section className="home-section bg-white" aria-labelledby="guide-articles-title">
        <SiteContainer>
          <h2 id="guide-articles-title" className="text-[32px] leading-tight font-bold text-navy sm:text-[42px]">
            Aktuelle Ratgeber
          </h2>
          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {publishedBlogPosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
          </div>
        </SiteContainer>
      </section>

      <PageCta
        title="Ihre Fahrt individuell abstimmen"
        description="Ratgeber schaffen Orientierung. Für eine konkrete Fahrt prüfen wir Termin, Strecke, Unterstützungsbedarf und Verfügbarkeit persönlich."
      />
    </>
  );
}

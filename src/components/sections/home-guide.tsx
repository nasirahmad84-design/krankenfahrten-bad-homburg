import { BlogPostCard } from "@/components/ui/blog-post-card";
import { Button } from "@/components/ui/button";
import { SiteContainer } from "@/components/layout/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { publishedBlogPosts } from "@/content/blog-posts";

export function HomeGuide() {
  const latestPost = publishedBlogPosts[0];
  if (!latestPost) return null;

  return (
    <section className="home-section bg-white" aria-labelledby="home-guide-title">
      <SiteContainer>
        <SectionHeading
          titleId="home-guide-title"
          eyebrow="Ratgeber"
          title="Krankenfahrten verständlich erklärt"
          description="Geprüfte Informationen für Patienten und Angehörige – mit transparenten Quellen und klarer Abgrenzung unseres Leistungsangebots."
          className="home-section-heading"
        />
        <div className="mt-9 max-w-3xl"><BlogPostCard post={latestPost} /></div>
        <Button href="/ratgeber" variant="link" className="mt-8 text-base">
          Alle Ratgeber ansehen →
        </Button>
      </SiteContainer>
    </section>
  );
}

import { generatedPublishedBlogPosts } from "./generated-blog-posts.ts";

export type BlogSource = Readonly<{
  id: string;
  title: string;
  publisher: string;
  url: string;
  checkedAt: string;
}>;

export type BlogSection = Readonly<{
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  sourceIds?: readonly string[];
}>;

export type BlogFaq = Readonly<{
  question: string;
  answer: string;
}>;

export type BlogPost = Readonly<{
  slug: string;
  title: string;
  metadataTitle: string;
  description: string;
  format: "Ratgeber" | "Aktuelle Information" | "Einordnung";
  publishedAt: string;
  updatedAt: string;
  reviewedAt: string;
  readingTimeMinutes: number;
  intro: string;
  summary: readonly string[];
  sections: readonly BlogSection[];
  faqs: readonly BlogFaq[];
  sources: readonly BlogSource[];
  relatedServiceSlugs: readonly string[];
}>;

export const publishedBlogPosts: readonly BlogPost[] = generatedPublishedBlogPosts;

export const blogPostsBySlug = Object.fromEntries(
  publishedBlogPosts.map((post) => [post.slug, post]),
) as Readonly<Record<string, BlogPost>>;

validatePublishedBlogPosts(publishedBlogPosts);

function validatePublishedBlogPosts(posts: readonly BlogPost[]) {
  const slugs = new Set<string>();

  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Ungültiger Ratgeber-Slug: ${post.slug}`);
    }
    if (slugs.has(post.slug)) throw new Error(`Doppelter Ratgeber-Slug: ${post.slug}`);
    slugs.add(post.slug);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)) {
      throw new Error(`Ungültiges Ratgeber-Datum: ${post.slug}`);
    }
    if (post.sources.length < 2) throw new Error(`Zu wenige Quellen: ${post.slug}`);
    if (post.sections.length < 3) throw new Error(`Zu wenige Abschnitte: ${post.slug}`);

    const sourceIds = new Set(post.sources.map(({ id }) => id));
    if (sourceIds.size !== post.sources.length) throw new Error(`Doppelte Quellen-ID: ${post.slug}`);
    for (const section of post.sections) {
      for (const sourceId of section.sourceIds ?? []) {
        if (!sourceIds.has(sourceId)) throw new Error(`Unbekannte Quelle ${sourceId}: ${post.slug}`);
      }
    }
  }
}

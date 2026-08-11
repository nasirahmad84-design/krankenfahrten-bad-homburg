import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticlePage } from "@/components/sections/blog-article-page";
import { blogPostsBySlug, publishedBlogPosts } from "@/content/blog-posts";
import { createBlogPostingStructuredData } from "@/lib/blog-structured-data";
import { createArticleMetadata } from "@/lib/metadata";

type BlogPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedBlogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];
  if (!post) return { title: "Ratgeber nicht gefunden", robots: { index: false, follow: false } };

  return createArticleMetadata(
    post.metadataTitle,
    post.description,
    `/ratgeber/${post.slug}`,
    post.publishedAt,
    post.updatedAt,
  );
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createBlogPostingStructuredData(post)) }}
      />
      <BlogArticlePage post={post} />
    </>
  );
}

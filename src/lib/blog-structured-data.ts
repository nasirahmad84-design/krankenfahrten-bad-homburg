import type { BlogPost } from "../content/blog-posts.ts";
import { siteConfig } from "./site-config.ts";
import { absoluteUrl, productionOrigin } from "./site-url.ts";

export function createBlogPostingStructuredData(post: BlogPost) {
  const url = absoluteUrl(`/ratgeber/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "de-DE",
    mainEntityOfPage: url,
    image: new URL("/images/social/og-default-1200x630.webp", productionOrigin).toString(),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: new URL("/brand/logo.svg", productionOrigin).toString(),
      },
    },
  } as const;
}

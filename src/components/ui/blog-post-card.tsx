import Link from "next/link";

import type { BlogPost } from "@/content/blog-posts";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-navy/12 bg-white p-6 shadow-[0_8px_24px_rgba(2,31,88,0.06)] sm:p-8">
      <p className="home-eyebrow">{post.format}</p>
      <h2 className="mt-3 text-[24px] leading-snug font-bold text-navy sm:text-[28px]">
        <Link
          href={`/ratgeber/${post.slug}`}
          className="rounded-md decoration-green decoration-2 underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-4 flex-1 text-base leading-[1.7] text-[#5b697a]">
        {post.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#5b697a]">
        <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTimeMinutes} Min. Lesezeit</span>
      </div>
      <Link
        href={`/ratgeber/${post.slug}`}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-green-dark underline decoration-2 underline-offset-4"
        aria-label={`${post.title} lesen`}
      >
        Ratgeber lesen →
      </Link>
    </article>
  );
}

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(`${value}T12:00:00+02:00`));
}

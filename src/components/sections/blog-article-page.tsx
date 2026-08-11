import Link from "next/link";

import { PageCta } from "@/components/sections/page-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { formatBlogDate } from "@/components/ui/blog-post-card";
import { NoticeBox } from "@/components/ui/notice-box";
import { SiteContainer } from "@/components/layout/site-container";
import type { BlogPost, BlogSource } from "@/content/blog-posts";
import { servicesBySlug } from "@/content/services";

export function BlogArticlePage({ post }: { post: BlogPost }) {
  const sourcesById = new Map(post.sources.map((source) => [source.id, source]));
  const relatedServices = post.relatedServiceSlugs
    .map((slug) => servicesBySlug[slug])
    .filter(Boolean);

  return (
    <>
      <Breadcrumbs
        current={post.title}
        parent={{ label: "Ratgeber", href: "/ratgeber" }}
      />

      <article>
        <header className="bg-[#f6f9fc] py-14 sm:py-18 lg:py-20">
          <SiteContainer className="max-w-[980px]">
            <p className="home-eyebrow">{post.format}</p>
            <h1 className="mt-4 text-[38px] leading-[1.12] font-bold tracking-[-0.035em] text-navy sm:text-5xl lg:text-[60px]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-4xl text-[18px] leading-[1.75] text-[#5b697a] sm:text-xl">
              {post.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-[#5b697a] sm:text-base">
              <span>Redaktion Krankenfahrten Bad Homburg</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTimeMinutes} Min. Lesezeit</span>
            </div>
          </SiteContainer>
        </header>

        <SiteContainer className="grid gap-12 py-14 lg:grid-cols-[minmax(0,760px)_minmax(240px,1fr)] lg:items-start lg:gap-16 lg:py-20">
          <div className="min-w-0">
            <section aria-labelledby="article-summary" className="rounded-card border border-green/30 bg-[#f0f7eb] p-6 sm:p-8">
              <h2 id="article-summary" className="text-[26px] leading-snug font-bold text-navy">
                Kurz zusammengefasst
              </h2>
              <ul className="mt-5 grid gap-3 text-base leading-[1.7] text-[#334155]">
                {post.summary.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] size-2 shrink-0 rounded-full bg-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 grid gap-12 sm:mt-16 sm:gap-16">
              {post.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28" aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`} className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-navy sm:text-[38px]">
                    {section.title}
                  </h2>
                  <div className="mt-5 grid gap-5 text-[17px] leading-[1.78] text-[#46566a]">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.bullets ? (
                      <ul className="grid gap-3 pl-1">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.72em] size-2 shrink-0 rounded-full bg-green" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {section.sourceIds?.length ? (
                    <SectionSources
                      sources={section.sourceIds.map((sourceId) => sourcesById.get(sourceId)).filter((source): source is BlogSource => Boolean(source))}
                    />
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-14 sm:mt-18" aria-labelledby="article-faq-title">
              <h2 id="article-faq-title" className="text-[30px] leading-tight font-bold text-navy sm:text-[38px]">
                Häufige Fragen
              </h2>
              <div className="mt-7"><FaqAccordion items={post.faqs} /></div>
            </section>

            <section className="mt-14 border-t border-navy/12 pt-10" aria-labelledby="article-sources-title">
              <h2 id="article-sources-title" className="text-[28px] leading-tight font-bold text-navy">
                Geprüfte Quellen
              </h2>
              <p className="mt-3 text-base leading-[1.7] text-[#5b697a]">
                Zuletzt inhaltlich geprüft am {formatBlogDate(post.reviewedAt)}.
              </p>
              <ol className="mt-6 grid gap-4">
                {post.sources.map((source, index) => (
                  <li key={source.id} id={`source-${source.id}`} className="rounded-xl border border-navy/10 bg-[#f7fafc] p-4 text-base leading-[1.6] text-[#46566a]">
                    <span className="font-semibold text-navy">[{index + 1}] {source.publisher}: </span>
                    <a
                      href={source.url}
                      data-editorial-source="true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-green-dark underline underline-offset-4"
                    >
                      {source.title}
                    </a>
                    <span className="block text-sm text-[#5b697a]">Geprüft am {formatBlogDate(source.checkedAt)}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28" aria-label="Hinweise zum Ratgeber">
            <NoticeBox title="Wichtige Einordnung">
              <p>
                Der Beitrag erklärt allgemeine Grundlagen und ersetzt keine medizinische oder versicherungsrechtliche Einzelfallberatung.
              </p>
            </NoticeBox>
            <nav className="mt-6 rounded-card border border-navy/12 bg-white p-5" aria-label="Inhalt des Artikels">
              <h2 className="text-lg font-bold text-navy">Auf dieser Seite</h2>
              <ul className="mt-3 grid">
                {post.sections.map((section) => (
                  <li key={section.id}>
                    <a className="inline-flex min-h-11 items-center text-sm font-semibold text-green-dark underline-offset-4 hover:underline" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </SiteContainer>

        {relatedServices.length ? (
          <section className="bg-[#f6f9fc] py-14 sm:py-18" aria-labelledby="related-services-title">
            <SiteContainer>
              <h2 id="related-services-title" className="text-[30px] leading-tight font-bold text-navy sm:text-[38px]">
                Passende Leistungen
              </h2>
              <div className="mt-7 flex flex-wrap gap-3">
                {relatedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/leistungen/${service.slug}`}
                    className="inline-flex min-h-12 items-center rounded-full border border-navy/15 bg-white px-5 py-2 font-semibold text-navy transition-colors hover:border-green hover:bg-[#f0f7eb]"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </SiteContainer>
          </section>
        ) : null}
      </article>

      <PageCta
        title="Sitzende Krankenfahrt persönlich klären"
        description="Teilen Sie uns Fahrtdaten und Unterstützungsbedarf mit. Wir prüfen, ob die gewünschte Fahrt zu unserem Angebot passt und bestätigen sie ausdrücklich."
      />
    </>
  );
}

function SectionSources({ sources }: { sources: readonly BlogSource[] }) {
  return (
    <p className="mt-6 border-l-4 border-green/50 pl-4 text-sm leading-[1.7] text-[#5b697a]">
      Quellen für diesen Abschnitt:{" "}
      {sources.map((source, index) => (
        <span key={source.id}>
          {index > 0 ? ", " : null}
          <a className="font-semibold text-green-dark underline underline-offset-4" href={`#source-${source.id}`}>
            {source.publisher}
          </a>
        </span>
      ))}
    </p>
  );
}

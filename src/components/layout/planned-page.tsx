import { SiteContainer } from "@/components/layout/site-container";

export function PlannedPage({ title }: { title: string }) {
  return (
    <section className="flex flex-1 items-center bg-[#f6f9fc] py-20" aria-labelledby="planned-page-title">
      <SiteContainer>
        <div className="max-w-2xl rounded-[18px] border border-[#dce2e9] bg-white p-6 sm:p-10">
          <h1 id="planned-page-title" className="text-section-title text-navy">{title}</h1>
          <p className="mt-5 text-[#5b697a]">Diese Seite wird im nächsten Entwicklungsabschnitt umgesetzt.</p>
        </div>
      </SiteContainer>
    </section>
  );
}

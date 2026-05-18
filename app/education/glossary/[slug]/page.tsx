import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { GlossaryBreadcrumb } from "@/components/education/GlossaryBreadcrumb";
import { GlossaryDetailHero } from "@/components/education/GlossaryDetailHero";
import { GlossaryExamples } from "@/components/education/GlossaryExamples";
import { RelatedTerms } from "@/components/education/RelatedTerms";
import {
  fetchAllGlossarySlugs,
  fetchTermBySlug,
  fetchTermsBySlugs,
} from "@/lib/glossary/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await fetchAllGlossarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const term = await fetchTermBySlug(slug);
  if (!term) return { title: "Term not found · FinHub Glossary" };
  return {
    title: `${term.term} · FinHub Glossary`,
    description: term.definition,
  };
}

export default async function GlossaryDetailPage({ params }: Params) {
  const { slug } = await params;
  const term = await fetchTermBySlug(slug);
  if (!term) notFound();

  const related = await fetchTermsBySlugs(term.related_slugs);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col gap-6 px-6 py-6">
        <GlossaryBreadcrumb term={term.term} />
        <GlossaryDetailHero term={term} />
        {term.extended_definition && (
          <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
              DEEP DIVE
            </h2>
            {term.extended_definition.split(/\n\n+/).map((para, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-[var(--color-text-muted)]"
              >
                {para}
              </p>
            ))}
          </section>
        )}
        <GlossaryExamples examples={term.examples} />
        <RelatedTerms terms={related} />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}

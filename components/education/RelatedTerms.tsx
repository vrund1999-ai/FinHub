import Link from "next/link";
import type { RelatedTermSummary } from "@/lib/glossary/queries";
import { DifficultyBadge } from "./DifficultyBadge";

export function RelatedTerms({ terms }: { terms: RelatedTermSummary[] }) {
  if (terms.length === 0) return null;
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        RELATED TERMS
      </h2>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/education/glossary/${t.slug}`}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="text-xs text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              {t.term}
            </span>
            <DifficultyBadge difficulty={t.difficulty} />
          </Link>
        ))}
      </div>
    </section>
  );
}

import type { TrendingTerm } from "./data";

export function TrendingTerms({ terms }: { terms: TrendingTerm[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        TRENDING TERMS
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {terms.map((term) => (
          <button
            key={term.label}
            type="button"
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
          >
            {term.label}
          </button>
        ))}
      </div>
    </section>
  );
}

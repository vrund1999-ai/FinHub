import { DifficultyBadge } from "./DifficultyBadge";
import type { GlossaryTermDetail } from "@/lib/glossary/queries";

export function GlossaryDetailHero({ term }: { term: GlossaryTermDetail }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-text-muted)]">
          {term.category}
        </span>
        <DifficultyBadge difficulty={term.difficulty} />
      </div>
      <h1
        className="text-4xl font-semibold text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {term.term}
      </h1>
      <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
        {term.definition}
      </p>
    </section>
  );
}

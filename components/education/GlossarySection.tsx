import type { GlossaryEntry as Entry } from "./data";
import { AlphabetGrid } from "./AlphabetGrid";
import { GlossaryEntry } from "./GlossaryEntry";

export function GlossarySection({
  alphabet,
  activeLetters,
  selected,
  entries,
  totalTerms,
}: {
  alphabet: readonly string[];
  activeLetters: ReadonlySet<string>;
  selected: string;
  entries: Entry[];
  totalTerms: number;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          GLOSSARY
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {totalTerms} terms
        </span>
      </div>
      <AlphabetGrid
        alphabet={alphabet}
        activeLetters={activeLetters}
        selected={selected}
      />
      <div className="border-t border-[var(--color-border)] pt-4">
        <h3
          className="text-2xl font-semibold text-[var(--color-accent)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {selected}
        </h3>
        <div className="mt-2">
          {entries.map((entry, i) => (
            <GlossaryEntry key={entry.term} entry={entry} isFirst={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

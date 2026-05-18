"use client";

import { ALPHABET } from "./data";
import { AlphabetGrid } from "./AlphabetGrid";
import { GlossaryEntry } from "./GlossaryEntry";
import { GlossaryFilters } from "./GlossaryFilters";
import { useGlossary } from "./GlossaryProvider";

export function GlossarySection() {
  const {
    allTerms,
    filteredTerms,
    activeLetters,
    letter,
    setLetter,
    hasActiveFilters,
    clearFilters,
  } = useGlossary();

  const grouped = new Map<string, typeof filteredTerms>();
  for (const t of filteredTerms) {
    const arr = grouped.get(t.letter);
    if (arr) arr.push(t);
    else grouped.set(t.letter, [t]);
  }
  const letters = Array.from(grouped.keys()).sort();

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          GLOSSARY
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {filteredTerms.length === allTerms.length
            ? `${allTerms.length} terms`
            : `${filteredTerms.length} of ${allTerms.length} terms`}
        </span>
      </div>

      <AlphabetGrid
        alphabet={ALPHABET}
        activeLetters={activeLetters}
        selected={letter}
        onSelect={setLetter}
      />

      <GlossaryFilters />

      <div className="max-h-[70vh] overflow-y-auto border-t border-[var(--color-border)] pt-4 pr-2">
        {filteredTerms.length === 0 ? (
          <div className="flex flex-col items-start gap-3 py-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              No terms match your filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          letters.map((l) => {
            const entries = grouped.get(l)!;
            return (
              <div key={l} className="mb-6 last:mb-0">
                <h3
                  className="text-2xl font-semibold text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {l}
                </h3>
                <div className="mt-2">
                  {entries.map((entry, i) => (
                    <GlossaryEntry
                      key={entry.slug}
                      entry={entry}
                      isFirst={i === 0}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

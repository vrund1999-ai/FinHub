"use client";

import type { Guide } from "@/lib/guides/queries";
import { GuidesProvider, useGuides } from "./GuidesProvider";
import { GuidesFilters } from "./GuidesFilters";
import { GuideCard } from "./GuideCard";

export function GuidesBrowser({ guides }: { guides: Guide[] }) {
  return (
    <GuidesProvider allGuides={guides}>
      <BrowserInner />
    </GuidesProvider>
  );
}

function BrowserInner() {
  const { allGuides, filteredGuides, hasActiveFilters, clearFilters } = useGuides();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          FILTERS
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {filteredGuides.length === allGuides.length
            ? `${allGuides.length} guides`
            : `${filteredGuides.length} of ${allGuides.length} guides`}
        </span>
      </div>

      <GuidesFilters />

      {filteredGuides.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8">
          <p className="text-sm text-[var(--color-text-muted)]">
            No guides match your filters.
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredGuides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { Search } from "lucide-react";
import { useEducationSearch } from "./EducationSearchProvider";

export function EducationHero() {
  const { query, setQuery } = useEducationSearch();

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <span className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
        LEARN AT YOUR OWN PACE
      </span>
      <h1
        className="text-3xl font-semibold text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Your financial education hub
      </h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        From your first stock to portfolio theory — structured tracks, plain-language definitions, and daily quizzes.
      </p>
      <div className="relative mt-2 w-full max-w-2xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms, tracks, and guides…"
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] py-3 pl-10 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
    </section>
  );
}

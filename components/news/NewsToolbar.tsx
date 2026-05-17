import { Search } from "lucide-react";

export function NewsToolbar({
  sortOptions,
}: {
  sortOptions: readonly string[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        TOP STORIES
      </span>

      <div className="flex items-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option}
            type="button"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)]"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search news or tickers…"
          className="w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}

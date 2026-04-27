"use client";

import { Search } from "lucide-react";

export function HeroSearch() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-xl items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 transition-colors focus-within:border-[var(--color-border-strong)]"
    >
      <Search size={16} className="shrink-0 text-[var(--color-text-dim)]" />
      <input
        type="search"
        placeholder="Search a ticker, topic, or term..."
        className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none"
      />
      <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)] sm:inline-block">
        ⌘K
      </kbd>
    </form>
  );
}

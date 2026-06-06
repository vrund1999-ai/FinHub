"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { buildNewsHref } from "@/lib/news/href";
import type { NewsCategory, SortOption } from "./data";

// The only interactive (client) piece of the news filters. Submitting navigates
// to /news with the current view + category preserved and `q` set to the input.
export function NewsSearch({
  view,
  category,
  initialQuery,
}: {
  view: SortOption;
  category: NewsCategory;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = value.trim();
    router.push(buildNewsHref({ view, category, q: q || undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          view === "By ticker"
            ? "Filter by ticker (e.g. AAPL)…"
            : "Search news or tickers…"
        }
        className="w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
      />
    </form>
  );
}

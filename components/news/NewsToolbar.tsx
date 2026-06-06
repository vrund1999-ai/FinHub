import Link from "next/link";
import { buildNewsHref } from "@/lib/news/href";
import { NewsSearch } from "./NewsSearch";
import type { NewsCategory, SortOption } from "./data";

export function NewsToolbar({
  sortOptions,
  activeView,
  params,
}: {
  sortOptions: readonly SortOption[];
  activeView: SortOption;
  params: { category: NewsCategory; q?: string };
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        TOP STORIES
      </span>

      <div className="flex items-center gap-2">
        {sortOptions.map((option) => {
          const isActive = option === activeView;
          return (
            <Link
              key={option}
              href={buildNewsHref({ view: option, category: params.category, q: params.q })}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)]/15 px-3.5 py-1.5 text-xs font-medium text-[var(--color-accent)]"
                  : "rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)]"
              }
            >
              {option}
            </Link>
          );
        })}
      </div>

      <NewsSearch view={activeView} category={params.category} initialQuery={params.q} />
    </div>
  );
}

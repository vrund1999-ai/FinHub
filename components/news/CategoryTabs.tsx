import Link from "next/link";
import { buildNewsHref } from "@/lib/news/href";
import type { NewsCategory, SortOption } from "./data";

export function CategoryTabs({
  tabs,
  active,
  params,
}: {
  tabs: readonly NewsCategory[];
  active: NewsCategory;
  params: { view: SortOption; q?: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-[var(--color-border)]">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <Link
            key={tab}
            href={buildNewsHref({ category: tab, view: params.view, q: params.q })}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "-mb-px border-b-2 border-[var(--color-accent)] pb-3 text-sm font-semibold text-[var(--color-accent)]"
                : "-mb-px border-b-2 border-transparent pb-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            }
          >
            {tab}
          </Link>
        );
      })}
    </div>
  );
}

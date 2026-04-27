import type { NewsArticle } from "./data";
import { CategoryTag } from "./CategoryTag";

export function NewsItem({ item }: { item: NewsArticle }) {
  return (
    <article className="flex flex-col gap-1.5">
      <CategoryTag category={item.category} />
      <h3 className="text-sm font-semibold leading-snug text-[var(--color-text)]">
        {item.headline}
      </h3>
      <p className="text-xs text-[var(--color-text-dim)]">
        {item.source} · {item.timeAgo}
      </p>
    </article>
  );
}

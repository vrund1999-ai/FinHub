import type { NewsArticle } from "./data";
import { categoryDisplayLabel, categoryStyles } from "./data";
import { CategoryTile } from "./CategoryTile";
import { TickerChip } from "./TickerChip";

export function ArticleCard({ article }: { article: NewsArticle }) {
  const chipStyle = categoryStyles[article.category];
  return (
    <article className="flex gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <CategoryTile category={article.category} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
            style={{ backgroundColor: chipStyle.chipBg, color: chipStyle.chipFg }}
          >
            {categoryDisplayLabel[article.category]}
          </span>
          <span>{article.source}</span>
          <span aria-hidden>·</span>
          <span>{article.timeAgo}</span>
        </div>
        <h3 className="text-base font-semibold leading-snug text-[var(--color-text)]">
          {article.headline}
        </h3>
        {article.summary ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {article.summary}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
          {article.tickers.map((symbol) => (
            <TickerChip key={symbol} symbol={symbol} />
          ))}
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

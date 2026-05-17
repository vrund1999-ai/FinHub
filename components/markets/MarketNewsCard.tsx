import type { MarketNewsItem } from "./data";
import { Card } from "@/components/homepage/Card";

export function MarketNewsCard({ items }: { items: MarketNewsItem[] }) {
  return (
    <Card title="MARKET NEWS">
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={item.headline}
            className={
              i === 0
                ? "flex flex-col gap-1 pb-3"
                : "flex flex-col gap-1 border-t border-[var(--color-border)] py-3 last:pb-0"
            }
          >
            <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
              {item.category}
            </span>
            <p className="text-sm leading-snug text-[var(--color-text)]">
              {item.headline}
            </p>
            <span className="text-xs text-[var(--color-text-muted)]">
              {item.source} · {item.timeAgo}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

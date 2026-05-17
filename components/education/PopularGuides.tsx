import { ArrowUpRight } from "lucide-react";
import type { PopularGuide } from "./data";

export function PopularGuides({ items }: { items: PopularGuide[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          POPULAR GUIDES
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          All guides <ArrowUpRight size={12} />
        </a>
      </div>
      <ul className="flex flex-col">
        {items.map((guide, i) => (
          <li
            key={guide.rank}
            className={
              i === 0
                ? "grid grid-cols-[auto_1fr] items-start gap-3 py-2"
                : "grid grid-cols-[auto_1fr] items-start gap-3 border-t border-[var(--color-border)] py-2"
            }
          >
            <span className="text-xs font-medium tabular-nums text-[var(--color-text-dim)]">
              {String(guide.rank).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="text-sm text-[var(--color-text)]">
                {guide.title}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)]">
                {guide.difficulty} · {guide.readTime}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

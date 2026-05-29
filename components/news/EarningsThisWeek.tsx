import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EarningsRow, EarningsStatus } from "./data";
import { StatusBadge } from "./StatusBadge";

const statusVariant: Record<EarningsStatus, "neutral" | "success" | "danger"> = {
  Pending: "neutral",
  Beat: "success",
  Miss: "danger",
};

export function EarningsThisWeek({ items }: { items: EarningsRow[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          EARNINGS THIS WEEK
        </h2>
        <Link
          href="/news/earnings"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          Calendar <ArrowUpRight size={12} />
        </Link>
      </div>
      <ul className="flex flex-col">
        {items.map((row, i) => (
          <li
            key={row.symbol}
            className={
              i === 0
                ? "grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2"
                : "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-[var(--color-border)] py-2"
            }
          >
            <span className="text-xs font-semibold tracking-wide text-[var(--color-accent)]">
              {row.symbol}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm text-[var(--color-text)]">
                {row.name}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)]">
                {row.day} · {row.date} · {row.when}
              </div>
            </div>
            <StatusBadge label={row.status} variant={statusVariant[row.status]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

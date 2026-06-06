import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { EconomicEventRow } from "@/lib/economic/getEconomicEventsThisWeek";
import type { Importance } from "@/lib/economic/sources";
import { StatusBadge } from "./StatusBadge";

const importanceBadge: Record<
  Exclude<Importance, "">,
  { label: string; variant: "danger" | "warning" }
> = {
  high: { label: "HIGH", variant: "danger" },
  medium: { label: "MED", variant: "warning" },
  low: { label: "LOW", variant: "warning" },
};

export function EconomicCalendar({ items }: { items: EconomicEventRow[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          ECONOMIC CALENDAR
        </h2>
        <Link
          href="/news/economic-calendar"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          Calendar <ArrowUpRight size={12} />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-2 text-sm text-[var(--color-text-muted)]">
          No upcoming events.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map((event, i) => {
            const badge = importanceBadge[event.importance || "low"];
            return (
              <li
                key={event.key}
                className={
                  i === 0
                    ? "grid grid-cols-[auto_1fr] items-center gap-3 py-2"
                    : "grid grid-cols-[auto_1fr] items-center gap-3 border-t border-[var(--color-border)] py-2"
                }
              >
                <StatusBadge label={badge.label} variant={badge.variant} />
                <div className="min-w-0">
                  {event.sourceUrl ? (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1 truncate text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] hover:underline"
                    >
                      <span className="truncate">{event.name}</span>
                      <ExternalLink size={11} className="shrink-0 opacity-60" />
                    </a>
                  ) : (
                    <div className="truncate text-sm text-[var(--color-text)]">
                      {event.name}
                    </div>
                  )}
                  <div className="text-[11px] text-[var(--color-text-muted)]">
                    {event.day} · {event.date} · {event.time}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

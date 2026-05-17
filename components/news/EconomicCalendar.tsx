import type { EconomicEvent, EventImportance } from "./data";
import { StatusBadge } from "./StatusBadge";

const importanceVariant: Record<EventImportance, "danger" | "warning"> = {
  HIGH: "danger",
  MED: "warning",
};

export function EconomicCalendar({ items }: { items: EconomicEvent[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        ECONOMIC CALENDAR
      </h2>
      <ul className="flex flex-col">
        {items.map((event, i) => (
          <li
            key={event.name}
            className={
              i === 0
                ? "grid grid-cols-[auto_1fr] items-center gap-3 py-2"
                : "grid grid-cols-[auto_1fr] items-center gap-3 border-t border-[var(--color-border)] py-2"
            }
          >
            <StatusBadge
              label={event.importance}
              variant={importanceVariant[event.importance]}
            />
            <div className="min-w-0">
              <div className="truncate text-sm text-[var(--color-text)]">
                {event.name}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)]">
                {event.day} · {event.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

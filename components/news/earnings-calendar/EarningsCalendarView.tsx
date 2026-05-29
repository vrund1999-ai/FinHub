"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/news/StatusBadge";
import {
  WEEKDAY,
  formatDate,
  formatDay,
  formatWhen,
  parseUtcDate,
} from "@/lib/earnings/format";
import type { CalendarEarningsRow } from "@/lib/earnings/getAllEarnings";
import type { EarningsStatus } from "@/components/news/data";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const statusVariant: Record<EarningsStatus, "neutral" | "success" | "danger"> = {
  Pending: "neutral",
  Beat: "success",
  Miss: "danger",
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatHeaderDate(iso: string): string {
  const d = parseUtcDate(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(d)
    .toUpperCase();
}

type Props = {
  rows: CalendarEarningsRow[];
  todayIso: string;
};

export function EarningsCalendarView({ rows, todayIso }: Props) {
  const [viewYear, setViewYear] = useState(() => Number(todayIso.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(
    () => Number(todayIso.slice(5, 7)) - 1,
  );
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  const rowsByDate = useMemo(() => {
    const m = new Map<string, CalendarEarningsRow[]>();
    for (const r of rows) {
      const arr = m.get(r.reportDate) ?? [];
      arr.push(r);
      m.set(r.reportDate, arr);
    }
    return m;
  }, [rows]);

  const yearRange = useMemo(() => {
    const currentYear = Number(todayIso.slice(0, 4));
    let minY = currentYear;
    let maxY = currentYear + 1;
    for (const r of rows) {
      const y = Number(r.reportDate.slice(0, 4));
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const out: number[] = [];
    for (let y = minY; y <= maxY; y++) out.push(y);
    return out;
  }, [rows, todayIso]);

  function stepMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  function jumpToToday() {
    setViewYear(Number(todayIso.slice(0, 4)));
    setViewMonth(Number(todayIso.slice(5, 7)) - 1);
    setSelectedDate(todayIso);
  }

  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
  const lastOfMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0));
  const leadBlanks = firstOfMonth.getUTCDay();
  const daysInMonth = lastOfMonth.getUTCDate();
  const totalCells = Math.ceil((leadBlanks + daysInMonth) / 7) * 7;

  const dayRows = rowsByDate.get(selectedDate) ?? [];
  const todayUtc = parseUtcDate(todayIso);

  const navButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]";

  const selectClass =
    "rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => stepMonth(-1)}
            aria-label="Previous month"
            className={navButtonClass}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              aria-label="Month"
              className={selectClass}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              aria-label="Year"
              className={selectClass}
            >
              {yearRange.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={jumpToToday}
              className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
            >
              Today
            </button>
          </div>
          <button
            type="button"
            onClick={() => stepMonth(1)}
            aria-label="Next month"
            className={navButtonClass}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          {WEEKDAY.map((d) => (
            <div key={d} className="px-1.5 py-1">
              {d.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - leadBlanks + 1;
            if (dayNum < 1 || dayNum > daysInMonth) {
              return (
                <div
                  key={i}
                  aria-hidden
                  className="aspect-square rounded-md"
                />
              );
            }
            const dateIso = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(dayNum)}`;
            const count = rowsByDate.get(dateIso)?.length ?? 0;
            const isSelected = dateIso === selectedDate;
            const isToday = dateIso === todayIso;

            const base =
              "relative aspect-square rounded-md border bg-[var(--color-surface-2)] p-1.5 text-left transition-colors";
            const interactive =
              "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]";
            const borderClass = isSelected
              ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
              : isToday
                ? "border-[var(--color-text-muted)]"
                : "border-[var(--color-border)]";

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(dateIso)}
                aria-pressed={isSelected}
                className={`${base} ${interactive} ${borderClass}`}
              >
                <span className="text-sm text-[var(--color-text)]">
                  {dayNum}
                </span>
                {count > 0 && (
                  <span className="absolute right-1 top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-semibold text-[var(--color-bg)]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
            {formatHeaderDate(selectedDate)}
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {dayRows.length}{" "}
            {dayRows.length === 1 ? "company" : "companies"}
          </span>
        </div>
        {dayRows.length === 0 ? (
          <p className="py-2 text-sm text-[var(--color-text-muted)]">
            No earnings scheduled for this date.
          </p>
        ) : (
          <ul className="flex flex-col">
            {dayRows.map((row, i) => (
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
                    {formatDay(row.reportDate, todayUtc)} ·{" "}
                    {formatDate(row.reportDate)} · {formatWhen(row.hour)}
                  </div>
                </div>
                <StatusBadge
                  label={row.status}
                  variant={statusVariant[row.status]}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

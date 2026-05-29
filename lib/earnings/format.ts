import type { EarningsStatus } from "@/components/news/data";

export const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type EarningsHour = "bmo" | "amc" | "dmh" | "";

export function parseUtcDate(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T00:00:00Z`);
}

export function formatDay(reportDate: string, today: Date): string {
  const d = parseUtcDate(reportDate);
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const diffDays = Math.round((d.getTime() - todayUtc) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return WEEKDAY[d.getUTCDay()];
}

export function formatDate(reportDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseUtcDate(reportDate));
}

export function formatWhen(hour: EarningsHour): string {
  switch (hour) {
    case "bmo":
      return "Pre-market";
    case "amc":
      return "After close";
    case "dmh":
      return "During market";
    default:
      return "TBD";
  }
}

export function deriveStatus(
  estimate: number | null,
  actual: number | null,
): EarningsStatus {
  if (actual === null || estimate === null) return "Pending";
  return actual >= estimate ? "Beat" : "Miss";
}

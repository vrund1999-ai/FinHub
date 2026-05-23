import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { EarningsRow, EarningsStatus } from "@/components/news/data";

type Row = {
  symbol: string;
  report_date: string;
  hour: "bmo" | "amc" | "dmh" | "";
  eps_estimate: number | null;
  eps_actual: number | null;
  ticker_profiles: { company_name: string } | { company_name: string }[] | null;
};

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseUtcDate(yyyyMmDd: string): Date {
  // Treat the date as UTC midnight so day comparisons are stable across server timezones.
  return new Date(`${yyyyMmDd}T00:00:00Z`);
}

function formatDay(reportDate: string, today: Date): string {
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

function formatWhen(hour: Row["hour"]): string {
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

function deriveStatus(
  estimate: number | null,
  actual: number | null,
): EarningsStatus {
  if (actual === null || estimate === null) return "Pending";
  return actual >= estimate ? "Beat" : "Miss";
}

function extractName(row: Row): string {
  const tp = row.ticker_profiles;
  if (!tp) return row.symbol;
  if (Array.isArray(tp)) return tp[0]?.company_name ?? row.symbol;
  return tp.company_name;
}

export async function getEarningsThisWeek(limit = 8): Promise<EarningsRow[]> {
  const supabase = await createClient();
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("earnings_calendar")
    .select(
      "symbol, report_date, hour, eps_estimate, eps_actual, ticker_profiles!inner(company_name)",
    )
    .gte("report_date", todayIso)
    .order("report_date", { ascending: true })
    .order("symbol", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return (data as Row[]).map((row) => ({
    symbol: row.symbol,
    name: extractName(row),
    day: formatDay(row.report_date, today),
    when: formatWhen(row.hour),
    status: deriveStatus(row.eps_estimate, row.eps_actual),
  }));
}

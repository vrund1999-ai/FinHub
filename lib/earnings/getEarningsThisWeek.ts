import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { EarningsRow } from "@/components/news/data";
import {
  deriveStatus,
  formatDate,
  formatDay,
  formatWhen,
  type EarningsHour,
} from "./format";

type Row = {
  symbol: string;
  report_date: string;
  hour: EarningsHour;
  eps_estimate: number | null;
  eps_actual: number | null;
  ticker_profiles: { company_name: string } | { company_name: string }[] | null;
};

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
    date: formatDate(row.report_date),
    when: formatWhen(row.hour),
    status: deriveStatus(row.eps_estimate, row.eps_actual),
  }));
}

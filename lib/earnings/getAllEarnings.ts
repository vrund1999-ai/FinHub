import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { EarningsStatus } from "@/components/news/data";
import { deriveStatus, type EarningsHour } from "./format";

export type CalendarEarningsRow = {
  symbol: string;
  name: string;
  reportDate: string;
  hour: EarningsHour;
  status: EarningsStatus;
};

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

export async function getAllEarnings(): Promise<CalendarEarningsRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("earnings_calendar")
    .select(
      "symbol, report_date, hour, eps_estimate, eps_actual, ticker_profiles!inner(company_name)",
    )
    .order("report_date", { ascending: true })
    .order("symbol", { ascending: true });

  if (error || !data) return [];

  return (data as Row[]).map((row) => ({
    symbol: row.symbol,
    name: extractName(row),
    reportDate: row.report_date,
    hour: row.hour,
    status: deriveStatus(row.eps_estimate, row.eps_actual),
  }));
}

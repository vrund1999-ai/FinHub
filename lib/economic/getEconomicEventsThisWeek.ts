import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Importance } from "./sources";
import { formatDate, formatDay } from "./format";

export type EconomicEventRow = {
  key: string;
  name: string;
  day: string;
  date: string;
  time: string;
  importance: Importance;
  sourceUrl: string | null;
};

type Row = {
  event_key: string;
  event: string;
  event_date: string;
  event_time: string;
  importance: Importance;
  source_url: string | null;
};

export async function getEconomicEventsThisWeek(limit = 6): Promise<EconomicEventRow[]> {
  const supabase = await createClient();
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("economic_calendar")
    .select("event_key, event, event_date, event_time, importance, source_url")
    .gte("event_date", todayIso)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return (data as Row[]).map((row) => ({
    key: `${row.event_key}-${row.event_date}`,
    name: row.event,
    day: formatDay(row.event_date, today),
    date: formatDate(row.event_date),
    time: row.event_time,
    importance: row.importance,
    sourceUrl: row.source_url,
  }));
}

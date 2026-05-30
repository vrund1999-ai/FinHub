import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Importance } from "./sources";

export type CalendarEconomicRow = {
  eventKey: string;
  name: string;
  eventDate: string;
  eventTime: string;
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

export async function getAllEconomicEvents(): Promise<CalendarEconomicRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("economic_calendar")
    .select("event_key, event, event_date, event_time, importance, source_url")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true });

  if (error || !data) return [];

  return (data as Row[]).map((row) => ({
    eventKey: row.event_key,
    name: row.event,
    eventDate: row.event_date,
    eventTime: row.event_time,
    importance: row.importance,
    sourceUrl: row.source_url,
  }));
}

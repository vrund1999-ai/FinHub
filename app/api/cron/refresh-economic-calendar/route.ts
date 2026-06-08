import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchUpcomingReleaseDates,
  type FredReleaseDate,
} from "@/lib/economic/fred";
import {
  classifyRelease,
  normalizeEventKey,
  type Importance,
} from "@/lib/economic/sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAYS_FORWARD = 90;

type Row = {
  event_key: string;
  event_date: string;
  event: string;
  importance: Importance;
  event_time: string;
  source_url: string | null;
  fetched_at: string;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const from = isoDate(now);
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + DAYS_FORWARD);
  const to = isoDate(horizon);

  let dates: FredReleaseDate[];
  try {
    dates = await fetchUpcomingReleaseDates(from);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  // Keep only tracked releases inside the horizon, deduped on the table's
  // primary key (event_key, event_date) so the upsert batch never self-conflicts.
  const byKey = new Map<string, Row>();
  for (const d of dates) {
    if (d.date < from || d.date > to) continue;
    const info = classifyRelease(d.releaseName);
    if (!info) continue;
    const eventKey = normalizeEventKey(d.releaseName);
    if (!eventKey) continue;
    byKey.set(`${eventKey}|${d.date}`, {
      event_key: eventKey,
      event_date: d.date,
      event: d.releaseName,
      importance: info.importance,
      event_time: info.time,
      source_url: info.sourceUrl,
      fetched_at: new Date().toISOString(),
    });
  }
  const rows = Array.from(byKey.values());

  if (rows.length > 0) {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("economic_calendar")
      .upsert(rows, { onConflict: "event_key,event_date" });
    if (error) {
      return NextResponse.json(
        { ok: false, error: `economic_calendar upsert failed: ${error.message}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true, window: { from, to }, fetched: rows.length });
}

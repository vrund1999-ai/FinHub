import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchCompanyProfile,
  fetchEarningsCalendar,
  type FinnhubEarning,
} from "@/lib/earnings/finnhub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAYS_FORWARD = 90;

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
  const future = new Date(now);
  future.setUTCDate(future.getUTCDate() + DAYS_FORWARD);
  const to = isoDate(future);

  let calendar: FinnhubEarning[];
  try {
    calendar = await fetchEarningsCalendar(from, to);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  const supabase = createAdminClient();

  const symbols = Array.from(new Set(calendar.map((r) => r.symbol))).filter(Boolean);

  // Look up which symbols already have profile rows.
  const known = new Set<string>();
  if (symbols.length > 0) {
    const { data: existing, error } = await supabase
      .from("ticker_profiles")
      .select("symbol")
      .in("symbol", symbols);
    if (error) {
      return NextResponse.json(
        { ok: false, error: `ticker_profiles select failed: ${error.message}` },
        { status: 500 },
      );
    }
    for (const row of existing ?? []) known.add(row.symbol);
  }

  // Fetch + upsert profiles for any new symbols. Skip symbols we can't resolve
  // so we don't FK-violate when inserting earnings rows.
  const unresolved = new Set<string>();
  const newProfiles: Array<{ symbol: string; company_name: string; logo_url: string | null }> = [];
  for (const symbol of symbols) {
    if (known.has(symbol)) continue;
    const profile = await fetchCompanyProfile(symbol);
    if (!profile) {
      unresolved.add(symbol);
      continue;
    }
    newProfiles.push({ symbol, company_name: profile.name, logo_url: profile.logo });
  }

  if (newProfiles.length > 0) {
    const { error } = await supabase
      .from("ticker_profiles")
      .upsert(newProfiles, { onConflict: "symbol" });
    if (error) {
      return NextResponse.json(
        { ok: false, error: `ticker_profiles upsert failed: ${error.message}` },
        { status: 500 },
      );
    }
  }

  const earningsRows = calendar
    .filter((r) => !unresolved.has(r.symbol))
    .map((r) => ({
      symbol: r.symbol,
      report_date: r.date,
      hour: r.hour,
      eps_estimate: r.epsEstimate,
      eps_actual: r.epsActual,
      revenue_estimate: r.revenueEstimate,
      revenue_actual: r.revenueActual,
      quarter: r.quarter || null,
      year: r.year || null,
      fetched_at: new Date().toISOString(),
    }));

  if (earningsRows.length > 0) {
    const { error } = await supabase
      .from("earnings_calendar")
      .upsert(earningsRows, { onConflict: "symbol,report_date" });
    if (error) {
      return NextResponse.json(
        { ok: false, error: `earnings_calendar upsert failed: ${error.message}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    window: { from, to },
    fetched: earningsRows.length,
    profilesAdded: newProfiles.length,
    skipped: unresolved.size,
  });
}

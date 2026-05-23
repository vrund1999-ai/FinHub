import "server-only";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

export type FinnhubHour = "bmo" | "amc" | "dmh" | "";

export type FinnhubEarning = {
  symbol: string;
  date: string; // YYYY-MM-DD
  hour: FinnhubHour;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
  quarter: number;
  year: number;
};

type FinnhubCalendarResponse = {
  earningsCalendar?: Array<{
    symbol: string;
    date: string;
    hour?: string;
    epsEstimate?: number | null;
    epsActual?: number | null;
    revenueEstimate?: number | null;
    revenueActual?: number | null;
    quarter?: number;
    year?: number;
  }>;
};

type FinnhubProfileResponse = {
  name?: string;
  logo?: string;
};

function requireKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

function normalizeHour(hour: string | undefined): FinnhubHour {
  return hour === "bmo" || hour === "amc" || hour === "dmh" ? hour : "";
}

export async function fetchEarningsCalendar(
  from: string,
  to: string,
): Promise<FinnhubEarning[]> {
  const token = requireKey();
  const url = `${FINNHUB_BASE}/calendar/earnings?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Finnhub calendar fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as FinnhubCalendarResponse;
  const rows = json.earningsCalendar ?? [];

  return rows.map((r) => ({
    symbol: r.symbol,
    date: r.date,
    hour: normalizeHour(r.hour),
    epsEstimate: r.epsEstimate ?? null,
    epsActual: r.epsActual ?? null,
    revenueEstimate: r.revenueEstimate ?? null,
    revenueActual: r.revenueActual ?? null,
    quarter: r.quarter ?? 0,
    year: r.year ?? 0,
  }));
}

export async function fetchCompanyProfile(
  symbol: string,
): Promise<{ name: string; logo: string | null } | null> {
  const token = requireKey();
  const url = `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as FinnhubProfileResponse;
  if (!json.name) return null;
  return { name: json.name, logo: json.logo ?? null };
}

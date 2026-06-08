import "server-only";

// FRED (Federal Reserve Economic Data, St. Louis Fed). Free + official; an API
// key is required (free, instant: https://fredaccount.stlouisfed.org/apikeys).
const FRED_BASE = "https://api.stlouisfed.org/fred";

export type FredReleaseDate = {
  releaseId: number;
  releaseName: string;
  date: string; // YYYY-MM-DD
};

type FredReleasesDatesResponse = {
  release_dates?: Array<{
    release_id: number;
    release_name?: string;
    date: string;
  }>;
};

function requireKey(): string {
  const key = process.env.FRED_API_KEY;
  if (!key) throw new Error("FRED_API_KEY is not set");
  return key;
}

// Upcoming release dates across all FRED releases, from `from` forward.
// `include_release_dates_with_no_data=true` is what surfaces future scheduled
// dates (otherwise FRED only returns dates that already have data).
export async function fetchUpcomingReleaseDates(
  from: string,
  limit = 1000,
): Promise<FredReleaseDate[]> {
  const key = requireKey();
  const url =
    `${FRED_BASE}/releases/dates?api_key=${encodeURIComponent(key)}` +
    `&file_type=json&realtime_start=${encodeURIComponent(from)}` +
    `&include_release_dates_with_no_data=true&order_by=release_date` +
    `&sort_order=asc&limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`FRED releases/dates fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as FredReleasesDatesResponse;
  const rows = json.release_dates ?? [];

  return rows
    .filter((r) => r.release_name && r.date)
    .map((r) => ({
      releaseId: r.release_id,
      releaseName: (r.release_name as string).trim(),
      date: r.date,
    }));
}

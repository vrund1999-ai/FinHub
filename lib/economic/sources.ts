import "server-only";

export type Importance = "high" | "medium" | "low" | "";

// Slugify a release name into a stable key used as part of the primary key:
// lowercase, drop punctuation, collapse to hyphens.
export function normalizeEventKey(event: string): string {
  return event
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ReleaseInfo = {
  importance: Importance;
  time: string; // well-known ET release time, display-ready (e.g. '8:30am ET')
  sourceUrl: string; // official page where the report is published
};

// Whitelist of the market-moving US releases we track from FRED, matched by
// keyword against the FRED release name. Releases not listed here are skipped,
// keeping the calendar focused on what people actually follow. FRED covers
// government releases (BLS/BEA/Census/Fed); proprietary ones (ISM, Conference
// Board, ADP) aren't in FRED and so don't appear.
const RELEASES: Array<{ keywords: string[]; info: ReleaseInfo }> = [
  { keywords: ["employment situation"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.bls.gov/news.release/empsit.toc.htm" } },
  { keywords: ["consumer price index"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.bls.gov/cpi/" } },
  { keywords: ["producer price index"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.bls.gov/ppi/" } },
  { keywords: ["personal income and outlays", "personal income & outlays"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.bea.gov/data/personal-consumption-expenditures-price-index" } },
  { keywords: ["gross domestic product"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.bea.gov/data/gdp/gross-domestic-product" } },
  { keywords: ["advance monthly sales for retail", "retail and food services", "retail sales"], info: { importance: "high", time: "8:30am ET", sourceUrl: "https://www.census.gov/retail/marts/www/marts_current.pdf" } },
  { keywords: ["unemployment insurance weekly claims", "weekly claims"], info: { importance: "medium", time: "8:30am ET", sourceUrl: "https://www.dol.gov/ui/data.pdf" } },
  { keywords: ["job openings and labor turnover", "jolts"], info: { importance: "medium", time: "10:00am ET", sourceUrl: "https://www.bls.gov/jlt/" } },
  { keywords: ["new residential construction", "housing starts"], info: { importance: "medium", time: "8:30am ET", sourceUrl: "https://www.census.gov/construction/nrc/" } },
  { keywords: ["new residential sales", "new home sales"], info: { importance: "medium", time: "10:00am ET", sourceUrl: "https://www.census.gov/construction/nrs/" } },
  { keywords: ["existing home sales"], info: { importance: "medium", time: "10:00am ET", sourceUrl: "https://www.nar.realtor/research-and-statistics/housing-statistics/existing-home-sales" } },
  { keywords: ["international trade"], info: { importance: "medium", time: "8:30am ET", sourceUrl: "https://www.bea.gov/data/intl-trade-investment/international-trade-goods-and-services" } },
  { keywords: ["industrial production"], info: { importance: "medium", time: "9:15am ET", sourceUrl: "https://www.federalreserve.gov/releases/g17/current/" } },
  { keywords: ["durable goods", "manufacturers' shipments", "advance report on durable"], info: { importance: "medium", time: "8:30am ET", sourceUrl: "https://www.census.gov/manufacturing/m3/" } },
];

export function classifyRelease(releaseName: string): ReleaseInfo | null {
  const n = releaseName.toLowerCase();
  for (const r of RELEASES) {
    if (r.keywords.some((k) => n.includes(k))) return r.info;
  }
  return null;
}

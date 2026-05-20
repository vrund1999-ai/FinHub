export const GUIDE_CATEGORIES = [
  "Investing Basics",
  "Markets & Trading",
  "Reading Financials",
  "Personal Finance",
  "Macro & Economy",
  "Options & Derivatives",
  "Retirement",
  "Taxes",
  "Crypto",
] as const;

export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];

export const GUIDE_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type GuideDifficulty = (typeof GUIDE_DIFFICULTIES)[number];

export const READ_TIME_BUCKETS = [
  { id: "lt5", label: "< 5 min", min: 1, max: 4 },
  { id: "5to10", label: "5–10 min", min: 5, max: 10 },
  { id: "11to20", label: "11–20 min", min: 11, max: 20 },
  { id: "gt20", label: "20+ min", min: 21, max: Number.POSITIVE_INFINITY },
] as const;

export type ReadTimeBucketId = (typeof READ_TIME_BUCKETS)[number]["id"];

export function bucketForMinutes(minutes: number): ReadTimeBucketId {
  for (const b of READ_TIME_BUCKETS) {
    if (minutes >= b.min && minutes <= b.max) return b.id;
  }
  return "gt20";
}

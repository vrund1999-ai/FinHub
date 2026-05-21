export const TRACK_CATEGORIES = [
  "Investing Basics",
  "Markets & Trading",
  "Reading Financials",
  "Personal Finance",
  "Macro & Economy",
  "Options & Derivatives",
  "Retirement",
  "Taxes",
  "Crypto",
  "Behavioral Finance",
] as const;

export type TrackCategory = (typeof TRACK_CATEGORIES)[number];

export const TRACK_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type TrackDifficulty = (typeof TRACK_DIFFICULTIES)[number];

export const LESSON_COUNT_BUCKETS = [
  { id: "short", label: "≤ 5 lessons", min: 1, max: 5 },
  { id: "medium", label: "6–10 lessons", min: 6, max: 10 },
  { id: "long", label: "11+ lessons", min: 11, max: 99 },
] as const;

export type LessonCountBucketId = (typeof LESSON_COUNT_BUCKETS)[number]["id"];

export function bucketForLessonCount(n: number): LessonCountBucketId {
  for (const b of LESSON_COUNT_BUCKETS) {
    if (n >= b.min && n <= b.max) return b.id;
  }
  return "long";
}

export const TRACK_ICON_NAMES = [
  "TrendingUp",
  "BarChart2",
  "Landmark",
  "Layers",
  "PiggyBank",
  "Wallet",
  "Bitcoin",
  "Receipt",
  "LineChart",
  "ShieldCheck",
  "Briefcase",
  "Brain",
] as const;

export type TrackIconName = (typeof TRACK_ICON_NAMES)[number];

export const TRACK_STATUS_FILTERS = ["all", "in-progress", "completed"] as const;
export type TrackStatusFilter = (typeof TRACK_STATUS_FILTERS)[number];

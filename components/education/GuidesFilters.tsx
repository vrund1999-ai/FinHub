"use client";

import {
  GUIDE_CATEGORIES,
  GUIDE_DIFFICULTIES,
  READ_TIME_BUCKETS,
  type GuideCategory,
  type GuideDifficulty,
  type ReadTimeBucketId,
} from "@/lib/guides/categories";
import { useGuides } from "./GuidesProvider";

export function GuidesFilters() {
  const {
    categories,
    difficulties,
    readTimeBuckets,
    toggleCategory,
    toggleDifficulty,
    toggleReadTimeBucket,
  } = useGuides();

  return (
    <div className="flex flex-col gap-3">
      <FilterRow label="CATEGORY">
        {GUIDE_CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={categories.has(c)}
            onClick={() => toggleCategory(c)}
            label={c}
          />
        ))}
      </FilterRow>
      <FilterRow label="DIFFICULTY">
        {GUIDE_DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            active={difficulties.has(d)}
            onClick={() => toggleDifficulty(d)}
            label={d}
          />
        ))}
      </FilterRow>
      <FilterRow label="READ TIME">
        {READ_TIME_BUCKETS.map((b) => (
          <Chip
            key={b.id}
            active={readTimeBuckets.has(b.id)}
            onClick={() => toggleReadTimeBucket(b.id)}
            label={b.label}
          />
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <span className="shrink-0 pt-1 text-[10px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)] sm:w-24">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: GuideCategory | GuideDifficulty | ReadTimeBucketId | string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
      }`}
    >
      {label}
    </button>
  );
}

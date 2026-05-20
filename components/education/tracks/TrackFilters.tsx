"use client";

import {
  TRACK_CATEGORIES,
  TRACK_DIFFICULTIES,
  LESSON_COUNT_BUCKETS,
  type TrackCategory,
  type TrackDifficulty,
  type LessonCountBucketId,
  type TrackStatusFilter,
} from "@/lib/tracks/categories";
import { useTracks } from "./TracksProvider";

export function TrackFilters() {
  const {
    categories,
    difficulties,
    lessonBuckets,
    status,
    isAuthed,
    toggleCategory,
    toggleDifficulty,
    toggleLessonBucket,
    setStatus,
  } = useTracks();

  return (
    <div className="flex flex-col gap-3">
      <FilterRow label="CATEGORY">
        {TRACK_CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={categories.has(c)}
            onClick={() => toggleCategory(c)}
            label={c}
          />
        ))}
      </FilterRow>
      <FilterRow label="DIFFICULTY">
        {TRACK_DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            active={difficulties.has(d)}
            onClick={() => toggleDifficulty(d)}
            label={d}
          />
        ))}
      </FilterRow>
      <FilterRow label="LESSONS">
        {LESSON_COUNT_BUCKETS.map((b) => (
          <Chip
            key={b.id}
            active={lessonBuckets.has(b.id)}
            onClick={() => toggleLessonBucket(b.id)}
            label={b.label}
          />
        ))}
      </FilterRow>
      <FilterRow label="STATUS">
        {(["all", "in-progress", "completed"] as TrackStatusFilter[]).map((s) => (
          <Chip
            key={s}
            active={status === s}
            onClick={() => setStatus(s)}
            disabled={!isAuthed && s !== "all"}
            label={statusLabel(s)}
          />
        ))}
        {!isAuthed && (
          <span className="self-center text-[11px] text-[var(--color-text-muted)]">
            Sign in to track progress
          </span>
        )}
      </FilterRow>
    </div>
  );
}

function statusLabel(s: TrackStatusFilter): string {
  if (s === "all") return "All";
  if (s === "in-progress") return "In progress";
  return "Completed";
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  label: TrackCategory | TrackDifficulty | LessonCountBucketId | string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        disabled
          ? "cursor-not-allowed border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50"
          : active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
      }`}
    >
      {label}
    </button>
  );
}

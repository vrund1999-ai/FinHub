import Link from "next/link";
import {
  TrendingUp,
  BarChart2,
  Landmark,
  Layers,
  PiggyBank,
  Wallet,
  Bitcoin,
  Receipt,
  LineChart,
  ShieldCheck,
  Briefcase,
  Brain,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LearningTrack, UserTrackProgress } from "@/lib/tracks/types";
import type { TrackIconName } from "@/lib/tracks/categories";
import { DifficultyBadge } from "../DifficultyBadge";
import { ProgressBar } from "../ProgressBar";

const iconMap: Record<
  TrackIconName,
  ComponentType<{ size?: number; className?: string }>
> = {
  TrendingUp,
  BarChart2,
  Landmark,
  Layers,
  PiggyBank,
  Wallet,
  Bitcoin,
  Receipt,
  LineChart,
  ShieldCheck,
  Briefcase,
  Brain,
};

export function TrackBrowseCard({
  track,
  progress,
}: {
  track: LearningTrack;
  progress?: UserTrackProgress;
}) {
  const Icon = iconMap[track.icon_name] ?? TrendingUp;
  const pct =
    progress && progress.total_lessons > 0
      ? Math.round(
          (progress.lessons_completed_count / progress.total_lessons) * 100,
        )
      : 0;
  const isCompleted = !!progress?.completed_at;

  return (
    <Link
      href={`/education/tracks/${track.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-md"
          style={{
            backgroundColor: `color-mix(in srgb, ${track.accent_color} 18%, transparent)`,
            color: track.accent_color,
          }}
        >
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={track.difficulty} />
          {isCompleted && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-success) 18%, transparent)",
                color: "var(--color-success)",
              }}
            >
              <CheckCircle2 size={12} /> Completed
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {track.category}
          </span>
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
          {track.title}
        </h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {track.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span>{track.lesson_count} lessons</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {track.est_minutes} min
          </span>
        </div>
        <ProgressBar pct={pct} color={track.accent_color} />
      </div>
    </Link>
  );
}

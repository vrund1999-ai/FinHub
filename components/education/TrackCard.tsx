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
} from "lucide-react";
import type { ComponentType } from "react";
import type { LearningTrack, UserTrackProgress } from "@/lib/tracks/types";
import type { TrackIconName } from "@/lib/tracks/categories";
import { ProgressBar } from "./ProgressBar";

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

export function TrackCard({
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
  return (
    <Link
      href={`/education/tracks/${track.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 transition hover:border-[var(--color-accent)]"
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-md"
        style={{
          backgroundColor: `color-mix(in srgb, ${track.accent_color} 18%, transparent)`,
          color: track.accent_color,
        }}
      >
        <Icon size={18} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
          {track.title}
        </h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {track.description}
        </p>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-muted)]">
          {track.lesson_count} lessons
        </span>
        <ProgressBar pct={pct} color={track.accent_color} />
      </div>
    </Link>
  );
}

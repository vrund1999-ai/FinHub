import { TrendingUp, BarChart2, Landmark, Layers } from "lucide-react";
import type { ComponentType } from "react";
import type { LearningTrack } from "./data";
import { ProgressBar } from "./ProgressBar";

const iconMap: Record<LearningTrack["iconName"], ComponentType<{ size?: number; className?: string }>> = {
  TrendingUp,
  BarChart2,
  Landmark,
  Layers,
};

export function TrackCard({ track }: { track: LearningTrack }) {
  const Icon = iconMap[track.iconName];
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-md"
        style={{
          backgroundColor: `color-mix(in srgb, ${track.accentColor} 18%, transparent)`,
          color: track.accentColor,
        }}
      >
        <Icon size={18} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {track.title}
        </h3>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {track.description}
        </p>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-muted)]">
          {track.lessons} lessons
        </span>
        <ProgressBar pct={track.progressPct} color={track.accentColor} />
      </div>
    </article>
  );
}

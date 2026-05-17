import { ArrowUpRight } from "lucide-react";
import type { LearningTrack } from "./data";
import { TrackCard } from "./TrackCard";

export function LearningTracksSection({
  tracks,
}: {
  tracks: LearningTrack[];
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          LEARNING TRACKS
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          View all tracks <ArrowUpRight size={12} />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
}

"use client";

import type { LearningTrack, UserTrackProgress } from "@/lib/tracks/types";
import { TracksProvider, useTracks } from "./TracksProvider";
import { TrackFilters } from "./TrackFilters";
import { TrackBrowseCard } from "./TrackBrowseCard";

export function TracksBrowser({
  tracks,
  progress,
  isAuthed,
}: {
  tracks: LearningTrack[];
  progress: UserTrackProgress[];
  isAuthed: boolean;
}) {
  return (
    <TracksProvider allTracks={tracks} progress={progress} isAuthed={isAuthed}>
      <BrowserInner />
    </TracksProvider>
  );
}

function BrowserInner() {
  const { allTracks, filteredTracks, progressByTrack, hasActiveFilters, clearFilters } =
    useTracks();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          FILTERS
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {filteredTracks.length === allTracks.length
            ? `${allTracks.length} tracks`
            : `${filteredTracks.length} of ${allTracks.length} tracks`}
        </span>
      </div>

      <TrackFilters />

      {filteredTracks.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8">
          <p className="text-sm text-[var(--color-text-muted)]">
            No tracks match your filters.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((t) => (
            <TrackBrowseCard
              key={t.id}
              track={t}
              progress={progressByTrack.get(t.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

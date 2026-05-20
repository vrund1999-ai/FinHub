"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LearningTrack, UserTrackProgress } from "@/lib/tracks/types";
import {
  bucketForLessonCount,
  type LessonCountBucketId,
  type TrackCategory,
  type TrackDifficulty,
  type TrackStatusFilter,
} from "@/lib/tracks/categories";

export type TrackWithProgress = LearningTrack & {
  progress?: UserTrackProgress;
};

type TracksContextValue = {
  allTracks: LearningTrack[];
  filteredTracks: LearningTrack[];
  progressByTrack: Map<string, UserTrackProgress>;
  isAuthed: boolean;
  categories: ReadonlySet<TrackCategory>;
  difficulties: ReadonlySet<TrackDifficulty>;
  lessonBuckets: ReadonlySet<LessonCountBucketId>;
  status: TrackStatusFilter;
  toggleCategory: (value: TrackCategory) => void;
  toggleDifficulty: (value: TrackDifficulty) => void;
  toggleLessonBucket: (value: LessonCountBucketId) => void;
  setStatus: (value: TrackStatusFilter) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const TracksContext = createContext<TracksContextValue | null>(null);

export function useTracks(): TracksContextValue {
  const ctx = useContext(TracksContext);
  if (!ctx) throw new Error("useTracks must be used inside <TracksProvider>");
  return ctx;
}

export function TracksProvider({
  allTracks,
  progress,
  isAuthed,
  children,
}: {
  allTracks: LearningTrack[];
  progress: UserTrackProgress[];
  isAuthed: boolean;
  children: ReactNode;
}) {
  const progressByTrack = useMemo(
    () => new Map(progress.map((p) => [p.track_id, p])),
    [progress],
  );

  const [categories, setCategories] = useState<Set<TrackCategory>>(
    () => new Set(),
  );
  const [difficulties, setDifficulties] = useState<Set<TrackDifficulty>>(
    () => new Set(),
  );
  const [lessonBuckets, setLessonBuckets] = useState<Set<LessonCountBucketId>>(
    () => new Set(),
  );
  const [status, setStatus] = useState<TrackStatusFilter>("all");

  const filteredTracks = useMemo(() => {
    return allTracks.filter((t) => {
      if (categories.size > 0 && !categories.has(t.category)) return false;
      if (difficulties.size > 0 && !difficulties.has(t.difficulty)) return false;
      if (
        lessonBuckets.size > 0 &&
        !lessonBuckets.has(bucketForLessonCount(t.lesson_count))
      ) {
        return false;
      }
      if (isAuthed && status !== "all") {
        const p = progressByTrack.get(t.id);
        const isCompleted = !!p?.completed_at;
        const isStarted = !!p && p.lessons_completed_count > 0 && !isCompleted;
        if (status === "completed" && !isCompleted) return false;
        if (status === "in-progress" && !isStarted) return false;
      }
      return true;
    });
  }, [allTracks, categories, difficulties, lessonBuckets, status, isAuthed, progressByTrack]);

  const toggleCategory = useCallback((value: TrackCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleDifficulty = useCallback((value: TrackDifficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleLessonBucket = useCallback((value: LessonCountBucketId) => {
    setLessonBuckets((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setCategories(new Set());
    setDifficulties(new Set());
    setLessonBuckets(new Set());
    setStatus("all");
  }, []);

  const hasActiveFilters =
    categories.size > 0 ||
    difficulties.size > 0 ||
    lessonBuckets.size > 0 ||
    status !== "all";

  const value = useMemo<TracksContextValue>(
    () => ({
      allTracks,
      filteredTracks,
      progressByTrack,
      isAuthed,
      categories,
      difficulties,
      lessonBuckets,
      status,
      toggleCategory,
      toggleDifficulty,
      toggleLessonBucket,
      setStatus,
      clearFilters,
      hasActiveFilters,
    }),
    [
      allTracks,
      filteredTracks,
      progressByTrack,
      isAuthed,
      categories,
      difficulties,
      lessonBuckets,
      status,
      toggleCategory,
      toggleDifficulty,
      toggleLessonBucket,
      clearFilters,
      hasActiveFilters,
    ],
  );

  return <TracksContext.Provider value={value}>{children}</TracksContext.Provider>;
}

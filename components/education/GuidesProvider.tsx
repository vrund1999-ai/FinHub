"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Guide } from "@/lib/guides/queries";
import {
  bucketForMinutes,
  type GuideCategory,
  type GuideDifficulty,
  type ReadTimeBucketId,
} from "@/lib/guides/categories";

type GuidesContextValue = {
  allGuides: Guide[];
  filteredGuides: Guide[];
  categories: ReadonlySet<GuideCategory>;
  difficulties: ReadonlySet<GuideDifficulty>;
  readTimeBuckets: ReadonlySet<ReadTimeBucketId>;
  toggleCategory: (value: GuideCategory) => void;
  toggleDifficulty: (value: GuideDifficulty) => void;
  toggleReadTimeBucket: (value: ReadTimeBucketId) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const GuidesContext = createContext<GuidesContextValue | null>(null);

export function useGuides(): GuidesContextValue {
  const ctx = useContext(GuidesContext);
  if (!ctx) throw new Error("useGuides must be used inside <GuidesProvider>");
  return ctx;
}

export function GuidesProvider({
  allGuides,
  children,
}: {
  allGuides: Guide[];
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<Set<GuideCategory>>(() => new Set());
  const [difficulties, setDifficulties] = useState<Set<GuideDifficulty>>(() => new Set());
  const [readTimeBuckets, setReadTimeBuckets] = useState<Set<ReadTimeBucketId>>(() => new Set());

  const filteredGuides = useMemo(() => {
    return allGuides.filter((g) => {
      if (categories.size > 0 && !categories.has(g.category)) return false;
      if (difficulties.size > 0 && !difficulties.has(g.difficulty)) return false;
      if (readTimeBuckets.size > 0 && !readTimeBuckets.has(bucketForMinutes(g.read_time_minutes))) return false;
      return true;
    });
  }, [allGuides, categories, difficulties, readTimeBuckets]);

  const toggleCategory = useCallback((value: GuideCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleDifficulty = useCallback((value: GuideDifficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleReadTimeBucket = useCallback((value: ReadTimeBucketId) => {
    setReadTimeBuckets((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setCategories(new Set());
    setDifficulties(new Set());
    setReadTimeBuckets(new Set());
  }, []);

  const hasActiveFilters =
    categories.size > 0 || difficulties.size > 0 || readTimeBuckets.size > 0;

  const value = useMemo<GuidesContextValue>(
    () => ({
      allGuides,
      filteredGuides,
      categories,
      difficulties,
      readTimeBuckets,
      toggleCategory,
      toggleDifficulty,
      toggleReadTimeBucket,
      clearFilters,
      hasActiveFilters,
    }),
    [
      allGuides,
      filteredGuides,
      categories,
      difficulties,
      readTimeBuckets,
      toggleCategory,
      toggleDifficulty,
      toggleReadTimeBucket,
      clearFilters,
      hasActiveFilters,
    ],
  );

  return <GuidesContext.Provider value={value}>{children}</GuidesContext.Provider>;
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { GlossaryListItem } from "@/lib/glossary/queries";
import type { Category, Difficulty } from "@/lib/glossary/categories";
import type { LearningTrack } from "@/lib/tracks/types";
import type { Guide } from "@/lib/guides/queries";

type EducationSearchContextValue = {
  allTerms: GlossaryListItem[];
  filteredTerms: GlossaryListItem[];
  allTracks: LearningTrack[];
  filteredTracks: LearningTrack[];
  allGuides: Guide[];
  filteredGuides: Guide[];
  activeLetters: ReadonlySet<string>;
  query: string;
  letter: string | null;
  categories: ReadonlySet<Category>;
  difficulties: ReadonlySet<Difficulty>;
  setQuery: (value: string) => void;
  setLetter: (value: string | null) => void;
  toggleCategory: (value: Category) => void;
  toggleDifficulty: (value: Difficulty) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const EducationSearchContext = createContext<EducationSearchContextValue | null>(null);

export function useEducationSearch(): EducationSearchContextValue {
  const ctx = useContext(EducationSearchContext);
  if (!ctx) throw new Error("useEducationSearch must be used inside <EducationSearchProvider>");
  return ctx;
}

export function EducationSearchProvider({
  allTerms,
  allTracks,
  allGuides,
  children,
}: {
  allTerms: GlossaryListItem[];
  allTracks: LearningTrack[];
  allGuides: Guide[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [categories, setCategories] = useState<Set<Category>>(() => new Set());
  const [difficulties, setDifficulties] = useState<Set<Difficulty>>(() => new Set());

  const activeLetters = useMemo(
    () => new Set(allTerms.map((t) => t.letter)),
    [allTerms],
  );

  // 302 rows × ~200 chars searchable is sub-millisecond on every keystroke;
  // no debouncing or Postgres FTS needed.
  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTerms.filter((t) => {
      if (letter && t.letter !== letter) return false;
      if (categories.size > 0 && !categories.has(t.category)) return false;
      if (difficulties.size > 0 && !difficulties.has(t.difficulty)) return false;
      if (q) {
        const haystack = `${t.term} ${t.definition}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allTerms, query, letter, categories, difficulties]);

  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTracks;
    return allTracks.filter((t) => {
      const haystack = `${t.title} ${t.description ?? ""} ${t.category ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allTracks, query]);

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allGuides;
    return allGuides.filter((g) => {
      const haystack = `${g.title} ${g.description ?? ""} ${g.source ?? ""} ${g.category ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allGuides, query]);

  const toggleCategory = useCallback((value: Category) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleDifficulty = useCallback((value: Difficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setLetter(null);
    setCategories(new Set());
    setDifficulties(new Set());
  }, []);

  const hasActiveFilters =
    query.length > 0 || letter !== null || categories.size > 0 || difficulties.size > 0;

  const value = useMemo<EducationSearchContextValue>(
    () => ({
      allTerms,
      filteredTerms,
      allTracks,
      filteredTracks,
      allGuides,
      filteredGuides,
      activeLetters,
      query,
      letter,
      categories,
      difficulties,
      setQuery,
      setLetter,
      toggleCategory,
      toggleDifficulty,
      clearFilters,
      hasActiveFilters,
    }),
    [
      allTerms,
      filteredTerms,
      allTracks,
      filteredTracks,
      allGuides,
      filteredGuides,
      activeLetters,
      query,
      letter,
      categories,
      difficulties,
      toggleCategory,
      toggleDifficulty,
      clearFilters,
      hasActiveFilters,
    ],
  );

  return <EducationSearchContext.Provider value={value}>{children}</EducationSearchContext.Provider>;
}

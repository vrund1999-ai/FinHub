"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { GlossaryListItem } from "@/lib/glossary/queries";
import type { Category, Difficulty } from "@/lib/glossary/categories";

type GlossaryContextValue = {
  allTerms: GlossaryListItem[];
  filteredTerms: GlossaryListItem[];
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

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext);
  if (!ctx) throw new Error("useGlossary must be used inside <GlossaryProvider>");
  return ctx;
}

export function GlossaryProvider({
  allTerms,
  children,
}: {
  allTerms: GlossaryListItem[];
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

  const value = useMemo<GlossaryContextValue>(
    () => ({
      allTerms,
      filteredTerms,
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

  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

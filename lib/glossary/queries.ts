import { createStaticClient } from "@/lib/supabase/static";
import type { Category, Difficulty } from "./categories";

export type GlossaryListItem = {
  slug: string;
  term: string;
  definition: string;
  category: Category;
  difficulty: Difficulty;
  letter: string;
};

export type GlossaryTermDetail = GlossaryListItem & {
  extended_definition: string | null;
  related_slugs: string[];
  examples: { title: string; body: string }[];
};

export type RelatedTermSummary = {
  slug: string;
  term: string;
  difficulty: Difficulty;
};

export async function fetchAllGlossaryTerms(): Promise<GlossaryListItem[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("slug, term, definition, category, difficulty, letter")
    .order("term");
  if (error) throw error;
  return (data ?? []) as GlossaryListItem[];
}

export async function fetchTermBySlug(slug: string): Promise<GlossaryTermDetail | null> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select(
      "slug, term, definition, extended_definition, category, difficulty, letter, related_slugs, examples",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as GlossaryTermDetail | null;
}

export async function fetchTermsBySlugs(slugs: string[]): Promise<RelatedTermSummary[]> {
  if (slugs.length === 0) return [];
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("slug, term, difficulty")
    .in("slug", slugs);
  if (error) throw error;
  return (data ?? []) as RelatedTermSummary[];
}

export async function fetchAllGlossarySlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from("glossary_terms").select("slug");
  if (error) throw error;
  return (data ?? []).map((row) => row.slug as string);
}

export type TrendingTermRow = {
  slug: string;
  term: string;
  view_count: number;
};

export async function fetchTrendingTerms(limit = 7): Promise<TrendingTermRow[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("get_trending_terms", {
    p_limit: limit,
  });
  // Trending is decorative — degrade to empty if the RPC is missing or errors
  // so /education still renders. Log so the failure is visible.
  if (error) {
    console.warn("fetchTrendingTerms failed:", error.message);
    return [];
  }
  return (data ?? []) as TrendingTermRow[];
}

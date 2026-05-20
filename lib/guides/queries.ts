import { createStaticClient } from "@/lib/supabase/static";
import type { GuideCategory, GuideDifficulty } from "./categories";

export type Guide = {
  id: string;
  slug: string;
  title: string;
  url: string;
  source: string;
  description: string | null;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  read_time_minutes: number;
  is_featured: boolean;
  featured_rank: number | null;
  published_at: string | null;
};

const GUIDE_COLUMNS =
  "id, slug, title, url, source, description, category, difficulty, read_time_minutes, is_featured, featured_rank, published_at";

export async function fetchFeaturedGuides(limit = 5): Promise<Guide[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("guides")
    .select(GUIDE_COLUMNS)
    .eq("is_featured", true)
    .order("featured_rank", { ascending: true })
    .limit(limit);
  if (error) {
    // Sidebar is decorative — degrade to empty so /education still renders.
    console.warn("fetchFeaturedGuides failed:", error.message);
    return [];
  }
  return (data ?? []) as Guide[];
}

export async function fetchAllGuides(): Promise<Guide[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("guides")
    .select(GUIDE_COLUMNS)
    .order("title", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Guide[];
}

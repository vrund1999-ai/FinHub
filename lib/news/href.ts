import {
  DEFAULT_NEWS_CATEGORY,
  type NewsCategory,
  type SortOption,
} from "@/components/news/data";

export type NewsParams = {
  view?: SortOption;
  category?: NewsCategory;
  q?: string;
};

// Build a /news href, omitting default/empty params so URLs stay clean
// ("Latest" and "All news" are the defaults the page falls back to).
export function buildNewsHref(params: NewsParams): string {
  const sp = new URLSearchParams();
  if (params.view && params.view !== "Latest") sp.set("view", params.view);
  if (params.category && params.category !== DEFAULT_NEWS_CATEGORY) {
    sp.set("category", params.category);
  }
  if (params.q) sp.set("q", params.q);
  const qs = sp.toString();
  return qs ? `/news?${qs}` : "/news";
}

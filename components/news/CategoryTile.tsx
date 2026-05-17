import { categoryDisplayLabel, categoryStyles } from "./data";
import type { ArticleCategory } from "./data";

export function CategoryTile({ category }: { category: ArticleCategory }) {
  const style = categoryStyles[category];
  return (
    <div
      className="flex w-16 shrink-0 items-center justify-center rounded-md px-2 py-3 text-center text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: style.tileBg, color: style.tileFg }}
    >
      {categoryDisplayLabel[category]}
    </div>
  );
}

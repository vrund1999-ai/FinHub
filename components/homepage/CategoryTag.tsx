import type { NewsCategory } from "./data";

export function CategoryTag({ category }: { category: NewsCategory }) {
  return (
    <span className="text-[10px] font-semibold tracking-[0.14em] text-[var(--color-accent)]">
      {category}
    </span>
  );
}

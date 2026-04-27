import type { NewsArticle } from "./data";
import { Card } from "./Card";
import { NewsItem } from "./NewsItem";

export function NewsCard({ items }: { items: NewsArticle[] }) {
  return (
    <Card title="LATEST NEWS" footerLabel="All news" footerHref="#">
      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <NewsItem key={item.headline} item={item} />
        ))}
      </div>
    </Card>
  );
}

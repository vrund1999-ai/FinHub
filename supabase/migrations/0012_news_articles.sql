create table if not exists public.news_articles (
  id            text primary key,              -- stable dedupe key, e.g. 'finnhub-<id>'
  category      text not null
                check (category in ('Earnings','Fed & rates','Macro','Markets','Technology','IPOs','M&A','Crypto')),
  headline      text not null,
  summary       text,
  url           text not null,
  source        text not null default '',
  image_url     text,
  tickers       text[] not null default '{}',
  published_at  timestamptz not null,
  fetched_at    timestamptz not null default now()
);

create index if not exists news_articles_published_at_idx
  on public.news_articles (published_at desc);

create index if not exists news_articles_category_idx
  on public.news_articles (category);

create index if not exists news_articles_tickers_idx
  on public.news_articles using gin (tickers);

alter table public.news_articles enable row level security;

-- Public read; no write policy means the anon key cannot write. Writes happen
-- only via the service_role key in /api/cron/refresh-news.
create policy "news_articles_select_public" on public.news_articles
  for select using (true);

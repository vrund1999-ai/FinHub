-- Curated external finance articles surfaced as "Popular Guides" on /education
-- and as the full list on /education/guides. Rows are managed manually via
-- seed/refresh migrations emitted by the /refresh-guides Claude Code skill;
-- there are no write policies, so anon callers can only SELECT.

create table if not exists public.guides (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  title              text not null,
  url                text not null,
  source             text not null,
  description        text,
  category           text not null
    check (category in (
      'Investing Basics',
      'Markets & Trading',
      'Reading Financials',
      'Personal Finance',
      'Macro & Economy',
      'Options & Derivatives',
      'Retirement',
      'Taxes',
      'Crypto'
    )),
  difficulty         text not null
    check (difficulty in ('Beginner','Intermediate','Advanced')),
  read_time_minutes  integer not null check (read_time_minutes > 0),
  is_featured        boolean not null default false,
  featured_rank      integer,
  published_at       date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- If a row is featured it must have a rank; if not featured, rank must be null.
  constraint guides_featured_rank_chk
    check ((is_featured and featured_rank is not null) or
           (not is_featured and featured_rank is null))
);

create index if not exists guides_category_idx   on public.guides(category);
create index if not exists guides_difficulty_idx on public.guides(difficulty);
create index if not exists guides_featured_idx
  on public.guides(featured_rank)
  where is_featured;

alter table public.guides enable row level security;

-- Public reference data: unrestricted SELECT for everyone, no write policies.
-- Seed and refresh migrations run as the postgres role and bypass RLS.
drop policy if exists "guides_select_public" on public.guides;
create policy "guides_select_public" on public.guides
  for select using (true);

-- Reuses set_updated_at() from 0001_profiles.sql.
drop trigger if exists guides_set_updated_at on public.guides;
create trigger guides_set_updated_at
  before update on public.guides
  for each row execute function public.set_updated_at();

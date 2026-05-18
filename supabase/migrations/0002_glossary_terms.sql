-- Glossary terms — public reference data powering the glossary on /education
-- and the per-term detail pages at /education/glossary/[slug]. Seed rows live
-- in 0003_glossary_terms_seed.sql.

create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  term text not null,
  definition text not null,
  extended_definition text,
  category text not null,
  difficulty text not null
    check (difficulty in ('Basic','Beginner','Intermediate','Advanced')),
  letter char(1) not null
    generated always as (upper(left(term, 1))) stored
    check (letter ~ '^[A-Z]$'),
  related_slugs text[] not null default '{}',
  examples jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists glossary_terms_letter_idx     on public.glossary_terms(letter);
create index if not exists glossary_terms_category_idx   on public.glossary_terms(category);
create index if not exists glossary_terms_difficulty_idx on public.glossary_terms(difficulty);

alter table public.glossary_terms enable row level security;

-- Public reference data: unrestricted SELECT for everyone, no write policies.
-- Seeding runs as the postgres role and bypasses RLS.
drop policy if exists "glossary_terms_select_public" on public.glossary_terms;
create policy "glossary_terms_select_public" on public.glossary_terms
  for select using (true);

-- Reuses set_updated_at() from 0001_profiles.sql (defined with create or replace).
drop trigger if exists glossary_terms_set_updated_at on public.glossary_terms;
create trigger glossary_terms_set_updated_at
  before update on public.glossary_terms
  for each row execute function public.set_updated_at();

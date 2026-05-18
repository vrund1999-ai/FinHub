-- Per-day visit counters for glossary terms — powers the TRENDING TERMS
-- section on /education. Day boundary is the America/New_York calendar date,
-- so counts roll over at midnight ET without a cron job. Writes flow through
-- the SECURITY DEFINER RPC below; the table itself has no write policies.

create table if not exists public.glossary_term_views (
  term_id    uuid not null references public.glossary_terms(id) on delete cascade,
  view_date  date not null,
  view_count bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (term_id, view_date)
);

create index if not exists glossary_term_views_date_count_idx
  on public.glossary_term_views (view_date, view_count desc);

alter table public.glossary_term_views enable row level security;

-- Counts are not sensitive; allow public SELECT for the read RPC and for
-- ad-hoc inspection. No insert/update/delete policies — writes only via RPC.
drop policy if exists "glossary_term_views_select_public" on public.glossary_term_views;
create policy "glossary_term_views_select_public" on public.glossary_term_views
  for select using (true);

-- Reuses set_updated_at() from 0001_profiles.sql.
drop trigger if exists glossary_term_views_set_updated_at on public.glossary_term_views;
create trigger glossary_term_views_set_updated_at
  before update on public.glossary_term_views
  for each row execute function public.set_updated_at();

-- Atomic upsert keyed by (term_id, today_ET). Bypasses RLS so anon callers
-- can increment, but only ever does this one operation on this one table.
create or replace function public.increment_glossary_view(p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_term_id uuid;
  v_today   date;
begin
  v_today := (timezone('America/New_York', now()))::date;

  select id into v_term_id from public.glossary_terms where slug = p_slug;
  if v_term_id is null then
    return;
  end if;

  insert into public.glossary_term_views (term_id, view_date, view_count)
  values (v_term_id, v_today, 1)
  on conflict (term_id, view_date)
  do update set view_count = public.glossary_term_views.view_count + 1,
                updated_at = now();
end;
$$;

revoke execute on function public.increment_glossary_view(text) from public;
grant   execute on function public.increment_glossary_view(text) to anon, authenticated;

-- Today's top-N terms, ordered by count desc with term asc as tiebreaker.
create or replace function public.get_trending_terms(p_limit int default 7)
returns table(slug text, term text, view_count bigint)
language sql
stable
set search_path = public
as $$
  select gt.slug, gt.term, gtv.view_count
  from public.glossary_term_views gtv
  join public.glossary_terms gt on gt.id = gtv.term_id
  where gtv.view_date = (timezone('America/New_York', now()))::date
  order by gtv.view_count desc, gt.term asc
  limit greatest(coalesce(p_limit, 7), 1);
$$;

revoke execute on function public.get_trending_terms(int) from public;
grant   execute on function public.get_trending_terms(int) to anon, authenticated;

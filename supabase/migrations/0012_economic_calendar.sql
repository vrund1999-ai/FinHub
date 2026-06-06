-- Economic calendar: upcoming US macro releases sourced from FRED (St. Louis
-- Fed) by the daily cron at /api/cron/refresh-economic-calendar. Mirrors the
-- earnings_calendar pattern (0011): public SELECT only; writes via service_role
-- from the cron route. FRED gives the schedule + source links + importance
-- (we classify), not forecast/actual numbers, so no value columns here.
--
-- NOTE: if you applied an earlier draft of this file, run
--   drop table if exists public.economic_calendar cascade;
-- before re-running it.

create table if not exists public.economic_calendar (
  event_key    text not null,              -- slug of the release name, e.g. 'employment-situation'
  event_date   date not null,
  event        text not null,              -- FRED release name, e.g. 'Employment Situation'
  importance   text not null default ''
               check (importance in ('high','medium','low','')),
  event_time   text not null default '',   -- well-known ET release time, e.g. '8:30am ET'
  source_url   text,                        -- official report page (BLS/BEA/Census/Fed/...)
  fetched_at   timestamptz not null default now(),
  primary key (event_key, event_date)
);

create index if not exists economic_calendar_event_date_idx
  on public.economic_calendar (event_date);

alter table public.economic_calendar enable row level security;

-- Public read; no write policy means the anon key cannot write. Writes happen
-- only via the service_role key in /api/cron/refresh-economic-calendar.
create policy "economic_calendar_select_public" on public.economic_calendar
  for select using (true);

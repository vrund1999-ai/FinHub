-- Earnings calendar for the "EARNINGS THIS WEEK" sidebar on /news.
-- Rows are upserted by the /api/cron/refresh-earnings route, which calls
-- Finnhub's /calendar/earnings endpoint on a daily Vercel Cron schedule.
-- The route uses the service_role key (server-only); anon callers can only SELECT.

create table if not exists public.ticker_profiles (
  symbol         text primary key,
  company_name   text not null,
  logo_url       text,
  fetched_at     timestamptz not null default now()
);

create table if not exists public.earnings_calendar (
  symbol            text not null references public.ticker_profiles(symbol) on delete cascade,
  report_date       date not null,
  hour              text not null default ''
                    check (hour in ('bmo','amc','dmh','')),
  eps_estimate      numeric,
  eps_actual        numeric,
  revenue_estimate  bigint,
  revenue_actual    bigint,
  quarter           smallint,
  year              smallint,
  fetched_at        timestamptz not null default now(),
  primary key (symbol, report_date)
);

create index if not exists earnings_calendar_report_date_idx
  on public.earnings_calendar (report_date);

alter table public.ticker_profiles   enable row level security;
alter table public.earnings_calendar enable row level security;

-- Public reference data: unrestricted SELECT, no write policies.
-- Writes happen only through the service_role key in /api/cron/refresh-earnings.
drop policy if exists "ticker_profiles_select_public" on public.ticker_profiles;
create policy "ticker_profiles_select_public" on public.ticker_profiles
  for select using (true);

drop policy if exists "earnings_calendar_select_public" on public.earnings_calendar;
create policy "earnings_calendar_select_public" on public.earnings_calendar
  for select using (true);

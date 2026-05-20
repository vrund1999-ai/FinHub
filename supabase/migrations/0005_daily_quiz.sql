-- Daily Quiz — schema + RPCs.
-- The quiz_questions pool is seeded separately in 0006_quiz_questions_seed.sql.
-- ET calendar day is the boundary for everything (same as glossary trending in
-- 0004_glossary_term_views.sql), so a daily reset happens at midnight ET without
-- any cron job. All writes flow through SECURITY DEFINER RPCs; tables expose
-- public/own SELECT only.

-- ---------------------------------------------------------------------------
-- 1. quiz_questions — the 1000-row pool (treated like glossary_terms: public
--    reference data, RLS-on with SELECT-only policy).
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  prompt        text not null,
  choices       jsonb not null,
  correct_index smallint not null check (correct_index >= 0),
  explanation   text not null,
  category      text not null,
  difficulty    text not null check (difficulty in ('Basic','Beginner','Intermediate','Advanced')),
  glossary_slug text references public.glossary_terms(slug) on delete set null,
  source_key    text unique,
  created_at    timestamptz not null default now(),
  constraint quiz_questions_choices_shape check (
    jsonb_typeof(choices) = 'array'
    and jsonb_array_length(choices) between 2 and 6
    and correct_index < jsonb_array_length(choices)
  )
);

create index if not exists quiz_questions_category_idx   on public.quiz_questions(category);
create index if not exists quiz_questions_difficulty_idx on public.quiz_questions(difficulty);

alter table public.quiz_questions enable row level security;

drop policy if exists "quiz_questions_select_public" on public.quiz_questions;
create policy "quiz_questions_select_public" on public.quiz_questions
  for select using (true);

-- ---------------------------------------------------------------------------
-- 2. daily_quiz_assignments — deterministic per-(user, ET-date). The
--    composite PK is the race fix: concurrent inserts hit unique_violation,
--    the RPC catches it on conflict do nothing and re-reads.
-- ---------------------------------------------------------------------------
create table if not exists public.daily_quiz_assignments (
  user_id      uuid not null references auth.users(id) on delete cascade,
  quiz_date    date not null,
  question_ids uuid[] not null check (array_length(question_ids, 1) = 3),
  cycle_number smallint not null default 1,
  created_at   timestamptz not null default now(),
  primary key (user_id, quiz_date)
);

create index if not exists daily_quiz_assignments_user_date_idx
  on public.daily_quiz_assignments(user_id, quiz_date desc);

alter table public.daily_quiz_assignments enable row level security;

drop policy if exists "daily_quiz_assignments_select_own" on public.daily_quiz_assignments;
create policy "daily_quiz_assignments_select_own" on public.daily_quiz_assignments
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. quiz_attempts — the source of truth for "what has this user seen?". A
--    question is counted as seen the moment it's *answered* (not assigned).
--    cycle_number is denormalized here so cycle resets stay queryable: the
--    "unseen" filter is `where user_id = ? and cycle_number = current_cycle`.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  question_id  uuid not null references public.quiz_questions(id) on delete cascade,
  quiz_date    date not null,
  position     smallint not null check (position between 1 and 3),
  chosen_index smallint not null,
  is_correct   boolean not null,
  cycle_number smallint not null default 1,
  answered_at  timestamptz not null default now(),
  unique (user_id, quiz_date, position)
);

create index if not exists quiz_attempts_user_question_idx on public.quiz_attempts(user_id, question_id);
create index if not exists quiz_attempts_user_date_idx     on public.quiz_attempts(user_id, quiz_date);

alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. user_quiz_stats — cached rollup powering StreakBar. Updated
--    transactionally inside submit_quiz_answer; read-side staleness check in
--    get_user_quiz_stats zeros stale streaks/weekly points without mutation.
-- ---------------------------------------------------------------------------
create table if not exists public.user_quiz_stats (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  current_streak_days  int not null default 0,
  longest_streak_days  int not null default 0,
  last_completed_date  date,
  total_points         int not null default 0,
  points_this_week     int not null default 0,
  week_anchor_date     date,
  current_cycle_number smallint not null default 1,
  updated_at           timestamptz not null default now()
);

alter table public.user_quiz_stats enable row level security;

drop policy if exists "user_quiz_stats_select_own" on public.user_quiz_stats;
create policy "user_quiz_stats_select_own" on public.user_quiz_stats
  for select using (auth.uid() = user_id);

-- Reuses set_updated_at() from 0001_profiles.sql.
drop trigger if exists user_quiz_stats_set_updated_at on public.user_quiz_stats;
create trigger user_quiz_stats_set_updated_at
  before update on public.user_quiz_stats
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RPC: get_or_create_daily_quiz()
-- Atomic "give me today's 3 questions; generate if missing". Returns one row
-- per assigned slot, with correct_index/explanation only populated for slots
-- the user has already answered (never leak the answer).
-- ---------------------------------------------------------------------------
create or replace function public.get_or_create_daily_quiz()
returns table (
  position      smallint,
  question_id   uuid,
  prompt        text,
  choices       jsonb,
  category      text,
  difficulty    text,
  glossary_slug text,
  chosen_index  smallint,
  is_correct    boolean,
  correct_index smallint,
  explanation   text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid      uuid;
  v_today    date;
  v_qids     uuid[];
  v_cycle    smallint;
  v_rowcount int;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  v_today := (timezone('America/New_York', now()))::date;

  select dqa.question_ids, dqa.cycle_number
    into v_qids, v_cycle
  from public.daily_quiz_assignments dqa
  where dqa.user_id = v_uid and dqa.quiz_date = v_today;

  if v_qids is null then
    -- No assignment yet — generate one.
    select coalesce(uqs.current_cycle_number, 1::smallint) into v_cycle
    from public.user_quiz_stats uqs
    where uqs.user_id = v_uid;
    if v_cycle is null then v_cycle := 1; end if;

    select array_agg(sub.id) into v_qids from (
      select q.id
      from public.quiz_questions q
      where q.id not in (
        select qa.question_id from public.quiz_attempts qa
        where qa.user_id = v_uid and qa.cycle_number = v_cycle
      )
      order by random()
      limit 3
    ) sub;

    -- Cycle exhausted (fewer than 3 unseen): bump cycle, pick from full pool.
    if v_qids is null or array_length(v_qids, 1) < 3 then
      v_cycle := v_cycle + 1;
      insert into public.user_quiz_stats (user_id, current_cycle_number)
        values (v_uid, v_cycle)
        on conflict (user_id) do update
          set current_cycle_number = excluded.current_cycle_number;

      select array_agg(sub.id) into v_qids from (
        select q.id from public.quiz_questions q
        order by random() limit 3
      ) sub;
    end if;

    -- If even the full pool can't supply 3 rows (shouldn't happen with the
    -- 1000-row seed) bail loudly rather than insert an invalid array.
    if v_qids is null or array_length(v_qids, 1) < 3 then
      raise exception 'quiz_pool_too_small' using errcode = 'P0001';
    end if;

    insert into public.daily_quiz_assignments (user_id, quiz_date, question_ids, cycle_number)
      values (v_uid, v_today, v_qids, v_cycle)
      on conflict (user_id, quiz_date) do nothing;
    get diagnostics v_rowcount = row_count;

    if v_rowcount = 0 then
      -- Another tab won the race — read its row.
      select dqa.question_ids, dqa.cycle_number
        into v_qids, v_cycle
      from public.daily_quiz_assignments dqa
      where dqa.user_id = v_uid and dqa.quiz_date = v_today;
    end if;
  end if;

  return query
  select
    u.ord::smallint                                                   as position,
    q.id                                                              as question_id,
    q.prompt,
    q.choices,
    q.category,
    q.difficulty,
    q.glossary_slug,
    qa.chosen_index,
    qa.is_correct,
    case when qa.id is not null then q.correct_index end              as correct_index,
    case when qa.id is not null then q.explanation   end              as explanation
  from unnest(v_qids) with ordinality as u(qid, ord)
  join public.quiz_questions q on q.id = u.qid
  left join public.quiz_attempts qa
    on qa.user_id = v_uid
   and qa.quiz_date = v_today
   and qa.position = u.ord::smallint
  order by u.ord;
end;
$$;

revoke execute on function public.get_or_create_daily_quiz() from public;
grant   execute on function public.get_or_create_daily_quiz() to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: submit_quiz_answer(p_position, p_chosen_index)
-- Idempotent (unique on (user_id, quiz_date, position) makes double-clicks
-- safe). Awards 10 points per correct answer the first time the slot is
-- filled. On the 3rd answer of the day, updates streak.
-- ---------------------------------------------------------------------------
create or replace function public.submit_quiz_answer(
  p_position     smallint,
  p_chosen_index smallint
)
returns table (
  is_correct          boolean,
  correct_index       smallint,
  explanation         text,
  points_awarded      int,
  current_streak_days int,
  total_points        int,
  points_this_week    int,
  day_completed       boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid             uuid;
  v_today           date;
  v_qids            uuid[];
  v_cycle           smallint;
  v_qid             uuid;
  v_correct_idx     smallint;
  v_explanation     text;
  v_is_correct      boolean;
  v_rowcount        int;
  v_inserted        boolean;
  v_points          int := 0;
  v_answered_count  int;
  v_stats           public.user_quiz_stats%rowtype;
  v_week_start      date;
  v_new_streak      int;
  v_day_completed   boolean := false;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if p_position is null or p_position < 1 or p_position > 3 then
    raise exception 'invalid_position' using errcode = '22023';
  end if;
  if p_chosen_index is null or p_chosen_index < 0 then
    raise exception 'invalid_choice' using errcode = '22023';
  end if;

  v_today := (timezone('America/New_York', now()))::date;

  select dqa.question_ids, dqa.cycle_number into v_qids, v_cycle
  from public.daily_quiz_assignments dqa
  where dqa.user_id = v_uid and dqa.quiz_date = v_today;
  if v_qids is null then
    raise exception 'no_assignment_for_today' using errcode = '42704';
  end if;
  v_qid := v_qids[p_position];

  select q.correct_index, q.explanation into v_correct_idx, v_explanation
  from public.quiz_questions q where q.id = v_qid;
  v_is_correct := (p_chosen_index = v_correct_idx);

  insert into public.quiz_attempts
    (user_id, question_id, quiz_date, position, chosen_index, is_correct, cycle_number)
  values
    (v_uid, v_qid, v_today, p_position, p_chosen_index, v_is_correct, v_cycle)
  on conflict (user_id, quiz_date, position) do nothing;
  get diagnostics v_rowcount = row_count;
  v_inserted := (v_rowcount > 0);

  if v_inserted and v_is_correct then
    v_points := 10;
  end if;

  -- Ensure a stats row exists, then load it.
  insert into public.user_quiz_stats (user_id) values (v_uid)
    on conflict (user_id) do nothing;
  select * into v_stats from public.user_quiz_stats where user_id = v_uid;

  -- Weekly window rolls over on Monday ET. date_trunc('week', date) returns
  -- the ISO-week Monday; cast to date because date_trunc returns timestamp.
  v_week_start := date_trunc('week', v_today)::date;
  if v_stats.week_anchor_date is null or v_stats.week_anchor_date < v_week_start then
    v_stats.points_this_week := 0;
    v_stats.week_anchor_date := v_week_start;
  end if;

  v_stats.total_points     := v_stats.total_points     + v_points;
  v_stats.points_this_week := v_stats.points_this_week + v_points;

  -- Did this answer complete the day? Compute after the insert so a fresh
  -- 3rd answer counts. If the user is re-submitting a previously-answered
  -- slot (v_inserted = false) and the day was already completed, this still
  -- reports day_completed = true.
  select count(*) into v_answered_count
  from public.quiz_attempts
  where user_id = v_uid and quiz_date = v_today;

  if v_answered_count >= 3 then
    v_day_completed := true;
    -- Only update streak the first time we hit the 3-answers threshold today.
    if v_stats.last_completed_date is null or v_stats.last_completed_date < v_today then
      if v_stats.last_completed_date is null then
        v_new_streak := 1;
      elsif v_stats.last_completed_date = v_today - 1 then
        v_new_streak := coalesce(v_stats.current_streak_days, 0) + 1;
      else
        v_new_streak := 1; -- skipped at least a day
      end if;
      v_stats.current_streak_days := v_new_streak;
      v_stats.longest_streak_days := greatest(v_stats.longest_streak_days, v_new_streak);
      v_stats.last_completed_date := v_today;
    end if;
  end if;

  update public.user_quiz_stats
  set current_streak_days = v_stats.current_streak_days,
      longest_streak_days = v_stats.longest_streak_days,
      last_completed_date = v_stats.last_completed_date,
      total_points        = v_stats.total_points,
      points_this_week    = v_stats.points_this_week,
      week_anchor_date    = v_stats.week_anchor_date
  where user_id = v_uid;

  return query select
    v_is_correct,
    v_correct_idx,
    v_explanation,
    v_points,
    v_stats.current_streak_days,
    v_stats.total_points,
    v_stats.points_this_week,
    v_day_completed;
end;
$$;

revoke execute on function public.submit_quiz_answer(smallint, smallint) from public;
grant   execute on function public.submit_quiz_answer(smallint, smallint) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: get_user_quiz_stats()
-- Read-only. Returns a synthetic zero-row if the user has no stats yet, and
-- zeros stale streak/weekly counters on the fly so the cache doesn't need a
-- nightly cron to stay honest.
-- ---------------------------------------------------------------------------
create or replace function public.get_user_quiz_stats()
returns table (
  current_streak_days  int,
  longest_streak_days  int,
  last_completed_date  date,
  total_points         int,
  points_this_week     int,
  week_anchor_date     date,
  current_cycle_number smallint
)
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_uid        uuid;
  v_today      date;
  v_week_start date;
  v_row        public.user_quiz_stats%rowtype;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  v_today      := (timezone('America/New_York', now()))::date;
  v_week_start := date_trunc('week', v_today)::date;

  select * into v_row from public.user_quiz_stats where user_id = v_uid;
  if not found then
    return query select 0, 0, null::date, 0, 0, null::date, 1::smallint;
    return;
  end if;

  if v_row.last_completed_date is null or v_row.last_completed_date < v_today - 1 then
    v_row.current_streak_days := 0;
  end if;
  if v_row.week_anchor_date is null or v_row.week_anchor_date < v_week_start then
    v_row.points_this_week := 0;
  end if;

  return query select
    v_row.current_streak_days,
    v_row.longest_streak_days,
    v_row.last_completed_date,
    v_row.total_points,
    v_row.points_this_week,
    v_row.week_anchor_date,
    v_row.current_cycle_number;
end;
$$;

revoke execute on function public.get_user_quiz_stats() from public;
grant   execute on function public.get_user_quiz_stats() to authenticated;

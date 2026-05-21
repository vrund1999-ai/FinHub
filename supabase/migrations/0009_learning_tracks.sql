-- Learning Tracks — schema + RPCs.
-- Powers /education (featured tracks tile), /education/tracks (browse),
-- /education/tracks/<slug> (overview), /education/tracks/<slug>/<lesson>
-- (lesson + formative mini-quiz), and /education/tracks/<slug>/quiz (scored
-- final quiz, 70% to pass). Content is curated via the /research-tracks
-- Claude Code skill; user state lives in user_lesson_completions,
-- user_track_progress, user_track_quiz_attempts, user_track_quiz_answers.
-- All user writes flow through SECURITY DEFINER RPCs.

-- ---------------------------------------------------------------------------
-- 1. learning_tracks — track metadata. Public reference data.
-- ---------------------------------------------------------------------------
create table if not exists public.learning_tracks (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null,
  category      text not null
    check (category in (
      'Investing Basics',
      'Markets & Trading',
      'Reading Financials',
      'Personal Finance',
      'Macro & Economy',
      'Options & Derivatives',
      'Retirement',
      'Taxes',
      'Crypto',
      'Behavioral Finance'
    )),
  difficulty    text not null
    check (difficulty in ('Beginner','Intermediate','Advanced')),
  lesson_count  smallint not null check (lesson_count between 1 and 30),
  est_minutes   smallint not null check (est_minutes > 0),
  icon_name     text not null
    check (icon_name in (
      'TrendingUp','BarChart2','Landmark','Layers',
      'PiggyBank','Wallet','Bitcoin','Receipt',
      'LineChart','ShieldCheck','Briefcase','Brain'
    )),
  accent_color  text not null,
  is_featured   boolean not null default false,
  featured_rank smallint,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint learning_tracks_featured_rank_chk
    check ((is_featured and featured_rank is not null) or
           (not is_featured and featured_rank is null))
);

create index if not exists learning_tracks_category_idx   on public.learning_tracks(category);
create index if not exists learning_tracks_difficulty_idx on public.learning_tracks(difficulty);
create index if not exists learning_tracks_featured_idx
  on public.learning_tracks(featured_rank) where is_featured;
create index if not exists learning_tracks_published_idx
  on public.learning_tracks(is_published) where is_published;

alter table public.learning_tracks enable row level security;

drop policy if exists "learning_tracks_select_public" on public.learning_tracks;
create policy "learning_tracks_select_public" on public.learning_tracks
  for select using (true);

drop trigger if exists learning_tracks_set_updated_at on public.learning_tracks;
create trigger learning_tracks_set_updated_at
  before update on public.learning_tracks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. track_lessons — ordered lessons within a track.
-- ---------------------------------------------------------------------------
create table if not exists public.track_lessons (
  id          uuid primary key default gen_random_uuid(),
  track_id    uuid not null references public.learning_tracks(id) on delete cascade,
  position    smallint not null check (position >= 1),
  slug        text not null,
  title       text not null,
  summary     text not null,
  est_minutes smallint not null check (est_minutes > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (track_id, position),
  unique (track_id, slug)
);

create index if not exists track_lessons_track_position_idx
  on public.track_lessons(track_id, position);

alter table public.track_lessons enable row level security;

drop policy if exists "track_lessons_select_public" on public.track_lessons;
create policy "track_lessons_select_public" on public.track_lessons
  for select using (true);

drop trigger if exists track_lessons_set_updated_at on public.track_lessons;
create trigger track_lessons_set_updated_at
  before update on public.track_lessons
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. lesson_resources — videos / articles / publications attached to a lesson.
-- Embed-mode 'embed' is currently only supported for YouTube videos, hence
-- the youtube_video_id requirement; 'link' resources open in a new tab.
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_resources (
  id                     uuid primary key default gen_random_uuid(),
  lesson_id              uuid not null references public.track_lessons(id) on delete cascade,
  position               smallint not null check (position >= 1),
  kind                   text not null check (kind in ('video','article','publication')),
  title                  text not null,
  url                    text not null,
  source                 text not null,
  author                 text,
  description            text,
  embed_mode             text not null check (embed_mode in ('embed','link')),
  read_or_watch_minutes  smallint not null check (read_or_watch_minutes > 0),
  attribution_note       text,
  youtube_video_id       text,
  created_at             timestamptz not null default now(),
  unique (lesson_id, position),
  constraint lesson_resources_embed_video_chk
    check (embed_mode = 'link' or (kind = 'video' and youtube_video_id is not null))
);

create index if not exists lesson_resources_lesson_position_idx
  on public.lesson_resources(lesson_id, position);

alter table public.lesson_resources enable row level security;

drop policy if exists "lesson_resources_select_public" on public.lesson_resources;
create policy "lesson_resources_select_public" on public.lesson_resources
  for select using (true);

-- ---------------------------------------------------------------------------
-- 4. lesson_questions — formative mini-quiz (2-3 questions per lesson).
-- Since the mini-quiz reveals the answer immediately and never gates
-- progression, we ship correct_index/explanation alongside the question; the
-- LessonMiniQuiz component reveals client-side on click.
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_questions (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.track_lessons(id) on delete cascade,
  position      smallint not null check (position >= 1),
  prompt        text not null,
  choices       jsonb not null,
  correct_index smallint not null check (correct_index >= 0),
  explanation   text not null,
  source_key    text unique,
  created_at    timestamptz not null default now(),
  unique (lesson_id, position),
  constraint lesson_questions_choices_shape check (
    jsonb_typeof(choices) = 'array'
    and jsonb_array_length(choices) between 2 and 6
    and correct_index < jsonb_array_length(choices)
  )
);

create index if not exists lesson_questions_lesson_position_idx
  on public.lesson_questions(lesson_id, position);

alter table public.lesson_questions enable row level security;

drop policy if exists "lesson_questions_select_public" on public.lesson_questions;
create policy "lesson_questions_select_public" on public.lesson_questions
  for select using (true);

-- ---------------------------------------------------------------------------
-- 5. track_quiz_questions — final-quiz pool per track (10-15 rows).
-- The route layer must SELECT without correct_index/explanation to avoid
-- leaking answers before submission; SECURITY DEFINER RPCs reveal them only
-- inside submit_track_quiz.
-- ---------------------------------------------------------------------------
create table if not exists public.track_quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  track_id      uuid not null references public.learning_tracks(id) on delete cascade,
  position      smallint not null check (position >= 1),
  prompt        text not null,
  choices       jsonb not null,
  correct_index smallint not null check (correct_index >= 0),
  explanation   text not null,
  difficulty    text not null check (difficulty in ('Beginner','Intermediate','Advanced')),
  source_key    text unique,
  created_at    timestamptz not null default now(),
  unique (track_id, position),
  constraint track_quiz_questions_choices_shape check (
    jsonb_typeof(choices) = 'array'
    and jsonb_array_length(choices) between 2 and 6
    and correct_index < jsonb_array_length(choices)
  )
);

create index if not exists track_quiz_questions_track_position_idx
  on public.track_quiz_questions(track_id, position);

alter table public.track_quiz_questions enable row level security;

drop policy if exists "track_quiz_questions_select_public" on public.track_quiz_questions;
create policy "track_quiz_questions_select_public" on public.track_quiz_questions
  for select using (true);

-- ---------------------------------------------------------------------------
-- 6. user_lesson_completions — one row per (user, lesson). Records the score
-- on the formative mini-quiz at the moment of completion; replays overwrite.
-- ---------------------------------------------------------------------------
create table if not exists public.user_lesson_completions (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references public.track_lessons(id) on delete cascade,
  last_score   smallint not null default 0,
  total_qs     smallint not null default 0,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists user_lesson_completions_user_idx
  on public.user_lesson_completions(user_id);

alter table public.user_lesson_completions enable row level security;

drop policy if exists "user_lesson_completions_select_own" on public.user_lesson_completions;
create policy "user_lesson_completions_select_own" on public.user_lesson_completions
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 7. user_track_progress — rollup per (user, track). completed_at is only set
-- when a final-quiz attempt passes (>= 70%).
-- ---------------------------------------------------------------------------
create table if not exists public.user_track_progress (
  user_id                 uuid not null references auth.users(id) on delete cascade,
  track_id                uuid not null references public.learning_tracks(id) on delete cascade,
  lessons_completed_count smallint not null default 0,
  total_lessons           smallint not null,
  last_active_at          timestamptz not null default now(),
  completed_at            timestamptz,
  best_quiz_score         smallint,
  best_quiz_total         smallint,
  primary key (user_id, track_id)
);

create index if not exists user_track_progress_user_idx
  on public.user_track_progress(user_id, last_active_at desc);

alter table public.user_track_progress enable row level security;

drop policy if exists "user_track_progress_select_own" on public.user_track_progress;
create policy "user_track_progress_select_own" on public.user_track_progress
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 8. user_track_quiz_attempts — one row per final-quiz attempt. question_ids
-- is frozen at start so retakes don't change the ordering mid-attempt.
-- ---------------------------------------------------------------------------
create table if not exists public.user_track_quiz_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  track_id        uuid not null references public.learning_tracks(id) on delete cascade,
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  question_ids    uuid[] not null,
  score           smallint,
  total_questions smallint not null,
  passed          boolean,
  cycle_number    smallint not null default 1
);

create index if not exists user_track_quiz_attempts_user_track_idx
  on public.user_track_quiz_attempts(user_id, track_id, started_at desc);

alter table public.user_track_quiz_attempts enable row level security;

drop policy if exists "user_track_quiz_attempts_select_own" on public.user_track_quiz_attempts;
create policy "user_track_quiz_attempts_select_own" on public.user_track_quiz_attempts
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 9. user_track_quiz_answers — per-question record for each attempt.
-- ---------------------------------------------------------------------------
create table if not exists public.user_track_quiz_answers (
  attempt_id   uuid not null references public.user_track_quiz_attempts(id) on delete cascade,
  question_id  uuid not null references public.track_quiz_questions(id) on delete cascade,
  chosen_index smallint not null,
  is_correct   boolean not null,
  answered_at  timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

alter table public.user_track_quiz_answers enable row level security;

drop policy if exists "user_track_quiz_answers_select_own" on public.user_track_quiz_answers;
create policy "user_track_quiz_answers_select_own" on public.user_track_quiz_answers
  for select using (
    exists (
      select 1 from public.user_track_quiz_attempts a
      where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- RPC: record_lesson_completion(p_lesson_id, p_answers)
-- Marks a lesson complete, scoring the mini-quiz answers but never gating
-- on correctness (correctness is informational only). Updates the parent
-- user_track_progress rollup. Returns the new progress shape as jsonb.
-- ---------------------------------------------------------------------------
create or replace function public.record_lesson_completion(
  p_lesson_id uuid,
  p_answers   smallint[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid           uuid;
  v_track_id      uuid;
  v_total_lessons smallint;
  v_score         smallint := 0;
  v_total_qs      smallint := 0;
  v_completed_ct  smallint;
  v_completed_at  timestamptz;
  v_progress_done timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if p_lesson_id is null then
    raise exception 'invalid_lesson' using errcode = '22023';
  end if;

  select tl.track_id into v_track_id
  from public.track_lessons tl
  where tl.id = p_lesson_id;
  if v_track_id is null then
    raise exception 'lesson_not_found' using errcode = '42704';
  end if;

  select lt.lesson_count into v_total_lessons
  from public.learning_tracks lt
  where lt.id = v_track_id;

  -- Score the answers against lesson_questions. answers[i] aligns to
  -- lesson_questions ordered by position. Wrong/missing answers count as
  -- incorrect but don't block completion.
  select count(*)::smallint into v_total_qs
  from public.lesson_questions lq where lq.lesson_id = p_lesson_id;

  if v_total_qs > 0 and array_length(p_answers, 1) is not null then
    select count(*)::smallint into v_score
    from (
      select lq.correct_index, p_answers[lq.position] as chosen
      from public.lesson_questions lq
      where lq.lesson_id = p_lesson_id
    ) sub
    where sub.chosen is not null and sub.chosen = sub.correct_index;
  end if;

  insert into public.user_lesson_completions
    (user_id, lesson_id, last_score, total_qs, completed_at)
  values
    (v_uid, p_lesson_id, v_score, v_total_qs, now())
  on conflict (user_id, lesson_id) do update
    set last_score   = excluded.last_score,
        total_qs     = excluded.total_qs,
        completed_at = excluded.completed_at;

  -- Recompute lessons_completed_count for this user+track.
  select count(*)::smallint into v_completed_ct
  from public.user_lesson_completions ulc
  join public.track_lessons tl on tl.id = ulc.lesson_id
  where ulc.user_id = v_uid and tl.track_id = v_track_id;

  insert into public.user_track_progress
    (user_id, track_id, lessons_completed_count, total_lessons, last_active_at)
  values
    (v_uid, v_track_id, v_completed_ct, v_total_lessons, now())
  on conflict (user_id, track_id) do update
    set lessons_completed_count = excluded.lessons_completed_count,
        total_lessons           = excluded.total_lessons,
        last_active_at          = excluded.last_active_at
  returning completed_at into v_progress_done;

  v_completed_at := now();

  return jsonb_build_object(
    'lesson_id',                p_lesson_id,
    'track_id',                 v_track_id,
    'last_score',               v_score,
    'total_qs',                 v_total_qs,
    'completed_at',             v_completed_at,
    'lessons_completed_count',  v_completed_ct,
    'total_lessons',            v_total_lessons,
    'track_completed_at',       v_progress_done
  );
end;
$$;

revoke execute on function public.record_lesson_completion(uuid, smallint[]) from public;
grant   execute on function public.record_lesson_completion(uuid, smallint[]) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: start_track_quiz(p_track_id)
-- Verifies the user has completed all lessons in the track, freezes a
-- shuffled question order, creates an attempt row, returns the attempt id
-- and the question payloads (sans correct_index / explanation).
-- ---------------------------------------------------------------------------
create or replace function public.start_track_quiz(p_track_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid          uuid;
  v_total        smallint;
  v_completed_ct smallint;
  v_qids         uuid[];
  v_attempt_id   uuid;
  v_cycle        smallint;
  v_questions    jsonb;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if p_track_id is null then
    raise exception 'invalid_track' using errcode = '22023';
  end if;

  select lt.lesson_count into v_total
  from public.learning_tracks lt where lt.id = p_track_id;
  if v_total is null then
    raise exception 'track_not_found' using errcode = '42704';
  end if;

  select coalesce(utp.lessons_completed_count, 0) into v_completed_ct
  from public.user_track_progress utp
  where utp.user_id = v_uid and utp.track_id = p_track_id;
  if v_completed_ct is null then v_completed_ct := 0; end if;

  if v_completed_ct < v_total then
    raise exception 'track_not_ready' using errcode = 'P0001';
  end if;

  -- Freeze a shuffled ordering of every final-quiz question for this track.
  select array_agg(sub.id) into v_qids from (
    select tqq.id from public.track_quiz_questions tqq
    where tqq.track_id = p_track_id
    order by random()
  ) sub;

  if v_qids is null or array_length(v_qids, 1) = 0 then
    raise exception 'no_questions_for_track' using errcode = 'P0001';
  end if;

  -- Bump cycle if the user has prior attempts.
  select coalesce(max(cycle_number), 0)::smallint + 1 into v_cycle
  from public.user_track_quiz_attempts
  where user_id = v_uid and track_id = p_track_id;

  insert into public.user_track_quiz_attempts
    (user_id, track_id, question_ids, total_questions, cycle_number)
  values
    (v_uid, p_track_id, v_qids, array_length(v_qids, 1)::smallint, v_cycle)
  returning id into v_attempt_id;

  select jsonb_agg(
    jsonb_build_object(
      'position',    u.ord,
      'question_id', tqq.id,
      'prompt',      tqq.prompt,
      'choices',     tqq.choices
    ) order by u.ord
  ) into v_questions
  from unnest(v_qids) with ordinality as u(qid, ord)
  join public.track_quiz_questions tqq on tqq.id = u.qid;

  return jsonb_build_object(
    'attempt_id',      v_attempt_id,
    'track_id',        p_track_id,
    'total_questions', array_length(v_qids, 1),
    'cycle_number',    v_cycle,
    'questions',       v_questions
  );
end;
$$;

revoke execute on function public.start_track_quiz(uuid) from public;
grant   execute on function public.start_track_quiz(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: submit_track_quiz(p_attempt_id, p_answers)
-- Scores against the frozen question_ids, persists user_track_quiz_answers,
-- marks the attempt complete, updates user_track_progress on pass.
-- p_answers[i] is the chosen index for the i-th question in question_ids
-- (1-indexed). Pass threshold = 70%.
-- ---------------------------------------------------------------------------
create or replace function public.submit_track_quiz(
  p_attempt_id uuid,
  p_answers    smallint[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid       uuid;
  v_attempt   public.user_track_quiz_attempts%rowtype;
  v_score     smallint := 0;
  v_total     smallint;
  v_passed    boolean;
  v_results   jsonb;
  v_existing  smallint;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if p_attempt_id is null then
    raise exception 'invalid_attempt' using errcode = '22023';
  end if;

  select * into v_attempt
  from public.user_track_quiz_attempts
  where id = p_attempt_id;
  if v_attempt.id is null then
    raise exception 'attempt_not_found' using errcode = '42704';
  end if;
  if v_attempt.user_id <> v_uid then
    raise exception 'not_attempt_owner' using errcode = '42501';
  end if;
  if v_attempt.completed_at is not null then
    raise exception 'attempt_already_completed' using errcode = '22023';
  end if;

  v_total := v_attempt.total_questions;
  if array_length(p_answers, 1) is null or array_length(p_answers, 1) <> v_total then
    raise exception 'answer_count_mismatch' using errcode = '22023';
  end if;

  -- Insert per-question rows and tally the score.
  insert into public.user_track_quiz_answers
    (attempt_id, question_id, chosen_index, is_correct, answered_at)
  select
    p_attempt_id,
    tqq.id,
    p_answers[u.ord]::smallint,
    (p_answers[u.ord] = tqq.correct_index) as is_correct,
    now()
  from unnest(v_attempt.question_ids) with ordinality as u(qid, ord)
  join public.track_quiz_questions tqq on tqq.id = u.qid;

  select count(*)::smallint into v_score
  from public.user_track_quiz_answers
  where attempt_id = p_attempt_id and is_correct;

  v_passed := (v_score::numeric / v_total::numeric) >= 0.70;

  update public.user_track_quiz_attempts
  set score        = v_score,
      passed       = v_passed,
      completed_at = now()
  where id = p_attempt_id;

  if v_passed then
    -- best_quiz_score update happens iff strictly better; completed_at set
    -- if not previously set.
    insert into public.user_track_progress
      (user_id, track_id, lessons_completed_count, total_lessons,
       last_active_at, completed_at, best_quiz_score, best_quiz_total)
    values
      (v_uid, v_attempt.track_id,
       (select lesson_count from public.learning_tracks where id = v_attempt.track_id),
       (select lesson_count from public.learning_tracks where id = v_attempt.track_id),
       now(), now(), v_score, v_total)
    on conflict (user_id, track_id) do update
      set last_active_at   = now(),
          completed_at     = coalesce(public.user_track_progress.completed_at, now()),
          best_quiz_score  = case
            when public.user_track_progress.best_quiz_score is null
              or excluded.best_quiz_score > public.user_track_progress.best_quiz_score
            then excluded.best_quiz_score
            else public.user_track_progress.best_quiz_score
          end,
          best_quiz_total  = case
            when public.user_track_progress.best_quiz_score is null
              or excluded.best_quiz_score > public.user_track_progress.best_quiz_score
            then excluded.best_quiz_total
            else public.user_track_progress.best_quiz_total
          end;
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'position',      u.ord,
      'question_id',   tqq.id,
      'prompt',        tqq.prompt,
      'choices',       tqq.choices,
      'chosen_index',  p_answers[u.ord],
      'correct_index', tqq.correct_index,
      'is_correct',    (p_answers[u.ord] = tqq.correct_index),
      'explanation',   tqq.explanation
    ) order by u.ord
  ) into v_results
  from unnest(v_attempt.question_ids) with ordinality as u(qid, ord)
  join public.track_quiz_questions tqq on tqq.id = u.qid;

  return jsonb_build_object(
    'attempt_id',      p_attempt_id,
    'track_id',        v_attempt.track_id,
    'score',           v_score,
    'total_questions', v_total,
    'passed',          v_passed,
    'pass_threshold',  0.70,
    'results',         v_results
  );
end;
$$;

revoke execute on function public.submit_track_quiz(uuid, smallint[]) from public;
grant   execute on function public.submit_track_quiz(uuid, smallint[]) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC: get_track_progress()
-- Returns the caller's full per-track progress rollup. Empty array if anon
-- (since auth.uid() is null we raise, but the server-side query layer
-- short-circuits anon callers before hitting this).
-- ---------------------------------------------------------------------------
create or replace function public.get_track_progress()
returns table (
  track_id                uuid,
  lessons_completed_count smallint,
  total_lessons           smallint,
  last_active_at          timestamptz,
  completed_at            timestamptz,
  best_quiz_score         smallint,
  best_quiz_total         smallint
)
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  return query
  select
    utp.track_id,
    utp.lessons_completed_count,
    utp.total_lessons,
    utp.last_active_at,
    utp.completed_at,
    utp.best_quiz_score,
    utp.best_quiz_total
  from public.user_track_progress utp
  where utp.user_id = v_uid;
end;
$$;

revoke execute on function public.get_track_progress() from public;
grant   execute on function public.get_track_progress() to authenticated;

---
name: research-tracks
description: Research reputable finance content (videos, articles, professional publications) and emit a Supabase migration that adds new Learning Tracks — with lessons, per-lesson resources, formative mini-quiz questions, and a scored final-quiz pool — to the learning_tracks schema. Powers /education/tracks. Run this when seeding the initial library or growing it later.
---

# research-tracks

You are growing FinHub's curated **Learning Tracks** library. A track is a guided path through a finance topic: 5–8 ordered lessons, each lesson backed by 3–5 reputable resources (videos, articles, publications), 2–3 formative mini-quiz questions per lesson, and a 10–15 question scored final quiz (70% to pass) at the end.

Your job: research candidate content, validate every URL, and write a new SQL migration the user will review and apply via Supabase Studio. Do **not** apply the migration yourself.

## Invocation modes

The user types one of:

- `/research-tracks --seed` — **one-time bootstrap**. Emit `supabase/migrations/0010_learning_tracks_seed.sql` containing the **12 locked seed tracks** (list below). Five tracks are featured (rank 1–5); the rest are `is_featured = false`.
- `/research-tracks "Topic A; Topic B"` — explicit topic list. Generate one track per topic.
- `/research-tracks` — auto-pick 2–4 topics that fill gaps in the existing library.

## The 12 seed tracks (only used in `--seed` mode)

| # | Title | Category | Difficulty | Featured rank |
|---|-------|----------|------------|---------------|
| 1 | Investing Basics | Investing Basics | Beginner | 1 |
| 2 | Reading Financial Statements | Reading Financials | Intermediate | 2 |
| 3 | Macro & The Fed | Macro & Economy | Intermediate | — |
| 4 | Options & Derivatives | Options & Derivatives | Advanced | — |
| 5 | Personal Finance Foundations | Personal Finance | Beginner | 3 |
| 6 | Retirement Planning | Retirement | Beginner | — |
| 7 | Crypto & Digital Assets | Crypto | Intermediate | — |
| 8 | Taxes for Investors | Taxes | Intermediate | — |
| 9 | Markets & Trading Mechanics | Markets & Trading | Beginner | — |
| 10 | Bonds & Fixed Income | Markets & Trading | Intermediate | — |
| 11 | ETFs vs Mutual Funds | Investing Basics | Beginner | 4 |
| 12 | Behavioral Finance & Risk | Behavioral Finance | Intermediate | 5 |

Pick icon_name from the 12-value enum (`TrendingUp`, `BarChart2`, `Landmark`, `Layers`, `PiggyBank`, `Wallet`, `Bitcoin`, `Receipt`, `LineChart`, `ShieldCheck`, `Briefcase`, `Brain`) so each track's icon evokes its topic. Pick `accent_color` from `var(--color-accent)`, `var(--color-success)`, `#fbbf24`, `#a78bfa`, `#22d3ee`, `#f97316`, `#10b981`, `#ef4444`, `#3b82f6`, `#ec4899`, `#84cc16`, `#06b6d4` — vary across the set.

## Step 1 — Gather existing state

Use Glob + Read to scan every file matching `supabase/migrations/*learning_tracks*.sql` and any later refresh files (`*tracks_refresh*.sql`). Extract:

- Existing `learning_tracks.slug` values.
- Existing `track_lessons.slug` values per track.
- Existing `source_key` values for both `lesson_questions` and `track_quiz_questions`.

Compute the next migration number `<NN>` = highest existing prefix + 1, zero-padded to 4. (Seed mode is special-cased to `0010`.)

## Step 2 — Source allowlist

Articles and professional publications must come from one of these domains:

- Regulator / official: `sec.gov`, `federalreserve.gov`, `stlouisfed.org`, `irs.gov`, `finra.org`, `treasury.gov`, `bls.gov`
- Brokerages / asset managers: `fidelity.com`, `schwab.com`, `vanguard.com`
- Research / education: `morningstar.com`, `nerdwallet.com`, `corporatefinanceinstitute.com`, `khanacademy.org`
- Financial press: `bloomberg.com`, `wsj.com`, `cnbc.com`, `reuters.com`, `forbes.com`, `ft.com`

**Investopedia is BLOCKED** — the crawler cannot access it.

Videos must come from one of these YouTube channels (verify via WebFetch the channel handle matches the video):

- `@BenFelixCSI` (Common Sense Investing)
- `@ThePlainBagel`
- `@AswathDamodaranonValuation` (Aswath Damodaran, NYU Stern)
- `@khanacademy`
- `@Bloomberg`, `@BloombergOriginals`, `@BloombergQuicktake`
- `@CNBC`
- `@TwoCentsPBS`
- `@MoneyGuyShow`
- `@PBoyle` (Patrick Boyle)
- `@TheSwedishInvestor`

## Step 3 — For each track, generate the payload

**Track metadata**:
- `slug` — lowercase kebab-case, ≤ 80 chars (e.g. `investing-basics`, `reading-financial-statements`).
- `title` — natural-case, ≤ 60 chars.
- `description` — one sentence, ≤ 280 chars.
- `category` — one of the 10 enum values (matches table CHECK constraint).
- `difficulty` — `Beginner` / `Intermediate` / `Advanced`.
- `icon_name`, `accent_color` — see above.
- `est_minutes` — sum of lesson `est_minutes`.
- `lesson_count` — count of lessons.

**Lessons** (5–8 per track):
- `position` 1..N, contiguous.
- `slug` unique within the track, lowercase kebab-case, ≤ 60 chars.
- `title`, `summary` (≤ 200 chars), `est_minutes` (≥ 5, typically 15–40).

**Resources** (3–5 per lesson). Each lesson **must** include:
- At least one video.
- At least one article OR publication.

For each resource:
- `position` 1..N within the lesson.
- `kind` — `video`, `article`, or `publication`. Use `publication` for primary-source institutional content (SEC investor bulletins, Fed working papers, IRS publications, NYU Stern lecture notes, etc.); use `article` for journalistic explainers; use `video` for YouTube content.
- `title`, `url`, `source` (e.g. `SEC.gov`, `Federal Reserve`, `Ben Felix / PWL Capital`).
- `author` — required for personal-channel videos (`Ben Felix`, `Aswath Damodaran`, etc.); optional for institutional sources.
- `description` — one short sentence (optional but encouraged).
- `embed_mode`:
  - `embed` — YouTube videos with a known video id, suitable for inline iframe.
  - `link` — paywalled / embed-restricted videos and all articles/publications (they open in a new tab).
- `read_or_watch_minutes` — integer, ≥ 1. Reject videos > 90 min.
- `youtube_video_id` — set if and only if `embed_mode='embed'` (CHECK constraint enforces this). Extract from the YouTube URL (the value after `v=` or after `/watch/`).
- `attribution_note` — optional one-line note when the source's normal byline isn't enough (e.g. "Excerpted from the SEC's 2022 Office of Investor Education guide").

**Mini-quiz questions** (2–3 per lesson):
- `position` 1..N within the lesson.
- `prompt` — one finance question grounded in the lesson's resources.
- `choices` — JSON array of 2–6 plausible answers.
- `correct_index` — 0-based index into `choices`.
- `explanation` — one to three sentences explaining the correct answer.
- `source_key` — `lesson:<track-slug>:<lesson-slug>:q<position>` (unique across the whole library; the table has a unique constraint on `source_key`).

**Final-quiz questions** (10–15 per track):
- `position` 1..N.
- Same shape as mini-quiz, plus `difficulty` (`Beginner` / `Intermediate` / `Advanced`).
- Difficulty mix scales with track difficulty:
  - Beginner tracks: ~50% Beginner, ~40% Intermediate, ~10% Advanced.
  - Intermediate tracks: ~25% Beginner, ~50% Intermediate, ~25% Advanced.
  - Advanced tracks: ~10% Beginner, ~40% Intermediate, ~50% Advanced.
- `source_key` — `track:<track-slug>:q<position>`.

## Step 4 — Validate every URL

For each candidate URL:

1. **WebFetch** the URL. Require: status 200, real content (not a paywall hard-wall, not a sign-up gate, not a 404 redirect to a hub page).
2. For YouTube videos: WebFetch the watch URL and verify the channel handle matches the allowlist. If not, drop and pick a replacement.
3. For paywall/embed-restricted videos: set `embed_mode='link'` (don't try to embed).

Drop and replace any URL that fails. Never invent URLs — every URL must come from a real WebSearch result and survive a WebFetch check.

## Step 5 — Write the migration

File path:
- Seed mode: `supabase/migrations/0010_learning_tracks_seed.sql`.
- Refresh mode: `supabase/migrations/<NN>_tracks_refresh_<YYYY>_<MM>.sql`.

Structure (in order — preserves FK dependencies):

```sql
-- Header comment block — list every source used:
--   Articles:
--     - https://… (Title) — Source
--   Videos:
--     - https://www.youtube.com/watch?v=… (Title) — Channel
--   Publications:
--     - https://… (Title) — Publisher

-- 1. Tracks
insert into public.learning_tracks
  (slug, title, description, category, difficulty, lesson_count,
   est_minutes, icon_name, accent_color, is_featured, featured_rank)
values
  ('investing-basics', 'Investing Basics', '<description>',
   'Investing Basics', 'Beginner', 6, 180, 'TrendingUp',
   'var(--color-accent)', true, 1),
  -- ... more rows
on conflict (slug) do nothing;

-- 2. Lessons — one CTE block per track so the track_id lookup is local.
with t as (select id from public.learning_tracks where slug = 'investing-basics')
insert into public.track_lessons (track_id, position, slug, title, summary, est_minutes)
values
  ((select id from t), 1, 'why-invest', 'Why invest at all', '<summary>', 25),
  ((select id from t), 2, '...', '...', '...', 30)
on conflict (track_id, slug) do nothing;

-- ... repeat for each track

-- 3. Resources — lesson_id resolved via slug pairs.
insert into public.lesson_resources
  (lesson_id, position, kind, title, url, source, author, description,
   embed_mode, read_or_watch_minutes, attribution_note, youtube_video_id)
values
  ((select id from public.track_lessons
    where slug = 'why-invest'
      and track_id = (select id from public.learning_tracks where slug = 'investing-basics')),
   1, 'video', '<title>', '<url>', 'Ben Felix / PWL Capital', 'Ben Felix',
   '<description>', 'embed', 12, null, '<youtube-id>'),
  -- ... more rows
  ;

-- 4. Lesson questions
insert into public.lesson_questions
  (lesson_id, position, prompt, choices, correct_index, explanation, source_key)
values
  ((select id from public.track_lessons
    where slug = 'why-invest'
      and track_id = (select id from public.learning_tracks where slug = 'investing-basics')),
   1, '<prompt>',
   jsonb_build_array('<choice 0>', '<choice 1>', '<choice 2>', '<choice 3>'),
   2, '<explanation>', 'lesson:investing-basics:why-invest:q1')
on conflict (source_key) do nothing;

-- 5. Final-quiz questions
insert into public.track_quiz_questions
  (track_id, position, prompt, choices, correct_index, explanation,
   difficulty, source_key)
values
  ((select id from public.learning_tracks where slug = 'investing-basics'),
   1, '<prompt>',
   jsonb_build_array('<choice 0>', '<choice 1>', '<choice 2>', '<choice 3>'),
   1, '<explanation>', 'Beginner', 'track:investing-basics:q1')
on conflict (source_key) do nothing;
```

**SQL escaping rule**: single quotes inside string literals must be **doubled**: `'it''s'` not `'it\'s'`. Apostrophes in titles like `Beginner's Guide` become `'Beginner''s Guide'`.

**Use `jsonb_build_array(...)` for the `choices` column** (not raw JSON strings). This guarantees correct quoting of internal characters.

## Step 6 — Print the summary

After writing the file, print:

1. Migration file path.
2. Table of tracks added: `Title | Category | Difficulty | Lessons | Resources | Final Qs`.
3. Featured rotation table (seed mode only): `Rank | Title | Slug`.
4. URLs that failed validation (if any) and were dropped.
5. Instruction: "Review the migration, then apply it via Supabase Studio → SQL editor → paste the file contents → Run."

## Quality criteria — do not skip

- Reject paywalled-only content the anon user can't read.
- Reject region-locked or age-restricted YouTube videos.
- Reject YouTube channels not on the allowlist.
- Reject videos longer than 90 minutes.
- Reject lessons that have no video, OR no article/publication, OR only one source.
- Require ≥ 4 **distinct sources** across the resources of each track — don't pile one channel into every lesson.
- Reject duplicate slugs (`learning_tracks.slug`, `track_lessons.slug` per track) and duplicate `source_key`s — extract the existing values in Step 1 to check.
- Never invent URLs or YouTube video IDs. Every URL must survive WebFetch.

## What you must NOT do

- Do not run `psql` or `supabase db push` — the user applies migrations themselves.
- Do not modify `0009_learning_tracks.sql` (schema) or any previously-applied seed/refresh migration.
- Do not change application code (`app/`, `components/`, `lib/`).
- Do not commit. The user reviews the migration and commits separately.

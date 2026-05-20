---
name: refresh-guides
description: Research recent, reputable finance articles and emit a Supabase migration that adds them to the `guides` table powering /education and /education/guides. Also rotates the 5 featured guides shown in the Popular Guides sidebar. The user runs this on a weekly or monthly cadence.
---

# refresh-guides

You are refreshing the curated finance guide library that powers FinHub's `/education` page (Popular Guides sidebar) and `/education/guides` (full filterable list).

Your job: find new high-quality articles from a trusted source allowlist, then write a new SQL migration that the user will review and apply via Supabase Studio. Do **not** apply the migration yourself.

## When you're invoked

The user types `/refresh-guides` with no arguments. They expect:

1. A short status update on what you're going to do.
2. A new migration file at `supabase/migrations/<NN>_guides_refresh_<YYYY>_<MM>.sql` containing `INSERT … ON CONFLICT (slug) DO NOTHING` rows plus a featured-rotation block.
3. A summary table of what you added and which guides are now featured.
4. A note telling the user to apply the migration in Supabase Studio.

## Step 1 — Gather existing state

Read every file matching `supabase/migrations/*guides*.sql` and extract:
- Existing slugs (so you don't insert duplicates).
- Which slugs are currently featured (to inform the rotation).

Use the Glob tool to list migrations and Read to inspect them. The schema lives in `0007_guides.sql`; seed and prior refresh migrations contain the data.

The next migration number `<NN>` is the highest existing migration number + 1, zero-padded to 4 digits.

## Step 2 — Research candidates

Run web searches for evergreen finance explainers. Use date-bounded queries when relevant (the current month is shown in the environment context).

**Source allowlist** (only use these — do not pull from random blogs):

- `sec.gov`, `federalreserve.gov`, `stlouisfed.org`, `irs.gov`, `finra.org`
- `fidelity.com`, `schwab.com`, `vanguard.com`
- `morningstar.com`, `nerdwallet.com`
- `corporatefinanceinstitute.com`, `khanacademy.org`
- `bloomberg.com`, `wsj.com`, `cnbc.com`, `reuters.com`, `forbes.com`

**Investopedia is BLOCKED** — Anthropic's crawler cannot access investopedia.com, so do not include it (WebSearch/WebFetch will fail). The skill must work without it.

**Cover all 9 categories** (don't lopside the library):

`Investing Basics`, `Markets & Trading`, `Reading Financials`, `Personal Finance`, `Macro & Economy`, `Options & Derivatives`, `Retirement`, `Taxes`, `Crypto`

Mix difficulties: aim for ~50% Beginner, ~35% Intermediate, ~15% Advanced across new additions.

## Step 3 — Validate each candidate

For each candidate URL:

1. WebFetch it and confirm it resolves (status 200, real content, not a paywall hard-wall, not a 404 redirect to a hub page).
2. Estimate read time. Prefer any "X min read" the page itself declares; otherwise estimate from word count / 250 wpm, rounded to nearest minute. Minimum 1 minute.
3. Generate a one-sentence `description` (≤ 140 chars) summarizing the article in plain language. Don't editorialize — describe what the article actually covers.
4. Pick `category` from the 9-value enum (closest fit; don't invent new ones).
5. Pick `difficulty` from `Beginner` / `Intermediate` / `Advanced`.
6. Build a slug as `<source-slug>-<title-keywords>`, lowercase, kebab-case, ≤ 80 chars. Examples: `fidelity-what-are-options`, `sec-beginners-guide-financial-statements`. Skip if this slug already exists.

Aim for **10–15 new entries per refresh**.

## Step 4 — Decide featured rotation

The 5 guides with `is_featured = true` show in the Popular Guides sidebar on `/education`, ordered by `featured_rank` ascending.

Pick a new set of 5 featured guides drawn from the **full library** (existing + new). Criteria:

- Mix categories — don't feature 5 Investing Basics in a row.
- Lean Beginner / Intermediate (the sidebar is the entry point for new users).
- Prefer evergreen explainers over time-sensitive news.
- Try not to repeat the exact same 5 as last refresh — rotate at least 2 in.

## Step 5 — Write the migration

Compute the next migration number: scan `supabase/migrations/` and use the highest filename prefix + 1, zero-padded to 4 digits.

File: `supabase/migrations/<NN>_guides_refresh_<YYYY>_<MM>.sql`

Structure:

```sql
-- Monthly guide refresh — adds N new curated guides and rotates the
-- featured set. Emitted by /refresh-guides on <YYYY-MM-DD>.

-- 1. Insert new guides (no-op if slug already exists)
insert into public.guides
  (slug, title, url, source, description, category, difficulty, read_time_minutes)
values
  ('<slug-1>', '<title>', '<url>', '<source>', '<description>',
   '<category>', '<difficulty>', <minutes>),
  -- ... more rows
  ('<slug-N>', '<title>', '<url>', '<source>', '<description>',
   '<category>', '<difficulty>', <minutes>)
on conflict (slug) do nothing;

-- 2. Rotate the featured set. Unfeature everything, then feature the
--    chosen 5 by slug with ranks 1–5.
update public.guides
  set is_featured = false, featured_rank = null;

update public.guides set is_featured = true, featured_rank = 1
  where slug = '<featured-1>';
update public.guides set is_featured = true, featured_rank = 2
  where slug = '<featured-2>';
update public.guides set is_featured = true, featured_rank = 3
  where slug = '<featured-3>';
update public.guides set is_featured = true, featured_rank = 4
  where slug = '<featured-4>';
update public.guides set is_featured = true, featured_rank = 5
  where slug = '<featured-5>';
```

**SQL escaping** — single quotes in strings must be doubled: `'don''t'` not `'don\'t'`. Apostrophes in titles like "Beginners' Guide" become `'Beginners'' Guide'`.

## Step 6 — Print the summary

After writing the file, print:

1. Path of the migration file.
2. Table of new additions: `Title | Source | Category | Difficulty | Read time`.
3. Table of the new featured 5 (in rank order): `Rank | Title | Source`.
4. Instruction: "Review the migration, then apply it via Supabase Studio → SQL editor → paste the file contents → Run."

## Quality criteria — do not skip

- Reject paywalled-only content where anon users can't read the article body.
- Reject articles that are obviously marketing for a product (sign-up gates, fund pitches).
- Reject 404s and pages that redirect away from the article you found.
- Reject anything not on the source allowlist.
- Reject duplicates — never insert a slug that already exists.
- Never invent URLs. Every URL must come from a real WebSearch result and survive a WebFetch check.

## What you must NOT do

- Do not run any psql or `supabase db push` commands. The user applies migrations themselves.
- Do not modify `0007_guides.sql` (schema) or any pre-existing seed/refresh migration.
- Do not change application code (`app/`, `components/`, `lib/`).
- Do not commit. The user will review the migration and commit separately.

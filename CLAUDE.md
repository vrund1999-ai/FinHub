# FinHub — Claude guide

Compact orientation for working on this repo. The setup walkthrough lives in [`docs/local-setup.md`](./docs/local-setup.md); this file is for working *inside* the codebase.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript strict** (`tsconfig.json`)
- **Tailwind v4** (PostCSS) — no `tailwind.config.*`; use CSS variables in `app/globals.css` for theming
- **Supabase** via `@supabase/ssr` for cookie-based auth and Postgres
- **lucide-react** for icons
- **No** form lib, validation lib, state lib, or test framework. Keep it that way unless we discuss it.

## Commands

```bash
npm install
npm run dev          # Next.js dev server (http://localhost:3000)
npm run build        # Production build — runs full type+RSC checks; use this to validate changes
npm run start        # Run the production build
npm run typecheck    # tsc --noEmit only
```

There is no `lint` script and no test framework. If a change feels test-worthy, **verify by running `npm run build`** (it surfaces server-action and RSC issues `tsc` alone misses) and by walking the dev-server flow.

## Repo map

| Path | What's there |
| --- | --- |
| `app/` | App Router routes. Server components by default; `"use client"` for interactive pages. |
| `app/signup/` | 3-step signup: `page.tsx` → `experience/` → `interests/`. Shared draft state in `SignupDraftProvider.tsx`. Server action in `actions.ts`. |
| `app/auth/callback/route.ts` | OAuth code-for-session exchange. |
| `app/login/` | Login page UI (no submit handler wired yet). |
| `lib/supabase/client.ts` | **Browser** Supabase client (`createBrowserClient`). |
| `lib/supabase/server.ts` | **Server** Supabase client (`createServerClient` with cookie adapter). |
| `middleware.ts` | Refreshes the Supabase session on every non-static request. Already matches all routes. |
| `components/auth/` | Reusable auth UI (`OAuthButton`, `TextField`, `PasswordField`, `PrimaryButton`, …). |
| `components/signup/` | Signup-specific UI (`Stepper`, `ChipGroup`, `ExperienceCard`, `Select`, `SignupSidebar`, …). |
| `components/login/` | Login-specific UI. |
| `supabase/migrations/` | Versioned SQL schema. Filenames are `NNNN_name.sql`. |
| `docs/` | Human-facing docs. Currently `local-setup.md`. |

## Architecture you should know

**Auth model.** Cookie-based SSR auth. The browser client signs in, `/auth/callback` exchanges the code for a session, and `middleware.ts` keeps the cookie fresh. **Never** import `lib/supabase/server.ts` from a `"use client"` file or `lib/supabase/client.ts` from a server component / server action — they have different cookie wiring.

**Multi-step signup state.** Each step's form values flow through `SignupDraftProvider` (context) wrapped in `app/signup/layout.tsx`. The provider hydrates from `sessionStorage["finhub:signup-draft"]` on mount and persists every `update(...)`. Call `reset()` after a successful submit. Don't reintroduce per-page `useState` for fields that need to survive navigation.

**Server actions.** Pattern in `app/signup/actions.ts`:

1. Validate input (return `{ ok: false, error }` — don't throw).
2. `const { data: { user } } = await supabase.auth.getUser()` — bail with `not_authenticated` error if missing.
3. `supabase.from("table").upsert(...)` keyed on `id` so reruns update instead of duplicating.
4. Return `{ ok: true } | { ok: false, error }`. Redirects happen on the **client** after success so the provider can `reset()` first.

**RLS.** Every `public.*` table has Row Level Security on. Policies tie writes/reads to `auth.uid() = id` (or equivalent). When you add a table, also add `select`/`insert`/`update` policies in the same migration — otherwise the anon-key client will silently fail.

**Database migrations.** SQL files in `supabase/migrations/`, run in filename order. Apply via Supabase Studio SQL editor (paste each file) or `supabase db push`. There is no auto-apply on `npm run dev`.

## Conventions

- **`"use client"` sparingly.** Only on pages/components that need state, effects, or browser APIs. Server components are the default.
- **Co-locate server actions** in an `actions.ts` next to the route that calls them. Mark with `"use server"` at the top of the file.
- **Components stay dumb.** Existing components in `components/*` take props and render — no data fetching, no global state. Keep new ones the same.
- **Tailwind only.** Use the CSS variables already defined (`var(--color-text)`, `var(--color-accent)`, …) for theming.
- **Comments are rare.** Names should carry the meaning. A short `// Why:` comment is fine when the reasoning isn't obvious.
- **No backwards-compat shims.** If you remove something, remove it cleanly — don't leave re-exports or deprecated wrappers behind.

## Branch + PR workflow

- One feature per branch, branched off the latest `origin/main`. Names are kebab-case and descriptive: `signup-with-google`, `signup-create-account-flow`, `docs-local-setup`.
- Commit messages: imperative mood ("Add X", "Wire up Y", "Fix Z"). Body explains *why*, not what.
- All commits include the trailer:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- PR descriptions follow the structure used in recent PRs: a Summary, then a Test plan checklist. Open via `gh pr create --base main`.

## Things to avoid

- Don't commit `.env.local` (already gitignored — keep it that way).
- Don't introduce the Supabase **service_role** key anywhere; this app uses only the **anon** key, which is browser-safe.
- Don't bypass RLS by adding a service-role admin path on the client.
- Don't add Apple OAuth wiring without checking with the user — the button currently shows a "Coming soon" alert by design.
- Don't add new dependencies (state, form, validation, testing libraries) without explicit user approval. The minimal dep tree is intentional.

## Where to start when stuck

1. Reproducing locally → `docs/local-setup.md`.
2. Understanding the OAuth round-trip → `app/auth/callback/route.ts` + `middleware.ts` + `lib/supabase/*`.
3. Adding a new field to signup → update `SignupDraftProvider`'s `SignupDraft` type, wire the field in the relevant step's `page.tsx`, extend `createAccountAction`'s `Input` type, add the column + check constraint in a new `supabase/migrations/000N_*.sql`.
4. Adding a new authenticated page → put it under `app/`, read `auth.getUser()` from `lib/supabase/server.ts` in a server component, redirect to `/login` if absent.

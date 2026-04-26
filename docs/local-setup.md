# Local Setup

End-to-end guide to running FinHub on your machine, including the external services it depends on (Supabase + Google OAuth).

If you only want the app to render UI without auth, you can skip the Supabase / Google sections — the OAuth buttons and account-creation flow will be inert, but every page will still load. For a fully working signup flow, complete every section below.

---

## 1. Prerequisites

| Tool | Why | Notes |
| --- | --- | --- |
| **Node.js ≥ 20** | Next.js 15 + React 19 | `node --version` |
| **npm** (bundled with Node) | Install dependencies | npm 10+ recommended |
| **Git** | Clone the repo | — |
| **Supabase account** | Auth + Postgres | Free tier is fine: <https://supabase.com> |
| **Google Cloud account** | OAuth client credentials | Free; needed for "Sign up with Google" |

Optional (only if you want to manage migrations from the CLI instead of pasting SQL):

- **Supabase CLI** — `npm i -g supabase` or follow <https://supabase.com/docs/guides/cli>.

---

## 2. Clone and install

```bash
git clone https://github.com/vrund1999-ai/FinHub.git
cd FinHub
npm install
```

---

## 3. Set up Supabase

### 3a. Create a project

1. Sign in at <https://supabase.com/dashboard>.
2. Click **New project**, give it a name (e.g. `finhub-dev`), choose a region close to you, and set a strong database password.
3. Wait for provisioning (~1 minute).

### 3b. Grab the URL and anon key

In the Supabase dashboard for your new project:

1. Open **Project Settings → API**.
2. Copy:
   - **Project URL** → goes into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Keep these handy — they go into `.env.local` in step 6.

> The `anon` key is safe to expose to the browser. Do **not** commit the `service_role` key to anything client-side; it's not used by this app.

### 3c. Apply database migrations

The repo's `supabase/migrations/` directory holds the SQL FinHub needs (currently the `profiles` table, RLS policies, and an `updated_at` trigger).

**Option A — paste in the SQL editor (simplest):**

1. In Supabase dashboard: **SQL Editor → New query**.
2. Open each file in `supabase/migrations/` (in filename order — they're prefixed `0001_`, `0002_`, …) and paste its contents.
3. Click **Run**. Confirm "Success. No rows returned."
4. Verify in **Table Editor**: `profiles` should now exist under the `public` schema with RLS enabled.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref <your-project-ref>   # one-time
supabase db push
```

`<your-project-ref>` is the subdomain of your Project URL (e.g. for `https://abcd1234.supabase.co` the ref is `abcd1234`).

---

## 4. Configure Google OAuth

This is the most error-prone step. You're configuring two systems:

- **Google Cloud Console** — issues the OAuth client ID + secret.
- **Supabase Auth** — stores those credentials and proxies the OAuth dance.

### 4a. Create a Google OAuth client

1. Go to <https://console.cloud.google.com/>. Create a project (or pick one) and select it.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**.
   - App name: anything (e.g. `FinHub Local`).
   - Support email and developer contact: your email.
   - Scopes: leave defaults (`openid`, `email`, `profile`) — the app only needs identity.
   - Test users: add your own Google email (required while the app is in "testing" mode).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: e.g. `FinHub Web`.
   - **Authorized JavaScript origins**: leave empty (Supabase handles the exchange).
   - **Authorized redirect URIs**: add **exactly one**:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     Replace `<your-project-ref>` with your Supabase project ref.
4. Click **Create**. Copy the generated **Client ID** and **Client secret**.

> The redirect URI must match Supabase's exactly — including `https://` and the trailing `/auth/v1/callback`. Mismatches cause a `redirect_uri_mismatch` error from Google.

### 4b. Enable Google in Supabase Auth

1. In the Supabase dashboard: **Authentication → Providers → Google**.
2. Toggle **Enable Sign in with Google** on.
3. Paste the **Client ID** and **Client secret** you just copied.
4. Save.

### 4c. Configure Site URL and redirect allowlist

Still in Supabase, open **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs** (one per line — these are what Supabase is allowed to redirect *back* to after OAuth):
  ```
  http://localhost:3000/auth/callback
  http://localhost:3000/**
  ```

The app's OAuth handler lives at `/auth/callback` (`app/auth/callback/route.ts`); the wildcard line is a convenience for any nested `next=` redirects passed by the client.

When you eventually deploy, add the production origin (e.g. `https://finhub.example.com`) to both fields too.

---

## 5. Optional: Apple OAuth

The signup page renders an **Apple** button as well, but the handler is gated with a "coming soon" alert — you don't need to configure anything for local dev. Skip this section.

---

## 6. Environment variables

Copy the example and fill in the values from step 3b:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-long-anon-key...
```

`.env.local` is gitignored — never commit it.

---

## 7. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>. The dev server hot-reloads on file changes.

Other handy scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with HMR |
| `npm run build` | Production build (catches type errors and RSC issues) |
| `npm run start` | Run the production build locally |
| `npm run typecheck` | `tsc --noEmit` only |

---

## 8. Walk the signup flow

1. Visit <http://localhost:3000/signup>.
2. Click **Sign up with Google** → Google consent screen → bounced back to `/signup` showing **Signed in as `<your-email>`**.
3. Continue → **Step 2 (Experience)** → pick a level (and optionally goal/time) → Continue.
4. **Step 3 (Interests)** → pick at least one Sector, Topic, and Index → **Create account**.
5. You should land on `/`.
6. In Supabase **Table Editor → profiles**, confirm a row exists with your `auth.users.id`, the names from your Google account, and the experience/interests you picked.

---

## 9. Troubleshooting

**`Supabase is not configured` alert when clicking the Google button**
The `NEXT_PUBLIC_SUPABASE_URL` env var is missing. Check `.env.local` and restart `npm run dev` — Next only re-reads env files on restart.

**Google → `redirect_uri_mismatch`**
The URI registered in Google Cloud doesn't match the one Supabase actually uses. It must be exactly `https://<your-project-ref>.supabase.co/auth/v1/callback` — no trailing slash, no `localhost`.

**Bounced back to `/signup?error=oauth`**
The code-for-session exchange in `app/auth/callback/route.ts` failed. Common causes:
- The browser visited `/auth/callback` directly (no `code` param).
- The Supabase project's **Site URL** or **Redirect URLs** don't include `http://localhost:3000` / `http://localhost:3000/auth/callback`.
- System clock drift — Supabase JWTs have a small skew tolerance.

**Create account button is disabled**
By design: requires ≥1 selection in each of Sectors, Topics, and Indices, plus an experience level set on Step 2.

**Create account fails with an RLS / "permission denied" / "relation \"profiles\" does not exist" error**
You skipped step 3c. Apply the migrations and try again.

**Session doesn't persist across reloads**
Make sure `middleware.ts` is being picked up — it must be at the project root (it is in this repo) and matches all routes except static assets. Check the browser cookies for `sb-<project-ref>-auth-token`; if missing, the OAuth callback didn't complete.

**`fetch failed` to Supabase from server actions**
Usually a typo in `NEXT_PUBLIC_SUPABASE_URL` or a corporate proxy blocking outbound HTTPS. Test with `curl https://<project-ref>.supabase.co/auth/v1/health` — should return `{"name":"GoTrue",...}`.

---

## 10. What's where

Quick map of the moving parts so you know where to poke when something breaks:

| Path | Purpose |
| --- | --- |
| `app/auth/callback/route.ts` | OAuth code-for-session exchange |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server-side (cookie-aware) Supabase client |
| `middleware.ts` | Refreshes the session on every request |
| `app/signup/*` | Multi-step signup flow |
| `app/signup/SignupDraftProvider.tsx` | Cross-step state (sessionStorage-backed) |
| `app/signup/actions.ts` | `createAccountAction` server action |
| `supabase/migrations/` | Versioned SQL — run these on every fresh Supabase project |

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { StepEyebrow } from "@/components/signup/StepEyebrow";
import { ProgressBar } from "@/components/signup/ProgressBar";
import { PasswordStrengthMeter } from "@/components/signup/PasswordStrengthMeter";
import { createClient } from "@/lib/supabase/client";
import { useSignupDraft } from "./SignupDraftProvider";

function splitFullName(full: string | undefined): [string, string] {
  if (!full) return ["", ""];
  const parts = full.trim().split(/\s+/);
  return [parts[0] ?? "", parts.slice(1).join(" ")];
}

export default function SignupStep1Page() {
  const { draft, update } = useSignupDraft();
  const [user, setUser] = useState<User | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setUser(u);
      // Read latest draft (hydration from sessionStorage may have completed
      // after this effect's closure was created) so we don't clobber values
      // the user already entered when revisiting Step 1.
      const current = draftRef.current;
      const meta = u.user_metadata ?? {};
      const [fallbackFirst, fallbackLast] = splitFullName(
        meta.full_name ?? meta.name,
      );
      const patch: Partial<typeof current> = { email: u.email ?? "" };
      if (!current.firstName) {
        patch.firstName = meta.given_name ?? fallbackFirst;
      }
      if (!current.lastName) {
        patch.lastName = meta.family_name ?? fallbackLast;
      }
      update(patch);
    });
  }, [update]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  const signedIn = user !== null;

  return (
    <>
      <div className="flex flex-col gap-2">
        <StepEyebrow step={1} />
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          Create your account
        </h1>
        {signedIn ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Signed in as {draft.email}.{" "}
            <button
              type="button"
              onClick={handleSignOut}
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              Use a different account
            </button>
          </p>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            Free forever — no credit card required
          </p>
        )}
      </div>

      <ProgressBar percent={33} />

      {!signedIn && (
        <>
          <div className="flex flex-col gap-3">
            <OAuthButton variant="google" label="Sign up with Google" />
            <OAuthButton variant="apple" label="Sign up with Apple" />
          </div>

          <OrDivider label="or sign up with email" />
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="First name"
          placeholder="Jane"
          autoComplete="given-name"
          value={draft.firstName}
          onChange={(e) => update({ firstName: e.target.value })}
        />
        <TextField
          label="Last name"
          placeholder="Smith"
          autoComplete="family-name"
          value={draft.lastName}
          onChange={(e) => update({ lastName: e.target.value })}
        />
      </div>

      <TextField
        label="Email address"
        type="email"
        placeholder="jane@example.com"
        autoComplete="email"
        value={draft.email}
        onChange={(e) => update({ email: e.target.value })}
      />

      {!signedIn && (
        <div className="flex flex-col gap-2">
          <PasswordField />
          <PasswordStrengthMeter score={0} />
        </div>
      )}

      <Link href="/signup/experience" className="block">
        <PrimaryButton icon={<ArrowRight size={16} />}>Continue</PrimaryButton>
      </Link>

      <p className="text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
        By signing up you agree to FinHub&rsquo;s{" "}
        <a href="#" className="text-[var(--color-accent)] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-[var(--color-accent)] hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <p className="text-center text-xs text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}

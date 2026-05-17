"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { ArrowRight, MailCheck } from "lucide-react";
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

function splitFullName(full: string | undefined): [string, string] {
  if (!full) return ["", ""];
  const parts = full.trim().split(/\s+/);
  return [parts[0] ?? "", parts.slice(1).join(" ")];
}

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= MIN_PASSWORD_LENGTH) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s as 0 | 1 | 2 | 3 | 4;
}

function mapSignUpError(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (m.includes("user already")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  return message;
}

export default function SignupStep1Page() {
  const router = useRouter();
  const { draft, update } = useSignupDraft();
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);
  const [confirmEmailAddress, setConfirmEmailAddress] = useState("");
  const [isPending, startTransition] = useTransition();
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
        patch.firstName = meta.given_name ?? meta.first_name ?? fallbackFirst;
      }
      if (!current.lastName) {
        patch.lastName = meta.family_name ?? meta.last_name ?? fallbackLast;
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
  const passwordScore = useMemo(() => scorePassword(password), [password]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!draft.firstName.trim()) errors.firstName = "Enter your first name.";
    if (!draft.lastName.trim()) errors.lastName = "Enter your last name.";
    const emailTrimmed = draft.email.trim();
    if (!emailTrimmed) {
      errors.email = "Enter your email.";
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Create a password.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return errors;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (signedIn) {
      router.push("/signup/experience");
      return;
    }
    setFormError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setFormError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      );
      return;
    }

    const firstName = draft.firstName.trim();
    const lastName = draft.lastName.trim();
    const email = draft.email.trim().toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();

    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/signup/experience`,
        },
      });

      if (error) {
        setFormError(mapSignUpError(error.message));
        return;
      }

      // Persist the normalized email back into the draft so later steps
      // (and the upsert in createAccountAction) see the same value Supabase
      // stored in auth.users.
      update({ email });

      if (data.session) {
        // Email confirmation disabled — Supabase set the session cookie,
        // continue straight into the rest of onboarding.
        setPassword("");
        router.push("/signup/experience");
      } else {
        // Email confirmation required — Supabase sent a verification link
        // pointing at /auth/callback?next=/signup/experience.
        setPassword("");
        setConfirmEmailAddress(email);
        setConfirmEmailSent(true);
      }
    });
  }

  if (confirmEmailSent) {
    return (
      <>
        <div className="flex flex-col gap-2">
          <StepEyebrow step={1} />
          <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
            Check your email
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            We sent a verification link to{" "}
            <span className="font-medium text-[var(--color-text)]">
              {confirmEmailAddress}
            </span>
            . Click it to finish creating your account.
          </p>
        </div>

        <ProgressBar percent={33} />

        <div className="flex items-start gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <MailCheck
            size={20}
            className="mt-0.5 text-[var(--color-accent)]"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-[var(--color-text)]">
              The link will bring you back here and continue to your experience
              setup.
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Don&rsquo;t see it? Check your spam folder, or wait a minute and
              refresh your inbox.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmEmailSent(false);
            setConfirmEmailAddress("");
          }}
          className="self-start text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Use a different email
        </button>

        <p className="text-center text-xs text-[var(--color-text-muted)]">
          Already verified?{" "}
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="First name"
            placeholder="Jane"
            autoComplete="given-name"
            value={draft.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            error={fieldErrors.firstName}
          />
          <TextField
            label="Last name"
            placeholder="Smith"
            autoComplete="family-name"
            value={draft.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            error={fieldErrors.lastName}
          />
        </div>

        <TextField
          label="Email address"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          value={draft.email}
          onChange={(e) => update({ email: e.target.value })}
          error={fieldErrors.email}
          disabled={signedIn}
        />

        {!signedIn && (
          <div className="flex flex-col gap-2">
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <PasswordStrengthMeter score={passwordScore} />
            <p className="text-xs text-[var(--color-text-muted)]">
              Use 8+ characters with a mix of letters, numbers, and symbols.
            </p>
          </div>
        )}

        {formError && (
          <p className="text-sm text-red-400" role="alert">
            {formError}
          </p>
        )}

        <PrimaryButton
          type="submit"
          disabled={isPending}
          icon={<ArrowRight size={16} />}
        >
          {isPending
            ? "Creating account..."
            : signedIn
              ? "Continue"
              : "Create account"}
        </PrimaryButton>
      </form>

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

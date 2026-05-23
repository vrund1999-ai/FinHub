import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { Checkbox } from "@/components/auth/Checkbox";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const showAccountExists = reason === "account_exists";

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--color-accent)]">
          Log in to your FinHub account
        </p>
      </div>

      {showAccountExists && (
        <p className="text-sm text-red-400" role="alert">
          An account with this email already exists. Please log in to continue.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <OAuthButton
          variant="google"
          label="Continue with Google"
          forceAccountPicker
        />
        <OAuthButton
          variant="apple"
          label="Continue with Apple"
          forceAccountPicker
        />
      </div>

      <OrDivider label="or sign in with email" />

      <TextField
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />

      <PasswordField
        placeholder="••••••••"
        autoComplete="current-password"
        labelTrailing={
          <a
            href="#"
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Forgot password?
          </a>
        }
      />

      <Checkbox label="Keep me signed in for 30 days" defaultChecked />

      <PrimaryButton>Log in</PrimaryButton>

      <p className="text-center text-xs text-[var(--color-text-muted)]">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 font-medium text-[var(--color-accent)] hover:underline"
        >
          Sign up free <ArrowRight size={12} />
        </Link>
      </p>
    </>
  );
}

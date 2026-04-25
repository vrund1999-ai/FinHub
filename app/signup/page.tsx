import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { StepEyebrow } from "@/components/signup/StepEyebrow";
import { ProgressBar } from "@/components/signup/ProgressBar";
import { PasswordStrengthMeter } from "@/components/signup/PasswordStrengthMeter";

export default function SignupStep1Page() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <StepEyebrow step={1} />
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          Create your account
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Free forever — no credit card required
        </p>
      </div>

      <ProgressBar percent={33} />

      <div className="flex flex-col gap-3">
        <OAuthButton variant="google" label="Sign up with Google" />
        <OAuthButton variant="apple" label="Sign up with Apple" />
      </div>

      <OrDivider label="or sign up with email" />

      <div className="grid grid-cols-2 gap-3">
        <TextField label="First name" placeholder="Jane" autoComplete="given-name" />
        <TextField label="Last name" placeholder="Smith" autoComplete="family-name" />
      </div>

      <TextField
        label="Email address"
        type="email"
        placeholder="jane@example.com"
        autoComplete="email"
      />

      <div className="flex flex-col gap-2">
        <PasswordField />
        <PasswordStrengthMeter score={0} />
      </div>

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

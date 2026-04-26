"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Leaf, Settings } from "lucide-react";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { StepEyebrow } from "@/components/signup/StepEyebrow";
import { ProgressBar } from "@/components/signup/ProgressBar";
import { ExperienceCard } from "@/components/signup/ExperienceCard";
import { Select } from "@/components/signup/Select";
import {
  useSignupDraft,
  type InvestmentGoal,
  type WeeklyMarketTime,
} from "../SignupDraftProvider";

const GOAL_OPTIONS = [
  { value: "retirement", label: "Retirement" },
  { value: "wealth", label: "Building wealth" },
  { value: "active-trading", label: "Active trading" },
  { value: "learning", label: "Learning" },
  { value: "other", label: "Other" },
];

const TIME_OPTIONS = [
  { value: "lt1", label: "<1 hour" },
  { value: "1-5", label: "1–5 hours" },
  { value: "5-10", label: "5–10 hours" },
  { value: "10+", label: "10+ hours" },
];

export default function SignupStep2Page() {
  const { draft, update } = useSignupDraft();

  return (
    <>
      <div className="flex flex-col gap-2">
        <StepEyebrow step={2} title="EXPERIENCE" />
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          What&rsquo;s your experience level?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          We&rsquo;ll tailor your education tracks and dashboard to match.
        </p>
      </div>

      <ProgressBar percent={66} />

      <div className="grid grid-cols-3 gap-3">
        <ExperienceCard
          icon={<Leaf size={20} />}
          title="Beginner"
          description="New to investing and financial markets"
          selected={draft.level === "beginner"}
          onClick={() => update({ level: "beginner" })}
        />
        <ExperienceCard
          icon={<BarChart3 size={20} />}
          title="Intermediate"
          description="Familiar with stocks, ETFs, and basic analysis"
          selected={draft.level === "intermediate"}
          onClick={() => update({ level: "intermediate" })}
        />
        <ExperienceCard
          icon={<Settings size={20} />}
          title="Advanced"
          description="Options, derivatives, and technical analysis"
          selected={draft.level === "advanced"}
          onClick={() => update({ level: "advanced" })}
        />
      </div>

      <Select
        label="What are you primarily investing for? (optional)"
        options={GOAL_OPTIONS}
        placeholder="Select a goal..."
        value={draft.investmentGoal ?? ""}
        onChange={(e) =>
          update({
            investmentGoal: (e.target.value || null) as InvestmentGoal | null,
          })
        }
      />

      <Select
        label="How much time do you spend on markets weekly? (optional)"
        options={TIME_OPTIONS}
        value={draft.weeklyMarketTime ?? ""}
        onChange={(e) =>
          update({
            weeklyMarketTime:
              (e.target.value || null) as WeeklyMarketTime | null,
          })
        }
      />

      <div className="mt-2 flex justify-between gap-3">
        <Link href="/signup">
          <SecondaryButton icon={<ArrowLeft size={16} />}>Back</SecondaryButton>
        </Link>
        <Link
          href="/signup/interests"
          aria-disabled={draft.level === null}
          className={draft.level === null ? "pointer-events-none" : ""}
        >
          <PrimaryButton
            fullWidth={false}
            icon={<ArrowRight size={16} />}
            disabled={draft.level === null}
          >
            Continue
          </PrimaryButton>
        </Link>
      </div>
    </>
  );
}

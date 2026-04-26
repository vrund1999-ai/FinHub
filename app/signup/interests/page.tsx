"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { StepEyebrow } from "@/components/signup/StepEyebrow";
import { ProgressBar } from "@/components/signup/ProgressBar";
import { ChipGroup } from "@/components/signup/ChipGroup";
import { createClient } from "@/lib/supabase/client";
import { useSignupDraft } from "../SignupDraftProvider";
import { createAccountAction } from "../actions";

const SECTORS = [
  "Technology",
  "Healthcare",
  "Financials",
  "Energy",
  "Consumer",
  "Industrials",
  "Real estate",
  "Utilities",
  "Materials",
];

const TOPICS = [
  "Earnings",
  "Fed & rates",
  "Crypto",
  "IPOs",
  "M&A deals",
  "Macro data",
  "Dividends",
  "Options flow",
];

const INDICES = [
  "S&P 500",
  "NASDAQ",
  "DJIA",
  "Russell 2K",
  "FTSE 100",
  "Nikkei 225",
];

type SelectionKey = "sectors" | "topics" | "indices";

export default function SignupStep3Page() {
  const router = useRouter();
  const { draft, update, reset } = useSignupDraft();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error: err }) => {
      if (err || !data.user) {
        router.replace("/signup");
      }
    });
  }, [router]);

  const sectorsSet = useMemo(() => new Set(draft.sectors), [draft.sectors]);
  const topicsSet = useMemo(() => new Set(draft.topics), [draft.topics]);
  const indicesSet = useMemo(() => new Set(draft.indices), [draft.indices]);

  function toggle(key: SelectionKey) {
    return (option: string) => {
      const current = draft[key];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      update({ [key]: next });
    };
  }

  const canSubmit =
    !isPending &&
    draft.level !== null &&
    draft.sectors.length > 0 &&
    draft.topics.length > 0 &&
    draft.indices.length > 0;

  function handleSubmit() {
    if (!canSubmit || draft.level === null) return;
    setError(null);
    const level = draft.level;
    startTransition(async () => {
      const result = await createAccountAction({
        firstName: draft.firstName,
        lastName: draft.lastName,
        level,
        investmentGoal: draft.investmentGoal,
        weeklyMarketTime: draft.weeklyMarketTime,
        sectors: draft.sectors,
        topics: draft.topics,
        indices: draft.indices,
      });
      if (result.ok) {
        reset();
        router.push("/");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <StepEyebrow step={3} title="INTERESTS" />
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          What do you want to follow?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Pick at least one in each group to personalize your news feed and
          alerts.
        </p>
      </div>

      <ProgressBar percent={100} />

      <ChipGroup
        label="Sectors"
        options={SECTORS}
        selected={sectorsSet}
        onToggle={toggle("sectors")}
      />
      <ChipGroup
        label="Topics"
        options={TOPICS}
        selected={topicsSet}
        onToggle={toggle("topics")}
      />
      <ChipGroup
        label="Indices"
        options={INDICES}
        selected={indicesSet}
        onToggle={toggle("indices")}
      />

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="mt-2 flex justify-between gap-3">
        <Link href="/signup/experience">
          <SecondaryButton icon={<ArrowLeft size={16} />}>Back</SecondaryButton>
        </Link>
        <PrimaryButton
          fullWidth={false}
          icon={<ArrowRight size={16} />}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? "Creating account..." : "Create account"}
        </PrimaryButton>
      </div>
    </>
  );
}

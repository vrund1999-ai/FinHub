"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { StepEyebrow } from "@/components/signup/StepEyebrow";
import { ProgressBar } from "@/components/signup/ProgressBar";
import { ChipGroup } from "@/components/signup/ChipGroup";

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

function useToggleSet(initial: string[] = []) {
  const [set, setSet] = useState<Set<string>>(new Set(initial));
  const toggle = (v: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };
  return [set, toggle] as const;
}

export default function SignupStep3Page() {
  const [sectors, toggleSector] = useToggleSet(["Technology", "Financials"]);
  const [topics, toggleTopic] = useToggleSet(["Earnings", "Fed & rates"]);
  const [indices, toggleIndex] = useToggleSet(["S&P 500", "NASDAQ"]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <StepEyebrow step={3} title="INTERESTS" />
        <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          What do you want to follow?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Pick at least 3 to personalize your news feed and alerts.
        </p>
      </div>

      <ProgressBar percent={100} />

      <ChipGroup
        label="Sectors"
        options={SECTORS}
        selected={sectors}
        onToggle={toggleSector}
      />
      <ChipGroup
        label="Topics"
        options={TOPICS}
        selected={topics}
        onToggle={toggleTopic}
      />
      <ChipGroup
        label="Indices"
        options={INDICES}
        selected={indices}
        onToggle={toggleIndex}
      />

      <div className="mt-2 flex justify-between gap-3">
        <Link href="/signup/experience">
          <SecondaryButton icon={<ArrowLeft size={16} />}>Back</SecondaryButton>
        </Link>
        <Link href="#">
          <PrimaryButton fullWidth={false} icon={<ArrowRight size={16} />}>
            Create account
          </PrimaryButton>
        </Link>
      </div>
    </>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";

type Input = {
  firstName: string;
  lastName: string;
  level: "beginner" | "intermediate" | "advanced";
  investmentGoal:
    | "retirement"
    | "wealth"
    | "active-trading"
    | "learning"
    | "other"
    | null;
  weeklyMarketTime: "lt1" | "1-5" | "5-10" | "10+" | null;
  sectors: string[];
  topics: string[];
  indices: string[];
};

export type CreateAccountResult =
  | { ok: true }
  | { ok: false; error: string };

const VALID_LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const VALID_GOALS = new Set([
  "retirement",
  "wealth",
  "active-trading",
  "learning",
  "other",
]);
const VALID_TIMES = new Set(["lt1", "1-5", "5-10", "10+"]);

export async function createAccountAction(
  input: Input,
): Promise<CreateAccountResult> {
  if (!VALID_LEVELS.has(input.level)) {
    return { ok: false, error: "Pick an experience level." };
  }
  if (input.investmentGoal && !VALID_GOALS.has(input.investmentGoal)) {
    return { ok: false, error: "Invalid investment goal." };
  }
  if (input.weeklyMarketTime && !VALID_TIMES.has(input.weeklyMarketTime)) {
    return { ok: false, error: "Invalid weekly market time." };
  }
  if (
    input.sectors.length === 0 ||
    input.topics.length === 0 ||
    input.indices.length === 0
  ) {
    return {
      ok: false,
      error: "Pick at least one sector, topic, and index.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "You need to be signed in to continue." };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      first_name: input.firstName.trim() || null,
      last_name: input.lastName.trim() || null,
      experience_level: input.level,
      investment_goal: input.investmentGoal,
      weekly_market_time: input.weeklyMarketTime,
      sectors: input.sectors,
      topics: input.topics,
      indices: input.indices,
      onboarded_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

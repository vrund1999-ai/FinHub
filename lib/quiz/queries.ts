import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type {
  FetchDailyQuizResult,
  QuizQuestionForUser,
  UserQuizStats,
} from "./types";

const BOT_UA = /bot|crawler|spider|preview|fetch|monitor|headless/i;

const ZERO_STATS: UserQuizStats = {
  current_streak_days: 0,
  longest_streak_days: 0,
  last_completed_date: null,
  total_points: 0,
  points_this_week: 0,
  week_anchor_date: null,
  current_cycle_number: 1,
};

export async function fetchDailyQuiz(): Promise<FetchDailyQuizResult> {
  const ua = (await headers()).get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return { ok: false, error: "unknown" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data, error } = await supabase.rpc("get_or_create_daily_quiz");
  if (error) {
    if (error.message?.includes("quiz_pool_too_small")) {
      return { ok: false, error: "quiz_pool_too_small" };
    }
    console.warn("fetchDailyQuiz failed:", error.message);
    return { ok: false, error: "unknown" };
  }

  const rows = (data ?? []) as QuizQuestionForUser[];
  return { ok: true, payload: { questions: rows } };
}

export async function fetchUserQuizStats(): Promise<UserQuizStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_user_quiz_stats");
  if (error) {
    console.warn("fetchUserQuizStats failed:", error.message);
    return ZERO_STATS;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return (row ?? ZERO_STATS) as UserQuizStats;
}

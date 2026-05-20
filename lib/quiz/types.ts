import type { Category, Difficulty } from "@/lib/glossary/categories";

export type QuizQuestionForUser = {
  slot: number;
  question_id: string;
  prompt: string;
  choices: string[];
  category: Category;
  difficulty: Difficulty;
  glossary_slug: string | null;
  chosen_index: number | null;
  is_correct: boolean | null;
  correct_index: number | null;
  explanation: string | null;
};

export type DailyQuizPayload = {
  questions: QuizQuestionForUser[];
};

export type SubmitInput = {
  slot: number;
  chosenIndex: number;
};

export type SubmitResult = {
  is_correct: boolean;
  correct_index: number;
  explanation: string;
  points_awarded: number;
  current_streak_days: number;
  total_points: number;
  points_this_week: number;
  day_completed: boolean;
};

export type UserQuizStats = {
  current_streak_days: number;
  longest_streak_days: number;
  last_completed_date: string | null;
  total_points: number;
  points_this_week: number;
  week_anchor_date: string | null;
  current_cycle_number: number;
};

export type FetchDailyQuizResult =
  | { ok: true; payload: DailyQuizPayload }
  | { ok: false; error: "not_authenticated" | "quiz_pool_too_small" | "unknown" };

export type SubmitQuizAnswerResult =
  | { ok: true; result: SubmitResult }
  | { ok: false; error: "not_authenticated" | "invalid_slot" | "invalid_choice" | "no_assignment_for_today" | "unknown" };

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  RecordLessonCompletionResult,
  StartTrackQuizResult,
  SubmitTrackQuizResult,
} from "@/lib/tracks/types";

type ActionError =
  | "not_authenticated"
  | "invalid_lesson"
  | "invalid_track"
  | "invalid_attempt"
  | "lesson_not_found"
  | "track_not_found"
  | "track_not_ready"
  | "no_questions_for_track"
  | "attempt_not_found"
  | "not_attempt_owner"
  | "attempt_already_completed"
  | "answer_count_mismatch"
  | "unknown";

export type CompleteLessonResult =
  | { ok: true; progress: RecordLessonCompletionResult }
  | { ok: false; error: ActionError };

export async function completeLessonAction(
  lessonId: string,
  answers: number[],
): Promise<CompleteLessonResult> {
  if (typeof lessonId !== "string" || lessonId.length === 0) {
    return { ok: false, error: "invalid_lesson" };
  }
  if (!Array.isArray(answers) || answers.some((a) => !Number.isInteger(a))) {
    return { ok: false, error: "invalid_lesson" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data, error } = await supabase.rpc("record_lesson_completion", {
    p_lesson_id: lessonId,
    p_answers: answers,
  });
  if (error) {
    return { ok: false, error: mapError(error.message) };
  }
  if (!data) return { ok: false, error: "unknown" };

  revalidatePath("/education");
  revalidatePath("/education/tracks");
  return { ok: true, progress: data as RecordLessonCompletionResult };
}

export type StartQuizResult =
  | { ok: true; payload: StartTrackQuizResult }
  | { ok: false; error: ActionError };

export async function startTrackQuizAction(
  trackId: string,
): Promise<StartQuizResult> {
  if (typeof trackId !== "string" || trackId.length === 0) {
    return { ok: false, error: "invalid_track" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data, error } = await supabase.rpc("start_track_quiz", {
    p_track_id: trackId,
  });
  if (error) {
    return { ok: false, error: mapError(error.message) };
  }
  if (!data) return { ok: false, error: "unknown" };
  return { ok: true, payload: data as StartTrackQuizResult };
}

export type SubmitQuizResult =
  | { ok: true; result: SubmitTrackQuizResult }
  | { ok: false; error: ActionError };

export async function submitTrackQuizAction(
  attemptId: string,
  answers: number[],
): Promise<SubmitQuizResult> {
  if (typeof attemptId !== "string" || attemptId.length === 0) {
    return { ok: false, error: "invalid_attempt" };
  }
  if (!Array.isArray(answers) || answers.some((a) => !Number.isInteger(a))) {
    return { ok: false, error: "answer_count_mismatch" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data, error } = await supabase.rpc("submit_track_quiz", {
    p_attempt_id: attemptId,
    p_answers: answers,
  });
  if (error) {
    return { ok: false, error: mapError(error.message) };
  }
  if (!data) return { ok: false, error: "unknown" };

  const result = data as SubmitTrackQuizResult;
  if (result.passed) {
    revalidatePath("/education");
    revalidatePath("/education/tracks");
    revalidatePath(`/education/tracks`);
  }
  return { ok: true, result };
}

function mapError(message: string | null | undefined): ActionError {
  const msg = message ?? "";
  if (msg.includes("not_authenticated")) return "not_authenticated";
  if (msg.includes("invalid_lesson")) return "invalid_lesson";
  if (msg.includes("invalid_track")) return "invalid_track";
  if (msg.includes("invalid_attempt")) return "invalid_attempt";
  if (msg.includes("lesson_not_found")) return "lesson_not_found";
  if (msg.includes("track_not_found")) return "track_not_found";
  if (msg.includes("track_not_ready")) return "track_not_ready";
  if (msg.includes("no_questions_for_track")) return "no_questions_for_track";
  if (msg.includes("attempt_not_found")) return "attempt_not_found";
  if (msg.includes("not_attempt_owner")) return "not_attempt_owner";
  if (msg.includes("attempt_already_completed")) return "attempt_already_completed";
  if (msg.includes("answer_count_mismatch")) return "answer_count_mismatch";
  console.warn("tracks action failed:", msg);
  return "unknown";
}

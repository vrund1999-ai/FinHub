"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  SubmitInput,
  SubmitQuizAnswerResult,
  SubmitResult,
} from "@/lib/quiz/types";

export async function submitQuizAnswer(
  input: SubmitInput,
): Promise<SubmitQuizAnswerResult> {
  if (
    !Number.isInteger(input.position) ||
    input.position < 1 ||
    input.position > 3
  ) {
    return { ok: false, error: "invalid_position" };
  }
  if (!Number.isInteger(input.chosenIndex) || input.chosenIndex < 0) {
    return { ok: false, error: "invalid_choice" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data, error } = await supabase.rpc("submit_quiz_answer", {
    p_position: input.position,
    p_chosen_index: input.chosenIndex,
  });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("not_authenticated")) return { ok: false, error: "not_authenticated" };
    if (msg.includes("invalid_position")) return { ok: false, error: "invalid_position" };
    if (msg.includes("invalid_choice")) return { ok: false, error: "invalid_choice" };
    if (msg.includes("no_assignment_for_today"))
      return { ok: false, error: "no_assignment_for_today" };
    console.warn("submitQuizAnswer failed:", msg);
    return { ok: false, error: "unknown" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { ok: false, error: "unknown" };

  const result = row as SubmitResult;
  if (result.day_completed) {
    revalidatePath("/education");
  }
  return { ok: true, result };
}

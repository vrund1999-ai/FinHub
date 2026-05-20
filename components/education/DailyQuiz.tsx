"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { submitQuizAnswer } from "@/app/education/quiz/actions";
import type {
  DailyQuizPayload,
  QuizQuestionForUser,
  SubmitResult,
} from "@/lib/quiz/types";

type RevealedQuestion = QuizQuestionForUser & { revealed: boolean };

function hydrate(payload: DailyQuizPayload): RevealedQuestion[] {
  return payload.questions
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((q) => ({ ...q, revealed: q.chosen_index !== null }));
}

function firstUnansweredIndex(questions: RevealedQuestion[]): number {
  const idx = questions.findIndex((q) => !q.revealed);
  return idx === -1 ? questions.length - 1 : idx;
}

export function DailyQuiz({ initial }: { initial: DailyQuizPayload }) {
  const [questions, setQuestions] = useState<RevealedQuestion[]>(() =>
    hydrate(initial),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    firstUnansweredIndex(hydrate(initial)),
  );
  const allAnswered = useMemo(
    () => questions.every((q) => q.revealed),
    [questions],
  );
  const [phase, setPhase] = useState<"answering" | "recap">(
    allAnswered ? "recap" : "answering",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = questions[currentIndex];
  const total = questions.length;
  const correctCount = useMemo(
    () => questions.filter((q) => q.is_correct === true).length,
    [questions],
  );

  function handleChoice(choiceIndex: number) {
    if (!current || current.revealed || isPending) return;
    setSubmitError(null);
    startTransition(async () => {
      const res = await submitQuizAnswer({
        position: current.position,
        chosenIndex: choiceIndex,
      });
      if (!res.ok) {
        setSubmitError(
          res.error === "not_authenticated"
            ? "Please log in to submit answers."
            : "Couldn’t save your answer. Try again.",
        );
        return;
      }
      applyResult(currentIndex, choiceIndex, res.result);
    });
  }

  function applyResult(
    qIndex: number,
    chosenIndex: number,
    result: SubmitResult,
  ) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              revealed: true,
              chosen_index: chosenIndex,
              is_correct: result.is_correct,
              correct_index: result.correct_index,
              explanation: result.explanation,
            }
          : q,
      ),
    );
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase("recap");
    }
  }

  if (phase === "recap" || allAnswered) {
    return (
      <RecapView correctCount={correctCount} total={total} />
    );
  }

  if (!current) {
    return (
      <DailyQuizShell>
        <p className="text-sm text-[var(--color-text-muted)]">
          No quiz available right now. Check back soon.
        </p>
      </DailyQuizShell>
    );
  }

  return (
    <DailyQuizShell>
      <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
        QUESTION {current.position} OF {total}
      </span>
      <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
        {current.prompt}
      </p>
      <div className="flex flex-col gap-2">
        {current.choices.map((choice, idx) => (
          <ChoiceButton
            key={`${current.question_id}-${idx}`}
            label={choice}
            disabled={current.revealed || isPending}
            state={resolveChoiceState(current, idx)}
            onClick={() => handleChoice(idx)}
          />
        ))}
      </div>

      {current.revealed && (
        <FeedbackBlock
          isCorrect={current.is_correct === true}
          explanation={current.explanation ?? ""}
          glossarySlug={current.glossary_slug}
        />
      )}

      {submitError && (
        <p className="text-xs text-[var(--color-danger)]">{submitError}</p>
      )}

      {current.revealed && (
        <button
          type="button"
          onClick={handleNext}
          className="self-end rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          {currentIndex < total - 1 ? "Next question" : "See results"}
        </button>
      )}
    </DailyQuizShell>
  );
}

function DailyQuizShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        DAILY QUIZ
      </h2>
      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        {children}
      </div>
    </section>
  );
}

type ChoiceState = "idle" | "correct" | "wrong" | "muted";

function resolveChoiceState(
  q: RevealedQuestion,
  choiceIdx: number,
): ChoiceState {
  if (!q.revealed) return "idle";
  if (q.correct_index === choiceIdx) return "correct";
  if (q.chosen_index === choiceIdx) return "wrong";
  return "muted";
}

function ChoiceButton({
  label,
  disabled,
  state,
  onClick,
}: {
  label: string;
  disabled: boolean;
  state: ChoiceState;
  onClick: () => void;
}) {
  const stateClass =
    state === "correct"
      ? "border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-text)]"
      : state === "wrong"
        ? "border-[var(--color-danger)] bg-[color-mix(in_srgb,var(--color-danger)_15%,transparent)] text-[var(--color-text)]"
        : state === "muted"
          ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] opacity-70"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-left text-xs transition-colors disabled:cursor-default ${stateClass}`}
    >
      {label}
    </button>
  );
}

function FeedbackBlock({
  isCorrect,
  explanation,
  glossarySlug,
}: {
  isCorrect: boolean;
  explanation: string;
  glossarySlug: string | null;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <span
        className="text-[10px] font-semibold tracking-[0.16em]"
        style={{
          color: isCorrect ? "var(--color-success)" : "var(--color-danger)",
        }}
      >
        {isCorrect ? "CORRECT" : "INCORRECT"}
      </span>
      <p className="text-xs leading-snug text-[var(--color-text-muted)]">
        {explanation}
      </p>
      {glossarySlug && (
        <Link
          href={`/education/glossary/${glossarySlug}`}
          className="text-[11px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Learn more →
        </Link>
      )}
    </div>
  );
}

function RecapView({
  correctCount,
  total,
}: {
  correctCount: number;
  total: number;
}) {
  const points = correctCount * 10;
  return (
    <DailyQuizShell>
      <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
        TODAY&apos;S RESULTS
      </span>
      <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
        You got <span className="tabular-nums">{correctCount}</span> of{" "}
        <span className="tabular-nums">{total}</span> correct.
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">
        +{points} points earned today. Come back tomorrow for 3 new questions.
      </p>
    </DailyQuizShell>
  );
}

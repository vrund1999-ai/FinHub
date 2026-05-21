"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { completeLessonAction } from "@/app/education/tracks/actions";
import type { LessonQuestion } from "@/lib/tracks/types";

type Phase = "answering" | "recap";

export function LessonMiniQuiz({
  lessonId,
  questions,
  isAuthed,
  nextLessonHref,
  trackHref,
  initiallyCompleted,
}: {
  lessonId: string;
  questions: LessonQuestion[];
  isAuthed: boolean;
  nextLessonHref: string | null;
  trackHref: string;
  initiallyCompleted: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    questions.map(() => false),
  );
  const [phase, setPhase] = useState<Phase>(initiallyCompleted ? "recap" : "answering");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [isPending, startTransition] = useTransition();

  const total = questions.length;
  const current = questions[currentIdx];
  const correctCount = chosen.filter(
    (c, i) => c !== null && c === questions[i]?.correct_index,
  ).length;

  function handleChoice(idx: number) {
    if (revealed[currentIdx]) return;
    setChosen((prev) => {
      const next = prev.slice();
      next[currentIdx] = idx;
      return next;
    });
    setRevealed((prev) => {
      const next = prev.slice();
      next[currentIdx] = true;
      return next;
    });
  }

  function handleNext() {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
      return;
    }
    if (!isAuthed) {
      setPhase("recap");
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      const answers = chosen.map((c) => (c === null ? -1 : c));
      const res = await completeLessonAction(lessonId, answers);
      if (!res.ok) {
        setSubmitError(
          res.error === "not_authenticated"
            ? "Please sign in to save your progress."
            : "Couldn't save your progress. Try again.",
        );
        return;
      }
      setCompleted(true);
      setPhase("recap");
    });
  }

  if (total === 0) {
    return (
      <Shell>
        <p className="text-xs text-[var(--color-text-muted)]">
          No mini-quiz for this lesson — head to the next lesson when you're ready.
        </p>
        {isAuthed && !completed && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const res = await completeLessonAction(lessonId, []);
                if (res.ok) setCompleted(true);
              });
            }}
            className="self-start rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          >
            Mark as complete
          </button>
        )}
      </Shell>
    );
  }

  if (phase === "recap") {
    return (
      <Shell>
        <div className="flex items-start gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <CheckCircle2 size={20} className="shrink-0 text-[var(--color-success)]" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {completed ? "Lesson complete" : "Mini-quiz done"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              You got <strong className="text-[var(--color-text)]">{correctCount}</strong> of{" "}
              <strong className="text-[var(--color-text)]">{total}</strong> correct.
              {!isAuthed && " Sign in to save your progress."}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {nextLessonHref ? (
            <Link
              href={nextLessonHref}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
            >
              Next lesson <ArrowRight size={12} />
            </Link>
          ) : (
            <Link
              href={trackHref}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
            >
              Back to track overview <ArrowRight size={12} />
            </Link>
          )}
          <Link
            href={trackHref}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
          >
            View track overview
          </Link>
        </div>
      </Shell>
    );
  }

  if (!current) return null;
  const isRevealed = revealed[currentIdx];
  const chosenIdx = chosen[currentIdx];

  return (
    <Shell>
      <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
        CHECK YOUR UNDERSTANDING — {currentIdx + 1} OF {total}
      </span>
      <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
        {current.prompt}
      </p>
      <div className="flex flex-col gap-2">
        {current.choices.map((choice, idx) => (
          <ChoiceButton
            key={`${current.id}-${idx}`}
            label={choice}
            disabled={isRevealed}
            state={resolveState(isRevealed, chosenIdx, current.correct_index, idx)}
            onClick={() => handleChoice(idx)}
          />
        ))}
      </div>
      {isRevealed && (
        <FeedbackBlock
          isCorrect={chosenIdx === current.correct_index}
          explanation={current.explanation}
        />
      )}
      {submitError && (
        <p className="text-xs text-[var(--color-danger)]">{submitError}</p>
      )}
      {isRevealed && (
        <button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="self-end rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {currentIdx < total - 1
            ? "Next question"
            : isPending
            ? "Saving…"
            : "Finish lesson"}
        </button>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        MINI-QUIZ
      </h2>
      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        {children}
      </div>
    </section>
  );
}

type ChoiceState = "idle" | "correct" | "wrong" | "muted";

function resolveState(
  revealed: boolean,
  chosen: number | null,
  correct: number,
  idx: number,
): ChoiceState {
  if (!revealed) return "idle";
  if (correct === idx) return "correct";
  if (chosen === idx) return "wrong";
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
}: {
  isCorrect: boolean;
  explanation: string;
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
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle, RotateCw } from "lucide-react";
import {
  startTrackQuizAction,
  submitTrackQuizAction,
} from "@/app/education/tracks/actions";
import type {
  StartTrackQuizResult,
  SubmitTrackQuizResult,
  TrackQuizQuestionForUser,
} from "@/lib/tracks/types";

type Phase = "answering" | "submitting" | "recap";

export function TrackFinalQuiz({
  trackId,
  trackTitle,
  trackHref,
  initialAttempt,
}: {
  trackId: string;
  trackTitle: string;
  trackHref: string;
  initialAttempt: StartTrackQuizResult;
}) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<StartTrackQuizResult>(initialAttempt);
  const [questions, setQuestions] = useState<TrackQuizQuestionForUser[]>(
    () => initialAttempt.questions,
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() =>
    initialAttempt.questions.map(() => null),
  );
  const [phase, setPhase] = useState<Phase>("answering");
  const [result, setResult] = useState<SubmitTrackQuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = questions.length;
  const current = questions[currentIdx];
  const currentChoice = chosen[currentIdx];
  const allAnswered = chosen.every((c) => c !== null);

  function handleChoice(idx: number) {
    setChosen((prev) => {
      const next = prev.slice();
      next[currentIdx] = idx;
      return next;
    });
  }

  function handleNext() {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }

  function handlePrev() {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setError(null);
    setPhase("submitting");
    startTransition(async () => {
      const answers = chosen.map((c) => (c === null ? 0 : c));
      const res = await submitTrackQuizAction(attempt.attempt_id, answers);
      if (!res.ok) {
        setPhase("answering");
        setError(submitErrorMessage(res.error));
        return;
      }
      setResult(res.result);
      setPhase("recap");
    });
  }

  function handleRetake() {
    setError(null);
    setPhase("submitting");
    startTransition(async () => {
      const res = await startTrackQuizAction(trackId);
      if (!res.ok) {
        setError(submitErrorMessage(res.error));
        setPhase("recap");
        return;
      }
      setAttempt(res.payload);
      setQuestions(res.payload.questions);
      setChosen(res.payload.questions.map(() => null));
      setCurrentIdx(0);
      setResult(null);
      setPhase("answering");
    });
  }

  if (phase === "recap" && result) {
    return (
      <QuizRecap
        result={result}
        questions={questions}
        trackTitle={trackTitle}
        trackHref={trackHref}
        onRetake={handleRetake}
        onBackToTrack={() => router.push(trackHref)}
        isPending={isPending}
        error={error}
      />
    );
  }

  if (!current) {
    return (
      <Shell trackTitle={trackTitle}>
        <p className="text-sm text-[var(--color-text-muted)]">
          No questions available for this track yet.
        </p>
      </Shell>
    );
  }

  return (
    <Shell trackTitle={trackTitle}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
          QUESTION {currentIdx + 1} OF {total}
        </span>
        <span className="text-[10px] tracking-[0.16em] text-[var(--color-text-muted)]">
          {chosen.filter((c) => c !== null).length} of {total} answered
        </span>
      </div>
      <p className="text-base font-medium leading-snug text-[var(--color-text)]">
        {current.prompt}
      </p>
      <div className="flex flex-col gap-2">
        {current.choices.map((choice, idx) => {
          const isChosen = currentChoice === idx;
          return (
            <button
              key={`${current.question_id}-${idx}`}
              type="button"
              onClick={() => handleChoice(idx)}
              disabled={isPending}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                isChosen
                  ? "border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0 || isPending}
          className="rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-xs text-[var(--color-text)] transition hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        {currentIdx < total - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isPending}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Next question
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || isPending || phase === "submitting"}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {phase === "submitting" ? "Submitting…" : "Submit quiz"}
          </button>
        )}
      </div>
    </Shell>
  );
}

function Shell({
  trackTitle,
  children,
}: {
  trackTitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {trackTitle} — Final Quiz
        </span>
        <p className="text-xs text-[var(--color-text-muted)]">
          Pass at 70% or higher to mark the track complete. You can navigate
          backward to change answers before submitting.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
        {children}
      </div>
    </section>
  );
}

function QuizRecap({
  result,
  questions,
  trackTitle,
  trackHref,
  onRetake,
  onBackToTrack,
  isPending,
  error,
}: {
  result: SubmitTrackQuizResult;
  questions: TrackQuizQuestionForUser[];
  trackTitle: string;
  trackHref: string;
  onRetake: () => void;
  onBackToTrack: () => void;
  isPending: boolean;
  error: string | null;
}) {
  const pct = Math.round((result.score / result.total_questions) * 100);
  const promptById = new Map(questions.map((q) => [q.question_id, q]));
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {trackTitle} — Final Quiz
        </span>
      </div>
      <div
        className="flex flex-col gap-2 rounded-md border p-5"
        style={{
          borderColor: result.passed ? "var(--color-success)" : "var(--color-danger)",
          backgroundColor: result.passed
            ? "color-mix(in srgb, var(--color-success) 12%, transparent)"
            : "color-mix(in srgb, var(--color-danger) 12%, transparent)",
        }}
      >
        <span
          className="text-[10px] font-semibold tracking-[0.16em]"
          style={{
            color: result.passed ? "var(--color-success)" : "var(--color-danger)",
          }}
        >
          {result.passed ? "PASSED" : "DID NOT PASS"}
        </span>
        <p className="text-lg font-semibold text-[var(--color-text)]">
          {result.score} / {result.total_questions} ({pct}%)
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {result.passed
            ? "Great work — you've completed this track."
            : `You need 70% (${Math.ceil(result.total_questions * 0.7)} correct) to pass. Review the explanations below and retake when ready.`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          QUESTION REVIEW
        </h2>
        <ol className="flex flex-col gap-3">
          {result.results.map((r) => {
            const prompt =
              r.prompt || promptById.get(r.question_id)?.prompt || "";
            const choices =
              r.choices && r.choices.length > 0
                ? r.choices
                : promptById.get(r.question_id)?.choices ?? [];
            return (
              <li
                key={r.question_id}
                className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4"
              >
                <div className="flex items-start gap-2">
                  {r.is_correct ? (
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[var(--color-success)]"
                    />
                  ) : (
                    <XCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-[var(--color-danger)]"
                    />
                  )}
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {r.position}. {prompt}
                  </p>
                </div>
                <div className="ml-6 flex flex-col gap-1">
                  {choices.map((c, i) => {
                    const isCorrect = i === r.correct_index;
                    const isChosen = i === r.chosen_index;
                    let style: React.CSSProperties = {};
                    let label = "";
                    if (isCorrect) {
                      style = { color: "var(--color-success)" };
                      label = " · correct answer";
                    } else if (isChosen) {
                      style = { color: "var(--color-danger)" };
                      label = " · your answer";
                    } else {
                      style = { color: "var(--color-text-muted)" };
                    }
                    return (
                      <span
                        key={i}
                        className="text-xs"
                        style={style}
                      >
                        {c}
                        {label}
                      </span>
                    );
                  })}
                </div>
                <p className="ml-6 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {r.explanation}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRetake}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <RotateCw size={12} />
          {isPending ? "Loading…" : "Retake quiz"}
        </button>
        <button
          type="button"
          onClick={onBackToTrack}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-strong)] px-4 py-2 text-xs text-[var(--color-text)] transition hover:border-[var(--color-accent)]"
        >
          Back to track <ArrowRight size={12} />
        </button>
        <Link
          href="/education/tracks"
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          All tracks
        </Link>
      </div>
    </section>
  );
}

function submitErrorMessage(
  code: string,
): string {
  if (code === "not_authenticated") return "Please sign in to submit your quiz.";
  if (code === "track_not_ready")
    return "Complete every lesson in the track before taking the final quiz.";
  if (code === "attempt_already_completed")
    return "This attempt has already been submitted. Start a new one to try again.";
  if (code === "answer_count_mismatch") return "Please answer every question first.";
  return "Couldn't submit the quiz. Try again.";
}

import type { QuizQuestion } from "./data";

export function DailyQuiz({ quiz }: { quiz: QuizQuestion }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        DAILY QUIZ
      </h2>
      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
          QUESTION {quiz.questionNumber} OF {quiz.totalQuestions}
        </span>
        <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
          {quiz.prompt}
        </p>
        <div className="flex flex-col gap-2">
          {quiz.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-xs text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

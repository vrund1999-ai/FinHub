import Link from "next/link";
import {
  TrendingUp,
  BarChart2,
  Landmark,
  Layers,
  PiggyBank,
  Wallet,
  Bitcoin,
  Receipt,
  LineChart,
  ShieldCheck,
  Briefcase,
  Brain,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LearningTrack, TrackLesson, UserTrackProgress } from "@/lib/tracks/types";
import type { TrackIconName } from "@/lib/tracks/categories";
import { DifficultyBadge } from "../DifficultyBadge";
import { ProgressBar } from "../ProgressBar";

const iconMap: Record<
  TrackIconName,
  ComponentType<{ size?: number; className?: string }>
> = {
  TrendingUp,
  BarChart2,
  Landmark,
  Layers,
  PiggyBank,
  Wallet,
  Bitcoin,
  Receipt,
  LineChart,
  ShieldCheck,
  Briefcase,
  Brain,
};

export function TrackOverview({
  track,
  lessons,
  completedLessonIds,
  progress,
  isAuthed,
}: {
  track: LearningTrack;
  lessons: TrackLesson[];
  completedLessonIds: Set<string>;
  progress: UserTrackProgress | null;
  isAuthed: boolean;
}) {
  const Icon = iconMap[track.icon_name] ?? TrendingUp;
  const pct =
    progress && progress.total_lessons > 0
      ? Math.round(
          (progress.lessons_completed_count / progress.total_lessons) * 100,
        )
      : 0;
  const allComplete = lessons.length > 0 && lessons.every((l) => completedLessonIds.has(l.id));
  const isCompleted = !!progress?.completed_at;
  const firstIncomplete = lessons.find((l) => !completedLessonIds.has(l.id));
  const resumeLesson = firstIncomplete ?? lessons[0];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md"
              style={{
                backgroundColor: `color-mix(in srgb, ${track.accent_color} 18%, transparent)`,
                color: track.accent_color,
              }}
            >
              <Icon size={28} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {track.category}
              </span>
              <h1
                className="text-2xl font-semibold text-[var(--color-text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {track.title}
              </h1>
              <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
                {track.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DifficultyBadge difficulty={track.difficulty} />
            {isCompleted && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-success) 18%, transparent)",
                  color: "var(--color-success)",
                }}
              >
                <CheckCircle2 size={12} /> Completed
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span>{track.lesson_count} lessons</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {track.est_minutes} min
            </span>
            {progress && (
              <span>
                {progress.lessons_completed_count} of {progress.total_lessons} complete
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ProgressBar pct={pct} color={track.accent_color} />
            {resumeLesson && (
              <Link
                href={`/education/tracks/${track.slug}/${resumeLesson.slug}`}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
              >
                {progress && progress.lessons_completed_count > 0 ? "Resume" : "Start track"}
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          LESSONS
        </h2>
        <ol className="flex flex-col gap-2">
          {lessons.map((lesson) => {
            const done = completedLessonIds.has(lesson.id);
            return (
              <li key={lesson.id}>
                <Link
                  href={`/education/tracks/${track.slug}/${lesson.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-accent)]"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: done
                        ? "color-mix(in srgb, var(--color-success) 18%, transparent)"
                        : "var(--color-surface-2)",
                      color: done ? "var(--color-success)" : "var(--color-text-muted)",
                    }}
                  >
                    {done ? <CheckCircle2 size={16} /> : lesson.position}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                      {lesson.title}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {lesson.summary}
                    </span>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Clock size={12} /> {lesson.est_minutes} min
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <FinalQuizCta
        track={track}
        allComplete={allComplete}
        isAuthed={isAuthed}
        isCompleted={isCompleted}
        bestScore={progress?.best_quiz_score ?? null}
        bestTotal={progress?.best_quiz_total ?? null}
      />
    </div>
  );
}

function FinalQuizCta({
  track,
  allComplete,
  isAuthed,
  isCompleted,
  bestScore,
  bestTotal,
}: {
  track: LearningTrack;
  allComplete: boolean;
  isAuthed: boolean;
  isCompleted: boolean;
  bestScore: number | null;
  bestTotal: number | null;
}) {
  const canTake = isAuthed && allComplete;
  return (
    <section
      className="flex flex-col gap-3 rounded-lg border p-6"
      style={{
        borderColor: canTake ? track.accent_color : "var(--color-border)",
        backgroundColor: canTake
          ? `color-mix(in srgb, ${track.accent_color} 6%, var(--color-surface))`
          : "var(--color-surface)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Final quiz
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            10–15 questions drawn from across the track. Pass at 70% or higher to
            mark the track complete. You can retake as many times as you like.
          </p>
          {bestScore !== null && bestTotal !== null && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Best score: <strong className="text-[var(--color-text)]">{bestScore}/{bestTotal}</strong>
              {isCompleted && " · Passed"}
            </p>
          )}
        </div>
        {canTake ? (
          <Link
            href={`/education/tracks/${track.slug}/quiz`}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
          >
            <PlayCircle size={14} />
            {isCompleted ? "Retake quiz" : "Take final quiz"}
          </Link>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)]">
            <Lock size={14} />
            {isAuthed ? "Complete all lessons to unlock" : "Sign in to take the quiz"}
          </span>
        )}
      </div>
    </section>
  );
}

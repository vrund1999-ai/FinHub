import { ExternalLink, FileText, BookOpen, PlayCircle, Clock } from "lucide-react";
import type {
  LessonQuestion,
  LessonResource,
  TrackLesson,
} from "@/lib/tracks/types";
import { LessonMiniQuiz } from "./LessonMiniQuiz";

export function LessonPlayer({
  lesson,
  resources,
  questions,
  isAuthed,
  nextLessonHref,
  trackHref,
  initiallyCompleted,
}: {
  lesson: TrackLesson;
  resources: LessonResource[];
  questions: LessonQuestion[];
  isAuthed: boolean;
  nextLessonHref: string | null;
  trackHref: string;
  initiallyCompleted: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          LESSON {lesson.position}
        </span>
        <h1
          className="text-2xl font-semibold text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lesson.title}
        </h1>
        <p className="max-w-3xl text-sm text-[var(--color-text-muted)]">
          {lesson.summary}
        </p>
        <span className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Clock size={12} /> {lesson.est_minutes} min
        </span>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          RESOURCES
        </h2>
        <div className="flex flex-col gap-4">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      <LessonMiniQuiz
        lessonId={lesson.id}
        questions={questions}
        isAuthed={isAuthed}
        nextLessonHref={nextLessonHref}
        trackHref={trackHref}
        initiallyCompleted={initiallyCompleted}
      />
    </div>
  );
}

function ResourceCard({ resource }: { resource: LessonResource }) {
  if (resource.kind === "video" && resource.embed_mode === "embed" && resource.youtube_video_id) {
    return <EmbeddedVideoCard resource={resource} />;
  }
  return <LinkedResourceCard resource={resource} />;
}

function EmbeddedVideoCard({ resource }: { resource: LessonResource }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${resource.youtube_video_id}`}
          title={resource.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <ResourceMeta resource={resource} />
    </article>
  );
}

function LinkedResourceCard({ resource }: { resource: LessonResource }) {
  const Icon = iconForKind(resource.kind);
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-accent)]"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-text-muted)",
        }}
      >
        <Icon size={18} />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {kindLabel(resource.kind)}
        </span>
        <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
            {resource.description}
          </p>
        )}
        <SourceLine resource={resource} />
      </div>
      <ExternalLink
        size={14}
        className="mt-1 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]"
      />
    </a>
  );
}

function ResourceMeta({ resource }: { resource: LessonResource }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {resource.description}
        </p>
      )}
      <SourceLine resource={resource} />
    </div>
  );
}

function SourceLine({ resource }: { resource: LessonResource }) {
  const parts = [resource.source];
  if (resource.author) parts.push(resource.author);
  parts.push(`${resource.read_or_watch_minutes} min`);
  const text = parts.join(" · ");
  const italic = resource.kind === "publication";
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`text-[11px] text-[var(--color-text-muted)] ${italic ? "italic" : ""}`}
      >
        {text}
      </span>
      {resource.attribution_note && (
        <span className="text-[11px] italic text-[var(--color-text-muted)]">
          {resource.attribution_note}
        </span>
      )}
    </div>
  );
}

function iconForKind(kind: LessonResource["kind"]) {
  if (kind === "video") return PlayCircle;
  if (kind === "publication") return BookOpen;
  return FileText;
}

function kindLabel(kind: LessonResource["kind"]): string {
  if (kind === "video") return "Video";
  if (kind === "publication") return "Publication";
  return "Article";
}

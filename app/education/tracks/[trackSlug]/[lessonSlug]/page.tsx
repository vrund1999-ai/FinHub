import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { LessonPlayer } from "@/components/education/tracks/LessonPlayer";
import {
  fetchLessonBySlug,
  fetchUserLessonCompletions,
} from "@/lib/tracks/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ trackSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { trackSlug, lessonSlug } = await params;
  const data = await fetchLessonBySlug(trackSlug, lessonSlug);
  if (!data) return { title: "Lesson not found · FinHub" };
  return {
    title: `${data.lesson.title} · ${data.track.title} · FinHub`,
    description: data.lesson.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { trackSlug, lessonSlug } = await params;
  const data = await fetchLessonBySlug(trackSlug, lessonSlug);
  if (!data) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const completedIds = await fetchUserLessonCompletions([data.lesson.id]);
  const initiallyCompleted = completedIds.includes(data.lesson.id);

  const nextHref = data.nextLesson
    ? `/education/tracks/${data.track.slug}/${data.nextLesson.slug}`
    : null;
  const trackHref = `/education/tracks/${data.track.slug}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col gap-6 px-6 py-6">
        <Link
          href={trackHref}
          className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          <ChevronLeft size={14} /> {data.track.title}
        </Link>
        <LessonPlayer
          lesson={data.lesson}
          resources={data.resources}
          questions={data.questions}
          isAuthed={!!user}
          nextLessonHref={nextHref}
          trackHref={trackHref}
          initiallyCompleted={initiallyCompleted}
        />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}

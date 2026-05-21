import { createStaticClient } from "@/lib/supabase/static";
import { createClient } from "@/lib/supabase/server";
import type {
  LearningTrack,
  LessonNeighbor,
  LessonQuestion,
  LessonResource,
  TrackLesson,
  TrackQuizQuestionForUser,
  UserTrackProgress,
} from "./types";

const TRACK_COLUMNS =
  "id, slug, title, description, category, difficulty, lesson_count, est_minutes, icon_name, accent_color, is_featured, featured_rank, is_published";

const LESSON_COLUMNS =
  "id, track_id, position, slug, title, summary, est_minutes";

const RESOURCE_COLUMNS =
  "id, lesson_id, position, kind, title, url, source, author, description, embed_mode, read_or_watch_minutes, attribution_note, youtube_video_id";

const LESSON_QUESTION_COLUMNS =
  "id, lesson_id, position, prompt, choices, correct_index, explanation";

export async function fetchFeaturedTracks(limit = 4): Promise<LearningTrack[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("learning_tracks")
    .select(TRACK_COLUMNS)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("featured_rank", { ascending: true })
    .limit(limit);
  if (error) {
    console.warn("fetchFeaturedTracks failed:", error.message);
    return [];
  }
  return (data ?? []) as LearningTrack[];
}

export async function fetchAllTracks(): Promise<LearningTrack[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("learning_tracks")
    .select(TRACK_COLUMNS)
    .eq("is_published", true)
    .order("category", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LearningTrack[];
}

export async function fetchTrackBySlug(
  slug: string,
): Promise<{ track: LearningTrack; lessons: TrackLesson[] } | null> {
  const supabase = createStaticClient();
  const { data: track, error: trackError } = await supabase
    .from("learning_tracks")
    .select(TRACK_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (trackError) throw trackError;
  if (!track) return null;

  const { data: lessons, error: lessonsError } = await supabase
    .from("track_lessons")
    .select(LESSON_COLUMNS)
    .eq("track_id", (track as LearningTrack).id)
    .order("position", { ascending: true });
  if (lessonsError) throw lessonsError;

  return {
    track: track as LearningTrack,
    lessons: (lessons ?? []) as TrackLesson[],
  };
}

export async function fetchLessonBySlug(
  trackSlug: string,
  lessonSlug: string,
): Promise<{
  track: LearningTrack;
  lesson: TrackLesson;
  resources: LessonResource[];
  questions: LessonQuestion[];
  prevLesson: LessonNeighbor | null;
  nextLesson: LessonNeighbor | null;
} | null> {
  const supabase = createStaticClient();
  const { data: track, error: trackError } = await supabase
    .from("learning_tracks")
    .select(TRACK_COLUMNS)
    .eq("slug", trackSlug)
    .eq("is_published", true)
    .maybeSingle();
  if (trackError) throw trackError;
  if (!track) return null;

  const { data: allLessons, error: lessonsError } = await supabase
    .from("track_lessons")
    .select(LESSON_COLUMNS)
    .eq("track_id", (track as LearningTrack).id)
    .order("position", { ascending: true });
  if (lessonsError) throw lessonsError;

  const lessons = (allLessons ?? []) as TrackLesson[];
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;

  const [resourcesRes, questionsRes] = await Promise.all([
    supabase
      .from("lesson_resources")
      .select(RESOURCE_COLUMNS)
      .eq("lesson_id", lesson.id)
      .order("position", { ascending: true }),
    supabase
      .from("lesson_questions")
      .select(LESSON_QUESTION_COLUMNS)
      .eq("lesson_id", lesson.id)
      .order("position", { ascending: true }),
  ]);
  if (resourcesRes.error) throw resourcesRes.error;
  if (questionsRes.error) throw questionsRes.error;

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return {
    track: track as LearningTrack,
    lesson,
    resources: (resourcesRes.data ?? []) as LessonResource[],
    questions: (questionsRes.data ?? []) as LessonQuestion[],
    prevLesson: prev
      ? { slug: prev.slug, title: prev.title, position: prev.position }
      : null,
    nextLesson: next
      ? { slug: next.slug, title: next.title, position: next.position }
      : null,
  };
}

export async function fetchUserTrackProgress(): Promise<UserTrackProgress[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.rpc("get_track_progress");
  if (error) {
    console.warn("fetchUserTrackProgress failed:", error.message);
    return [];
  }
  return (data ?? []) as UserTrackProgress[];
}

export async function fetchUserLessonCompletions(
  lessonIds: string[],
): Promise<string[]> {
  if (lessonIds.length === 0) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("user_lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds);
  if (error) {
    console.warn("fetchUserLessonCompletions failed:", error.message);
    return [];
  }
  return (data ?? []).map((r) => (r as { lesson_id: string }).lesson_id);
}

export async function fetchTrackQuizQuestionsForAttempt(
  attemptId: string,
): Promise<TrackQuizQuestionForUser[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: attempt, error: attemptErr } = await supabase
    .from("user_track_quiz_attempts")
    .select("id, user_id, question_ids, completed_at")
    .eq("id", attemptId)
    .maybeSingle();
  if (attemptErr || !attempt) return null;
  if ((attempt as { user_id: string }).user_id !== user.id) return null;
  if ((attempt as { completed_at: string | null }).completed_at !== null) {
    return null;
  }

  const ids = (attempt as { question_ids: string[] }).question_ids;
  const { data: questions, error: qErr } = await supabase
    .from("track_quiz_questions")
    .select("id, prompt, choices")
    .in("id", ids);
  if (qErr || !questions) return null;

  const byId = new Map(
    (questions as { id: string; prompt: string; choices: string[] }[]).map(
      (q) => [q.id, q],
    ),
  );
  return ids
    .map((id, i) => {
      const q = byId.get(id);
      if (!q) return null;
      return {
        position: i + 1,
        question_id: q.id,
        prompt: q.prompt,
        choices: q.choices,
      };
    })
    .filter((x): x is TrackQuizQuestionForUser => x !== null);
}

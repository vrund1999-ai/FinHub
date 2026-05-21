import type {
  TrackCategory,
  TrackDifficulty,
  TrackIconName,
} from "./categories";

export type LearningTrack = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TrackCategory;
  difficulty: TrackDifficulty;
  lesson_count: number;
  est_minutes: number;
  icon_name: TrackIconName;
  accent_color: string;
  is_featured: boolean;
  featured_rank: number | null;
  is_published: boolean;
};

export type TrackLesson = {
  id: string;
  track_id: string;
  position: number;
  slug: string;
  title: string;
  summary: string;
  est_minutes: number;
};

export type LessonResourceKind = "video" | "article" | "publication";
export type LessonResourceEmbedMode = "embed" | "link";

export type LessonResource = {
  id: string;
  lesson_id: string;
  position: number;
  kind: LessonResourceKind;
  title: string;
  url: string;
  source: string;
  author: string | null;
  description: string | null;
  embed_mode: LessonResourceEmbedMode;
  read_or_watch_minutes: number;
  attribution_note: string | null;
  youtube_video_id: string | null;
};

// Mini-quiz reveals the answer client-side immediately, so the question
// payload ships with correct_index/explanation — no RPC round-trip needed.
export type LessonQuestion = {
  id: string;
  lesson_id: string;
  position: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation: string;
};

// Final-quiz payload returned by start_track_quiz — answer + explanation are
// withheld until submit_track_quiz reveals them.
export type TrackQuizQuestionForUser = {
  position: number;
  question_id: string;
  prompt: string;
  choices: string[];
};

export type TrackQuizResultRow = {
  position: number;
  question_id: string;
  prompt: string;
  choices: string[];
  chosen_index: number;
  correct_index: number;
  is_correct: boolean;
  explanation: string;
};

export type StartTrackQuizResult = {
  attempt_id: string;
  track_id: string;
  total_questions: number;
  cycle_number: number;
  questions: TrackQuizQuestionForUser[];
};

export type SubmitTrackQuizResult = {
  attempt_id: string;
  track_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  pass_threshold: number;
  results: TrackQuizResultRow[];
};

export type UserTrackProgress = {
  track_id: string;
  lessons_completed_count: number;
  total_lessons: number;
  last_active_at: string;
  completed_at: string | null;
  best_quiz_score: number | null;
  best_quiz_total: number | null;
};

export type RecordLessonCompletionResult = {
  lesson_id: string;
  track_id: string;
  last_score: number;
  total_qs: number;
  completed_at: string;
  lessons_completed_count: number;
  total_lessons: number;
  track_completed_at: string | null;
};

export type LessonNeighbor = { slug: string; title: string; position: number };

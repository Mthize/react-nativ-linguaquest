import type {
  AITeacherPrompt,
  Language,
  Lesson,
  LessonGoal,
  Phrase,
  VocabularyItem,
} from "@/types/learning";

export const STREAM_AUDIO_CALL_TYPE = "audio_room";
export const VISION_AGENT_USER_ID = "linguaquest-teacher";
export const VISION_AGENT_CALL_MEMBER_ROLE = "admin";

export type LessonAudioCallPhase =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "ended"
  | "error";

export type LessonAudioAgentConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed";

export type LessonAudioSessionRequest = {
  lessonId: Lesson["id"];
  languageCode?: Language["code"];
  userImageUrl?: string | null;
  userName?: string | null;
};

export type LessonAudioCallCustomData = {
  languageCode: Language["code"];
  languageName: Language["name"];
  lessonDescription: Lesson["description"];
  lessonGoals: LessonGoal[];
  lessonId: Lesson["id"];
  lessonPhrases: Phrase[];
  lessonTitle: Lesson["title"];
  lessonVocabulary: VocabularyItem[];
  teacherName: string;
  teacherPrompt: AITeacherPrompt;
};

export type LessonAudioSessionResponse = {
  apiKey: string;
  callCid: string;
  callId: string;
  callType: string;
  created: boolean;
  createdAt: string;
  languageCode: Language["code"];
  languageName: Language["name"];
  lessonId: Lesson["id"];
  lessonTitle: Lesson["title"];
  teacherName: string;
  token: string;
  user: {
    id: string;
    image?: string | null;
    name: string;
  };
};

export type LessonAudioAgentSessionRequest = {
  callId: string;
  callType: string;
};

export type LessonAudioAgentSessionResponse = {
  callId: string;
  callType: string;
  sessionId: string;
  sessionStartedAt: string;
};

export function getTeacherName(systemPrompt: string) {
  const match = systemPrompt.match(/You're\s+([^,]+),/i);

  return match?.[1]?.trim() ?? "AI Teacher";
}

export function createLessonAudioCallId(
  lessonId: Lesson["id"],
  languageCode: Language["code"],
  clerkUserId: string,
) {
  return [
    "lesson",
    sanitizeIdPart(languageCode),
    sanitizeIdPart(lessonId),
    sanitizeIdPart(clerkUserId).slice(-8),
    Date.now().toString(36),
  ].join("-");
}

function sanitizeIdPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

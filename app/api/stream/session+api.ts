import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import {
  createLessonAudioCallId,
  getTeacherName,
  STREAM_AUDIO_CALL_TYPE,
  type LessonAudioCallCustomData,
  type LessonAudioSessionRequest,
  VISION_AGENT_CALL_MEMBER_ROLE,
  VISION_AGENT_USER_ID,
} from "@/lib/lesson-audio";
import {
  createStreamServerClient,
  verifyClerkRequestUserId,
} from "@/lib/stream-server";
import type { Language } from "@/types/learning";

const LESSON_CAPTIONS_SETTINGS = {
  language: "auto",
  speech_segment_config: {
    max_speech_caption_ms: 1800,
    silence_duration_ms: 400,
  },
} as const;

export async function POST(request: Request) {
  try {
    const clerkUserId = await verifyClerkRequestUserId(request);
    const body = (await request.json()) as LessonAudioSessionRequest;

    if (!body?.lessonId) {
      return Response.json(
        { error: "Missing lessonId for the audio lesson session." },
        { status: 400 },
      );
    }

    const lesson = LESSONS.find((entry) => entry.id === body.lessonId);

    if (!lesson) {
      return Response.json(
        { error: "The selected lesson could not be found." },
        { status: 404 },
      );
    }

    const unit = UNITS.find((entry) => entry.id === lesson.unitId);
    const language = unit
      ? LANGUAGES.find((entry) => entry.code === unit.languageCode)
      : null;

    if (!unit || !language) {
      return Response.json(
        { error: "The selected lesson is missing its language context." },
        { status: 500 },
      );
    }

    if (body.languageCode && body.languageCode !== language.code) {
      return Response.json(
        { error: "The selected lesson does not match the requested language." },
        { status: 400 },
      );
    }

    const teacherName = getTeacherName(lesson.aiTeacherPrompt.systemPrompt);
    const streamClient = createStreamServerClient();
    const callId = createLessonAudioCallId(lesson.id, language.code, clerkUserId);
    const call = streamClient.video.call(STREAM_AUDIO_CALL_TYPE, callId);
    const custom = buildLessonCustomData({
      languageCode: language.code,
      languageName: language.name,
      lesson,
      teacherName,
    });

    const createdCall = await call.getOrCreate({
      data: {
        created_by_id: clerkUserId,
        custom,
        members: [
          { user_id: clerkUserId },
          { role: VISION_AGENT_CALL_MEMBER_ROLE, user_id: VISION_AGENT_USER_ID },
        ],
        settings_override: {
          transcription: {
            closed_caption_mode: "available",
            ...LESSON_CAPTIONS_SETTINGS,
          },
        },
        video: false,
      },
      video: false,
    });

    await call.update({ custom });
    await call.updateCallMembers({
      update_members: [
        { user_id: clerkUserId },
        { role: VISION_AGENT_CALL_MEMBER_ROLE, user_id: VISION_AGENT_USER_ID },
      ],
    });

    if (createdCall.call.backstage) {
      await call.goLive();
    }

    const captions = await startLessonCaptions(call);

    const token = streamClient.generateUserToken({ user_id: clerkUserId });

    return Response.json({
      apiKey: process.env.STREAM_API_KEY,
      callCid: createdCall.call.cid,
      callId,
      callType: STREAM_AUDIO_CALL_TYPE,
      captionsEnabled: captions.enabled,
      captionsError: captions.error,
      created: createdCall.created,
      createdAt: createdCall.call.created_at.toISOString(),
      languageCode: language.code,
      languageName: language.name,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      teacherName,
      token,
      user: {
        id: clerkUserId,
        image: body.userImageUrl ?? null,
        name: body.userName?.trim() || "Learner",
      },
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error("Failed to create Stream lesson session", error);

    return Response.json(
      { error: "Unable to create the Stream audio lesson session." },
      { status: 500 },
    );
  }
}

function buildLessonCustomData({
  languageCode,
  languageName,
  lesson,
  teacherName,
}: {
  languageCode: Language["code"];
  languageName: Language["name"];
  lesson: (typeof LESSONS)[number];
  teacherName: string;
}): LessonAudioCallCustomData {
  return {
    languageCode,
    languageName,
    lessonDescription: lesson.description,
    lessonGoals: lesson.goals,
    lessonId: lesson.id,
    lessonPhrases: lesson.phrases,
    lessonTitle: lesson.title,
    lessonVocabulary: lesson.vocabulary,
    teacherName,
    teacherPrompt: lesson.aiTeacherPrompt,
  };
}

async function startLessonCaptions(call: {
  startClosedCaptions: (request?: {
    language?: "auto";
    speech_segment_config?: {
      max_speech_caption_ms?: number;
      silence_duration_ms?: number;
    };
  }) => Promise<unknown>;
}) {
  try {
    await call.startClosedCaptions(LESSON_CAPTIONS_SETTINGS);

    return {
      enabled: true,
      error: null,
    } as const;
  } catch (error) {
    console.error("Failed to start Stream lesson captions", error);

    return {
      enabled: false,
      error: "Live captions are unavailable for this audio lesson right now.",
    } as const;
  }
}

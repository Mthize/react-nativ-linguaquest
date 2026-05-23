import AudioLessonScreen from "@/components/audio-lesson-screen";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLessonAudioCall } from "@/hooks/useLessonAudioCall";
import { posthog } from "@/lib/posthog";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

export default function LessonScreen() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessonId
    ? LESSONS.find((entry) => entry.id === lessonId)
    : null;
  const unit = lesson ? UNITS.find((entry) => entry.id === lesson.unitId) : null;
  const language = unit
    ? LANGUAGES.find((entry) => entry.code === unit.languageCode)
    : null;
  const lessonNumber =
    lesson && unit ? unit.lessonIds.findIndex((entry) => entry === lesson.id) + 1 : 0;
  const lessonActivityCount = lesson?.activities.length ?? 0;
  const learnerName =
    user?.firstName?.trim() ||
    user?.fullName?.trim() ||
    user?.username ||
    "Learner";
  const lessonStartTimeRef = useRef<number | null>(null);
  const hasTrackedStartRef = useRef(false);
  const hasTrackedAbandonmentRef = useRef(false);
  const hasLessonFinishedRef = useRef(false);
  const lastQuestionIndexRef = useRef(-1);
  const startedLessonIdRef = useRef<string | null>(null);

  const {
    agentConnectionError,
    agentConnectionStatus,
    captionsError,
    captionsStatus,
    endCall,
    error,
    isListening,
    learnerCaption,
    muted,
    phase,
    session,
    startHoldToTalk,
    startOrJoinCall,
    stopHoldToTalk,
    teacherCaption,
  } = useLessonAudioCall({
    enabled: Boolean(lesson && language),
    getToken,
    isAuthLoaded: isLoaded,
    isSignedIn,
    language: language ?? LANGUAGES[0],
    lesson: lesson ?? LESSONS[0],
    userId,
    userImageUrl: user?.imageUrl ?? null,
    userName: learnerName,
  });

  useEffect(() => {
    if (phase === "ended") {
      hasLessonFinishedRef.current = true;
    }
  }, [phase]);

  const initializeLessonTracking = useCallback(() => {
    lessonStartTimeRef.current = Date.now();
    hasTrackedStartRef.current = false;
    hasTrackedAbandonmentRef.current = false;
    hasLessonFinishedRef.current = false;
    lastQuestionIndexRef.current = getDisplayedQuestionIndex(lessonActivityCount);
    startedLessonIdRef.current = lessonId ?? null;
  }, [lessonActivityCount, lessonId]);

  const captureLessonAbandoned = useCallback(() => {
    if (phase === "ended") {
      hasLessonFinishedRef.current = true;
    }

    if (
      !lesson ||
      startedLessonIdRef.current !== lesson.id ||
      !hasTrackedStartRef.current ||
      hasTrackedAbandonmentRef.current ||
      hasLessonFinishedRef.current
    ) {
      return;
    }

    const startedAt = lessonStartTimeRef.current;
    const timeIntoLessonSeconds = startedAt
      ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      : 0;
    const lastQuestionIndex =
      lessonActivityCount > 0
        ? Math.min(lastQuestionIndexRef.current, lessonActivityCount - 1)
        : -1;

    lastQuestionIndexRef.current = lastQuestionIndex;

    posthog.capture("lesson_abandoned", {
      lesson_id: lesson.id,
      time_into_lesson_seconds: timeIntoLessonSeconds,
      last_question_index: lastQuestionIndex,
    });

    hasTrackedAbandonmentRef.current = true;
  }, [lesson, lessonActivityCount, phase]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !lesson || !language) {
      return;
    }

    if (phase !== "idle") {
      return;
    }

    if (startedLessonIdRef.current !== lesson.id || !hasTrackedStartRef.current) {
      initializeLessonTracking();
      posthog.capture("lesson_started", {
        lesson_id: lesson.id,
        language: language.code,
        lesson_number: lessonNumber,
      });
      hasTrackedStartRef.current = true;
    }

    void startOrJoinCall();
  }, [
    initializeLessonTracking,
    isLoaded,
    isSignedIn,
    language,
    lesson,
    lessonNumber,
    phase,
    startOrJoinCall,
  ]);

  useEffect(() => {
    return () => {
      captureLessonAbandoned();
    };
  }, [captureLessonAbandoned]);

  if (!lesson || !language) {
    return <Redirect href="/learn" />;
  }

  if (isLoaded && !isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <AudioLessonScreen
      agentConnectionError={agentConnectionError}
      agentConnectionStatus={agentConnectionStatus}
      audioCallError={error}
      audioCallPhase={phase}
      audioCallUserImageUrl={user?.imageUrl ?? null}
      audioCallUserName={learnerName}
      captionsError={captionsError}
      captionsStatus={captionsStatus}
      language={language}
      learnerCaption={learnerCaption}
      lesson={lesson}
      isListening={isListening}
      micEnabled={!muted}
      onMicPressIn={() => {
        void startHoldToTalk();
      }}
      onMicPressOut={() => {
        void stopHoldToTalk();
      }}
      onBack={() => {
        captureLessonAbandoned();
        router.back();
      }}
      onEndCall={() => {
        void endCall();
      }}
      sessionEnded={phase === "ended"}
      sessionId={session?.callId ?? null}
      teacherCaption={teacherCaption}
    />
  );
}

function getDisplayedQuestionIndex(activityCount: number) {
  return activityCount > 0 ? 0 : -1;
}

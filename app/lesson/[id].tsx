import AudioLessonScreen from "@/components/audio-lesson-screen";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLessonAudioCall } from "@/hooks/useLessonAudioCall";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function LessonScreen() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const [previewVisible, setPreviewVisible] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessonId
    ? LESSONS.find((entry) => entry.id === lessonId)
    : null;
  const unit = lesson ? UNITS.find((entry) => entry.id === lesson.unitId) : null;
  const language = unit
    ? LANGUAGES.find((entry) => entry.code === unit.languageCode)
    : null;
  const learnerName =
    user?.firstName?.trim() ||
    user?.fullName?.trim() ||
    user?.username ||
    "Learner";

  const {
    agentConnectionError,
    agentConnectionStatus,
    endCall,
    error,
    muted,
    phase,
    session,
    startOrJoinCall,
    toggleMute,
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
      language={language}
      lesson={lesson}
      micEnabled={!muted}
      onBack={() => router.back()}
      onEndCall={() => {
        void endCall();
      }}
      onStartOrJoinCall={() => {
        void startOrJoinCall();
      }}
      onToggleMic={() => {
        void toggleMute();
      }}
      onTogglePreview={() => {
        setPreviewVisible((current) => !current);
      }}
      onToggleSubtitles={() => {
        setSubtitlesEnabled((current) => !current);
      }}
      previewVisible={previewVisible}
      sessionEnded={phase === "ended"}
      sessionId={session?.callId ?? null}
      subtitlesEnabled={subtitlesEnabled}
    />
  );
}

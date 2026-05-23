import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import {
  type LessonAudioCaptionsStatus,
  type LessonAudioAgentConnectionStatus,
  type LessonAudioCallPhase,
  type LessonAudioLiveCaption,
  getTeacherName,
} from "@/lib/lesson-audio";
import { colors } from "@/constants/theme";
import type { Language, Lesson } from "@/types/learning";

type AudioLessonScreenProps = {
  agentConnectionError?: string | null;
  agentConnectionStatus: LessonAudioAgentConnectionStatus;
  audioCallError?: string | null;
  audioCallPhase: LessonAudioCallPhase;
  audioCallUserImageUrl?: string | null;
  audioCallUserName: string;
  captionsError?: string | null;
  captionsStatus: LessonAudioCaptionsStatus;
  isListening: boolean;
  language: Language;
  learnerCaption?: LessonAudioLiveCaption | null;
  lesson: Lesson;
  micEnabled: boolean;
  sessionId?: string | null;
  sessionEnded: boolean;
  teacherCaption?: LessonAudioLiveCaption | null;
  accessibilityModeEnabled?: boolean;
  onBack: () => void;
  onEndCall: () => void;
  onMicPressIn: () => void;
  onMicPressOut: () => void;
};

const FEEDBACK_ITEMS = [
  { label: "Speaking", value: "Excellent", color: "#33c759" },
  { label: "Pronunciation", value: "Great", color: "#2f80ff" },
  { label: "Grammar", value: "Good", color: "#6c4ef5" },
] as const;

export default function AudioLessonScreen({
  agentConnectionError,
  agentConnectionStatus,
  audioCallError,
  audioCallPhase,
  audioCallUserImageUrl,
  audioCallUserName,
  captionsError,
  captionsStatus,
  isListening,
  language,
  learnerCaption,
  lesson,
  micEnabled,
  sessionId,
  sessionEnded,
  teacherCaption,
  accessibilityModeEnabled,
  onBack,
  onEndCall,
  onMicPressIn,
  onMicPressOut,
}: AudioLessonScreenProps) {
  const [isAccessibilityModeDetected, setIsAccessibilityModeDetected] =
    useState(false);
  const teacherName = getTeacherName(lesson.aiTeacherPrompt.systemPrompt);
  const status = getStatus(
    audioCallPhase,
    Boolean(audioCallError),
    micEnabled,
    isListening,
  );
  const agentStatus = getAgentStatus(agentConnectionStatus);
  const responseText = getResponseText({
    audioCallError,
    audioCallPhase,
    lessonTitle: lesson.title,
    teacherName,
  });
  const teacherPreviewText =
    teacherCaption?.text.trim() ||
    lesson.aiTeacherPrompt.introMessage ||
    responseText ||
    `${teacherName} is ready.`;
  const firstPhrase = lesson.phrases[0];
  const secondPhrase = lesson.phrases[1];
  const captionLine =
    [firstPhrase?.text, secondPhrase?.text].filter(Boolean).join("  •  ") ||
    lesson.goals[0]?.description ||
    lesson.title;
  const captionStatus = getCaptionStatus(captionsStatus);
  const controlButtonsDisabled =
    audioCallPhase !== "joined" && audioCallPhase !== "ended";
  const canHoldToSpeak = audioCallPhase === "joined";
  const listeningLabel = isListening ? "Listening..." : "Hold to speak";
  const isAccessibilityModeEnabled =
    accessibilityModeEnabled ?? isAccessibilityModeDetected;
  const sessionShortId = sessionId?.slice(-6).toUpperCase() ?? null;
  const responseStatusText = getResponseStatusText(audioCallPhase, Boolean(audioCallError));
  const learnerCaptionText =
    learnerCaption?.text.trim() ||
    (captionsStatus === "live"
      ? "Your speech captions will appear here as you talk."
      : sessionShortId
        ? `Session ${sessionShortId} • ${captionLine}`
        : captionLine);

  useEffect(() => {
    if (accessibilityModeEnabled !== undefined) {
      return;
    }

    let isMounted = true;

    const updateAccessibilityMode = async () => {
      try {
        const [isScreenReaderEnabled, isAccessibilityServiceEnabled] =
          await Promise.all([
            AccessibilityInfo.isScreenReaderEnabled(),
            AccessibilityInfo.isAccessibilityServiceEnabled().catch(() => false),
          ]);

        if (isMounted) {
          setIsAccessibilityModeDetected(
            isScreenReaderEnabled || isAccessibilityServiceEnabled,
          );
        }
      } catch {
        if (isMounted) {
          setIsAccessibilityModeDetected(false);
        }
      }
    };

    void updateAccessibilityMode();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      () => {
        void updateAccessibilityMode();
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [accessibilityModeEnabled]);

  const handleAccessibleMicPress = () => {
    if (!canHoldToSpeak) {
      return;
    }

    if (isListening) {
      onMicPressOut();
      return;
    }

    onMicPressIn();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
    >
      <View className="flex-1 px-[14px] pt-2">
        <View className="mb-[14px] flex-row items-center">
          <TouchableOpacity
            className="mr-1.5 h-10 w-10 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onBack}
          >
            <Ionicons
              color={colors.neutral.textPrimary}
              name="chevron-back"
              size={28}
            />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="mb-0.5 font-poppins-semibold text-[18px] leading-6 text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <Text className="font-poppins-medium text-[14px] leading-[18px] text-[#6d7591]">
                {status.label}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            className={`h-11 flex-row items-center justify-center rounded-full px-4 ${
              controlButtonsDisabled ? "bg-[#f1f2f6]" : "bg-[#ff5a5f]"
            }`}
            disabled={controlButtonsDisabled}
            onPress={onEndCall}
            style={{ opacity: controlButtonsDisabled ? 0.58 : 1 }}
          >
            <Ionicons
              color={controlButtonsDisabled ? "#9096aa" : "#ffffff"}
              name="call"
              size={18}
              style={styles.endCallIcon}
            />
            <Text
              className={`ml-2 font-poppins-semibold text-[13px] leading-4 ${
                controlButtonsDisabled ? "text-[#9096aa]" : "text-white"
              }`}
            >
              End Call
            </Text>
          </TouchableOpacity>
        </View>

        <View className="relative min-h-0 flex-1 overflow-hidden rounded-[34px] bg-[#dcd1c4]">
          <View className="absolute left-[-40px] top-[-60px] h-[210px] w-[210px] rounded-full bg-[rgba(255,255,255,0.42)]" />
          <View className="absolute bottom-[-90px] right-[-70px] h-[220px] w-[220px] rounded-full bg-[rgba(255,255,255,0.24)]" />
          <View className="absolute right-[34px] top-[52px] h-[240px] w-[86px] rounded-[20px] bg-[rgba(153,120,86,0.24)]" />
          <View className="absolute left-[26px] top-[74px] h-[188px] w-[70px] rounded-[20px] bg-[rgba(162,126,89,0.18)]" />
          <View className="absolute bottom-[130px] right-6 h-[84px] w-[66px] rounded-[26px] bg-[rgba(92,124,83,0.2)]" />
          <View className="absolute bottom-[90px] left-7 h-[56px] w-[50px] rounded-[22px] bg-[rgba(111,147,92,0.16)]" />
          <View className="absolute left-[18px] top-[188px] h-[72px] w-[86px] rounded-[16px] bg-[rgba(127,154,193,0.18)]" />

          <View className="absolute left-4 top-4 max-w-[170px] rounded-[18px] bg-[rgba(255,255,255,0.46)] px-3 py-2.5">
            <Text className="font-poppins-semibold text-[12px] leading-4 text-lingua-purple">
              {language.name}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 font-poppins-semibold text-[14px] leading-[18px] text-text-primary"
            >
              {lesson.title}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-1 font-poppins-medium text-[11px] leading-[15px] text-text-secondary"
            >
              {lesson.goals[0]?.description ?? lesson.title}
            </Text>
          </View>

          <View className="absolute right-4 top-6 w-[130px] rounded-[22px] border-2 border-white bg-[rgba(255,255,255,0.86)] px-2 pb-2.5 pt-2">
            <View className="h-[116px] items-center justify-center overflow-hidden rounded-[16px] bg-[#ebe8f8]">
              <Image
                className="h-[104px] w-[104px]"
                contentFit="contain"
                source={images.mascotWelcome}
              />
            </View>
            <Text className="mt-2 text-center font-poppins-semibold text-[13px] leading-4 text-text-primary">
              {teacherName}
            </Text>
          </View>

          <Image
            className="absolute bottom-[168px] left-3 h-[390px] w-[300px]"
            contentFit="contain"
            source={images.mascotAuth}
          />

          <View className="absolute bottom-[72px] left-[18px] right-[30px] rounded-[24px] bg-white px-[18px] py-[14px]">
            <View className="flex-row items-center gap-3">
              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={3}
                  className="font-poppins-semibold text-[15px] leading-5 text-text-primary"
                >
                  {teacherPreviewText}
                </Text>
                <Text
                  numberOfLines={1}
                  className="mt-1 font-poppins-medium text-[13px] leading-[18px] text-[#8c93ac]"
                >
                  {responseStatusText}
                </Text>

                <View className="mt-2 flex-row items-center gap-2">
                  <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: agentStatus.color }}
                  />
                  <Text className="font-poppins-medium text-[12px] leading-4 text-[#6b7280]">
                    Teacher {agentStatus.label}
                  </Text>
                </View>

                <View className="mt-2 flex-row items-center gap-2">
                  <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: captionStatus.color }}
                  />
                  <Text className="font-poppins-medium text-[12px] leading-4 text-[#6b7280]">
                    Live captions {captionStatus.label}
                  </Text>
                </View>

                {agentConnectionStatus === "failed" && agentConnectionError ? (
                  <Text className="mt-2 font-poppins-medium text-[12px] leading-4 text-[#d64545]">
                    {agentConnectionError}
                  </Text>
                ) : null}

                {captionsStatus === "failed" && captionsError ? (
                  <Text className="mt-2 font-poppins-medium text-[12px] leading-4 text-[#d64545]">
                    {captionsError}
                  </Text>
                ) : null}
              </View>

              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f1edff]">
                <Ionicons
                  color={colors.primary.purple}
                  name={sessionEnded ? "checkmark-circle" : "volume-high"}
                  size={22}
                />
              </View>
            </View>

            <View className="mt-3 flex-row items-center gap-2.5">
              {audioCallUserImageUrl ? (
                <Image
                  className="h-8 w-8 rounded-full"
                  contentFit="cover"
                  source={{ uri: audioCallUserImageUrl }}
                />
              ) : (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#eef1fb]">
                  <Text className="font-poppins-semibold text-[12px] leading-4 text-lingua-purple">
                    {audioCallUserName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={1}
                  className="font-poppins-semibold text-[12px] leading-4 text-text-primary"
                >
                  {audioCallUserName}
                </Text>
                <Text
                  numberOfLines={2}
                  className="font-poppins-medium text-[12px] leading-4 text-[#8c93ac]"
                >
                  {learnerCaptionText}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-5 mt-[18px] items-center px-5">
          <Pressable
            accessibilityHint="Activates the microphone so you can start or stop speaking."
            accessibilityLabel={listeningLabel}
            accessibilityRole="button"
            accessible
            disabled={!canHoldToSpeak}
            onPress={
              isAccessibilityModeEnabled ? handleAccessibleMicPress : undefined
            }
            onPressIn={
              isAccessibilityModeEnabled ? undefined : onMicPressIn
            }
            onPressOut={
              isAccessibilityModeEnabled ? undefined : onMicPressOut
            }
            style={({ pressed }) => [
              styles.micButton,
              !canHoldToSpeak && styles.micButtonDisabled,
              (isListening || pressed) && canHoldToSpeak
                ? styles.micButtonActive
                : null,
            ]}
          >
            <View
              style={[
                styles.micButtonInner,
                (isListening || !canHoldToSpeak) && styles.micButtonInnerMuted,
              ]}
            >
              <Ionicons
                color={isListening && canHoldToSpeak ? "#ffffff" : colors.primary.purple}
                name={isListening && canHoldToSpeak ? "radio" : "mic"}
                size={42}
              />
            </View>
          </Pressable>

          <Text className="mt-4 font-poppins-semibold text-[18px] leading-6 text-text-primary">
            {listeningLabel}
          </Text>
          <Text className="mt-1 text-center font-poppins-medium text-[13px] leading-[18px] text-[#8a90a8]">
            Press and hold to speak.
          </Text>
        </View>

        <View className="mb-3 rounded-[30px] border border-[#ece8fb] bg-[#faf7ff] px-3 py-5">
          <View className="flex-row overflow-hidden rounded-[22px]">
          {FEEDBACK_ITEMS.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 items-center justify-center px-3 py-1.5${
                index < FEEDBACK_ITEMS.length - 1
                  ? " border-r border-r-[#e8e2f4]"
                  : ""
              }`}
            >
              <Text className="mb-2 text-center font-poppins-semibold text-[14px] leading-5 text-text-primary">
                {item.label}
              </Text>
              <Text
                className="text-center font-poppins-semibold text-[16px] leading-[22px]"
                style={{ color: item.color }}
              >
                {item.value}
              </Text>
            </View>
          ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function getResponseText({
  audioCallError,
  audioCallPhase,
  lessonTitle,
  teacherName,
}: {
  audioCallError?: string | null;
  audioCallPhase: LessonAudioCallPhase;
  lessonTitle: string;
  teacherName: string;
}) {
  if (audioCallError) {
    return audioCallError;
  }

  switch (audioCallPhase) {
    case "loading":
      return "Setting up your secure Stream session for this lesson.";
    case "connecting":
      return `Joining ${teacherName}'s audio room now.`;
    case "joined":
      return `You're live in the audio lesson with ${teacherName}.`;
    case "ended":
      return `Great work with ${lessonTitle}. Start again whenever you're ready.`;
    default:
      return `${teacherName} is getting your audio lesson ready.`;
  }
}

function getResponseStatusText(
  audioCallPhase: LessonAudioCallPhase,
  hasError: boolean,
) {
  if (hasError || audioCallPhase === "error") {
    return "Audio lesson unavailable right now";
  }

  if (audioCallPhase === "loading" || audioCallPhase === "connecting") {
    return "Audio lesson connecting...";
  }

  if (audioCallPhase === "ended") {
    return "Audio lesson complete";
  }

  if (audioCallPhase === "joined") {
    return "Audio lesson in progress 🎧";
  }

  return "Audio lesson in progress";
}

function getStatus(
  audioCallPhase: LessonAudioCallPhase,
  hasError: boolean,
  micEnabled: boolean,
  isListening: boolean,
) {
  if (hasError || audioCallPhase === "error") {
    return { color: colors.semantic.error, label: "Error" };
  }

  if (audioCallPhase === "loading") {
    return { color: colors.primary.purple, label: "Loading" };
  }

  if (audioCallPhase === "connecting") {
    return { color: colors.semantic.warning, label: "Connecting" };
  }

  if (audioCallPhase === "joined") {
    if (isListening) {
      return { color: colors.primary.purple, label: "Listening" };
    }

    return micEnabled
      ? { color: colors.semantic.success, label: "Joined" }
      : { color: colors.semantic.success, label: "Ready to speak" };
  }

  if (audioCallPhase === "ended") {
    return { color: colors.semantic.error, label: "Ended" };
  }

  return { color: colors.neutral.textSecondary, label: "Ready" };
}

function getAgentStatus(
  agentConnectionStatus: LessonAudioAgentConnectionStatus,
) {
  switch (agentConnectionStatus) {
    case "connecting":
      return { color: colors.semantic.warning, label: "Connecting" };
    case "connected":
      return { color: colors.semantic.success, label: "Connected" };
    case "failed":
      return { color: colors.semantic.error, label: "Failed" };
    default:
      return { color: colors.neutral.textSecondary, label: "Idle" };
  }
}

function getCaptionStatus(captionsStatus: LessonAudioCaptionsStatus) {
  switch (captionsStatus) {
    case "starting":
      return { color: colors.semantic.warning, label: "starting" };
    case "live":
      return { color: colors.semantic.success, label: "on" };
    case "failed":
      return { color: colors.semantic.error, label: "unavailable" };
    default:
      return { color: colors.neutral.textSecondary, label: "idle" };
  }
}

const styles = StyleSheet.create({
  endCallIcon: {
    transform: [{ rotate: "135deg" }],
  },
  micButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#ebe6fb",
    borderRadius: 64,
    borderWidth: 1,
    elevation: 6,
    height: 128,
    justifyContent: "center",
    shadowColor: "#4d2fb8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    width: 128,
  },
  micButtonActive: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
    shadowOpacity: 0.22,
    transform: [{ scale: 1.02 }],
  },
  micButtonDisabled: {
    opacity: 0.55,
  },
  micButtonInner: {
    alignItems: "center",
    backgroundColor: "#f3efff",
    borderRadius: 46,
    height: 92,
    justifyContent: "center",
    width: 92,
  },
  micButtonInnerMuted: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});

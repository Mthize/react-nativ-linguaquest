import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import type { Language, Lesson } from "@/types/learning";

type AudioLessonScreenProps = {
  language: Language;
  lesson: Lesson;
  micEnabled: boolean;
  previewVisible: boolean;
  sessionEnded: boolean;
  subtitlesEnabled: boolean;
  onBack: () => void;
  onEndCall: () => void;
  onToggleMic: () => void;
  onTogglePreview: () => void;
  onToggleSubtitles: () => void;
};

const FEEDBACK_ITEMS = [
  { label: "Speaking", value: "Excellent", color: "#33c759" },
  { label: "Pronunciation", value: "Great", color: "#2f80ff" },
  { label: "Grammar", value: "Good", color: "#6c4ef5" },
] as const;

export default function AudioLessonScreen({
  language,
  lesson,
  micEnabled,
  previewVisible,
  sessionEnded,
  subtitlesEnabled,
  onBack,
  onEndCall,
  onToggleMic,
  onTogglePreview,
  onToggleSubtitles,
}: AudioLessonScreenProps) {
  const teacherName = getTeacherName(lesson.aiTeacherPrompt.systemPrompt);
  const status = sessionEnded
    ? { color: colors.semantic.error, label: "Offline" }
    : micEnabled
      ? { color: colors.semantic.success, label: "Online" }
      : { color: colors.semantic.warning, label: "Muted" };
  const responseText = sessionEnded
    ? `Great work with ${lesson.title}. We'll pick up again soon.`
    : lesson.aiTeacherPrompt.introMessage;
  const firstPhrase = lesson.phrases[0];
  const secondPhrase = lesson.phrases[1];
  const captionLine = subtitlesEnabled
    ? [firstPhrase?.text, secondPhrase?.text].filter(Boolean).join("  •  ")
    : lesson.goals[0]?.description ?? lesson.title;

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

          <View className="flex-row gap-2.5">
            <HeaderAction iconName="videocam-outline" />
            <HeaderAction
              label={`${lesson.phrases.length + lesson.goals.length + 7}`}
            />
            <HeaderAction iconName="notifications-outline" />
          </View>
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

          {previewVisible ? (
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
          ) : null}

          <Image
            className="absolute bottom-[168px] left-3 h-[390px] w-[300px]"
            contentFit="contain"
            source={images.mascotAuth}
          />

          <View className="absolute bottom-[52px] left-[18px] right-[52px] rounded-[28px] bg-white px-[18px] pb-[14px] pt-[18px]">
            <Text className="mb-1 font-poppins-semibold text-[16px] leading-6 text-text-primary">
              {firstPhrase?.text ?? `${language.name} practice`}
            </Text>
            <Text
              className="font-poppins-medium text-[17px] leading-[26px] text-text-primary"
              numberOfLines={2}
            >
              {responseText}
            </Text>
            <View className="mt-2.5 flex-row items-center gap-2.5">
              <Text
                numberOfLines={1}
                className="flex-1 font-poppins-medium text-[12px] leading-4 text-[#8c93ac]"
              >
                {captionLine}
              </Text>
              <Ionicons
                color={colors.primary.purple}
                name={sessionEnded ? "checkmark-circle" : "volume-high"}
                size={24}
              />
            </View>
          </View>
        </View>

        <View className="mb-4 mt-[18px] flex-row justify-between px-2">
          <CallButton
            iconName="videocam"
            label="Camera"
            onPress={onTogglePreview}
          />
          <CallButton
            iconName={micEnabled ? "mic" : "mic-off"}
            label="Mic"
            onPress={onToggleMic}
          />
          <CallButton
            iconName="language"
            label="Subtitles"
            onPress={onToggleSubtitles}
          />
          <CallButton
            danger
            iconName="call"
            label="End Call"
            onPress={onEndCall}
          />
        </View>

        <View className="mb-2 flex-row rounded-[28px] bg-white px-2.5 py-[22px]">
          {FEEDBACK_ITEMS.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 px-[14px]${
                index < FEEDBACK_ITEMS.length - 1
                  ? " border-r border-r-[#eceef5]"
                  : ""
              }`}
            >
              <Text className="mb-2.5 font-poppins-medium text-[14px] leading-5 text-text-primary">
                {item.label}
              </Text>
              <Text
                className="font-poppins-semibold text-[16px] leading-[22px]"
                style={{ color: item.color }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function HeaderAction({
  iconName,
  label,
}: {
  iconName?: keyof typeof Ionicons.glyphMap;
  label?: string;
}) {
  return (
    <View className="h-12 w-12 items-center justify-center rounded-[24px] border border-[#ececf5] bg-white">
      {label ? (
        <Text className="font-poppins-semibold text-[18px] leading-5 text-text-primary">
          {label}
        </Text>
      ) : (
        <Ionicons
          color={colors.neutral.textPrimary}
          name={iconName ?? "ellipse-outline"}
          size={20}
        />
      )}
    </View>
  );
}

function CallButton({
  danger = false,
  iconName,
  label,
  onPress,
}: {
  danger?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="flex-1 items-center">
      <TouchableOpacity
        activeOpacity={0.9}
        className={`mb-2 h-[78px] w-[78px] items-center justify-center rounded-full ${
          danger ? "bg-[#ff4747]" : "bg-white"
        }`}
        onPress={onPress}
      >
        <Ionicons
          color={danger ? "#ffffff" : "#0d1b52"}
          name={iconName}
          size={28}
          style={danger ? styles.endCallIcon : null}
        />
      </TouchableOpacity>
      <Text className="font-poppins-medium text-[13px] leading-[18px] text-[#8a90a8]">
        {label}
      </Text>
    </View>
  );
}

function getTeacherName(systemPrompt: string) {
  const match = systemPrompt.match(/You're\s+([^,]+),/i);

  return match?.[1]?.trim() ?? "AI Teacher";
}

const styles = StyleSheet.create({
  endCallIcon: {
    transform: [{ rotate: "135deg" }],
  },
});

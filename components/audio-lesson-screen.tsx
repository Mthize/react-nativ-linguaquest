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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons
              color={colors.neutral.textPrimary}
              name="chevron-back"
              size={28}
            />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>AI Teacher</Text>
            <View style={styles.onlineRow}>
              <View
                style={[styles.onlineDot, { backgroundColor: status.color }]}
              />
              <Text style={styles.onlineText}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <HeaderAction iconName="videocam-outline" />
            <HeaderAction label={`${lesson.phrases.length + lesson.goals.length + 7}`} />
            <HeaderAction iconName="notifications-outline" />
          </View>
        </View>

        <View style={styles.callCard}>
          <View style={styles.roomGlowTopLeft} />
          <View style={styles.roomGlowBottomRight} />
          <View style={styles.roomShelfLarge} />
          <View style={styles.roomShelfSmall} />
          <View style={styles.roomPlantLarge} />
          <View style={styles.roomPlantSmall} />
          <View style={styles.roomFrame} />

          <View style={styles.lessonChip}>
            <Text style={styles.lessonChipLanguage}>{language.name}</Text>
            <Text numberOfLines={1} style={styles.lessonChipTitle}>
              {lesson.title}
            </Text>
            <Text numberOfLines={1} style={styles.lessonChipGoal}>
              {lesson.goals[0]?.description ?? lesson.title}
            </Text>
          </View>

          {previewVisible ? (
            <View style={styles.previewCard}>
              <View style={styles.previewInner}>
                <Image
                  contentFit="contain"
                  source={images.mascotWelcome}
                  style={styles.previewImage}
                />
              </View>
              <Text style={styles.previewName}>{teacherName}</Text>
            </View>
          ) : null}

          <Image
            contentFit="contain"
            source={images.mascotAuth}
            style={styles.foxImage}
          />

          <View style={styles.responseBubble}>
            <Text style={styles.responseTextPrimary}>
              {firstPhrase?.text ?? `${language.name} practice`}
            </Text>
            <Text style={styles.responseTextSecondary} numberOfLines={2}>
              {responseText}
            </Text>
            <View style={styles.responseFooter}>
              <Text numberOfLines={1} style={styles.responseMeta}>
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

        <View style={styles.controlsRow}>
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

        <View style={styles.performanceCard}>
          {FEEDBACK_ITEMS.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.performanceColumn,
                index < FEEDBACK_ITEMS.length - 1
                  ? styles.performanceDivider
                  : null,
              ]}
            >
              <Text style={styles.performanceLabel}>{item.label}</Text>
              <Text style={[styles.performanceValue, { color: item.color }]}>
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
    <View style={styles.headerAction}>
      {label ? (
        <Text style={styles.headerActionLabel}>{label}</Text>
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
    <View style={styles.callButtonWrap}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.callButton,
          danger ? styles.callButtonDanger : null,
        ]}
      >
        <Ionicons
          color={danger ? "#ffffff" : "#0d1b52"}
          name={iconName}
          size={28}
          style={danger ? styles.endCallIcon : null}
        />
      </TouchableOpacity>
      <Text style={styles.callButtonLabel}>{label}</Text>
    </View>
  );
}

function getTeacherName(systemPrompt: string) {
  const match = systemPrompt.match(/You're\s+([^,]+),/i);

  return match?.[1]?.trim() ?? "AI Teacher";
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 14,
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginRight: 6,
    width: 40,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 2,
  },
  onlineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  onlineDot: {
    borderRadius: 99,
    height: 12,
    width: 12,
  },
  onlineText: {
    color: "#6d7591",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerAction: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#ececf5",
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  headerActionLabel: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    lineHeight: 20,
  },
  callCard: {
    backgroundColor: "#dcd1c4",
    borderRadius: 34,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  roomGlowTopLeft: {
    backgroundColor: "rgba(255,255,255,0.42)",
    borderRadius: 999,
    height: 210,
    left: -40,
    position: "absolute",
    top: -60,
    width: 210,
  },
  roomGlowBottomRight: {
    backgroundColor: "rgba(255,255,255,0.24)",
    borderRadius: 999,
    bottom: -90,
    height: 220,
    position: "absolute",
    right: -70,
    width: 220,
  },
  roomShelfLarge: {
    backgroundColor: "rgba(153,120,86,0.24)",
    borderRadius: 20,
    height: 240,
    position: "absolute",
    right: 34,
    top: 52,
    width: 86,
  },
  roomShelfSmall: {
    backgroundColor: "rgba(162,126,89,0.18)",
    borderRadius: 20,
    height: 188,
    left: 26,
    position: "absolute",
    top: 74,
    width: 70,
  },
  roomPlantLarge: {
    backgroundColor: "rgba(92,124,83,0.2)",
    borderRadius: 26,
    bottom: 130,
    height: 84,
    position: "absolute",
    right: 24,
    width: 66,
  },
  roomPlantSmall: {
    backgroundColor: "rgba(111,147,92,0.16)",
    borderRadius: 22,
    bottom: 90,
    height: 56,
    left: 28,
    position: "absolute",
    width: 50,
  },
  roomFrame: {
    backgroundColor: "rgba(127,154,193,0.18)",
    borderRadius: 16,
    height: 72,
    left: 18,
    position: "absolute",
    top: 188,
    width: 86,
  },
  lessonChip: {
    backgroundColor: "rgba(255,255,255,0.46)",
    borderRadius: 18,
    left: 16,
    maxWidth: 170,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: "absolute",
    top: 16,
  },
  lessonChipLanguage: {
    color: colors.primary.purple,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    lineHeight: 16,
  },
  lessonChipTitle: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
  lessonChipGoal: {
    color: "#6b7280",
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    borderColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 2,
    paddingBottom: 10,
    paddingHorizontal: 8,
    paddingTop: 8,
    position: "absolute",
    right: 16,
    top: 24,
    width: 130,
  },
  previewInner: {
    alignItems: "center",
    backgroundColor: "#ebe8f8",
    borderRadius: 16,
    height: 116,
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImage: {
    height: 104,
    width: 104,
  },
  previewName: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    lineHeight: 16,
    marginTop: 8,
    textAlign: "center",
  },
  foxImage: {
    bottom: 168,
    height: 390,
    left: 12,
    position: "absolute",
    width: 300,
  },
  responseBubble: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    bottom: 52,
    left: 18,
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 18,
    position: "absolute",
    right: 52,
  },
  responseTextPrimary: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  responseTextSecondary: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-Medium",
    fontSize: 17,
    lineHeight: 26,
  },
  responseFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  responseMeta: {
    color: "#8c93ac",
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 18,
    paddingHorizontal: 8,
  },
  callButtonWrap: {
    alignItems: "center",
    flex: 1,
  },
  callButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    height: 78,
    justifyContent: "center",
    marginBottom: 8,
    width: 78,
  },
  callButtonDanger: {
    backgroundColor: "#ff4747",
  },
  endCallIcon: {
    transform: [{ rotate: "135deg" }],
  },
  callButtonLabel: {
    color: "#8a90a8",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  performanceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 22,
  },
  performanceColumn: {
    flex: 1,
    paddingHorizontal: 14,
  },
  performanceDivider: {
    borderRightColor: "#eceef5",
    borderRightWidth: 1,
  },
  performanceLabel: {
    color: colors.neutral.textPrimary,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  performanceValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    lineHeight: 22,
  },
});

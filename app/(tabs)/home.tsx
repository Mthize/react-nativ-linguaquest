import { posthog } from "@/lib/posthog";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";

const GREETINGS = {
  de: "Hallo",
  es: "Hola",
  fr: "Bonjour",
  ja: "こんにちは",
  ko: "안녕",
  zh: "你好",
} as const;

export default function HomeScreen() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const selectedLanguageCode = useLanguageStore((state) => state.selectedLanguage);
  const [languageHydrated, setLanguageHydrated] = useState(
    useLanguageStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (languageHydrated) {
      return;
    }

    return useLanguageStore.persist.onFinishHydration(() =>
      setLanguageHydrated(true),
    );
  }, [languageHydrated]);

  if (!authLoaded || !languageHydrated) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={colors.primary.purple} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!selectedLanguageCode) {
    return <Redirect href="/language-select" />;
  }

  const selectedLanguage =
    LANGUAGES.find((language) => language.code === selectedLanguageCode) ??
    LANGUAGES[0];
  const currentUnit = [...UNITS]
    .filter((unit) => unit.languageCode === selectedLanguage.code)
    .sort((first, second) => first.order - second.order)[0];
  const lessonPosition = currentUnit
    ? Math.min(2, currentUnit.lessonIds.length - 1)
    : 0;
  const currentLesson = currentUnit
    ? LESSONS.find((lesson) => lesson.id === currentUnit.lessonIds[lessonPosition])
    : null;

  if (!currentUnit || !currentLesson) {
    return <Redirect href="/learn" />;
  }

  const greeting =
    GREETINGS[selectedLanguage.code as keyof typeof GREETINGS] ?? "Hello";
  const userFirstName =
    user?.firstName?.trim() ||
    user?.fullName?.split(" ")[0] ||
    user?.username ||
    "Learner";
  const practiceCount =
    currentLesson.vocabulary.length + currentLesson.phrases.length;
  const totalGoalXp =
    currentLesson.xpReward +
    currentLesson.goals.reduce((total, goal) => total + goal.xpReward, 0);
  const completedGoalXp =
    currentLesson.xpReward + (currentLesson.goals[0]?.xpReward ?? 0);
  const progressWidth = Math.max(
    0,
    Math.min(1, completedGoalXp / Math.max(totalGoalXp, 1)),
  );
  const conversationTopic =
    currentLesson.aiTeacherPrompt.topics[0]
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (value) => value.toUpperCase()) ?? "Speaking";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View className="gap-7">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="h-11 w-11 overflow-hidden rounded-full border border-[#f1f3f9] bg-white">
                <Image
                  source={{ uri: selectedLanguage.flag }}
                  contentFit="cover"
                  style={styles.flagImage}
                />
              </View>
              <Text className="font-poppins-semibold text-[18px] leading-[24px] text-text-primary">
                {greeting}, {userFirstName}! {"\u{1F44B}"}
              </Text>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-2">
                <Image
                  source={images.streakFire}
                  contentFit="contain"
                  style={styles.streakImage}
                />
                <Text className="font-poppins-medium text-[18px] leading-[22px] text-text-primary">
                  {practiceCount}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full"
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#293056"
                />
              </Pressable>
            </View>
          </View>

          <View
            className="overflow-hidden rounded-[26px] bg-[#fff7ef] px-6 py-5"
            style={styles.softCardShadow}
          >
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-3">
                <Text className="font-poppins-medium text-[15px] leading-[20px] text-text-primary">
                  Daily goal
                </Text>
                <Text className="font-poppins-bold text-[20px] leading-[28px] text-text-primary">
                  {completedGoalXp}
                  <Text className="font-poppins-medium text-[18px] text-[#8a91a6]">
                    {" "}
                    / {totalGoalXp} XP
                  </Text>
                </Text>
                <View className="h-[8px] overflow-hidden rounded-full bg-[#fde3c8]">
                  <View
                    className="h-full rounded-full bg-[#ff8a00]"
                    style={{ width: `${progressWidth * 100}%` }}
                  />
                </View>
              </View>

              <Image
                source={images.treasure}
                contentFit="contain"
                style={styles.goalArtwork}
              />
            </View>
          </View>

          <View
            className="overflow-hidden rounded-[28px] bg-lingua-purple px-6 py-6"
            style={styles.heroCardShadow}
          >
            <View className="absolute inset-0 overflow-hidden">
              <View style={styles.heroGlowLarge} />
              <View style={styles.heroGlowSmall} />
              <View style={styles.heroHillLeft} />
              <View style={styles.heroHillCenter} />
            </View>

            <View className="relative flex-row items-end justify-between gap-4">
              <View className="max-w-[52%] gap-2">
                <Text className="font-poppins-medium text-[14px] leading-[20px] text-white/85">
                  Continue learning
                </Text>
                <Text className="font-poppins-semibold text-[20px] leading-[26px] text-white">
                  {selectedLanguage.name}
                </Text>
                <Text className="font-poppins-medium text-[17px] leading-[22px] text-white/85">
                  A1 • Unit {lessonPosition + 1}
                </Text>

                <Link href="/learn" asChild>
                  <Pressable
                    accessibilityRole="button"
                    className="mt-4 h-[50px] w-[126px] items-center justify-center rounded-[18px] bg-white"
                    style={styles.continueButtonShadow}
                    onPress={() =>
                      posthog.capture("continue_learning_clicked", {
                        language: selectedLanguage.name,
                        lesson_title: currentLesson.title,
                      })
                    }
                  >
                    <Text className="font-poppins-semibold text-[18px] leading-[22px] text-lingua-purple">
                      Continue
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <Image
                source={images.palace}
                contentFit="contain"
                style={styles.palaceArtwork}
              />
            </View>
          </View>

          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="font-poppins-semibold text-[18px] leading-[24px] text-text-primary">
                Today&apos;s plan
              </Text>
              <Link href="/learn" asChild>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => posthog.capture("view_all_lessons_clicked")}
                >
                  <Text className="font-poppins-semibold text-[16px] leading-[22px] text-lingua-purple">
                    View all
                  </Text>
                </Pressable>
              </Link>
            </View>

            <View className="gap-6">
              <PlanRow
                accentColor="#6c4ef5"
                iconName="book"
                title="Lesson"
                subtitle={currentLesson.title}
                complete
              />
              <PlanRow
                accentColor="#6c4ef5"
                iconName="headset"
                title="AI Conversation"
                subtitle={`Practice ${conversationTopic.toLowerCase()}`}
              />
              <PlanRow
                accentColor="#ff5c5c"
                iconName="chatbubble-ellipses"
                title="New words"
                subtitle={`${currentLesson.vocabulary.length} words`}
              />
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type PlanRowProps = {
  accentColor: string;
  complete?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  subtitle: string;
  title: string;
};

function PlanRow({
  accentColor,
  complete = false,
  iconName,
  subtitle,
  title,
}: PlanRowProps) {
  return (
    <View className="flex-row items-center gap-4">
      <View
        className="h-[54px] w-[54px] items-center justify-center rounded-[16px]"
        style={{ backgroundColor: accentColor }}
      >
        <Ionicons name={iconName} size={24} color="#ffffff" />
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-poppins-semibold text-[17px] leading-[22px] text-text-primary">
          {title}
        </Text>
        <Text className="font-poppins-medium text-[15px] leading-[20px] text-[#7d8598]">
          {subtitle}
        </Text>
      </View>

      {complete ? (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-lingua-purple">
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : (
        <View className="h-8 w-8 rounded-full border-2 border-[#c7cedc]" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  continueButtonShadow: {
    boxShadow: "0 10px 25px rgba(33, 20, 114, 0.16)",
  },
  flagImage: {
    height: "100%",
    width: "100%",
  },
  goalArtwork: {
    height: 106,
    width: 106,
  },
  heroCardShadow: {
    boxShadow: "0 20px 38px rgba(91, 59, 246, 0.22)",
  },
  heroGlowLarge: {
    position: "absolute",
    right: -40,
    top: -10,
    height: 220,
    width: 220,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  heroGlowSmall: {
    position: "absolute",
    right: 70,
    top: 28,
    height: 70,
    width: 70,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroHillCenter: {
    position: "absolute",
    bottom: -72,
    left: 100,
    height: 160,
    width: 170,
    borderRadius: 999,
    backgroundColor: "rgba(42, 18, 135, 0.32)",
  },
  heroHillLeft: {
    position: "absolute",
    bottom: -82,
    left: -28,
    height: 170,
    width: 210,
    borderRadius: 999,
    backgroundColor: "rgba(42, 18, 135, 0.45)",
  },
  loadingState: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
  },
  palaceArtwork: {
    height: 150,
    marginBottom: -24,
    marginRight: -12,
    width: 160,
  },
  safeArea: {
    backgroundColor: "#fbfbfd",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  softCardShadow: {
    boxShadow: "0 12px 30px rgba(17, 24, 39, 0.05)",
  },
  streakImage: {
    height: 24,
    width: 24,
  },
});

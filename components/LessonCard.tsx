import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";
import { Lesson } from "@/types/learning";

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  isInProgress: boolean;
  onPress: () => void;
}

function getLessonThumbnail(lesson: Lesson) {
  if (/greeting|introduction/i.test(lesson.title)) {
    return images.mascotWelcome;
  }

  if (/café|numbers|colors/i.test(lesson.title)) {
    return images.palace;
  }

  return images.mascotAuth;
}

export function LessonCard({
  lesson,
  index,
  isCompleted,
  isInProgress,
  onPress,
}: LessonCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex-row items-center rounded-2xl border p-4 ${
        isInProgress
          ? "border-[#C4B5FD] bg-[#EDE9FE]"
          : "border-border bg-white"
      }`}
      onPress={onPress}
      style={styles.cardShadow}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="caption">Lesson {index + 1}</Text>
          {isInProgress && (
            <View className="rounded-full bg-[rgba(108,78,245,0.12)] px-2 py-0.5">
              <Text className="font-poppins-medium text-[10px] text-lingua-purple">
                In progress
              </Text>
            </View>
          )}
        </View>

        <Text
          className="font-poppins-semibold text-sm text-text-primary"
          numberOfLines={1}
        >
          {lesson.title}
        </Text>

        <Text className="caption mt-0.5">
          {lesson.activities.length} activities · {lesson.xpReward} XP
        </Text>
      </View>

      {isCompleted && (
        <View className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-[#21c16b]">
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      )}

      {isInProgress && (
        <Image
          className="ml-3 h-14 w-[72px] rounded-[10px]"
          source={getLessonThumbnail(lesson)}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});

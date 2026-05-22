import { colors, fontFamily } from "@/constants/theme";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AiTeacherScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-[340px] rounded-[32px] bg-surface px-6 py-8">
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#21c16b",
              opacity: 0.16,
              marginBottom: 18,
            }}
          />

          <Text className="h2">AI Teacher</Text>
          <Text
            className="body-md mt-3 text-text-secondary"
            style={{ fontFamily: fontFamily.regular }}
          >
            This placeholder marks the future AI video teacher experience.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

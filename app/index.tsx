import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-white px-8">
      <Text className="h1 text-center color-lingua-purple">LinguaQuest</Text>
      <Text>TTechGlobal Inc.</Text>
      <Link href="/onboarding" asChild>
        <Pressable className="rounded-2xl bg-lingua-deep-purple px-7 py-4">
          <Text className="font-poppins-semibold text-base text-white">
            Open Onboarding
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

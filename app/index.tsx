import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-white px-8">
      <Text className="h1 text-center color-lingua-purple">LinguaQuest</Text>
      <Pressable
        className="rounded-2xl bg-lingua-deep-purple px-7 py-4"
        onPress={handleSignOut}
      >
        <Text className="font-poppins-semibold text-base text-white">
          Sign Out
        </Text>
      </Pressable>
    </View>
  );
}

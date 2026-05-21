import { useAuth, useClerk } from "@clerk/expo";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useLanguageStore } from "@/store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const { selectedLanguage } = useLanguageStore();
  const [languageHydrated, setLanguageHydrated] = useState(
    useLanguageStore.persist.hasHydrated()
  );

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  useEffect(() => {
    if (languageHydrated) return;
    return useLanguageStore.persist.onFinishHydration(() =>
      setLanguageHydrated(true)
    );
  }, [languageHydrated]);

  if (!isLoaded || !languageHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/language-select" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-white px-8">
      <Text className="h1 text-center color-lingua-purple">LinguaQuest</Text>
      <Link href="/language-select" asChild>
        <Pressable className="rounded-2xl bg-lingua-purple px-7 py-4">
          <Text className="font-poppins-semibold text-base text-white">
            Choose language
          </Text>
        </Pressable>
      </Link>
      <Pressable className="px-2 py-1" onPress={handleSignOut}>
        <Text className="font-poppins-semibold text-base text-lingua-purple">
          Sign Out
        </Text>
      </Pressable>
    </View>
  );
}

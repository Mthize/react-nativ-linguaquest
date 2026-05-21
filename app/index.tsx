import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { colors } from "@/constants/theme";
import { useLanguageStore } from "@/store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const [languageHydrated, setLanguageHydrated] = useState(
    useLanguageStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useLanguageStore.persist.hasHydrated()) {
      setLanguageHydrated(true);
      return;
    }

    return useLanguageStore.persist.onFinishHydration(() =>
      setLanguageHydrated(true),
    );
  }, []);

  if (!isLoaded || !languageHydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary.purple} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/language-select" />;
  }

  return <Redirect href="/home" />;
}

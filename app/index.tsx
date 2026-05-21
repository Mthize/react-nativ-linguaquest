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
    if (languageHydrated) {
      return;
    }

    return useLanguageStore.persist.onFinishHydration(() =>
      setLanguageHydrated(true),
    );
  }, [languageHydrated]);

  if (!isLoaded || !languageHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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

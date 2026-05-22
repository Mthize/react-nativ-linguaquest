import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

import { PostHogProvider, posthog } from "@/lib/posthog";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const SAFE_SCREEN_PARAM_KEYS = ["page", "lang", "utm_source"] as const;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

SplashScreen.preventAutoHideAsync();

function getSafeScreenParams(
  params: Record<string, string | string[] | undefined>,
) {
  const safeParams: Record<string, string> = {};

  for (const key of SAFE_SCREEN_PARAM_KEYS) {
    const value = params[key];

    if (typeof value === "string" && value.length > 0) {
      safeParams[key] = value.trim();
      continue;
    }

    if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
      safeParams[key] = value[0].trim();
    }
  }

  return safeParams;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      const safeParams = getSafeScreenParams(params);

      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...safeParams,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PostHogProvider
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
        maxElementsCaptured: 20,
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="language-select" />
        </Stack>
      </ClerkProvider>
    </PostHogProvider>
  );
}

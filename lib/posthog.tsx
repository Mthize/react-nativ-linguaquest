import PostHog, {
  PostHogProvider as PostHogReactNativeProvider,
  type PostHogProviderProps as PostHogReactNativeProviderProps,
} from "posthog-react-native";

const posthogProjectToken =
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
const posthogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
const isPostHogEnabled = Boolean(posthogProjectToken);

if (!isPostHogEnabled && __DEV__) {
  console.warn(
    "PostHog is disabled because EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is missing.",
  );
}

const noopAsync = async () => undefined;

type PostHogClientMethods = Pick<
  PostHog,
  "capture" | "flush" | "identify" | "screen"
>;

const noopPostHog: PostHogClientMethods = {
  capture: noopAsync,
  flush: noopAsync,
  identify: () => undefined,
  screen: noopAsync,
};

const sdkClient = isPostHogEnabled
  ? new PostHog(posthogProjectToken!, {
      host: posthogHost,
    })
  : (noopPostHog as unknown as PostHog);

export const posthog: PostHog = sdkClient;

export function PostHogProvider({
  children,
  ...props
}: Omit<PostHogReactNativeProviderProps, "client">) {
  if (!isPostHogEnabled || !(sdkClient instanceof PostHog)) {
    return <>{children}</>;
  }

  return (
    <PostHogReactNativeProvider {...props} client={sdkClient}>
      {children}
    </PostHogReactNativeProvider>
  );
}

type PostHogProperties = Record<string, unknown>;

export const posthog = {
  capture: (_event: string, _properties?: PostHogProperties) => {},
  identify: (_distinctId: string, _properties?: PostHogProperties) => {},
};

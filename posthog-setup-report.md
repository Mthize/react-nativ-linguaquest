# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the LinguaQuest Expo app. The `posthog-react-native` SDK was installed alongside its required Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`). A central PostHog client was created in `lib/posthog.ts`, the `PostHogProvider` was added to the root layout with manual screen tracking for Expo Router, and targeted event captures were added to six screens covering the full user journey from onboarding through to active learning. User identification via `posthog.identify()` is performed on both email and SSO sign-up and sign-in completions.

| Event | Description | File |
|---|---|---|
| `onboarding_get_started_clicked` | User taps Get Started on the onboarding screen — top of sign-up funnel | `app/onboarding.tsx` |
| `sign_up_submitted` | User submits the email+password sign-up form | `app/(auth)/sign-up.tsx` |
| `sign_up_completed` | Email verification done; account fully created | `app/(auth)/sign-up.tsx` |
| `sign_up_sso_clicked` | User attempts sign-up via Google, Facebook, or Apple | `app/(auth)/sign-up.tsx` |
| `sign_in_submitted` | User submits the email sign-in form | `app/(auth)/sign-in.tsx` |
| `sign_in_completed` | Email verification done; user fully signed in | `app/(auth)/sign-in.tsx` |
| `sign_in_sso_clicked` | User attempts sign-in via a social provider | `app/(auth)/sign-in.tsx` |
| `language_confirmed` | User confirms their chosen language | `app/language-select.tsx` |
| `continue_learning_clicked` | User taps Continue on the home screen hero card | `app/(tabs)/home.tsx` |
| `view_all_lessons_clicked` | User taps View all in Today's plan section | `app/(tabs)/home.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Signup conversion funnel** — Funnel: `onboarding_get_started_clicked` → `sign_up_submitted` → `sign_up_completed`
2. **Signin conversion funnel** — Funnel: `sign_in_submitted` → `sign_in_completed`
3. **SSO vs email split** — Breakdown of `sign_up_completed` and `sign_in_completed` by `method` property
4. **Language popularity** — Trends of `language_confirmed` broken down by `language_name`
5. **Learning engagement** — Trend of `continue_learning_clicked` over time, broken down by `language`

Create the dashboard here:
- PostHog project: https://eu.i.posthog.com/project/184706/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

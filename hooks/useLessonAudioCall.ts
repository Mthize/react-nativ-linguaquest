import {
  useEffect,
  useRef,
  useState,
} from "react";
import { isRunningInExpoGo } from "expo";
import type {
  Call,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import type { Subscription } from "rxjs";

import {
  type LessonAudioAgentConnectionStatus,
  type LessonAudioAgentSessionResponse,
  type LessonAudioCallPhase,
  type LessonAudioSessionResponse,
} from "@/lib/lesson-audio";
import type { Language, Lesson } from "@/types/learning";

type UseLessonAudioCallParams = {
  enabled: boolean;
  getToken: () => Promise<string | null>;
  isAuthLoaded: boolean;
  isSignedIn: boolean | undefined;
  language: Language;
  lesson: Lesson;
  userId?: string | null;
  userImageUrl?: string | null;
  userName?: string | null;
};

type StreamCallingState =
  | "unknown"
  | "idle"
  | "ringing"
  | "joining"
  | "joined"
  | "left"
  | "reconnecting"
  | "migrating"
  | "reconnecting-failed"
  | "offline";

const CALLING_STATE = {
  IDLE: "idle",
  JOINED: "joined",
  JOINING: "joining",
  LEFT: "left",
  MIGRATING: "migrating",
  OFFLINE: "offline",
  RECONNECTING: "reconnecting",
  RECONNECTING_FAILED: "reconnecting-failed",
} as const satisfies Record<string, StreamCallingState>;

let streamVideoModulePromise:
  | Promise<typeof import("@stream-io/video-react-native-sdk")>
  | null = null;

export function useLessonAudioCall({
  enabled,
  getToken,
  isAuthLoaded,
  isSignedIn,
  language,
  lesson,
  userId,
  userImageUrl,
  userName,
}: UseLessonAudioCallParams) {
  const [call, setCall] = useState<Call | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [callingState, setCallingState] = useState<StreamCallingState>(
    CALLING_STATE.IDLE,
  );
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [phase, setPhase] = useState<LessonAudioCallPhase>("idle");
  const [session, setSession] = useState<LessonAudioSessionResponse | null>(
    null,
  );
  const [agentConnectionError, setAgentConnectionError] = useState<string | null>(
    null,
  );
  const [agentConnectionStatus, setAgentConnectionStatus] =
    useState<LessonAudioAgentConnectionStatus>("idle");
  const [agentSession, setAgentSession] =
    useState<LessonAudioAgentSessionResponse | null>(null);
  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const agentSessionRef = useRef<LessonAudioAgentSessionResponse | null>(null);
  const isEndingRef = useRef(false);

  useEffect(() => {
    callRef.current = call;
  }, [call]);

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
    agentSessionRef.current = agentSession;
  }, [agentSession]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscriptions: Subscription[] = [];

    if (call) {
      subscriptions.push(
        call.state.callingState$.subscribe((nextState) => {
          setCallingState(nextState);
        }),
      );
      subscriptions.push(
        call.microphone.state.status$.subscribe((status) => {
          setMuted(status !== "enabled");
        }),
      );
    } else {
      setCallingState(CALLING_STATE.IDLE);
      setMuted(false);
    }

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [call, enabled]);

  useEffect(() => {
    if (!enabled) {
      setCallingState(CALLING_STATE.IDLE);
      setError(null);
      setMuted(false);
      setPhase("idle");
      setSession(null);
      setAgentConnectionError(null);
      setAgentConnectionStatus("idle");
      setAgentSession(null);
      return;
    }

    if (callingState === CALLING_STATE.JOINED) {
      setPhase("joined");
      return;
    }

    if (
      callingState === CALLING_STATE.JOINING ||
      callingState === CALLING_STATE.RECONNECTING ||
      callingState === CALLING_STATE.MIGRATING
    ) {
      setPhase("connecting");
      return;
    }

    if (
      callingState === CALLING_STATE.RECONNECTING_FAILED ||
      callingState === CALLING_STATE.OFFLINE
    ) {
      setError("The audio room lost connection. Try joining again.");
      setPhase("error");
      return;
    }

    if (
      callingState === CALLING_STATE.LEFT &&
      !isEndingRef.current &&
      phase !== "idle"
    ) {
      setPhase("ended");
    }
  }, [callingState, enabled, phase]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setError(null);
    setPhase("idle");
    setSession(null);
    setAgentConnectionError(null);
    setAgentConnectionStatus("idle");
    setAgentSession(null);

    return () => {
      void cleanupActiveSession();
    };
  }, [enabled, language.code, lesson.id]);

  async function startOrJoinCall() {
    if (!enabled) {
      return;
    }

    if (!isAuthLoaded) {
      setError("Your account is still loading. Try again in a moment.");
      setPhase("error");
      return;
    }

    if (!isSignedIn || !userId) {
      setError("Sign in to start this audio lesson.");
      setPhase("error");
      return;
    }

    if (isRunningInExpoGo()) {
      setError(
        "Stream audio lessons require a development build. Expo Go does not include the native calling modules.",
      );
      setPhase("error");
      return;
    }

    const clerkToken = await getToken();

    if (!clerkToken) {
      setError("Unable to verify your session for this audio lesson.");
      setPhase("error");
      return;
    }

    setError(null);
    setPhase("loading");
    setAgentConnectionError(null);
    setAgentConnectionStatus("idle");
    isEndingRef.current = false;

    try {
      await cleanupActiveSession(clerkToken);

      const response = await fetch("/api/stream/session", {
        body: JSON.stringify({
          languageCode: language.code,
          lessonId: lesson.id,
          userImageUrl,
          userName,
        }),
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const failure = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          failure?.error ?? "Unable to create the audio lesson session.",
        );
      }

      const nextSession = (await response.json()) as LessonAudioSessionResponse;
      const { StreamVideoClient } = await loadStreamVideoModule();
      const nextClient = StreamVideoClient.getOrCreateInstance({
        apiKey: nextSession.apiKey,
        token: nextSession.token,
        user: {
          id: nextSession.user.id,
          image: nextSession.user.image ?? undefined,
          name: nextSession.user.name,
        },
      });
      const nextCall = nextClient.call(
        nextSession.callType,
        nextSession.callId,
      );

      setSession(nextSession);
      setClient(nextClient);
      setCall(nextCall);
      setPhase("connecting");

      await nextCall.join();
      await nextCall.camera.disable().catch(() => undefined);
      setPhase("joined");

      setAgentConnectionStatus("connecting");

      try {
        const agentResponse = await fetch("/api/stream/agent/start", {
          body: JSON.stringify({
            callId: nextSession.callId,
            callType: nextSession.callType,
          }),
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (!agentResponse.ok) {
          const failure = (await agentResponse.json().catch(() => null)) as
            | { error?: string }
            | null;

          throw new Error(
            failure?.error ?? "The AI teacher could not join the audio room.",
          );
        }

        const nextAgentSession =
          (await agentResponse.json()) as LessonAudioAgentSessionResponse;

        setAgentSession(nextAgentSession);
        setAgentConnectionError(null);
        setAgentConnectionStatus("connected");
      } catch (agentStartError) {
        setAgentSession(null);
        setAgentConnectionError(
          agentStartError instanceof Error
            ? agentStartError.message
            : "The AI teacher could not join the audio room.",
        );
        setAgentConnectionStatus("failed");
      }
    } catch (joinError) {
      await cleanupActiveSession(clerkToken);
      setError(
        joinError instanceof Error
          ? joinError.message
          : "Unable to join the Stream audio room.",
      );
      setPhase("error");
    }
  }

  async function toggleMute() {
    if (!callRef.current || phase !== "joined") {
      return;
    }

    try {
      await callRef.current.microphone.toggle();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Unable to update your microphone state.",
      );
      setPhase("error");
    }
  }

  async function endCall() {
    if (!callRef.current && !clientRef.current && !agentSessionRef.current) {
      setPhase("ended");
      return;
    }

    isEndingRef.current = true;
    setError(null);

    const clerkToken = await getToken().catch(() => null);

    try {
      if (callRef.current) {
        try {
          await callRef.current.endCall();
        } catch {
          await callRef.current.leave();
        }
      }

      await cleanupActiveSession(clerkToken);
      setPhase("ended");
    } catch (endError) {
      setError(
        endError instanceof Error
          ? endError.message
          : "Unable to end the current audio lesson.",
      );
      setPhase("error");
    }
  }

  async function cleanupActiveSession(authToken?: string | null) {
    const activeAgentSession = agentSessionRef.current;

    if (activeAgentSession) {
      const clerkToken = authToken ?? (await getToken().catch(() => null));

      if (clerkToken) {
        await fetch(
          `/api/stream/agent/${encodeURIComponent(activeAgentSession.callId)}/${encodeURIComponent(activeAgentSession.sessionId)}`,
          {
            headers: { Authorization: `Bearer ${clerkToken}` },
            method: "DELETE",
          },
        ).catch(() => undefined);
      }
    }

    const activeCall = callRef.current ?? clientRef.current?.state.calls[0];

    if (activeCall) {
      await activeCall.leave().catch(() => undefined);
    }

    if (clientRef.current) {
      await clientRef.current.disconnectUser().catch(() => undefined);
    }

    setCall(null);
    setClient(null);
    setSession(null);
    setAgentSession(null);
    setAgentConnectionError(null);
    setAgentConnectionStatus("idle");
  }

  return {
    agentConnectionError,
    agentConnectionStatus,
    agentSession,
    call,
    callingState,
    client,
    endCall,
    error,
    isJoined: phase === "joined",
    isStarting: phase === "loading" || phase === "connecting",
    muted,
    phase,
    session,
    startOrJoinCall,
    toggleMute,
  };
}

async function loadStreamVideoModule() {
  streamVideoModulePromise ??= import("@stream-io/video-react-native-sdk");
  return streamVideoModulePromise;
}

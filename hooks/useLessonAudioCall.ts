import {
  useCallback,
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
  type LessonAudioCaptionsStatus,
  type LessonAudioAgentConnectionStatus,
  type LessonAudioAgentSessionResponse,
  type LessonAudioCallPhase,
  type LessonAudioLiveCaption,
  type LessonAudioSessionResponse,
  VISION_AGENT_USER_ID,
} from "@/lib/lesson-audio";
import { createBackendUrl } from "@/lib/backend-url";
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
  const [isListening, setIsListening] = useState(false);
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
  const [captionsError, setCaptionsError] = useState<string | null>(null);
  const [captionsStatus, setCaptionsStatus] =
    useState<LessonAudioCaptionsStatus>("idle");
  const [learnerCaption, setLearnerCaption] =
    useState<LessonAudioLiveCaption | null>(null);
  const [teacherCaption, setTeacherCaption] =
    useState<LessonAudioLiveCaption | null>(null);
  const [agentSession, setAgentSession] =
    useState<LessonAudioAgentSessionResponse | null>(null);
  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const agentSessionRef = useRef<LessonAudioAgentSessionResponse | null>(null);
  const getTokenRef = useRef(getToken);
  const isListeningRef = useRef(false);
  const isEndingRef = useRef(false);
  const isStartingRef = useRef(false);

  const cleanupActiveSession = useCallback(async (authToken?: string | null) => {
    if (isListeningRef.current) {
      setIsListening(false);
    }

    await setSpeakerOutputMuted(false);

    const activeAgentSession = agentSessionRef.current;

    if (activeAgentSession) {
      const clerkToken =
        authToken ?? (await getTokenRef.current().catch(() => null));

      if (clerkToken) {
        await fetch(
          createBackendUrl(
            `api/stream/agent/${encodeURIComponent(activeAgentSession.callId)}/${encodeURIComponent(activeAgentSession.sessionId)}`,
          ),
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
    setCaptionsError(null);
    setCaptionsStatus("idle");
    setLearnerCaption(null);
    setTeacherCaption(null);
  }, []);

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
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

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
      subscriptions.push(
        call.state.captioning$.subscribe((isCaptioning) => {
          setCaptionsStatus((currentStatus) => {
            if (isCaptioning) {
              return "live";
            }

            if (currentStatus === "failed") {
              return currentStatus;
            }

            return session?.captionsEnabled ? "starting" : "idle";
          });
        }),
      );
      subscriptions.push(
        call.state.closedCaptions$.subscribe((captions) => {
          const nextTeacherCaption = getLatestCaptionForSpeaker(
            captions,
            VISION_AGENT_USER_ID,
          );
          const nextLearnerCaption = getLatestCaptionForSpeaker(
            captions,
            session?.user.id ?? userId ?? "",
          );

          if (nextTeacherCaption) {
            setTeacherCaption((currentCaption) =>
              shouldReplaceCaption(currentCaption, nextTeacherCaption)
                ? nextTeacherCaption
                : currentCaption,
            );
          }

          if (nextLearnerCaption) {
            setLearnerCaption((currentCaption) =>
              shouldReplaceCaption(currentCaption, nextLearnerCaption)
                ? nextLearnerCaption
                : currentCaption,
            );
          }
        }),
      );
    } else {
      setCallingState(CALLING_STATE.IDLE);
      setIsListening(false);
      setMuted(false);
      setCaptionsStatus("idle");
    }

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [call, enabled, session, userId]);

  useEffect(() => {
    if (!enabled) {
      setCallingState(CALLING_STATE.IDLE);
      setError(null);
      setIsListening(false);
      setMuted(false);
      setPhase("idle");
      setSession(null);
      setAgentConnectionError(null);
      setAgentConnectionStatus("idle");
      setAgentSession(null);
      setCaptionsError(null);
      setCaptionsStatus("idle");
      setLearnerCaption(null);
      setTeacherCaption(null);
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
    setIsListening(false);
    setPhase("idle");
    setSession(null);
    setAgentConnectionError(null);
    setAgentConnectionStatus("idle");
    setAgentSession(null);
    setCaptionsError(null);
    setCaptionsStatus("idle");
    setLearnerCaption(null);
    setTeacherCaption(null);

    return () => {
      void cleanupActiveSession();
    };
  }, [cleanupActiveSession, enabled, language.code, lesson.id]);

  useEffect(() => {
    if (phase === "joined" || !isListeningRef.current) {
      return;
    }

    setIsListening(false);
    void setSpeakerOutputMuted(false);
  }, [phase]);

  async function startOrJoinCall() {
    if (!enabled) {
      return;
    }

    if (isStartingRef.current) {
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

    isStartingRef.current = true;
    let clerkToken: string | null = null;

    try {
      clerkToken = await getToken();

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

      await cleanupActiveSession(clerkToken);

      const response = await fetch(createBackendUrl("api/stream/session"), {
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
      setCaptionsError(nextSession.captionsError ?? null);
      setCaptionsStatus(
        nextSession.captionsEnabled
          ? "starting"
          : nextSession.captionsError
            ? "failed"
            : "idle",
      );
      setLearnerCaption(null);
      setTeacherCaption(null);
      setClient(nextClient);
      setCall(nextCall);
      setPhase("connecting");

      await nextCall.join();
      await nextCall.camera.disable().catch(() => undefined);
      await nextCall.microphone.disable().catch(() => undefined);
      await setSpeakerOutputMuted(false);
      setPhase("joined");

      setAgentConnectionStatus("connecting");

      try {
        const agentResponse = await fetch(
          createBackendUrl("api/stream/agent/start"),
          {
          body: JSON.stringify({
            callId: nextSession.callId,
            callType: nextSession.callType,
          }),
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          },
        );

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
    } finally {
      isStartingRef.current = false;
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

  async function startHoldToTalk() {
    if (!callRef.current || phase !== "joined" || isListeningRef.current) {
      return;
    }

    setError(null);
    setIsListening(true);

    try {
      await setSpeakerOutputMuted(true);

      if (callRef.current.microphone.state.status !== "enabled") {
        await callRef.current.microphone.enable();
      }
    } catch (holdError) {
      await setSpeakerOutputMuted(false);
      setIsListening(false);
      setError(
        holdError instanceof Error
          ? holdError.message
          : "Unable to activate the microphone right now.",
      );
    }
  }

  async function stopHoldToTalk() {
    if (!callRef.current || !isListeningRef.current) {
      return;
    }

    setIsListening(false);

    try {
      if (callRef.current.microphone.state.status === "enabled") {
        await callRef.current.microphone.disable();
      }
    } catch (holdError) {
      setError(
        holdError instanceof Error
          ? holdError.message
          : "Unable to release the microphone right now.",
      );
    } finally {
      await setSpeakerOutputMuted(false);
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

  return {
    agentConnectionError,
    agentConnectionStatus,
    agentSession,
    call,
    callingState,
    captionsError,
    captionsStatus,
    client,
    endCall,
    error,
    isListening,
    isJoined: phase === "joined",
    isStarting: phase === "loading" || phase === "connecting",
    learnerCaption,
    muted,
    phase,
    session,
    startHoldToTalk,
    startOrJoinCall,
    stopHoldToTalk,
    teacherCaption,
    toggleMute,
  };
}

async function loadStreamVideoModule() {
  streamVideoModulePromise ??= import("@stream-io/video-react-native-sdk");
  return streamVideoModulePromise;
}

async function setSpeakerOutputMuted(muted: boolean) {
  const { callManager } = await loadStreamVideoModule();

  if (!callManager?.speaker || typeof callManager.speaker.setMute !== "function") {
    return;
  }

  // Mute teacher playback while the learner is holding the mic to reduce echo.
  callManager.speaker.setMute(muted);
}

type StreamClosedCaption = {
  end_time: string;
  id: string;
  speaker_id: string;
  start_time: string;
  text: string;
  user?: {
    id?: string;
    name?: string;
  } | null;
};

function getLatestCaptionForSpeaker(
  captions: StreamClosedCaption[],
  speakerId: string,
) {
  if (!speakerId) {
    return null;
  }

  const match = [...captions]
    .reverse()
    .find(
      (caption) =>
        caption.user?.id === speakerId || caption.speaker_id === speakerId,
    );

  if (!match) {
    return null;
  }

  return {
    endTime: match.end_time,
    id: match.id,
    speakerId: match.user?.id ?? match.speaker_id,
    speakerName: match.user?.name?.trim() || "Speaker",
    startTime: match.start_time,
    text: match.text.trim(),
  } satisfies LessonAudioLiveCaption;
}

function shouldReplaceCaption(
  currentCaption: LessonAudioLiveCaption | null,
  nextCaption: LessonAudioLiveCaption,
) {
  if (!currentCaption) {
    return true;
  }

  if (currentCaption.id !== nextCaption.id) {
    return true;
  }

  return currentCaption.startTime !== nextCaption.startTime;
}

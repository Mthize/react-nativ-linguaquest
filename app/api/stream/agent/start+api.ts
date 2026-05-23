import type { LessonAudioAgentSessionRequest } from "@/lib/lesson-audio";
import { createVisionAgentServerUrl, readVisionAgentError } from "@/lib/vision-agent-server";
import { verifyClerkRequestUserId } from "@/lib/stream-server";

export async function POST(request: Request) {
  try {
    await verifyClerkRequestUserId(request);

    const body = (await request.json()) as LessonAudioAgentSessionRequest;

    if (!body?.callId || !body?.callType) {
      return Response.json(
        { error: "Missing callId or callType for the agent session." },
        { status: 400 },
      );
    }

    const response = await fetch(
      createVisionAgentServerUrl(
        `calls/${encodeURIComponent(body.callId)}/sessions`,
      ),
      {
        body: JSON.stringify({ call_type: body.callType }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );

    if (!response.ok) {
      return Response.json(
        {
          error: await readVisionAgentError(response),
        },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as {
      call_id: string;
      session_id: string;
      session_started_at: string;
    };

    return Response.json({
      callId: payload.call_id,
      callType: body.callType,
      sessionId: payload.session_id,
      sessionStartedAt: payload.session_started_at,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error("Failed to start Vision Agent session", error);

    return Response.json(
      { error: "Unable to start the AI teacher right now." },
      { status: 500 },
    );
  }
}

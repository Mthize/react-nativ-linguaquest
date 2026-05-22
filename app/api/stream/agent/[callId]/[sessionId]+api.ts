import { createVisionAgentServerUrl, readVisionAgentError } from "@/lib/vision-agent-server";
import { verifyClerkRequestUserId } from "@/lib/stream-server";

export async function DELETE(
  request: Request,
  { callId, sessionId }: Record<string, string>,
) {
  try {
    await verifyClerkRequestUserId(request);

    const response = await fetch(
      createVisionAgentServerUrl(
        `calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
      ),
      { method: "DELETE" },
    );

    if (response.status === 404) {
      return new Response(null, { status: 202 });
    }

    if (!response.ok) {
      return Response.json(
        {
          error: await readVisionAgentError(response),
        },
        { status: response.status },
      );
    }

    return new Response(null, { status: 202 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error("Failed to stop Vision Agent session", error);

    return Response.json(
      { error: "Unable to stop the AI teacher session cleanly." },
      { status: 500 },
    );
  }
}

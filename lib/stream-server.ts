import { verifyToken } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

export function createStreamServerClient() {
  return new StreamClient(
    getRequiredEnv("STREAM_API_KEY"),
    getRequiredEnv("STREAM_API_SECRET"),
  );
}

export async function verifyClerkRequestUserId(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    throw new Response(
      JSON.stringify({ error: "Missing Clerk session token." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }

  const payload = await verifyToken(token, {
    secretKey: getRequiredEnv("CLERK_SECRET_KEY"),
  });
  const clerkUserId = payload?.sub;

  if (typeof clerkUserId !== "string" || clerkUserId.length === 0) {
    throw new Response(
      JSON.stringify({ error: "Unable to verify the signed-in Clerk user." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }

  return clerkUserId;
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("Authorization")?.trim();

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  return token.length > 0 ? token : null;
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server env var: ${name}`);
  }

  return value;
}

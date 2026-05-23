const DEFAULT_VISION_AGENT_SERVER_URL = "http://127.0.0.1:8000";

export function getVisionAgentServerUrl() {
  const configuredUrl = process.env.VISION_AGENT_SERVER_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "VISION_AGENT_SERVER_URL must be set in production for Vision Agent requests.",
    );
  }

  return DEFAULT_VISION_AGENT_SERVER_URL;
}

export function createVisionAgentServerUrl(pathname: string) {
  return new URL(pathname, withTrailingSlash(getVisionAgentServerUrl())).toString();
}

export async function readVisionAgentError(response: Response) {
  const failure = (await response.json().catch(() => null)) as
    | { detail?: string; error?: string }
    | null;

  return failure?.detail ?? failure?.error ?? response.statusText;
}

function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

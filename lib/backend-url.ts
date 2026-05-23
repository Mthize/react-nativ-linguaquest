export function getBackendBaseUrl() {
  const value = process.env.EXPO_PUBLIC_BACKEND_BASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing EXPO_PUBLIC_BACKEND_BASE_URL for audio lesson API requests.",
    );
  }

  return value;
}

export function createBackendUrl(pathname: string) {
  return new URL(pathname, withTrailingSlash(getBackendBaseUrl())).toString();
}

function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

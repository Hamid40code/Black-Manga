/**
 * Holds the short-lived access token for the lifetime of this page runtime.
 * The token is deliberately never written to localStorage, sessionStorage,
 * IndexedDB, or a JavaScript-readable cookie.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

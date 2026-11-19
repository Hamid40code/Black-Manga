import { apiRequest, AuthApiError, isAuthApiConfigured } from './apiClient';
import { clearAccessToken, setAccessToken } from './authToken';

export { AuthApiError, isAuthApiConfigured };

export type CreateAccountPayload = {
  username: string;
  password: string;
  email: string;
};

export type SignInPayload = {
  username: string;
  password: string;
  rememberMe: boolean;
};

type TokenResponse = {
  accessToken?: unknown;
  user?: {
    username?: unknown;
  };
};

export type AuthenticatedUser = {
  username: string | null;
};

function readAccessToken(response: TokenResponse | null): string {
  if (!response || typeof response.accessToken !== 'string' || response.accessToken.trim().length === 0) {
    throw new AuthApiError('SERVER_ERROR');
  }

  return response.accessToken;
}

/** Checks username uniqueness against the real backend. No preview fallback is used. */
export async function checkUsernameAvailability(username: string): Promise<{ exists: boolean }> {
  const result = await apiRequest<{ exists?: unknown }>('/auth/username/check', {
    method: 'POST',
    body: { username },
  });

  if (typeof result?.exists !== 'boolean') throw new AuthApiError('SERVER_ERROR');
  return { exists: result.exists };
}

/** Creates an account through the configured backend. */
export async function createAccount(payload: CreateAccountPayload): Promise<void> {
  await apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

/** Exchanges credentials for a short-lived access token. */
export async function signIn(payload: SignInPayload): Promise<AuthenticatedUser> {
  const result = await apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });

  setAccessToken(readAccessToken(result));
  return { username: payload.username.trim() };
}

/**
 * Restores a session using the backend's HttpOnly refresh cookie.
 * The refresh token itself is never read by JavaScript.
 */
let restoreSessionInFlight: Promise<AuthenticatedUser | null> | null = null;

export function restoreSession(): Promise<AuthenticatedUser | null> {
  if (!isAuthApiConfigured()) return Promise.resolve(null);
  if (restoreSessionInFlight) return restoreSessionInFlight;

  restoreSessionInFlight = (async () => {
    try {
      const result = await apiRequest<TokenResponse>('/auth/refresh', { method: 'POST' });
      setAccessToken(readAccessToken(result));

      const username = result.user?.username;
      return { username: typeof username === 'string' ? username : null };
    } catch (error) {
      clearAccessToken();
      if (error instanceof AuthApiError && (error.status === 401 || error.status === 403)) {
        return null;
      }
      throw error;
    }
  })().finally(() => {
    restoreSessionInFlight = null;
  });

  return restoreSessionInFlight;
}

/** Ends the server session and always clears the in-memory access token. */
export async function signOut(): Promise<void> {
  try {
    if (isAuthApiConfigured()) {
      await apiRequest('/auth/logout', { method: 'POST' });
    }
  } finally {
    clearAccessToken();
  }
}

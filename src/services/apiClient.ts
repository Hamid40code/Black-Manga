import {
  isAuthApiErrorCode,
  type AuthApiErrorCode,
} from '../constants/authErrors';
import { clearAccessToken, getAccessToken, setAccessToken } from './authToken';

const API_BASE_URL = (import.meta.env.VITE_AUTH_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  requiresAuth?: boolean;
};

export class AuthApiError extends Error {
  readonly code: AuthApiErrorCode;
  readonly status?: number;

  constructor(code: AuthApiErrorCode, status?: number) {
    super(code);
    this.name = 'AuthApiError';
    this.code = code;
    this.status = status;
  }
}

function normalizeApiError(body: unknown, status: number): AuthApiErrorCode {
  if (typeof body === 'object' && body !== null && 'code' in body) {
    const code = (body as { code?: unknown }).code;
    if (typeof code === 'string' && isAuthApiErrorCode(code)) return code;
  }

  if (status === 401) return 'INVALID_CREDENTIALS';
  if (status === 403) return 'ACCOUNT_DISABLED';
  if (status === 409) return 'UNKNOWN_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  return 'SERVER_ERROR';
}

function parseResponseBody(responseText: string): unknown {
  if (!responseText.trim()) return null;

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return null;
  }
}

let refreshInFlight: Promise<string | null> | null = null;

/** Rotates an expired access token using the backend-managed HttpOnly cookie. */
async function refreshAccessToken(): Promise<string | null> {
  if (!API_BASE_URL) return null;
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
    } catch {
      throw new AuthApiError('NETWORK_ERROR');
    }

    const body = parseResponseBody(await response.text().catch(() => ''));
    if (response.status === 401 || response.status === 403) {
      clearAccessToken();
      return null;
    }
    if (!response.ok) {
      throw new AuthApiError(normalizeApiError(body, response.status), response.status);
    }

    const token =
      typeof body === 'object' && body !== null && 'accessToken' in body
        ? (body as { accessToken?: unknown }).accessToken
        : undefined;
    if (typeof token !== 'string' || token.trim().length === 0) {
      clearAccessToken();
      throw new AuthApiError('SERVER_ERROR');
    }

    setAccessToken(token);
    return token;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

/** Shared JSON API client. Authenticated requests receive the in-memory bearer token. */
export async function apiRequest<TResponse = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  if (!API_BASE_URL) {
    throw new AuthApiError('API_NOT_CONFIGURED');
  }

  const sendRequest = async (tokenOverride?: string): Promise<Response> => {
    const headers = new Headers({ Accept: 'application/json' });
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');

    if (options.requiresAuth) {
      const token = tokenOverride ?? getAccessToken();
      if (!token) throw new AuthApiError('AUTH_REQUIRED');
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      return await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
        method: options.method ?? 'GET',
        headers,
        credentials: 'include',
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });
    } catch {
      throw new AuthApiError('NETWORK_ERROR');
    }
  };

  let response = await sendRequest();
  let attemptedRefresh = false;
  if (options.requiresAuth && response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (!refreshedToken) throw new AuthApiError('SESSION_EXPIRED', 401);
    attemptedRefresh = true;
    response = await sendRequest(refreshedToken);
  }

  if (attemptedRefresh && response.status === 401) {
    clearAccessToken();
    throw new AuthApiError('SESSION_EXPIRED', 401);
  }

  let responseText = '';
  try {
    responseText = await response.text();
  } catch {
    if (response.ok) return undefined as TResponse;
    throw new AuthApiError('SERVER_ERROR', response.status);
  }

  const responseBody = parseResponseBody(responseText);
  if (!response.ok) {
    throw new AuthApiError(normalizeApiError(responseBody, response.status), response.status);
  }

  return responseBody as TResponse;
}

export function isAuthApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

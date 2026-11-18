import {
  isAuthApiErrorCode,
  type AuthApiErrorCode,
} from '../constants/authErrors';

export type UsernameAvailability = {
  exists: boolean;
  previewMode: boolean;
};

export type CreateAccountPayload = {
  username: string;
  password: string;
  email: string;
};

export type CreateAccountResult =
  | { created: true }
  | { created: false; reason: 'API_NOT_CONFIGURED' };

const API_BASE_URL = (import.meta.env.VITE_AUTH_API_BASE_URL ?? '').replace(/\/+$/, '');

export class AuthApiError extends Error {
  readonly code: AuthApiErrorCode;

  constructor(code: AuthApiErrorCode) {
    super(code);
    this.name = 'AuthApiError';
    this.code = code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeApiError(
  body: unknown,
  status: number,
  conflictCode?: AuthApiErrorCode,
): AuthApiErrorCode {
  const code = isRecord(body) ? body.code : undefined;

  if (typeof code === 'string' && isAuthApiErrorCode(code)) {
    return code;
  }

  if (status === 409) return conflictCode ?? 'UNKNOWN_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  return 'SERVER_ERROR';
}

async function postJson(
  path: string,
  payload: unknown,
  conflictCode?: AuthApiErrorCode,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AuthApiError('NETWORK_ERROR');
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // A successful 204 response is valid for registration; endpoint-specific
    // response validation is performed by the caller when a body is required.
  }

  if (!response.ok) {
    throw new AuthApiError(normalizeApiError(body, response.status, conflictCode));
  }

  return body;
}

/**
 * Checks the username with the future backend.
 * Without an API URL, preview mode lets the email setup screen be tested. It
 * does not query or store user data.
 */
export async function checkUsernameAvailability(username: string): Promise<UsernameAvailability> {
  if (!API_BASE_URL) {
    return { exists: false, previewMode: true };
  }

  const result = await postJson('/auth/username/check', { username }, 'USERNAME_ALREADY_EXISTS');

  if (!isRecord(result) || typeof result.exists !== 'boolean') {
    throw new AuthApiError('SERVER_ERROR');
  }

  return { exists: result.exists, previewMode: false };
}

/** Sends the complete registration request when a backend URL is configured. */
export async function createAccount(payload: CreateAccountPayload): Promise<CreateAccountResult> {
  if (!API_BASE_URL) {
    return { created: false, reason: 'API_NOT_CONFIGURED' };
  }

  // The API contract defines any successful 2xx response as completed creation.
  await postJson('/auth/register', payload);
  return { created: true };
}

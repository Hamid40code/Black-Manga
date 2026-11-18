import type { AuthErrorCode } from '../types/auth.types';
import { FORM_LIMITS } from './formLimits';

/** Errors the authentication API is allowed to return to the client. */
export const AUTH_API_ERROR_CODES = [
  'USERNAME_ALREADY_EXISTS',
  'EMAIL_ALREADY_IN_USE',
  'INVALID_CREDENTIALS',
  'ACCOUNT_DISABLED',
  'RATE_LIMITED',
  'NETWORK_ERROR',
  'SERVER_ERROR',
  'UNKNOWN_ERROR',
] as const satisfies readonly AuthErrorCode[];

export type AuthApiErrorCode = (typeof AUTH_API_ERROR_CODES)[number];

const AUTH_API_ERROR_CODE_SET: ReadonlySet<string> = new Set(AUTH_API_ERROR_CODES);

/** Converts an untrusted API code into a known, safe error-code type. */
export function isAuthApiErrorCode(code: string): code is AuthApiErrorCode {
  return AUTH_API_ERROR_CODE_SET.has(code);
}

/** User-facing sign-in, registration, and authentication messages. */
export const AUTH_ERRORS: Record<AuthErrorCode, string> = {
  USERNAME_REQUIRED: 'Enter a username.',
  USERNAME_TOO_SHORT: `Username must contain at least ${FORM_LIMITS.username.min} characters.`,
  USERNAME_TOO_LONG: `Username must contain no more than ${FORM_LIMITS.username.max} characters.`,
  USERNAME_ALREADY_EXISTS: 'That username is already taken.',
  PASSWORD_REQUIRED: 'Enter a password.',
  PASSWORD_TOO_SHORT: `Use at least ${FORM_LIMITS.password.min} characters.`,
  PASSWORD_TOO_LONG: `Use no more than ${FORM_LIMITS.password.max} characters.`,
  PASSWORD_MISSING_UPPERCASE: 'Add an uppercase letter (A–Z).',
  PASSWORD_MISSING_LOWERCASE: 'Add a lowercase letter (a–z).',
  PASSWORD_MISSING_NUMBER: 'Add a number (0–9).',
  CONFIRM_PASSWORD_REQUIRED: 'Repeat your password.',
  PASSWORDS_DO_NOT_MATCH: 'The passwords do not match.',
  EMAIL_ALREADY_IN_USE: 'This email is already connected to an account.',
  INVALID_CREDENTIALS: 'Username or password is incorrect.',
  ACCOUNT_DISABLED: 'This account is unavailable.',
  RATE_LIMITED: 'Too many attempts. Try again later.',
  NETWORK_ERROR: 'Connection failed. Try again.',
  SERVER_ERROR: 'Server error. Try again later.',
  UNKNOWN_ERROR: 'Unable to continue. Try again.',
};

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return AUTH_ERRORS[code];
}

/** Converts only recognized API errors into safe, user-facing messages. */
export function getAuthErrorFromApi(code: string): string {
  return isAuthApiErrorCode(code) ? AUTH_ERRORS[code] : AUTH_ERRORS.UNKNOWN_ERROR;
}

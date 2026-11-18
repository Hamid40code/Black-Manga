import type { EmailErrorCode } from '../types/email.types';

/** Email-specific messages; these are not used by the username sign-in form. */
export const EMAIL_ERRORS: Record<EmailErrorCode, string> = {
  EMAIL_REQUIRED: 'Enter your email address.',
  EMAIL_INVALID: 'Enter a valid email address.',
  EMAIL_TOO_LONG: 'Email address is too long.',
};

export function getEmailErrorMessage(code: EmailErrorCode): string {
  return EMAIL_ERRORS[code];
}

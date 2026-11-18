import type { EmailErrorCode } from '../types/email.types';
import { FORM_LIMITS } from '../constants/formLimits';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address for future registration, profile, or recovery forms.
 * It is intentionally separate from username-based sign-in.
 */
export function validateEmail(emailValue: string): EmailErrorCode | null {
  const email = emailValue.trim();

  if (!email) return 'EMAIL_REQUIRED';
  if (email.length > FORM_LIMITS.email.max) return 'EMAIL_TOO_LONG';
  if (!EMAIL_PATTERN.test(email)) return 'EMAIL_INVALID';

  return null;
}

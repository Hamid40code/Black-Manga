import type { SignInErrors, SignInValues } from '../types/auth.types';
import { FORM_LIMITS } from '../constants/formLimits';

/**
 * Validates the username and password shown on the sign-in form.
 * Passwords are not trimmed: spaces remain part of the password.
 */
export function validateSignIn(values: SignInValues): SignInErrors {
  const errors: SignInErrors = {};
  const username = values.username.trim();
  const password = values.password;

  if (!username) {
    errors.username = 'USERNAME_REQUIRED';
  } else if (username.length < FORM_LIMITS.username.min) {
    errors.username = 'USERNAME_TOO_SHORT';
  } else if (username.length > FORM_LIMITS.username.max) {
    errors.username = 'USERNAME_TOO_LONG';
  }

  if (!password) {
    errors.password = 'PASSWORD_REQUIRED';
  } else if (password.length < FORM_LIMITS.password.min) {
    errors.password = 'PASSWORD_TOO_SHORT';
  } else if (password.length > FORM_LIMITS.password.max) {
    errors.password = 'PASSWORD_TOO_LONG';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'PASSWORD_MISSING_UPPERCASE';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'PASSWORD_MISSING_LOWERCASE';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'PASSWORD_MISSING_NUMBER';
  }

  return errors;
}

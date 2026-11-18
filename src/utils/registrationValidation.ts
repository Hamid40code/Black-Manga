import type { RegistrationCredentials, RegistrationErrors } from '../types/registration.types';
import { validateSignIn } from './validation';

/** Validates the first step of account creation without duplicating sign-in rules. */
export function validateRegistrationCredentials(
  values: RegistrationCredentials,
): RegistrationErrors {
  const errors: RegistrationErrors = validateSignIn({
    username: values.username,
    password: values.password,
  });

  if (!values.confirmPassword) {
    errors.confirmPassword = 'CONFIRM_PASSWORD_REQUIRED';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'PASSWORDS_DO_NOT_MATCH';
  }

  return errors;
}

import type { AuthErrorCode } from './auth.types';

export type RegistrationCredentials = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type RegistrationField = keyof RegistrationCredentials;

export type RegistrationErrors = Partial<Record<RegistrationField, AuthErrorCode>>;

export type RegistrationStep = 'credentials' | 'email' | 'complete';

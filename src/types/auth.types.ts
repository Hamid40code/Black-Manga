export type SignInValues = {
  username: string;
  password: string;
};

export type SignInField = keyof SignInValues;

export type AuthErrorCode =
  | 'USERNAME_REQUIRED'
  | 'USERNAME_TOO_SHORT'
  | 'USERNAME_TOO_LONG'
  | 'USERNAME_ALREADY_EXISTS'
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_LONG'
  | 'PASSWORD_MISSING_UPPERCASE'
  | 'PASSWORD_MISSING_LOWERCASE'
  | 'PASSWORD_MISSING_NUMBER'
  | 'CONFIRM_PASSWORD_REQUIRED'
  | 'PASSWORDS_DO_NOT_MATCH'
  | 'EMAIL_ALREADY_IN_USE'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DISABLED'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export type SignInErrors = Partial<Record<SignInField, AuthErrorCode>>;

export type FormNotice = {
  type: 'info' | 'error';
  message: string;
};

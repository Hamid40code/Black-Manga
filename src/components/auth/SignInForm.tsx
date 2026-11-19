import { useState, type FormEvent } from 'react';
import FormStatus from './FormStatus';
import PrimaryActionButton from './PrimaryActionButton';
import FloatingInput from './FloatingInput';
import PasswordInput from './PasswordInput';
import { getAuthErrorFromApi, getAuthErrorMessage } from '../../constants/authErrors';
import { validateSignIn } from '../../utils/validation';
import type { FormNotice, SignInErrors, SignInValues } from '../../types/auth.types';
import type { AuthenticatedUser } from '../../services/authApi';
import { AuthApiError, signIn } from '../../services/authApi';
import { FORM_LIMITS } from '../../constants/formLimits';

type SignInFormProps = {
  values: SignInValues;
  onValuesChange: (field: keyof SignInValues, value: string) => void;
  onCreateAccount: () => void;
  onAuthenticated: (user: AuthenticatedUser) => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
};

export default function SignInForm({
  values,
  onValuesChange,
  onCreateAccount,
  onAuthenticated,
  rememberMe,
  onRememberMeChange,
}: SignInFormProps) {
  const [errors, setErrors] = useState<SignInErrors>({});
  const [notice, setNotice] = useState<FormNotice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Preserve deliberate focus-to-edit behavior without allowing browser autofill.
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);

  function handleChange(field: keyof SignInValues, value: string) {
    onValuesChange(field, value);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const validationErrors = validateSignIn(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const user = await signIn({
        username: values.username.trim(),
        password: values.password,
        rememberMe,
      });
      onAuthenticated(user);
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? getAuthErrorFromApi(error.code)
          : getAuthErrorMessage('UNKNOWN_ERROR');
      setNotice({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleForgotPassword() {
    setNotice({ type: 'info', message: 'Password recovery is not connected yet.' });
  }

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-3" aria-label="Sign in form">
      <div className="space-y-0">
        <FloatingInput
          id="username"
          name="username"
          type="text"
          label="Username"
          leadingIcon="user"
          autoComplete="off"
          readOnly={!usernameEditable}
          onFocus={() => setUsernameEditable(true)}
          autoCapitalize="none"
          spellCheck={false}
          minLength={FORM_LIMITS.username.min}
          maxLength={FORM_LIMITS.username.max}
          disabled={isSubmitting}
          required
          value={values.username}
          onChange={(event) => handleChange('username', event.target.value)}
          error={errors.username ? getAuthErrorMessage(errors.username) : undefined}
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          readOnly={!passwordEditable}
          onFocus={() => setPasswordEditable(true)}
          minLength={FORM_LIMITS.password.min}
          maxLength={FORM_LIMITS.password.max}
          disabled={isSubmitting}
          required
          value={values.password}
          onChange={(event) => handleChange('password', event.target.value)}
          error={errors.password ? getAuthErrorMessage(errors.password) : undefined}
        />
      </div>

      <div className="flex min-h-5 items-center justify-between gap-3 text-[12px]">
        <label
          htmlFor="sign-in-remember-me"
          className="inline-flex cursor-pointer items-center gap-2 text-white/75 transition-colors hover:text-white"
        >
          <input
            id="sign-in-remember-me"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            disabled={isSubmitting}
            onChange={(event) => onRememberMeChange(event.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer rounded border border-white/35 bg-white/10 accent-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          />
          <span>Remember me</span>
        </label>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isSubmitting}
          className="shrink-0 text-amber-100/90 underline decoration-amber-200/35 underline-offset-4 transition-colors hover:text-amber-50 disabled:opacity-50"
        >
          Forgot password?
        </button>
      </div>

      <FormStatus notice={notice} compact />

      <PrimaryActionButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'SIGNING IN…' : 'SIGN IN'}
      </PrimaryActionButton>

      <p className="pt-2 text-center text-xs text-white/60">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onCreateAccount}
          disabled={isSubmitting}
          className="font-semibold text-amber-100 underline decoration-amber-200/40 underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:opacity-50"
        >
          Create account
        </button>
      </p>
    </form>
  );
}

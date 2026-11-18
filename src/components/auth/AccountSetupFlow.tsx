import { useCallback, useState, type FormEvent } from 'react';
import FloatingInput, { MailIcon } from './FloatingInput';
import PasswordInput from './PasswordInput';
import SignInForm from './SignInForm';
import FormStatus from './FormStatus';
import PrimaryActionButton from './PrimaryActionButton';
import LegalModal, { type LegalDocument } from './LegalModal';
import { getAuthErrorFromApi, getAuthErrorMessage } from '../../constants/authErrors';
import { getEmailErrorMessage } from '../../constants/emailErrors';
import type { FormNotice, SignInValues } from '../../types/auth.types';
import type {
  RegistrationCredentials,
  RegistrationErrors,
  RegistrationStep,
} from '../../types/registration.types';
import { checkUsernameAvailability, createAccount, AuthApiError } from '../../services/authApi';
import { validateEmail } from '../../utils/emailValidation';
import { validateRegistrationCredentials } from '../../utils/registrationValidation';
import { FORM_LIMITS } from '../../constants/formLimits';

const INITIAL_CREDENTIALS: RegistrationCredentials = {
  username: '',
  password: '',
  confirmPassword: '',
};

const INITIAL_SIGN_IN_VALUES: SignInValues = {
  username: '',
  password: '',
};

export default function AccountSetupFlow() {
  const [page, setPage] = useState<'signup' | 'signin'>('signup');
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null);
  const closeLegalModal = useCallback(() => setLegalDocument(null), []);
  const [step, setStep] = useState<RegistrationStep>('credentials');
  const [credentials, setCredentials] = useState<RegistrationCredentials>(INITIAL_CREDENTIALS);
  // Keep sign-in input values above the page switch so unmounting the form
  // does not clear them. They start empty on every fresh page load.
  const [signInValues, setSignInValues] = useState<SignInValues>(INITIAL_SIGN_IN_VALUES);
  // UI state only for now; authentication can use this when session persistence is implemented.
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [credentialErrors, setCredentialErrors] = useState<RegistrationErrors>({});
  const [emailError, setEmailError] = useState<string>();
  const [notice, setNotice] = useState<FormNotice | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  function handleCredentialChange(field: keyof RegistrationCredentials, value: string) {
    setCredentials((current) => ({ ...current, [field]: value }));
    setCredentialErrors((current) => ({ ...current, [field]: undefined }));
    setNotice(null);
  }

  function handleSignInValueChange(field: keyof SignInValues, value: string) {
    setSignInValues((current) => ({ ...current, [field]: value }));
  }

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const validationErrors = validateRegistrationCredentials(credentials);
    setCredentialErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(credentials.username.trim());

      if (result.exists) {
        setCredentialErrors((current) => ({
          ...current,
          username: 'USERNAME_ALREADY_EXISTS',
        }));
        return;
      }

      // No database is queried in preview mode. The backend check becomes active
      // as soon as VITE_AUTH_API_BASE_URL is configured.
      setStep('email');
      setNotice(
        result.previewMode
          ? { type: 'info', message: 'Preview mode: username availability is not being checked yet.' }
          : null,
      );
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? getAuthErrorFromApi(error.code)
          : getAuthErrorMessage('UNKNOWN_ERROR');
      setNotice({ type: 'error', message });
    } finally {
      setIsCheckingUsername(false);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(getEmailErrorMessage(emailValidationError));
      return;
    }

    setEmailError(undefined);
    setIsCreatingAccount(true);

    try {
      const result = await createAccount({
        username: credentials.username.trim(),
        password: credentials.password,
        email: email.trim(),
      });

      if (!result.created) {
        setNotice({
          type: 'info',
          message: 'Backend is not connected. Your information has not been saved.',
        });
        return;
      }

      setStep('complete');
      setCredentials((current) => ({ ...current, password: '', confirmPassword: '' }));
      setEmail('');
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? getAuthErrorFromApi(error.code)
          : getAuthErrorMessage('UNKNOWN_ERROR');
      setNotice({ type: 'error', message });
    } finally {
      setIsCreatingAccount(false);
    }
  }

  function goBackToCredentials() {
    setStep('credentials');
    setEmailError(undefined);
    setNotice(null);
  }

  if (page === 'signin') {
    return (
      <div className="w-full">
        <h1 className="mb-5 text-center font-serif text-[30px] font-medium tracking-[-0.025em] text-white">
          Welcome back
        </h1>
        <SignInForm
          values={signInValues}
          onValuesChange={handleSignInValueChange}
          onCreateAccount={() => setPage('signup')}
          rememberMe={rememberMe}
          onRememberMeChange={setRememberMe}
        />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="w-full text-center">
        <h1 className="mb-5 font-serif text-[30px] font-medium tracking-[-0.025em] text-white">
          Account created
        </h1>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-200/10 text-emerald-100 mx-auto">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-white/75">Your account is ready.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-5 text-center font-serif text-[30px] font-medium tracking-[-0.025em] text-white">
        {step === 'credentials' ? 'Create account' : 'Account setup'}
      </h1>

      {step === 'credentials' ? (
        <form
          onSubmit={handleCredentialsSubmit}
          noValidate
          className="space-y-1"
          aria-label="Create account form"
        >
          <FloatingInput
            id="username"
            name="username"
            type="text"
            label="Username"
            leadingIcon="user"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            minLength={FORM_LIMITS.username.min}
            maxLength={FORM_LIMITS.username.max}
            disabled={isCheckingUsername}
            required
            value={credentials.username}
            onChange={(event) => handleCredentialChange('username', event.target.value)}
            error={
              credentialErrors.username
                ? getAuthErrorMessage(credentialErrors.username)
                : undefined
            }
          />
          <PasswordInput
            id="new-password"
            name="password"
            label="Password"
            autoComplete="new-password"
            minLength={FORM_LIMITS.password.min}
            maxLength={FORM_LIMITS.password.max}
            disabled={isCheckingUsername}
            required
            value={credentials.password}
            onChange={(event) => handleCredentialChange('password', event.target.value)}
            error={
              credentialErrors.password
                ? getAuthErrorMessage(credentialErrors.password)
                : undefined
            }
          />
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            label="Repeat password"
            autoComplete="new-password"
            minLength={FORM_LIMITS.password.min}
            maxLength={FORM_LIMITS.password.max}
            disabled={isCheckingUsername}
            required
            value={credentials.confirmPassword}
            onChange={(event) => handleCredentialChange('confirmPassword', event.target.value)}
            error={
              credentialErrors.confirmPassword
                ? getAuthErrorMessage(credentialErrors.confirmPassword)
                : undefined
            }
          />

          <FormStatus notice={notice} />

          <PrimaryActionButton type="submit" disabled={isCheckingUsername}>
            {isCheckingUsername ? 'CHECKING…' : 'CONTINUE'}
          </PrimaryActionButton>
        </form>
      ) : (
        <form onSubmit={handleEmailSubmit} noValidate className="space-y-1" aria-label="Email setup form">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-white/75">
            <span className="text-amber-100/80"><MailIcon /></span>
            <span className="min-w-0 truncate text-sm">{credentials.username.trim()}</span>
            <span className="ml-auto shrink-0 text-[10px] uppercase tracking-[0.14em] text-white/40">Username</span>
          </div>

          <FloatingInput
            id="account-email"
            name="email"
            type="email"
            label="Email address"
            leadingIcon="mail"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={FORM_LIMITS.email.max}
            disabled={isCreatingAccount}
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError(undefined);
              setNotice(null);
            }}
            error={emailError}
          />

          <FormStatus notice={notice} />

          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button
              type="button"
              onClick={goBackToCredentials}
              className="h-[52px] rounded-xl border border-white/20 bg-white/[0.06] px-5 text-xs font-semibold tracking-[0.12em] text-white/80 transition-colors hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100"
            >
              BACK
            </button>
            <PrimaryActionButton type="submit" disabled={isCreatingAccount}>
              {isCreatingAccount ? 'SAVING…' : 'CREATE ACCOUNT'}
            </PrimaryActionButton>
          </div>
        </form>
      )}

      <div className="mt-1 space-y-3 text-center">
        <p className="text-[11px] leading-5 text-white/55">
          By creating an account, you agree to our{' '}
          <button
            type="button"
            onClick={() => setLegalDocument('terms')}
            className="font-medium text-amber-100/90 underline decoration-amber-200/40 underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setLegalDocument('privacy')}
            className="font-medium text-amber-100/90 underline decoration-amber-200/40 underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            Privacy Policy
          </button>
          .
        </p>
        <p className="text-xs text-white/60">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setPage('signin')}
            disabled={isCheckingUsername || isCreatingAccount}
            className="font-semibold text-amber-100 underline decoration-amber-200/40 underline-offset-4 transition-colors hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign in
          </button>
        </p>
      </div>

      {legalDocument ? (
        <LegalModal document={legalDocument} onClose={closeLegalModal} />
      ) : null}
    </div>
  );
}

import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import FieldError from './FieldError';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  id: string;
  label: string;
  error?: string;
};

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <rect x="4.25" y="10" width="15.5" height="10.25" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10V7.25a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path d="M3 3 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.9 5.25A10.8 10.8 0 0 1 12 5c5.2 0 8.7 4.6 9.5 6-.3.55-1.15 1.8-2.45 2.95M6.2 6.2C4.4 7.4 3.2 9.15 2.5 11c.8 1.5 4.3 7 9.5 7 1.1 0 2.1-.2 3.05-.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function PasswordInput({ id, label, error, ...inputProps }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`group relative rounded-xl border bg-white/[0.045] transition-colors duration-200 ${
          error
            ? 'border-rose-300/60'
            : 'border-white/15 hover:border-white/25 focus-within:border-amber-200/70 focus-within:bg-white/[0.065]'
        }`}
      >
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors duration-200 group-focus-within:text-amber-100/90">
          <LockIcon />
        </span>
        <input
          {...inputProps}
          id={id}
          type={isVisible ? 'text' : 'password'}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-error`}
          className="floating-input h-14 w-full rounded-xl bg-transparent pb-2 pl-12 pr-14 pt-6 text-[15px] text-white outline-none placeholder:text-transparent"
        />
        <label
          htmlFor={id}
          className="floating-label pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[14px] text-white/55"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          <VisibilityIcon visible={isVisible} />
        </button>
      </div>

      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

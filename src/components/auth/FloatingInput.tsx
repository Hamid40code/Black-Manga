import type { InputHTMLAttributes } from 'react';
import FieldError from './FieldError';

type FloatingInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  id: string;
  label: string;
  error?: string;
  leadingIcon: 'user' | 'mail';
};

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.25 19a6.75 6.75 0 0 1 13.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7 7.5 5.75L19.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FloatingInput({
  id,
  label,
  error,
  leadingIcon,
  ...inputProps
}: FloatingInputProps) {
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
          {leadingIcon === 'user' ? <UserIcon /> : <MailIcon />}
        </span>
        <input
          {...inputProps}
          id={id}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-error`}
          className="floating-input h-14 w-full rounded-xl bg-transparent pb-2 pl-12 pr-4 pt-6 text-[15px] text-white outline-none placeholder:text-transparent"
        />
        <label
          htmlFor={id}
          className="floating-label pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[14px] text-white/55"
        >
          {label}
        </label>
      </div>

      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

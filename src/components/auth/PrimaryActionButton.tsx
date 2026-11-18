import type { ButtonHTMLAttributes } from 'react';

/** Shared primary button styling and light-sweep animation for auth actions. */
type PrimaryActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryActionButton({
  children,
  className = '',
  ...buttonProps
}: PrimaryActionButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#d7a45e] via-[#e4bd7d] to-[#c98a49] px-5 text-sm font-semibold tracking-[0.12em] text-[#21170e] shadow-[0_10px_28px_rgba(194,132,65,0.20)] transition-all duration-300 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100 disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-22deg] bg-white/25 transition-transform duration-700 group-hover:translate-x-[480%]"
      />
    </button>
  );
}

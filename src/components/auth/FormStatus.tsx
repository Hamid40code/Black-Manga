import type { FormNotice } from '../../types/auth.types';

type FormStatusProps = {
  notice: FormNotice | null;
  compact?: boolean;
};

/** Fixed-height status area so notices never shift the form layout. */
export default function FormStatus({ notice, compact = false }: FormStatusProps) {
  const tone = notice?.type === 'error' ? 'text-rose-200' : 'text-amber-100/90';

  return (
    <div
      className={`flex ${compact ? 'h-[30px]' : 'h-[34px]'} items-center overflow-hidden`}
      role="status"
      aria-live="polite"
    >
      {notice ? (
        <p className={`line-clamp-2 text-[10px] leading-[14px] ${tone}`}>
          {notice.message}
        </p>
      ) : null}
    </div>
  );
}

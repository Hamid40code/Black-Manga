type FieldErrorProps = {
  id: string;
  message?: string;
};

/** A fixed-height, accessible error slot shared by all form fields. */
export default function FieldError({ id, message }: FieldErrorProps) {
  return (
    <div
      id={id}
      aria-live="polite"
      aria-atomic="true"
      className="mt-1 flex h-[34px] items-start overflow-hidden"
    >
      {message ? (
        <p className="flex items-start gap-1.5 text-[10px] leading-[14px] text-rose-200">
          <span
            aria-hidden="true"
            className="mt-px inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-rose-200/70 text-[8px] font-bold"
          >
            !
          </span>
          <span className="line-clamp-2">{message}</span>
        </p>
      ) : null}
    </div>
  );
}

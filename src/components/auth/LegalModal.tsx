import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type LegalDocument = 'terms' | 'privacy';

type LegalModalProps = {
  document: LegalDocument;
  onClose: () => void;
};

const LEGAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    intro: 'These starter terms describe the basic rules for using the manga website. Review and adapt them before making the website publicly available.',
    sections: [
      {
        heading: 'Using your account',
        body: 'Keep your username and password private. You are responsible for activity carried out through your account and should tell the site team if you believe your account has been accessed without permission.',
      },
      {
        heading: 'Acceptable use',
        body: 'Use the website lawfully and respectfully. Do not attempt to disrupt the service, access another person’s account, upload harmful code, or misuse content or other users’ information.',
      },
      {
        heading: 'Content and availability',
        body: 'Website content may change or become temporarily unavailable. Any rights in manga, artwork, trademarks, or other third-party material remain with their respective owners.',
      },
      {
        heading: 'Changes and contact',
        body: 'These terms may be updated as the website develops. Add the website operator’s contact details and the applicable governing-law information before launch.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'This starter notice explains how account information is intended to be handled. Replace it with a policy that accurately describes your production backend before launch.',
    sections: [
      {
        heading: 'Information you provide',
        body: 'Registration is designed to collect a username, password, and email address. The production service should never store passwords in plain text; passwords must be securely hashed on the server.',
      },
      {
        heading: 'How information is used',
        body: 'Account information should be used only for creating and securing accounts, providing requested website features, and sending essential account-related messages.',
      },
      {
        heading: 'Storage and sharing',
        body: 'A production privacy notice must identify the service providers that process account data, how long data is retained, and when information may be disclosed. Do not publish this draft until those details are confirmed.',
      },
      {
        heading: 'Your choices',
        body: 'Provide a clear way for users to request access, correction, or deletion of their account information, and publish a contact address for privacy questions.',
      },
    ],
  },
} satisfies Record<LegalDocument, {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}>;

export default function LegalModal({ document, onClose }: LegalModalProps) {
  const content = LEGAL_CONTENT[document];
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = window.document.body.style.overflow;
    const previouslyFocused = window.document.activeElement instanceof HTMLElement
      ? window.document.activeElement
      : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && window.document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && window.document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button:not([disabled])')?.focus();
    window.document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        aria-describedby="legal-modal-intro"
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[min(82svh,700px)] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#15171c]/90 shadow-[0_30px_100px_rgba(0,0,0,0.60)] backdrop-blur-xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 id="legal-modal-title" className="font-serif text-xl text-white sm:text-2xl">
            {content.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white/70 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <p id="legal-modal-intro" className="mb-5 text-sm leading-6 text-white/65">
            {content.intro}
          </p>
          <div className="space-y-5">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-1 text-sm font-semibold text-amber-100/90">
                  {section.heading}
                </h3>
                <p className="text-sm leading-6 text-white/75">{section.body}</p>
              </section>
            ))}
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/10 px-5 py-4 text-right sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/[0.08] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white/85 transition-colors hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            CLOSE
          </button>
        </footer>
      </section>
    </div>,
    window.document.body,
  );
}

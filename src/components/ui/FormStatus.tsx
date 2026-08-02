import type { ReactElement } from 'react';

import { AlertIcon } from '@/components/ui/icons/AlertIcon';
import { CheckIcon } from '@/components/ui/icons/CheckIcon';
import { SpinnerIcon } from '@/components/ui/icons/SpinnerIcon';
import { cn } from '@/lib/cn';

/** Discriminated union, not four optional booleans (AGENTS.md §4). */
export type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

interface FormStatusProps {
  state: FormState;
  /**
   * Direct email address, shown as a fallback whenever submission fails.
   * docs/2-architecture.md §9 requires no silent failure path — if the form
   * breaks, the reader still has a way to reach you.
   */
  fallbackEmail: string;
  /** True when the visitor prefers reduced motion; replaces the spinner. */
  reducedMotion?: boolean;
  className?: string;
}

/**
 * Live region above the submit button (docs/3-style-preference.md §5.7).
 *
 * The region is always mounted and merely empty while idle. Mounting it at the
 * same moment its message appears means assistive tech never announces the
 * change.
 */
export const FormStatus = ({
  state,
  fallbackEmail,
  reducedMotion = false,
  className,
}: FormStatusProps): ReactElement => (
  <div role="status" aria-live="polite" className={cn('min-h-0', className)}>
    {state.status === 'submitting' ? (
      <p className="flex items-center gap-2 text-body-sm text-fg-muted">
        {reducedMotion ? null : (
          <SpinnerIcon width={16} height={16} className="animate-spin" />
        )}
        Sending…
      </p>
    ) : null}

    {state.status === 'success' ? (
      <p className="flex items-center gap-2 rounded-md bg-surface p-3 text-body-sm text-success">
        <CheckIcon width={16} height={16} className="shrink-0" />
        {state.message}
      </p>
    ) : null}

    {state.status === 'error' ? (
      <div className="flex items-start gap-2 rounded-md bg-surface p-3 text-body-sm text-danger">
        <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
        <span>
          {state.message} You can also email{' '}
          <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4">
            {fallbackEmail}
          </a>
          .
        </span>
      </div>
    ) : null}
  </div>
);

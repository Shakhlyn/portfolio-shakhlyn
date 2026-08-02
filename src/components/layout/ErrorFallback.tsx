import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface ErrorFallbackProps {
  /** Shown only in development. Never a raw stack trace in production. */
  detail?: string;
}

const handleReload = (): void => {
  window.location.reload();
};

/**
 * docs/3-style-preference.md §6.14 — same shape as the 404, plus a reload
 * action. Never a blank screen; a portfolio that white-screens in front of a
 * recruiter is the worst possible failure mode (AGENTS.md §5).
 */
export const ErrorFallback = ({ detail }: ErrorFallbackProps): ReactElement => (
  <Container as="section" className="py-32 text-center">
    <h1
      tabIndex={-1}
      className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      Something went wrong
    </h1>

    <p className="mx-auto mt-3 max-w-content text-body text-fg-muted md:text-body-md">
      This page failed to load. Reloading usually fixes it.
    </p>

    {import.meta.env.DEV && detail ? (
      <pre className="mx-auto mt-6 max-w-content overflow-x-auto rounded-md border border-border bg-surface p-4 text-left text-body-sm text-fg-muted">
        {detail}
      </pre>
    ) : null}

    <div className="mt-8 flex justify-center">
      <Button variant="primary" size="lg" onClick={handleReload}>
        Reload page
      </Button>
    </div>
  </Container>
);

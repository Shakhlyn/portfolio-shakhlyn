import type { ReactElement } from 'react';

import { Container } from '@/components/ui/Container';

/** Stub for /writing. WritingCard and WritingEmptyState are E14. */
export const WritingPage = (): ReactElement => (
  <Container as="section" className="py-16">
    <h1
      tabIndex={-1}
      className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      Writing
    </h1>
  </Container>
);

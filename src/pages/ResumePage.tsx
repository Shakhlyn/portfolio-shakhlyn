import type { ReactElement } from 'react';

import { Container } from '@/components/ui/Container';

/** Stub for /resume. ResumeViewer and ResumeDownloadLink are E12. */
export const ResumePage = (): ReactElement => (
  <Container as="section" className="py-16">
    <h1
      tabIndex={-1}
      className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      Resume
    </h1>
  </Container>
);

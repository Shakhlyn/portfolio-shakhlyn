import type { ReactElement } from 'react';

import { Container } from '@/components/ui/Container';
import { PROFILE } from '@/data/profile';

/**
 * Stub. The Hero, Current Role, Projects, About, Skills, Resume, and Contact
 * sections are E09–E13; this holds the h1 and the section order they slot into.
 */
export const HomePage = (): ReactElement => (
  <Container as="section" className="py-24">
    {/* tabIndex -1 so route-change focus management can land here. */}
    <h1
      tabIndex={-1}
      className="max-w-content text-display text-fg focus-visible:outline-none md:text-display-md"
    >
      {PROFILE.name}
    </h1>
    <p className="mt-4 max-w-content text-body-lg text-fg-muted md:text-body-lg-md">
      {PROFILE.roleFraming}
    </p>
  </Container>
);

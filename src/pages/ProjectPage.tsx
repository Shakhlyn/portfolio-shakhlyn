import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { Container } from '@/components/ui/Container';

/**
 * Stub for /projects/:slug. ProjectCaseStudy and unknown-slug handling are E10.
 * Until PROJECTS has content, this renders the raw slug.
 */
export const ProjectPage = (): ReactElement => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Container as="article" className="py-16">
      <h1
        tabIndex={-1}
        className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
      >
        {slug}
      </h1>
    </Container>
  );
};

import type { ReactElement } from 'react';

import { Container } from '@/components/ui/Container';
import { WRITING_METADATA } from '@/data/metadata';
import { getPublishedPosts } from '@/data/writing';
import { useDocumentMetadata } from '@/hooks/useDocumentMetadata';

/** Stub for /writing. WritingCard and WritingEmptyState are E14. */
export const WritingPage = (): ReactElement => {
  /*
   * `noindex` is a condition, not a constant (docs/2-architecture.md §8):
   * "Allow indexing for writing posts only after real manually maintained
   * content exists." Written this way it flips itself the day the first post is
   * published, so E14 has nothing to remember to undo.
   *
   * TODO(E14): confirm the flip against a real post rather than against a stub.
   */
  const hasPosts = getPublishedPosts().length > 0;

  useDocumentMetadata({ ...WRITING_METADATA, noindex: !hasPosts });

  return (
    <Container as="section" className="py-16">
      <h1
        tabIndex={-1}
        className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
      >
        Writing
      </h1>
    </Container>
  );
};

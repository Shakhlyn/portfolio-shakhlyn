import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { Container } from '@/components/ui/Container';
import { buildWritingPostMetadata, NOT_FOUND_METADATA } from '@/data/metadata';
import { getPostBySlug } from '@/data/writing';
import { useDocumentMetadata } from '@/hooks/useDocumentMetadata';

/** Stub for /writing/:slug. Real post rendering is E14. */
export const WritingPostPage = (): ReactElement => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  /*
   * A slug with no published post must not claim a title that does not exist,
   * so it borrows the 404's metadata rather than describing itself
   * (docs/2-architecture.md §8: indexing only once real content exists).
   *
   * TODO(E14): the page still renders the raw slug as its h1. Rendering is
   * E14's; only the head is E15's.
   */
  useDocumentMetadata(
    post?.published ? buildWritingPostMetadata(post) : NOT_FOUND_METADATA,
  );

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

import { useEffect } from 'react';

import { applyMetadata, resetMetadata } from '@/lib/metadata';
import type { RouteMetadataType } from '@/types/metadata.types';

/**
 * Applies a route's metadata for as long as the route is mounted, and restores
 * the `index.html` defaults when it unmounts.
 *
 * **The cleanup is the reason this hook exists.** Without it, visiting
 * `/writing` and navigating home leaves the home page carrying `noindex`, and
 * the only symptom is traffic that never arrives.
 */
export const useDocumentMetadata = ({
  title,
  description,
  path,
  noindex,
}: RouteMetadataType): void => {
  // The four primitives, not the object: a fresh object every render would
  // rewrite the head on every keystroke in the contact form.
  useEffect(() => {
    applyMetadata({ title, description, path, noindex });

    return resetMetadata;
  }, [title, description, path, noindex]);
};

import type { ProjectType } from '@/types/project.types';

/**
 * Lowercase alphanumeric segments joined by single hyphens. This is what makes
 * a URL human-readable rather than merely unique (1-prd.md §5 SEO).
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const findDuplicate = (values: readonly string[]): string | undefined => {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) return value;
    seen.add(value);
  }

  return undefined;
};

/**
 * Makes `project.types.ts`'s promise executable — "Stable identity. Slugs are
 * validated against this, never derived at runtime."
 *
 * Deliberately **not** checked: that `slug === id`. They are equal for every
 * entry today, and enforcing it would collapse two fields into one. The id is
 * stable identity that other data can reference; the slug is a URL that may be
 * rewritten for readability without breaking those references.
 *
 * Throws rather than returning a result: a broken slug produces a
 * `/projects/:slug` that silently renders the 404, which is the failure mode
 * loud enough to be worth stopping for.
 */
export const assertValidProjectSlugs = (projects: readonly ProjectType[]): void => {
  const duplicateId = findDuplicate(projects.map((project) => project.id));
  if (duplicateId) {
    throw new Error(`Duplicate project id: "${duplicateId}" (src/data/projects.ts)`);
  }

  const duplicateSlug = findDuplicate(projects.map((project) => project.slug));
  if (duplicateSlug) {
    throw new Error(`Duplicate project slug: "${duplicateSlug}" (src/data/projects.ts)`);
  }

  const malformed = projects.find((project) => !SLUG_PATTERN.test(project.slug));
  if (malformed) {
    throw new Error(
      `Project slug "${malformed.slug}" (id "${malformed.id}") is not lowercase-kebab. ` +
        `Expected /${SLUG_PATTERN.source}/ — it becomes a public URL.`,
    );
  }
};

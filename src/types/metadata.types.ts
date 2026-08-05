export interface RouteMetadataType {
  /**
   * Page-specific title, composed as `${title} — ${SITE_NAME}`. Pass SITE_NAME
   * itself on the home page and `buildTitle` returns SITE_TITLE unchanged,
   * rather than the name twice.
   */
  title: string;
  /** Practical target is 155–160 characters; longer is truncated at display. */
  description: string;
  /** Site-root path, e.g. `/projects/data-slicing`. Made absolute internally. */
  path: string;
  /** Omit on indexable routes. `true` emits `noindex, nofollow`. */
  noindex?: boolean;
}

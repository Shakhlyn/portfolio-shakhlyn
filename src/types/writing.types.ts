export interface WritingPostType {
  slug: string;
  title: string;
  /** ISO 8601 date, e.g. "2026-08-02". */
  date: string;
  summary: string;
  /** Paragraphs of body copy. No MDX dependency in v1 (docs/2-architecture.md §3). */
  body: string[];
  /**
   * Only published posts render and are indexable. Placeholder-only writing
   * routes stay `noindex` until real content exists (docs/2-architecture.md §8).
   */
  published: boolean;
}

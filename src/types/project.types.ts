export type ProjectCategory = 'professional' | 'personal';

export interface ProjectImageType {
  src: string;
  width: number;
  height: number;
  alt: string;
  /**
   * Candidate set for `srcset`, widest last, each entry a `<url> <width>w` pair.
   * Optional: a project with one committed size renders `src` alone rather than
   * a one-entry `srcset`, which tells the browser nothing it did not know.
   *
   * `src` stays the widest candidate, so a browser without `srcset` support
   * still gets a correct — merely larger — image.
   */
  srcSet?: string;
}

export interface ProjectType {
  /** Stable identity. Slugs are validated against this, never derived at runtime. */
  id: string;
  /** Human-readable URL segment for /projects/:slug. */
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  problem: string;
  /** The candidate's own role on the project (1-prd.md §6). */
  role: string;
  approach: string;
  stack: string[];
  outcome: string;
  tags: string[];
  /**
   * All optional. Only links present in the data render — no dead links, no
   * disabled placeholders (docs/2-architecture.md §11).
   */
  githubUrl?: string;
  liveUrl?: string;
  caseStudySlug?: string;
  /** Omitted when no real screenshot exists; the card then omits the frame entirely. */
  image?: ProjectImageType;
}

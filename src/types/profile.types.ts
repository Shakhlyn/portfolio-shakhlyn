export interface PortraitType {
  src: string;
  width: number;
  height: number;
  /** Real alt text — the person's name. Never empty for the hero portrait. */
  alt: string;
  /**
   * Candidate set for `srcset`, widest last, each entry a `<url> <width>w` pair.
   * `src` stays the widest candidate so a browser without `srcset` support gets
   * a correct image rather than none.
   */
  srcSet?: string;
}

export interface SocialLinksType {
  /**
   * Every link is optional. A link the person does not have is omitted, never
   * set to '' or '#' — that is what makes the no-dead-links rule enforceable at
   * the type level rather than by discipline (docs/2-architecture.md §11).
   */
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
}

/**
 * Which hero layout renders (docs/4-interaction-design.md §5.1).
 *
 * An explicit discriminator, never inferred from whether `portrait` happens to
 * be populated: layout and artwork are two independent decisions, and deriving
 * one from the other means the `split` layout cannot be built or reviewed until
 * a photograph exists.
 */
export type HeroLayout = 'stacked' | 'split';

/**
 * Hero CTA labels. `1-prd.md` §6 lists these under required Hero Content, so
 * they live in data like every other piece of copy, not in the component.
 */
export interface HeroCtaLabelsType {
  /** Primary CTA, to the /resume route. */
  resume: string;
  /** Secondary CTA, to the #contact anchor. */
  contact: string;
}

export interface ProfileType {
  /** Full name. Used as the hero h1. */
  name: string;
  /**
   * Short display name for the header wordmark. Separate from `name` because
   * the full legal name does not fit an h-16 bar at 320px, and deriving it by
   * slicing `name` would hardcode an assumption about name structure.
   */
  wordmark: string;
  /** Target role framing, e.g. "Full-stack & AI Engineer". */
  roleFraming: string;
  /** Mono eyebrow above the h1 — availability or location. */
  eyebrow: string;
  /** Value proposition. Two lines maximum. */
  valueProposition: string;
  currentPositionRole: string;
  currentPositionCompany: string;
  social: SocialLinksType;
  heroCtas: HeroCtaLabelsType;
  /** Selects the hero layout. Required, so a profile can never omit the choice. */
  layout: HeroLayout;
  /**
   * The portrait that fills the `split` layout's slot. Optional because the
   * slot is aspect-ratio-locked and reserves its space without it — a missing
   * photograph is never a broken layout (docs/4-interaction-design.md §5.1).
   */
  portrait?: PortraitType;
}

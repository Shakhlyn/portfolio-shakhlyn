export interface PortraitType {
  src: string;
  width: number;
  height: number;
  /** Real alt text — the person's name. Never empty for the hero portrait. */
  alt: string;
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
  /**
   * Optional by design. Its presence selects the two-column hero layout;
   * its absence selects text-only (docs/4-interaction-design.md §5.1).
   * This one field is the entire layout switch.
   */
  portrait?: PortraitType;
}

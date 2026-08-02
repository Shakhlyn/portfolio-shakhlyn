export interface AboutType {
  /**
   * Prose paragraphs, rendered in order at `max-w-content`. Two or three
   * (docs/3-style-preference.md §6.5) — no accordion, no "read more".
   */
  paragraphs: string[];
  /** Optional closing line naming the roles being targeted. */
  lookingFor?: string;
}

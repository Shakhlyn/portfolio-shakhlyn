/**
 * The focus ring, defined once and used by every interactive element
 * (docs/3-style-preference.md §4.5).
 *
 * focus-visible: only, never focus: (AGENTS.md §10). `focus:` fires on mouse
 * click and makes every button look permanently selected.
 */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/** Visually hidden, but present in the accessibility tree. */
export const SR_ONLY = 'sr-only';

/** Appended to the accessible name of any link that opens a new tab. */
export const NEW_TAB_LABEL = '(opens in a new tab)';

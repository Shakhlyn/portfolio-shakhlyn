/**
 * Motion tokens — docs/3-style-preference.md §8, docs/4-interaction-design.md §8.
 *
 * docs/4-interaction-design.md §8 is a closed inventory of eleven animations.
 * If an animation is not on that list, it does not ship (AGENTS.md §7).
 */

export const DURATION_HOVER = 0.15;
export const DURATION_REVEAL = 0.4;
export const DURATION_PAGE = 0.2;
export const DURATION_MENU = 0.2;

export const EASE_OUT = 'easeOut' as const;
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

export const STAGGER_CARDS = 0.06;
export const STAGGER_BADGES = 0.04;

/**
 * Total stagger per group is capped at ~300ms. A 10-card stagger at 60ms is
 * 600ms of waiting — cap the stagger, not the card count.
 */
export const STAGGER_MAX_TOTAL = 0.3;

/** Reveal once only; re-animating on every scroll pass reads as unpolished. */
export const VIEWPORT_ONCE = { once: true, margin: '-80px' } as const;

/** Distance for fade-up reveals, in px. */
export const REVEAL_OFFSET_Y = 12;

/** Distance for the page transition, in px. */
export const PAGE_OFFSET_Y = 8;

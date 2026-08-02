/**
 * Site-wide constants. SCREAMING_SNAKE_CASE per AGENTS.md §3. Consumed by E15.
 *
 * TODO(content): SITE_URL needs the real deployed domain before launch — it is
 * what absolute OG image and canonical URLs are built from.
 */
export const SITE_URL = 'https://example.com';

export const SITE_TITLE = 'Shaokh Al Mahmud Shakhlyn — Software Engineer';

export const SITE_DESCRIPTION =
  'Software engineer with 2+ years building enterprise web applications in TypeScript, React, Python, and FastAPI on distributed international teams.';

/** TODO(content): the OG image itself is not committed yet. */
export const OG_IMAGE_PATH = '/og/portfolio-og.png';

/**
 * Scroll-spy timings — docs/4-interaction-design.md §3. Defined here so E07
 * does not have to invent them.
 *
 * A section activates once it crosses the upper third of the viewport, which is
 * where people actually read.
 */
export const SCROLL_SPY_ROOT_MARGIN = '-20% 0px -70% 0px';

/**
 * Scroll spy is suppressed for this long after a nav click, so sections passed
 * through during a smooth scroll do not flicker the active indicator.
 */
export const NAV_CLICK_SUPPRESS_MS = 700;

/** The header gains its border and blur past this scroll offset. */
export const HEADER_SCROLL_THRESHOLD = 8;

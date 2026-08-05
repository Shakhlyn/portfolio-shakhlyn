/**
 * Site-wide constants. SCREAMING_SNAKE_CASE per AGENTS.md §3.
 *
 * This module is imported by `vite.config.ts` as well as by the app, so it must
 * stay free of asset imports, JSX, and browser globals — the config is bundled
 * by esbuild, which has no loader for `.webp` and no DOM.
 *
 * TODO(content): SITE_URL is a placeholder domain.
 * TODO(deploy): every absolute URL in `dist/` is derived from it, so link
 * previews fetch nothing until it is the real domain. Set it in E18 — it is the
 * only place the host appears.
 */
export const SITE_URL = 'https://shakhlyn.dev';

export const SITE_TITLE = 'Shaokh Al Mahmud Shakhlyn — Software Engineer';

export const SITE_DESCRIPTION =
  'Software engineer with 2+ years building enterprise web applications in TypeScript, React, Python, and FastAPI on distributed international teams.';

/** The person, not the positioning. `SITE_TITLE` carries the keywords. */
export const SITE_NAME = 'Shaokh Al Mahmud Shakhlyn';

export const SITE_LOCALE = 'en_US';

/** Mirrors PROFILE.socials.x — the card wants the handle, not the URL. */
export const TWITTER_HANDLE = '@Shakhlyn';

/**
 * Placeholder OG image, generated from the design tokens. Replace before launch
 * (1-prd.md §6 permits a placeholder during development only).
 *
 * TODO(content): still the generated placeholder.
 */
export const OG_IMAGE_PATH = '/og/portfolio-og.png';

/** Measured from the committed file. Declaring dimensions it does not have is
 * worse than declaring none — unfurlers reserve the space before fetching. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = `${SITE_NAME} — software engineer portfolio`;

/**
 * Absolute URL from a site-root path. Every crawler-facing URL goes through
 * here, so the domain is written once and changed once.
 */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();

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

/**
 * How close to the document bottom counts as "the page cannot scroll further".
 *
 * The last section can only reach the activation band if it, plus the footer,
 * is taller than 70% of the viewport — otherwise the page runs out of scroll
 * with the band still over the section above, and that one stays lit. Two
 * pixels of slack absorb sub-pixel rounding at fractional zoom, the same
 * reasoning as the carousel's end detection.
 */
export const SCROLL_BOTTOM_EPSILON = 2;

/** The header gains its border and blur past this scroll offset. */
export const HEADER_SCROLL_THRESHOLD = 8;

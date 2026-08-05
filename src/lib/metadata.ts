import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/constants/site';
import type { RouteMetadataType } from '@/types/metadata.types';

/**
 * The small internal metadata utility docs/2-architecture.md §8 asks for — no
 * `react-helmet`, no `react-head`.
 *
 * **React 19's native `<title>`/`<meta>` hoisting is deliberately not used.** It
 * is the shorter answer and it cannot express *removal*: a route that renders no
 * `<meta name="robots">` does not clear one the previous route rendered, so the
 * home page would inherit `/writing`'s `noindex` and nothing in the UI would say
 * so. Explicit apply/reset is the whole point.
 *
 * Open Graph is not written per route. Unfurlers do not execute JavaScript, so
 * a runtime `og:title` is visible only to crawlers that already read the real
 * heading — it would be effort spent on an audience of nobody. The static set in
 * `index.html` is what LinkedIn and Slack actually see.
 */

/** Home passes SITE_NAME and gets SITE_TITLE, not the name twice. */
export const buildTitle = (title: string): string =>
  title === SITE_NAME ? SITE_TITLE : `${title} — ${SITE_NAME}`;

/**
 * Find-or-create, never blind-append: appending unconditionally leaves one stale
 * `description` per navigation, and a crawler reads the first one it finds.
 */
const upsertMeta = (name: string, content: string): void => {
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertCanonical = (href: string): void => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

/** Removed, not set to `index` — an explicit `index` is noise a crawler ignores. */
const removeRobots = (): void => {
  document.head.querySelector('meta[name="robots"]')?.remove();
};

export const applyMetadata = ({
  title,
  description,
  path,
  noindex,
}: RouteMetadataType): void => {
  document.title = buildTitle(title);
  upsertMeta('description', description);
  upsertCanonical(absoluteUrl(path));

  if (noindex) {
    // `nofollow` matters on the 404 specifically: its recovery links point at
    // real routes, and a crawler that treats a soft-404 as a hub is how a
    // "Page Not Found" title ends up ranking.
    upsertMeta('robots', 'noindex, nofollow');
  } else {
    removeRobots();
  }
};

/** Restores the `index.html` defaults. Called by the hook's cleanup. */
export const resetMetadata = (): void => {
  document.title = SITE_TITLE;
  upsertMeta('description', SITE_DESCRIPTION);
  upsertCanonical(absoluteUrl('/'));
  removeRobots();
};

/**
 * FormSubmit's AJAX endpoint (docs/2-architecture.md §9).
 *
 * **This is the token form, never `formsubmit.co/ajax/{address}`.** The
 * plain-address form would ship the contact address into the bundle a second
 * time, inside a URL, where a harvester finds it without parsing anything.
 *
 * The token is **not a secret and is not treated as one.** It reaches the
 * bundle on any static host, so a `VITE_` environment variable would keep it
 * out of git history and not out of the deployed JavaScript — the appearance of
 * a secret without the property. A plain constant is the honest version.
 *
 * `/ajax/` rather than the bare path: it answers with JSON instead of
 * redirecting to a provider-hosted thank-you page, which is what lets the page
 * survive its own submission and show the states in
 * docs/4-interaction-design.md §5.7.
 */
export const CONTACT_ENDPOINT =
  'https://formsubmit.co/ajax/c0b6500b908543aa0ae546b5c2b894f8';

/**
 * FormSubmit's reserved honeypot field. A submission arriving with it filled is
 * accepted and discarded by the provider — a bot is told nothing, which is the
 * point.
 */
export const HONEYPOT_FIELD = '_honey';

/** Subject line on the notification email, so it is filterable in a real inbox. */
export const CONTACT_SUBJECT = 'Portfolio contact form';

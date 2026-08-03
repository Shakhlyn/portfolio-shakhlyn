/**
 * The three fields from docs/3-style-preference.md §6.8, in DOM order.
 *
 * Order is load-bearing: a failed submit focuses the first invalid field, and
 * "first" means first on screen, not first key in an object literal
 * (docs/4-interaction-design.md §5.7).
 */
export const CONTACT_FIELD_NAMES = ['name', 'email', 'message'] as const;

export type ContactFieldName = (typeof CONTACT_FIELD_NAMES)[number];

export type ContactValues = Record<ContactFieldName, string>;

/**
 * An absent key is a valid field. "No error" is not the empty string — that
 * would make `errors.email` truthy-checkable only by length, and one `if`
 * written the obvious way would mark every valid field invalid.
 */
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

/** Which fields the visitor has finished with, so blur validation stays quiet until then. */
export type ContactTouched = Partial<Record<ContactFieldName, boolean>>;

/**
 * The transport's answer, discriminated rather than thrown.
 *
 * A rejected `fetch`, a non-`ok` response, and a body that does not confirm
 * success are the same thing to the caller: the message did not arrive
 * (docs/2-architecture.md §11 — no silent failure path).
 */
export type ContactSubmitResult = { status: 'sent' } | { status: 'failed' };

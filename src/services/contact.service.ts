import { CONTACT_ENDPOINT, CONTACT_SUBJECT, HONEYPOT_FIELD } from '@/constants/contact';
import type { ContactSubmitResult, ContactValues } from '@/types/contact.types';

interface SubmitContactInput {
  values: ContactValues;
  /** The honeypot's current value. Empty for a human; anything else for a bot. */
  honeypot: string;
}

/**
 * FormSubmit answers `{ success: 'true' | 'false', message: string }`.
 *
 * **Both facts below were verified against the live endpoint on 2026-08-03, not
 * assumed**, because both are ways this function could report a delivery that
 * never happened (docs/2-architecture.md §11):
 *
 * 1. `success` is a **string**. `if (body.success)` treats `'false'` as
 *    success, because a non-empty string is truthy. Compared against the
 *    literal for that reason.
 * 2. A wrong or dead token answers **HTTP 200** with `success: 'false'` —
 *    observed reply: "Email address … is not formatted correctly." So
 *    `response.ok` alone proves nothing, and the body check is the only thing
 *    standing between a broken endpoint and a green confirmation.
 *
 * Typed as `unknown` and narrowed rather than asserted: this body crosses the
 * network from a third party and nothing guarantees its shape.
 */
const isDelivered = (body: unknown): boolean =>
  typeof body === 'object' &&
  body !== null &&
  'success' in body &&
  String((body as { success: unknown }).success) === 'true';

/**
 * The whole transport, in one function (docs/2-architecture.md §9).
 *
 * Nothing else in the app knows the provider exists, so changing it is a change
 * to this file and the endpoint constant — no component, no hook.
 *
 * It resolves to a discriminated result and never throws: a rejected `fetch`
 * (offline, DNS, CORS), a non-`ok` response, and a body that does not confirm
 * delivery are the same fact to the caller — the message did not arrive.
 *
 * The endpoint requires an `Origin`/`Referer`, which the browser sets on every
 * `fetch` and which no header here can or should forge. A request without one is
 * refused with "Make sure you open this page through a web server" — worth
 * knowing before concluding from a command-line probe that the token is dead.
 */
export const submitContact = async ({
  values,
  honeypot,
}: SubmitContactInput): Promise<ContactSubmitResult> => {
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        message: values.message,
        _subject: CONTACT_SUBJECT,
        // Replies go to the sender. Without it, replying to the notification
        // replies to yourself.
        _replyto: values.email,
        // The AJAX endpoint is consumed by this page; a captcha redirect has
        // nowhere to render.
        _captcha: 'false',
        [HONEYPOT_FIELD]: honeypot,
      }),
    });

    if (!response.ok) {
      return { status: 'failed' };
    }

    const body: unknown = await response.json();

    return isDelivered(body) ? { status: 'sent' } : { status: 'failed' };
  } catch {
    return { status: 'failed' };
  }
};

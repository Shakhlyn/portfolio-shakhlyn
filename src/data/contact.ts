import type { ContactFieldName } from '@/types/contact.types';

interface ContactFieldCopy {
  label: string;
  required: boolean;
  /** Shown when a required field is blurred or submitted empty. Optional fields have none. */
  requiredMessage?: string;
  /** Shown when the value is present but malformed. Only Email has one. */
  invalidMessage?: string;
  /** Ceiling and the message shown when it is passed. Both or neither. */
  maxLength?: number;
  tooLongMessage?: string;
}

interface ContactCopy {
  fields: Record<ContactFieldName, ContactFieldCopy>;
  submitLabel: string;
  /** Replaces the form once a submission is delivered. */
  successMessage: string;
  /**
   * Shown with the mailto fallback FormStatus appends. It must not imply the
   * message was stored anywhere — it was not.
   */
  errorMessage: string;
  /**
   * Announced after a failed submit (docs/4-interaction-design.md §5.7). Two
   * strings rather than one with a plural rule: English needs exactly two forms
   * here, and a template that says "1 fields" is the kind of detail that reads
   * as carelessness on a page whose whole job is not reading as careless.
   */
  invalidOne: string;
  invalidMany: string;
  /** Heading for the direct-contact column beside the form. */
  directHeading: string;
  directDescription: string;
}

/**
 * Every user-visible string in the contact section.
 *
 * DRAFT COPY — the wording is mine, not yours, the same footing `about.ts` is
 * on. `1-prd.md` §6 permits unpolished copy during development and expects it
 * rewritten before launch.
 *
 * TODO(content): rewrite in your own voice. Validation messages are read by a
 * stranger at their most impatient, so short beats polite.
 *
 * Required-ness is data, not markup: the asterisk in the label and the rule in
 * the validator both read `required` from here, so the two cannot disagree
 * (docs/3-style-preference.md §6.8).
 *
 * The length ceilings carry over from the previous portfolio's form. They are
 * not a formatting preference — an unbounded textarea posted to a third-party
 * endpoint is what a spam bot fills, and the provider rejects an oversized body
 * with an error the visitor cannot act on. Catching it here produces one they can.
 */
export const CONTACT: ContactCopy = {
  fields: {
    name: {
      label: 'Name',
      required: false,
      maxLength: 100,
      tooLongMessage: 'Keep this under 100 characters.',
    },
    email: {
      label: 'Email',
      required: true,
      requiredMessage: 'Add an email address so I can reply.',
      invalidMessage: 'That does not look like an email address.',
    },
    message: {
      label: 'Message',
      required: true,
      requiredMessage: 'Add a message.',
      maxLength: 2000,
      tooLongMessage: 'Keep this under 2000 characters.',
    },
  },
  submitLabel: 'Send message',
  successMessage: 'Thanks — your message is on its way. I usually reply within a day.',
  errorMessage: 'That did not send.',
  invalidOne: 'One field needs attention.',
  invalidMany: '{count} fields need attention.',
  directHeading: 'Or reach me directly',
  directDescription: 'Email is the fastest way to get a reply.',
};

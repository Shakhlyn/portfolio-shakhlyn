import { CONTACT } from '@/data/contact';
import type {
  ContactErrors,
  ContactFieldName,
  ContactValues,
} from '@/types/contact.types';
import { CONTACT_FIELD_NAMES } from '@/types/contact.types';

/**
 * Shape check, not an RFC-complete one. Carried over from the previous
 * portfolio's form.
 *
 * A validator strict enough to reject a real address costs more than one that
 * lets a typo through: the typo bounces back to a visitor who can fix it, while
 * a false rejection loses the contact entirely. `type="email"` is the second
 * line of defence and the recipient is the third.
 */
const EMAIL_SHAPE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Is this one field valid? Pure — it answers "is this value acceptable", never
 * "should we be asking yet". Timing belongs to `useContactForm` (E13-T04).
 *
 * Returns the message to show, or `undefined` when the field is fine.
 */
export const validateField = (
  field: ContactFieldName,
  values: ContactValues,
): string | undefined => {
  const copy = CONTACT.fields[field];
  const value = values[field].trim();

  if (!value) {
    // An optional field left empty is valid, and an optional field carries no
    // required message to show even if this branch were reached.
    return copy.required ? copy.requiredMessage : undefined;
  }

  if (copy.maxLength !== undefined && value.length > copy.maxLength) {
    return copy.tooLongMessage;
  }

  if (field === 'email' && !EMAIL_SHAPE.test(value)) {
    return copy.invalidMessage;
  }

  return undefined;
};

/**
 * Every field, in DOM order. The first key present is therefore the first
 * invalid field on screen, which is the one a failed submit focuses
 * (docs/4-interaction-design.md §5.7).
 *
 * Mapped over the union rather than written out per field, so adding a field to
 * `CONTACT_FIELD_NAMES` cannot leave a validator behind.
 */
export const validateContact = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};

  for (const field of CONTACT_FIELD_NAMES) {
    const message = validateField(field, values);
    if (message) {
      errors[field] = message;
    }
  }

  return errors;
};

/** The first invalid field in DOM order, or `undefined` when the form is valid. */
export const firstInvalidField = (errors: ContactErrors): ContactFieldName | undefined =>
  CONTACT_FIELD_NAMES.find((field) => errors[field] !== undefined);

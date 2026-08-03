import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';

import type { FormState } from '@/components/ui/FormStatus';
import { CONTACT } from '@/data/contact';
import { firstInvalidField, validateContact, validateField } from '@/lib/validateContact';
import { submitContact } from '@/services/contact.service';
import type {
  ContactErrors,
  ContactFieldName,
  ContactTouched,
  ContactValues,
} from '@/types/contact.types';

const EMPTY_VALUES: ContactValues = { name: '', email: '', message: '' };
const ALL_TOUCHED: ContactTouched = { name: true, email: true, message: true };

interface UseContactFormOptions {
  /**
   * Called with the first invalid field, synchronously inside the submit event.
   *
   * The hook names the field; the caller owns the refs and does the focusing
   * (docs/tickets/E13-tickets.md T04). A callback rather than a returned value
   * because focus is an event, not a state: returning the field name would make
   * two consecutive failed submits on an unchanged form indistinguishable, and
   * the second one would move nothing.
   */
  onInvalid: (field: ContactFieldName) => void;
}

interface UseContactFormResult {
  values: ContactValues;
  errors: ContactErrors;
  touched: ContactTouched;
  state: FormState;
  honeypot: string;
  onHoneypotChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (
    field: ContactFieldName,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (
    field: ContactFieldName,
  ) => (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * Values, validation timing, and the submission state machine
 * (docs/4-interaction-design.md §5.7).
 *
 * The timing is the reason this is a hook rather than four `useState` calls in
 * the component:
 *
 * - Typing updates the value and validates nothing. Validating a keystroke
 *   marks a half-typed address invalid and punishes someone mid-word.
 * - Blur validates that field alone, once it has been touched.
 * - Submit validates everything, marks every field touched, and hands the first
 *   invalid field in DOM order to `onInvalid`.
 *
 * `FormState` is imported from `FormStatus` rather than redeclared. A parallel
 * union is how a `submitting` state stops disabling the button: the two drift,
 * and only one of them is the one the component switches on.
 *
 * No `useEffect`. Every transition here is caused by an event, and an effect
 * synchronising state to state is the anti-pattern AGENTS.md §5 names.
 */
export const useContactForm = ({
  onInvalid,
}: UseContactFormOptions): UseContactFormResult => {
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<ContactTouched>({});
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const [honeypot, setHoneypot] = useState('');

  const onChange = useCallback(
    (field: ContactFieldName) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = event.target;
        setValues((current) => ({ ...current, [field]: value }));

        // Clear a message the visitor is actively fixing. Leaving it up while
        // they correct the field tells them the correction did not count.
        setErrors((current) => {
          if (current[field] === undefined) {
            return current;
          }
          const next = { ...current };
          delete next[field];
          return next;
        });
      },
    [],
  );

  const onBlur = useCallback(
    (field: ContactFieldName) =>
      (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { value } = event.target;
        setTouched((current) => ({ ...current, [field]: true }));

        // Read from the event rather than from `values`: on a blur caused by
        // the same interaction that changed the field, state has not committed
        // yet and would validate the previous value.
        const message = validateField(field, { ...values, [field]: value });

        setErrors((current) => {
          const next = { ...current };
          if (message) {
            next[field] = message;
          } else {
            delete next[field];
          }
          return next;
        });
      },
    [values],
  );

  const onHoneypotChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setHoneypot(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      const nextErrors = validateContact(values);
      const invalid = firstInvalidField(nextErrors);

      setTouched(ALL_TOUCHED);
      setErrors(nextErrors);

      if (invalid) {
        // The count rides in the error state's message — no fourth FormState
        // variant, no change to an E05 component
        // (docs/4-interaction-design.md §5.7).
        const count = Object.keys(nextErrors).length;
        setState({
          status: 'error',
          message:
            count === 1
              ? CONTACT.invalidOne
              : CONTACT.invalidMany.replace('{count}', String(count)),
        });
        onInvalid(invalid);
        return;
      }

      setState({ status: 'submitting' });

      void submitContact({ values, honeypot }).then((result) => {
        setState(
          result.status === 'sent'
            ? { status: 'success', message: CONTACT.successMessage }
            : { status: 'error', message: CONTACT.errorMessage },
        );
      });

      // Values are deliberately not cleared on either branch. On error,
      // retyping a message because a network call failed is the fastest way to
      // lose a contact (§5.7). On success the form is replaced, so there is no
      // field left to clear.
    },
    [honeypot, onInvalid, values],
  );

  return {
    values,
    errors,
    touched,
    state,
    honeypot,
    onHoneypotChange,
    onChange,
    onBlur,
    onSubmit,
  };
};

export type { UseContactFormResult };

import type { ReactElement } from 'react';
import { useCallback, useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { FormStatus } from '@/components/ui/FormStatus';
import { TextArea } from '@/components/ui/TextArea';
import { TextInput } from '@/components/ui/TextInput';
import { HONEYPOT_FIELD } from '@/constants/contact';
import { SR_ONLY } from '@/constants/styles';
import { CONTACT } from '@/data/contact';
import { CONTACT_EMAIL } from '@/data/profile';
import { useContactForm } from '@/hooks/useContactForm';
import { useMotionVariants } from '@/hooks/useMotionVariants';
import type { ContactFieldName } from '@/types/contact.types';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * The contact form (docs/4-interaction-design.md §5.7,
 * docs/3-style-preference.md §6.8).
 *
 * Markup only — validation timing and the submission state machine are
 * `useContactForm`, and the endpoint is `contact.service.ts`. This component
 * knows neither.
 *
 * `TextInput` and `TextArea` already own their label, the `*` for required,
 * `aria-invalid`, and the `aria-describedby` wiring to their message. Nothing
 * here adds ARIA of its own; doing so would produce two elements claiming to
 * describe the same field.
 */
export const ContactForm = (): ReactElement => {
  const { reducedMotion } = useMotionVariants();

  /**
   * Refs by field name, so a failed submit can focus the first invalid one.
   * A ref map rather than three refs: the hook names the field, and translating
   * a name back into one of three variables is a switch that exists only to
   * undo the abstraction.
   */
  const fieldRefs = useRef<Partial<Record<ContactFieldName, FieldElement | null>>>({});

  const focusField = useCallback((field: ContactFieldName): void => {
    fieldRefs.current[field]?.focus();
  }, []);

  const {
    values,
    errors,
    state,
    honeypot,
    onHoneypotChange,
    onChange,
    onBlur,
    onSubmit,
  } = useContactForm({ onInvalid: focusField });

  /**
   * Focus moves to the success message as it mounts (§5.7).
   *
   * A ref callback rather than an effect: the node is focusable at the moment
   * React attaches it, and an effect would need a dependency on state it does
   * not own to fire exactly once.
   */
  const focusOnMount = useCallback((node: HTMLDivElement | null): void => {
    node?.focus();
  }, []);

  if (state.status === 'success') {
    return (
      <div
        ref={focusOnMount}
        tabIndex={-1}
        className="rounded-lg border border-border bg-surface p-6 focus-visible:outline-none"
      >
        <FormStatus state={state} fallbackEmail={CONTACT_EMAIL} />
      </div>
    );
  }

  const isSubmitting = state.status === 'submitting';

  return (
    /**
     * No `action`, no `method`, no provider attributes. There is no no-JS
     * submission path to degrade to, and attributes describing a mechanism that
     * is not in use are what a later reader tries to make load-bearing
     * (docs/4-interaction-design.md §5.7).
     */
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <TextInput
        ref={(node) => {
          fieldRefs.current.name = node;
        }}
        label={CONTACT.fields.name.label}
        required={CONTACT.fields.name.required}
        value={values.name}
        onChange={onChange('name')}
        onBlur={onBlur('name')}
        error={errors.name}
        readOnly={isSubmitting}
        autoComplete="name"
      />

      <TextInput
        ref={(node) => {
          fieldRefs.current.email = node;
        }}
        label={CONTACT.fields.email.label}
        required={CONTACT.fields.email.required}
        type="email"
        value={values.email}
        onChange={onChange('email')}
        onBlur={onBlur('email')}
        error={errors.email}
        readOnly={isSubmitting}
        autoComplete="email"
      />

      <TextArea
        ref={(node) => {
          fieldRefs.current.message = node;
        }}
        label={CONTACT.fields.message.label}
        required={CONTACT.fields.message.required}
        value={values.message}
        onChange={onChange('message')}
        onBlur={onBlur('message')}
        error={errors.message}
        readOnly={isSubmitting}
      />

      {/*
        The honeypot. Visually hidden by clipping rather than `display:none`,
        which some clients drop from the submitted body, and removed from both
        the tab order and the accessibility tree — a human using a screen reader
        is a human, and a trap only they can fall into is not a spam filter
        (docs/3-style-preference.md §6.8).

        SR_ONLY names the wrong audience here and is the right CSS: it is the
        project's one "visually hidden, still submitted" utility, and
        `aria-hidden` is what takes it back out of the accessibility tree that
        the class name would otherwise put it in.
      */}
      <input
        type="text"
        name={HONEYPOT_FIELD}
        value={honeypot}
        onChange={onHoneypotChange}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className={SR_ONLY}
      />

      <FormStatus
        state={state}
        fallbackEmail={CONTACT_EMAIL}
        reducedMotion={reducedMotion}
      />

      {/*
        `disabled:opacity-100` because this button is **busy, not unavailable**.
        Button's generic disabled treatment fades to 50%, which drops the label
        to 2.26:1 against its own fill — below AA, on the one control whose text
        the visitor is still reading while they wait. WCAG exempts genuinely
        inactive controls from contrast; a control mid-request is not one.

        `disabled` still blocks a double submit, and `aria-busy` distinguishes
        the two states for assistive tech. The spinner and "Sending…" live in
        FormStatus above (§5.7), so the button does not need to fade to say it.
      */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full disabled:opacity-100 sm:w-auto"
      >
        {CONTACT.submitLabel}
      </Button>
    </form>
  );
};

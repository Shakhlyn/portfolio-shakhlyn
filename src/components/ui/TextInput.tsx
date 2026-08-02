import type { InputHTMLAttributes, ReactElement } from 'react';
import { useId } from 'react';

import { AlertIcon } from '@/components/ui/icons/AlertIcon';
import { FOCUS_RING } from '@/constants/styles';
import { cn } from '@/lib/cn';

interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className'
> {
  /**
   * Visible label text. Placeholders are never a label substitute — they vanish
   * the moment someone types, taking the field's meaning with them.
   */
  label: string;
  /** Validation message. Presence switches the field into its error state. */
  error?: string;
  className?: string;
}

/**
 * Presentational only — validation logic and state live in ContactForm (E13).
 *
 * Uses `border-border-strong`, not `border`: the decorative `border` token is
 * 1.27:1 and fails the 3:1 non-text contrast requirement for an interactive
 * control boundary (docs/3-style-preference.md §2.4).
 */
export const TextInput = ({
  label,
  error,
  required,
  className,
  ...props
}: TextInputProps): ReactElement => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        {/* Required is marked in the label text, never by colour alone. */}
        {label}
        {required ? ' *' : ''}
      </label>

      <input
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-11 rounded-md border bg-bg px-3 text-body text-fg transition-colors duration-150 placeholder:text-fg-subtle',
          error ? 'border-danger' : 'border-border-strong focus:border-accent',
          FOCUS_RING,
        )}
      />

      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-body-sm text-danger">
          <AlertIcon width={16} height={16} className="shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
};

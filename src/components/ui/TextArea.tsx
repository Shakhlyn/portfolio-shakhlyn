import type { ReactElement, Ref, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';

import { AlertIcon } from '@/components/ui/icons/AlertIcon';
import { FOCUS_RING } from '@/constants/styles';
import { cn } from '@/lib/cn';

interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'className'
> {
  label: string;
  error?: string;
  /**
   * Forwarded to the `<textarea>`, so a form can move focus to its first invalid
   * field (docs/4-interaction-design.md §5.7). A plain prop, not `forwardRef` —
   * React 19 passes `ref` through props for function components, and the type
   * must say so because `TextareaHTMLAttributes` does not carry it.
   */
  ref?: Ref<HTMLTextAreaElement>;
  className?: string;
}

/** Multi-line counterpart to TextInput (docs/3-style-preference.md §5.6). */
export const TextArea = ({
  label,
  error,
  required,
  ref,
  className,
  ...props
}: TextAreaProps): ReactElement => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        {label}
        {required ? ' *' : ''}
      </label>

      <textarea
        {...props}
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-32 rounded-md border bg-bg px-3 py-2 text-body text-fg transition-colors duration-150 placeholder:text-fg-subtle',
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

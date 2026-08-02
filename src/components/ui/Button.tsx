import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { FOCUS_RING, NEW_TAB_LABEL } from '@/constants/styles';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface ButtonAsButtonProps
  extends
    ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  /** Renders a plain anchor with new-tab semantics instead of a router Link. */
  external?: boolean;
  /**
   * A link never takes a click handler. A <button> that navigates cannot be
   * middle-clicked, opened in a new tab, or copied as a link, and screen
   * readers announce the wrong role.
   */
  onClick?: never;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong',
  secondary:
    'bg-transparent text-fg border border-border hover:bg-surface-hover hover:border-border-strong',
  ghost: 'bg-transparent text-fg-muted hover:text-fg hover:bg-surface-hover',
};

/** `sm` is desktop-only — 32px fails the 44x44px touch minimum. */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-body-sm font-medium',
  md: 'h-10 px-4 text-body-sm font-medium',
  lg: 'h-12 px-6 text-body font-medium',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps): ReactElement => {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    FOCUS_RING,
    className,
  );

  if ('href' in props) {
    const { href, external } = props;

    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {children}
          <span className="sr-only">{NEW_TAB_LABEL}</span>
        </a>
      );
    }

    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...rest } = props;

  return (
    <button {...rest} type={type} className={classes}>
      {children}
    </button>
  );
};

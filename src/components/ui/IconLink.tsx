import type { ReactElement, ReactNode } from 'react';

import { FOCUS_RING, NEW_TAB_LABEL } from '@/constants/styles';
import { cn } from '@/lib/cn';

interface IconLinkProps {
  href: string;
  /**
   * The accessible name. Required — an icon-only control without one is
   * announced as "link" and nothing else.
   */
  label: string;
  icon: ReactNode;
  className?: string;
}

/**
 * Icon-only link (docs/3-style-preference.md §5.5).
 *
 * Content-agnostic: it takes an icon, a label, and an href. It knows nothing
 * about GitHub or profile.ts — SocialLinks composes it.
 *
 * `mailto:` opens in the same tab; everything else external opens in a new one.
 */
export const IconLink = ({
  href,
  label,
  icon,
  className,
}: IconLinkProps): ReactElement => {
  const isMailto = href.startsWith('mailto:');

  return (
    <a
      href={href}
      aria-label={isMailto ? label : `${label} ${NEW_TAB_LABEL}`}
      {...(isMailto ? {} : { target: '_blank', rel: 'noreferrer' })}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors duration-150 hover:bg-surface-hover hover:text-fg',
        FOCUS_RING,
        className,
      )}
    >
      {icon}
    </a>
  );
};

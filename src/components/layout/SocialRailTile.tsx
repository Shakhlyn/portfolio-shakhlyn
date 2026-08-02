import type { KeyboardEvent, ReactElement } from 'react';

import { NEW_TAB_LABEL } from '@/constants/styles';
import { useMotionVariants } from '@/hooks/useMotionVariants';
import { cn } from '@/lib/cn';
import type { PresentSocialChannelType } from '@/types/social.types';

interface SocialRailTileProps {
  channel: PresentSocialChannelType;
}

/**
 * One rail tile (docs/3-style-preference.md §6.11,
 * docs/4-interaction-design.md §7).
 *
 * Collapsed it is a 48x48 square flush against the left viewport edge, rounded
 * on the right only so it reads as attached to the screen. On hover **or
 * keyboard focus** it grows rightward to reveal its label — focus expansion is
 * required, not optional: a keyboard user must see the same label a mouse user
 * sees.
 *
 * Not built on IconLink: that primitive is a 40px rounded-full circle with
 * different colours and no label slot, and widening it to cover both would push
 * it past the optional-prop count where AGENTS.md §5 calls for composition.
 */
export const SocialRailTile = ({ channel }: SocialRailTileProps): ReactElement => {
  const { label, href, Icon } = channel;
  const { reducedMotion } = useMotionVariants();
  const isMailto = href.startsWith('mailto:');

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>): void => {
    // §9 keyboard map: Escape on a focused tile blurs and collapses it.
    if (event.key === 'Escape') event.currentTarget.blur();
  };

  return (
    <a
      href={href}
      onKeyDown={handleKeyDown}
      // The visual label is an enhancement; this is always the accessible name.
      aria-label={isMailto ? label : `${label} ${NEW_TAB_LABEL}`}
      {...(isMailto ? {} : { target: '_blank', rel: 'noreferrer' })}
      className={cn(
        'group relative flex h-12 items-center overflow-hidden',
        // No left border and left corners square: the tile is flush with x=0.
        'rounded-l-none rounded-r-md border-y border-r border-l-0',
        'border-border bg-surface text-fg-muted shadow-sm',
        // Expanded colours. box-shadow deliberately changes without a
        // transition — 3-style §8 lists it as never-animate.
        'hover:border-accent hover:bg-accent hover:text-on-accent hover:shadow-lg',
        'focus-visible:border-accent focus-visible:bg-accent focus-visible:text-on-accent focus-visible:shadow-lg',
        'transition-colors duration-150',
        // Inset ring rather than the shared offset ring: an offset ring on an
        // element flush against x=0 is clipped by the viewport (§6.11 requires
        // it stay visible).
        'outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
      )}
    >
      {/*
        Label sits left of the icon (§7). Width animates via max-width so it can
        size to its own text; a fixed width would clip "LinkedIn" or pad "X".
        This is the single documented width-animation exception (§7) — the rail
        is position: fixed, so it is outside document flow.
      */}
      <span
        className={cn(
          'max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-40 group-focus-visible:max-w-40',
          reducedMotion ? 'duration-0' : 'duration-100',
          'transition-[max-width] ease-out',
        )}
      >
        <span
          className={cn(
            'pl-4 text-body-sm font-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
            reducedMotion ? 'duration-0' : 'duration-100',
            'block transition-opacity ease-out',
          )}
        >
          {label}
        </span>
      </span>

      {/*
        Icon well; keeps the icon at the trailing edge as the tile grows.
        47px rather than the w-12 token because the 1px right border sits
        outside it — 47 + 1 is the 48px tile that §6.11 specifies. No token
        expresses "one token minus a hairline".
      */}
      <span className="flex h-12 w-[47px] shrink-0 items-center justify-center">
        <Icon aria-hidden="true" />
      </span>
    </a>
  );
};

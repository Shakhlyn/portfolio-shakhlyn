import type { ReactElement } from 'react';

import { NEW_TAB_LABEL } from '@/constants/styles';
import { cn } from '@/lib/cn';
import type { PresentSocialChannelType } from '@/types/social.types';

interface SocialRailTileProps {
  channel: PresentSocialChannelType;
}

/**
 * One rail tile at rest (docs/3-style-preference.md §6.11,
 * docs/4-interaction-design.md §7).
 *
 * Collapsed it is a 48x48 square flush against the left viewport edge, rounded
 * on the right only so it reads as attached to the screen.
 *
 * Not built on IconLink: that primitive is a 40px rounded-full circle with
 * different colours and no label slot, and widening it to cover both would push
 * it past the optional-prop count where AGENTS.md §5 calls for composition.
 */
export const SocialRailTile = ({ channel }: SocialRailTileProps): ReactElement => {
  const { label, href, Icon } = channel;
  const isMailto = href.startsWith('mailto:');

  return (
    <a
      href={href}
      // The visual label comes later; this is always the accessible name.
      aria-label={isMailto ? label : `${label} ${NEW_TAB_LABEL}`}
      {...(isMailto ? {} : { target: '_blank', rel: 'noreferrer' })}
      className={cn(
        'group relative flex h-12 items-center overflow-hidden',
        // No left border and left corners square: the tile is flush with x=0.
        'rounded-l-none rounded-r-md border-y border-r border-l-0',
        'border-border bg-surface text-fg-muted shadow-sm',
        'transition-colors duration-150',
        // Inset ring rather than the shared offset ring: an offset ring on an
        // element flush against x=0 is clipped by the viewport (§6.11 requires
        // it stay visible).
        'outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
      )}
    >
      {/*
        Icon well. 47px rather than the w-12 token because the 1px right border
        sits outside it — 47 + 1 is the 48px tile that §6.11 specifies. No token
        expresses "one token minus a hairline".
      */}
      <span className="flex h-12 w-[47px] shrink-0 items-center justify-center">
        <Icon aria-hidden="true" />
      </span>
    </a>
  );
};

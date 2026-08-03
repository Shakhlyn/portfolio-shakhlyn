import type { ReactElement } from 'react';

import { SocialRailTile } from '@/components/layout/SocialRailTile';
import { getPresentSocialChannels } from '@/constants/social';
import { PROFILE } from '@/data/profile';

/**
 * Fixed left-edge social rail (docs/4-interaction-design.md §7,
 * docs/3-style-preference.md §6.11).
 *
 * Visible at `sm` and up. Below that it is hidden and its links appear in the
 * mobile nav sheet and the footer — a fixed rail on a 375px phone screen eats
 * content width and collides with thumbs.
 *
 * z-30 puts it above page content but below the header's z-40, which is what
 * places it below the mobile nav sheet: the sheet renders inside the header's
 * stacking context. That matters in practice, because between `sm` and `lg` the
 * sheet and the rail both exist.
 *
 * It must never overlap page content, and the default gutter is narrower than
 * the rail, so Container widens its left padding to 56px from `sm` through `lg`
 * (see Container.tsx and §7). Changing the rail's width or breakpoint means
 * changing that padding too.
 *
 * Rendered as a landmark so screen readers can skip it, and mounted after
 * <main> in the document so it does not sit between the header and page content
 * in the tab order.
 */
export const SocialRail = (): ReactElement | null => {
  const channels = getPresentSocialChannels(PROFILE.social);

  // No links, no rail — and no empty landmark announced to screen readers.
  if (channels.length === 0) return null;

  return (
    <nav
      aria-label="Social links"
      className="fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 sm:block"
    >
      {/*
        items-start is load-bearing: without it the <li> children stretch to the
        widest item, so expanding one tile widens all of them and the collapsed
        tiles render at expanded width with no label. §6.11 requires one tile at
        a time.

        The tiles are contiguous, as §6.11's diagram draws them — the `├────┤`
        between rows is a shared edge, not a gap. `-space-y-px` pulls each tile
        up over its neighbour's border so the seam stays a single hairline;
        without it the two adjacent `border-y` edges stack into a 2px line that
        reads heavier than the rail's outer border.
      */}
      <ul className="flex flex-col items-start -space-y-px">
        {channels.map((channel) => (
          <li key={channel.key}>
            <SocialRailTile channel={channel} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

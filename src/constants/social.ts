import { EmailIcon } from '@/components/ui/icons/EmailIcon';
import { GitHubIcon } from '@/components/ui/icons/GitHubIcon';
import { LinkedInIcon } from '@/components/ui/icons/LinkedInIcon';
import { XIcon } from '@/components/ui/icons/XIcon';
import type { SocialLinksType } from '@/types/profile.types';
import type { PresentSocialChannelType, SocialChannelType } from '@/types/social.types';

/**
 * The four social channels, in the order fixed by
 * docs/4-interaction-design.md §7.
 *
 * **Email is last, and the three profile links come first.** `mailto:` is a
 * different kind of destination from the other three — it hands the visitor to
 * their mail client rather than opening a page — so it sits at the end of the
 * run instead of inside it.
 *
 * Both `SocialLinks` and `SocialRail` render from this list, because
 * docs/5-epic-list.md E08 requires them to be "driven by the same profile.ts
 * link data". Two inline copies would be two places for the order to drift.
 *
 * Icons are component references rather than elements, so this module stays
 * JSX-free and each consumer picks its own icon size.
 */
export const SOCIAL_CHANNELS: readonly SocialChannelType[] = [
  { key: 'github', label: 'GitHub', Icon: GitHubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'email', label: 'Email', Icon: EmailIcon },
];

/**
 * Channels the profile has a link for.
 *
 * "Tiles render only for links present in src/data/profile.ts. No placeholder
 * tiles" (§7) — the filter lives here so the rail and the inline list cannot
 * disagree about which links exist.
 */
export const getPresentSocialChannels = (
  social: SocialLinksType,
): PresentSocialChannelType[] =>
  SOCIAL_CHANNELS.flatMap((channel) => {
    const href = social[channel.key];
    return href ? [{ ...channel, href }] : [];
  });

import type { ReactElement } from 'react';

import { IconLink } from '@/components/ui/IconLink';
import { getPresentSocialChannels } from '@/constants/social';
import { PROFILE } from '@/data/profile';
import { cn } from '@/lib/cn';

interface SocialLinksProps {
  className?: string;
}

/**
 * The inline list form of the social links, reused by the mobile nav sheet, the
 * footer, the hero below `sm`, and the contact section. `SocialRail` is the
 * separate fixed left-edge form and does not replace this.
 *
 * Channel order, labels, icons, and the presence filter all come from
 * SOCIAL_CHANNELS, so this and the rail cannot disagree about any of them.
 */
export const SocialLinks = ({ className }: SocialLinksProps): ReactElement => {
  const channels = getPresentSocialChannels(PROFILE.social);

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {channels.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <IconLink href={href} label={label} icon={<Icon />} />
        </li>
      ))}
    </ul>
  );
};

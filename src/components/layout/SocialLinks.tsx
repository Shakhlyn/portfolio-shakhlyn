import type { ReactElement, ReactNode } from 'react';

import { IconLink } from '@/components/ui/IconLink';
import { EmailIcon } from '@/components/ui/icons/EmailIcon';
import { GitHubIcon } from '@/components/ui/icons/GitHubIcon';
import { LinkedInIcon } from '@/components/ui/icons/LinkedInIcon';
import { XIcon } from '@/components/ui/icons/XIcon';
import { PROFILE } from '@/data/profile';
import { cn } from '@/lib/cn';

interface SocialLinksProps {
  className?: string;
}

interface SocialEntry {
  key: string;
  href: string | undefined;
  label: string;
  icon: ReactNode;
}

/**
 * The inline list form of the social links, reused by the mobile nav sheet, the
 * footer, the hero below `lg`, and the contact section. `SocialRail` (E08) is
 * the separate fixed left-edge form and does not replace this.
 *
 * Order follows docs/4-interaction-design.md §7.
 */
export const SocialLinks = ({ className }: SocialLinksProps): ReactElement => {
  const entries: SocialEntry[] = [
    { key: 'github', href: PROFILE.social.github, label: 'GitHub', icon: <GitHubIcon /> },
    {
      key: 'linkedin',
      href: PROFILE.social.linkedin,
      label: 'LinkedIn',
      icon: <LinkedInIcon />,
    },
    { key: 'email', href: PROFILE.social.email, label: 'Email', icon: <EmailIcon /> },
    { key: 'x', href: PROFILE.social.x, label: 'X', icon: <XIcon /> },
  ];

  // Tiles render only for links present in profile.ts. No placeholder tiles (§7).
  const present = entries.filter((entry): entry is SocialEntry & { href: string } =>
    Boolean(entry.href),
  );

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {present.map((entry) => (
        <li key={entry.key}>
          <IconLink href={entry.href} label={entry.label} icon={entry.icon} />
        </li>
      ))}
    </ul>
  );
};

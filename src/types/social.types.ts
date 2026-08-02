import type { ComponentType } from 'react';

import type { IconProps } from '@/types/icon.types';
import type { SocialLinksType } from '@/types/profile.types';

export interface SocialChannelType {
  /**
   * Field name on `ProfileType['social']`. Keying by the field rather than a
   * free string means a typo is a compile error, not a silently missing link.
   */
  key: keyof SocialLinksType;
  label: string;
  /** Component reference, not rendered JSX — the consumer decides sizing. */
  Icon: ComponentType<IconProps>;
}

/** A channel the profile actually has a link for. */
export interface PresentSocialChannelType extends SocialChannelType {
  href: string;
}

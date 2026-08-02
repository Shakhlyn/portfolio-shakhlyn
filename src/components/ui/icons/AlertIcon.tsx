import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const AlertIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

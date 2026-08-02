import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const ExternalLinkIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} {...props}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

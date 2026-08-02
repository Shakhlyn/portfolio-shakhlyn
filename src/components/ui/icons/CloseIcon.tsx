import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const CloseIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

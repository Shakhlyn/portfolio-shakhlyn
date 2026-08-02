import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const CheckIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

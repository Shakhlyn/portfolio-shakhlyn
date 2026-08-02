import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const XIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} fill="currentColor" stroke="none" {...props}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.17 17.52h1.83L7.02 4.13H5.06l12.01 15.64Z" />
  </svg>
);

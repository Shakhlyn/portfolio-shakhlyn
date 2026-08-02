import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

export const LinkedInIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} fill="currentColor" stroke="none" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05A4.17 4.17 0 0 1 17.6 8.7c3.7 0 4.4 2.44 4.4 5.6V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.25 1.53-2.25 3.1V21h-4V9Z" />
  </svg>
);

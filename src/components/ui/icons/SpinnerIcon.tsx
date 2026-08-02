import type { ReactElement } from 'react';

import type { IconProps } from '@/types/icon.types';

import { ICON_BASE_PROPS } from './iconBase';

/**
 * Static mark only. The rotation is applied by the caller so it can be dropped
 * under prefers-reduced-motion (docs/4-interaction-design.md §8, animation 11).
 */
export const SpinnerIcon = (props: IconProps): ReactElement => (
  <svg {...ICON_BASE_PROPS} {...props}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </svg>
);

import { domAnimation, LazyMotion } from 'motion/react';
import type { ReactElement } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';

/**
 * RouterProvider and global providers only — no markup, no layout, no state.
 *
 * `LazyMotion` + the `m` component is what keeps Motion out of the critical
 * path. The full `motion` component statically pulls the whole animation
 * engine — layout projection, drag, gestures — into the entry chunk, and this
 * site animates `opacity` and `transform` and nothing else. `domAnimation`
 * carries exactly that feature set.
 *
 * `strict` makes the saving enforceable: importing `motion` anywhere in the
 * tree now throws at render rather than quietly re-adding the weight it was
 * removed to shed. Use `m` (docs/2-architecture.md §7, Animation Strategy).
 */
export const App = (): ReactElement => (
  <LazyMotion features={domAnimation} strict>
    <RouterProvider router={router} />
  </LazyMotion>
);

import type { ReactElement } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';

/** RouterProvider and global providers only — no markup, no layout, no state. */
export const App = (): ReactElement => <RouterProvider router={router} />;

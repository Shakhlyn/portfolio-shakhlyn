import type { ReactElement } from 'react';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { Container } from '@/components/ui/Container';
import { PROFILE } from '@/data/profile';

/**
 * docs/3-style-preference.md §6.12 — deliberately minimal. No sitemap sprawl,
 * no newsletter, no "built with ❤️". Goes horizontal at `md` (§2).
 *
 * **The social row renders below `sm` only**, which is exactly where the fixed
 * rail is hidden (§6.11). At `sm` and up the rail is on screen while the footer
 * is, so a second copy of the same four links a few hundred pixels apart is
 * duplication, not redundancy — the rule `docs/4-interaction-design.md` §5.1
 * already applies to the hero's row, generalised.
 *
 * It is hidden, not deleted, because the footer is the only social surface on
 * every route at every width. Deleting it would leave a phone visitor deep in
 * `/projects/:slug` or `/resume` with no visible link at all — the rail is gone
 * below `sm`, and the hero and contact rows are home-page only.
 */
export const Footer = (): ReactElement => (
  <footer className="border-t border-border py-12">
    <Container className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <p className="text-body-sm text-fg-subtle">
        {PROFILE.name} · {new Date().getFullYear()}
      </p>
      <SocialLinks className="sm:hidden" />
    </Container>
  </footer>
);

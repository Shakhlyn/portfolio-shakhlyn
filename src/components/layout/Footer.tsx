import type { ReactElement } from 'react';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { Container } from '@/components/ui/Container';
import { PROFILE } from '@/data/profile';

/**
 * docs/3-style-preference.md §6.12 — deliberately minimal. No sitemap sprawl,
 * no newsletter, no "built with ❤️". Goes horizontal at `md` (§2).
 */
export const Footer = (): ReactElement => (
  <footer className="border-t border-border py-12">
    <Container className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <p className="text-body-sm text-fg-subtle">
        {PROFILE.name} · {new Date().getFullYear()}
      </p>
      <SocialLinks />
    </Container>
  </footer>
);

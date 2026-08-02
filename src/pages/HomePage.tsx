import type { ReactElement } from 'react';

import { CurrentRoleSection } from '@/components/sections/CurrentRoleSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';

/**
 * The home page. Hero and Current Role are real (E09); the four sections below
 * them are still the E07-T03 anchor scaffold, replaced by their owning epics —
 * Projects E10, About and Skills E11, Resume E12, Contact E13.
 *
 * The scaffold stays until then because the nav depends on it: without targets
 * in the DOM the scroll spy has nothing to observe and every remaining nav
 * anchor is a dead link.
 *
 * Order is fixed by docs/4-interaction-design.md §1.
 */

/** Enough height that each section can be scrolled to independently. */
const PLACEHOLDER = 'min-h-96';

export const HomePage = (): ReactElement => (
  <>
    <HeroSection />

    <CurrentRoleSection />

    <Section id="projects" title="Projects">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="about" title="About">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="skills" title="Skills">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="contact" title="Contact">
      <div className={PLACEHOLDER} />
    </Section>
  </>
);

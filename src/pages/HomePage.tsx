import type { ReactElement } from 'react';

import { AboutSection } from '@/components/sections/AboutSection';
import { CurrentRoleSection } from '@/components/sections/CurrentRoleSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { Section } from '@/components/ui/Section';

/**
 * The home page. Hero and Current Role are real (E09), Projects is real (E10),
 * About and Skills are real (E11); Contact below them is still the E07-T03
 * anchor scaffold, replaced by its owning epic, E13.
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

    <ProjectsSection />

    <AboutSection />

    <SkillsSection />

    <Section id="contact" title="Contact">
      <div className={PLACEHOLDER} />
    </Section>
  </>
);

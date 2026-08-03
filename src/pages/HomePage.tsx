import type { ReactElement } from 'react';

import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CurrentRoleSection } from '@/components/sections/CurrentRoleSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';

/**
 * The home page. Every section is real: Hero and Current Role (E09), Projects
 * (E10), About and Skills (E11), Contact (E13). No scaffold sections remain.
 *
 * Order is fixed by docs/4-interaction-design.md §1 and must match the nav's,
 * or the scroll-spy indicator appears to jump backwards as the page scrolls.
 */
export const HomePage = (): ReactElement => (
  <>
    <HeroSection />

    <CurrentRoleSection />

    <ProjectsSection />

    <AboutSection />

    <SkillsSection />

    <ContactSection />
  </>
);

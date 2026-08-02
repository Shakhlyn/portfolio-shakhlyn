import type { ReactElement } from 'react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PROFILE } from '@/data/profile';

/**
 * SCAFFOLD — E07-T03.
 *
 * These are empty section anchors, not the real sections. Without targets in
 * the DOM no E07 acceptance criterion is verifiable: the scroll spy has nothing
 * to observe, focusSection has nothing to focus, and every nav anchor is a dead
 * link.
 *
 * Each placeholder is replaced by its owning epic — Hero and Current Role E09,
 * Projects E10, About and Skills E11, Resume E12, Contact E13. No copy is
 * invented here; headings only.
 *
 * Order is fixed by docs/4-interaction-design.md §1.
 */

/** Enough height that each section can be scrolled to independently. */
const PLACEHOLDER = 'min-h-96';

export const HomePage = (): ReactElement => (
  <>
    <section id="home" className="scroll-mt-20 pt-24 pb-16">
      <Container>
        <h1
          tabIndex={-1}
          className="max-w-content text-display text-fg focus-visible:outline-none md:text-display-md"
        >
          {PROFILE.name}
        </h1>
        <p className="mt-4 max-w-content text-body-lg text-fg-muted md:text-body-lg-md">
          {PROFILE.roleFraming}
        </p>
      </Container>
    </section>

    <Section id="current-role" title="Current Role">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="projects" title="Projects">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="about" title="About">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="skills" title="Skills">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="resume" title="Resume">
      <div className={PLACEHOLDER} />
    </Section>

    <Section id="contact" title="Contact">
      <div className={PLACEHOLDER} />
    </Section>
  </>
);

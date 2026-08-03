import type { ReactElement } from 'react';

import { ResumeDownloadLink } from '@/components/sections/ResumeDownloadLink';
import { ResumeViewer } from '@/components/sections/ResumeViewer';
import { Container } from '@/components/ui/Container';

/**
 * The resume route (docs/2-architecture.md §3, §8).
 *
 * Heading order is `h1: Resume` → `h2: View` → `h2: Download`, fixed by §8's
 * resume page plan. View precedes Download even though Download is the smaller
 * commitment: a visitor who can see the document decides whether they want the
 * file.
 *
 * `tabIndex={-1}` on the `h1` is what `useRouteFocus` moves focus to on route
 * change (E03) — it is load-bearing, not decoration.
 *
 * No motion. The content arrives with the route transition (animation 5), and
 * the closed-list rule in docs/4-interaction-design.md §8 gives anything unnamed
 * animation 2 with no child orchestration. `ProjectPage` and its sections are
 * the precedent and carry no `whileInView` either; adding a scroll reveal to a
 * route whose content is entirely above the fold would fight the transition that
 * just ran.
 */
export const ResumePage = (): ReactElement => (
  <Container as="section" className="space-y-12 py-16 md:py-20">
    <h1
      tabIndex={-1}
      className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      Resume
    </h1>

    <ResumeViewer />

    <ResumeDownloadLink />
  </Container>
);

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
 *
 * **The centred column is this page's layout, and it is one element.** The
 * heading, the viewer, and the download all share its edges, so the page reads
 * as a document rather than as blocks pinned to the left of a 1120px shell.
 *
 * **It widens to the full container at `lg`, and everything widens with it.**
 * An earlier version widened only the preview, which left the "View in browser"
 * button 144px indented from the very frame it belongs to. The 68-character
 * measure (`3-style-preference.md` §3.3) protects paragraphs, and this route has
 * none — an `h1`, an `h2`, one metadata line and two buttons. Nothing here needs
 * a prose cap, and one shared width is what keeps every left edge honest.
 *
 * It is an inner wrapper rather than `max-w-content` on `Container`'s
 * `className`. `Container` carries `2xl:max-w-container-wide`; `tailwind-merge`
 * would resolve the base `max-w-*` conflict but leave that variant standing, and
 * the column would jump to 1280px above 1536px.
 *
 * Between `sm` and `xl` the column inherits `Container`'s widened left gutter,
 * which clears the social rail (docs/4-interaction-design.md §7), so it sits
 * ~16px right of true viewport centre in that range. That asymmetry is accepted
 * site-wide by §7; opting this route out would let the rail overlap the column.
 */
export const ResumePage = (): ReactElement => (
  <Container as="section" className="py-16 md:py-20">
    <div className="mx-auto w-full max-w-content space-y-12 lg:max-w-none">
      <h1
        tabIndex={-1}
        className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
      >
        Resume
      </h1>

      <ResumeViewer />

      <ResumeDownloadLink />
    </div>
  </Container>
);

import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import { RESUME } from '@/data/resume';
import { useCanEmbedPdf } from '@/hooks/useCanEmbedPdf';
import { usePdfAvailable } from '@/hooks/usePdfAvailable';

/**
 * The embed frame. A4 — the committed file's page size,
 * `/MediaBox [0 0 594.96 841.92]` — so the slot reserves the document's exact
 * shape before it paints and contributes zero CLS.
 *
 * `max-h-[80vh]` is the ceiling. Without it the frame is 1086px tall at the
 * column's full 768px, which is taller than a laptop viewport: the visitor
 * scrolls the page to see a document that scrolls itself. Capped, the PDF's own
 * viewer scrolls inside a frame that always fits. Viewport units resolve at
 * first paint, so the cap costs no CLS either.
 *
 * Both values are arbitrary because no token expresses an aspect ratio or a
 * viewport fraction (docs/3-style-preference.md §9). The ratio is written as the
 * paper dimensions rather than `1/1.414`, which is the same number without
 * saying where it came from. Re-check it if the PDF is ever regenerated at US
 * Letter — that is `51/66`.
 *
 * Width comes from the centred column in `ResumePage`, not from here.
 */
const EMBED_FRAME =
  'mt-4 aspect-[210/297] max-h-[80vh] w-full overflow-hidden rounded-lg border border-border bg-surface';

/**
 * The frame for both non-embed states. **Deliberately not aspect-locked.** The
 * lock exists to reserve space for a document that is arriving; where none is,
 * holding 1086px of empty rectangle around one sentence is the defect, not the
 * reservation.
 */
const PANEL_FRAME =
  'mt-4 w-full rounded-lg border border-border bg-surface p-6 text-center';

/** The browser has no inline PDF viewer. Not a fault — a capability difference. */
const CANNOT_EMBED = 'This browser cannot display the PDF inline.';

/**
 * The file itself is unreachable. Says so plainly: `<object>`'s native fallback
 * fires for this case too, and blaming the visitor's browser for a missing file
 * sends them to check a setting that was never the problem.
 */
const NOT_AVAILABLE = 'The resume file could not be loaded right now.';

/**
 * The `h2: View` section of `/resume` (docs/2-architecture.md §8,
 * docs/3-style-preference.md §6.7, docs/4-interaction-design.md §5.6).
 *
 * **Three states, two of which show no document.** The browser may have no PDF
 * viewer, or the file may be unreachable. They are different problems and carry
 * different copy — an earlier version gave both the capability wording, which
 * told a visitor to blame their browser for a deploy defect.
 *
 * **`<object>`, not `<iframe>` or `<embed>`.** It is the only one of the three
 * whose children render as fallback content when the resource cannot be
 * displayed, which keeps a last layer of degradation underneath both checks. It
 * needs an explicit accessible name — an unlabelled embedded region is announced
 * as "embedded object" and nothing more.
 *
 * **The fallback replaces the embed, never the section.** All three states keep
 * the same labelled region in the same place, so nothing about the page's shape
 * depends on the visitor's browser.
 *
 * **`aria-label`, not `aria-labelledby`.** This section has no heading — the
 * preview introduces itself and `2-architecture.md` §8's resume outline is `h1:
 * Resume` then `h2: Download`. A region still needs a name, and a dangling
 * `aria-labelledby` is worse than none: it resolves to empty and the section is
 * announced as an unnamed group.
 *
 * **The action is unconditional and lives beneath the frame.** It is the page's
 * one guarantee — the file is always one click away — so it deliberately depends
 * on neither hook. `secondary`, not `primary`: Download is this view's single
 * `primary` (`3-style-preference.md` §5.1).
 */
export const ResumeViewer = (): ReactElement => {
  const support = useCanEmbedPdf();
  const availability = usePdfAvailable(RESUME.filePath);

  // `'checking'` counts as available: collapsing the frame while the probe is in
  // flight would shift the layout on every load for a state that is transient.
  const isMissing = availability === 'missing';
  const canEmbed = support !== 'unsupported';

  return (
    <section aria-label="Resume preview">
      {isMissing || !canEmbed ? (
        // No `danger` styling in either case — §2.5 reserves it for form feedback.
        <div className={PANEL_FRAME}>
          <p className="text-body-sm text-fg-muted">
            {isMissing ? NOT_AVAILABLE : CANNOT_EMBED}
          </p>
        </div>
      ) : (
        <object
          data={RESUME.filePath}
          type="application/pdf"
          aria-label={`Resume, ${RESUME.fileType}`}
          className={EMBED_FRAME}
        >
          {/* The browser's own last resort, below both checks. Worded for the
              resource failure, since that is what reaching here means. */}
          <p className="p-6 text-body-sm text-fg-muted">{NOT_AVAILABLE}</p>
        </object>
      )}

      <div className="mt-4">
        <Button href={RESUME.filePath} external variant="secondary">
          {RESUME.viewLabel}
        </Button>
      </div>
    </section>
  );
};

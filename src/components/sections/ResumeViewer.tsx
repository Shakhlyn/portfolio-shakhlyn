import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import { RESUME } from '@/data/resume';
import { useCanEmbedPdf } from '@/hooks/useCanEmbedPdf';

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
 * The frame for the non-embed state. **Deliberately not aspect-locked.** The
 * lock exists to reserve space for a document that is arriving; where none is,
 * holding 1086px of empty rectangle around one sentence is the defect, not the
 * reservation.
 */
const PANEL_FRAME =
  'mt-4 w-full rounded-lg border border-border bg-surface p-6 text-center';

const NO_INLINE_PDF = 'This browser cannot display the PDF inline.';

/**
 * The `h2: View` section of `/resume` (docs/2-architecture.md §8,
 * docs/3-style-preference.md §6.7, docs/4-interaction-design.md §5.6).
 *
 * **`<object>`, not `<iframe>` or `<embed>`.** It is the only one of the three
 * whose children render as fallback content when the resource cannot be
 * displayed, which keeps a last layer of degradation underneath the check. It
 * needs an explicit accessible name — an unlabelled embedded region is announced
 * as "embedded object" and nothing more.
 *
 * **The fallback replaces the embed, never the section.** The heading stays in
 * both states, so the outline `2-architecture.md` §8 fixes does not vary by
 * browser.
 *
 * **The action is unconditional and lives beneath the frame.** It is the page's
 * one guarantee — the file is always one click away — so it deliberately does
 * not depend on the check. `secondary`, not `primary`: Download is this view's
 * single `primary` (`3-style-preference.md` §5.1).
 */
export const ResumeViewer = (): ReactElement => {
  const support = useCanEmbedPdf();

  return (
    <section aria-labelledby="resume-view-heading">
      <h2 id="resume-view-heading" className="text-h2 text-fg md:text-h2-md">
        View
      </h2>

      {support === 'unsupported' ? (
        // Not `danger` styling: a browser with no inline PDF viewer is a
        // capability difference, not an error (§2.5).
        <div className={PANEL_FRAME}>
          <p className="text-body-sm text-fg-muted">{NO_INLINE_PDF}</p>
        </div>
      ) : (
        <object
          data={RESUME.filePath}
          type="application/pdf"
          aria-label={`Resume, ${RESUME.fileType}`}
          className={EMBED_FRAME}
        >
          <p className="p-6 text-body-sm text-fg-muted">{NO_INLINE_PDF}</p>
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

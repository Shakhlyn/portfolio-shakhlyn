import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import { RESUME } from '@/data/resume';
import { useCanEmbedPdf } from '@/hooks/useCanEmbedPdf';

/**
 * A4 — the committed file's page size, `/MediaBox [0 0 594.96 841.92]`. Locking
 * the ratio reserves the slot's exact height before the document paints, so it
 * contributes zero CLS; the same technique as the hero portrait slot.
 *
 * An arbitrary value because no token expresses aspect ratios
 * (docs/3-style-preference.md §9). Written as the paper dimensions rather than
 * as `1/1.414`, which is the same number without saying where it came from.
 * Re-check this if the PDF is ever regenerated at US Letter — that is `51/66`.
 */
const SLOT =
  'mt-4 aspect-[210/297] w-full max-w-content overflow-hidden rounded-lg border border-border bg-surface';

/** Shown by the panel and by `<object>`'s own fallback, so it is written once. */
const NO_INLINE_PDF = 'This browser cannot display the PDF inline.';

/**
 * The `h2: View` section of `/resume` (docs/2-architecture.md §8,
 * docs/3-style-preference.md §6.7, docs/4-interaction-design.md §5.6).
 *
 * **`<object>`, not `<iframe>` or `<embed>`.** It is the only one of the three
 * whose children render as fallback content when the resource cannot be
 * displayed, which puts a second layer of degradation underneath the capability
 * check at no cost. It needs an explicit accessible name — an unlabelled
 * embedded region is announced as "embedded object" and nothing more.
 *
 * **The fallback replaces the embed, never the section.** The heading stays in
 * both states, so the outline `2-architecture.md` §8 fixes does not vary by
 * browser, and the panel keeps that heading introducing something real. It uses
 * the same frame at the same locked ratio, so the section's height does not
 * change when detection settles and nothing shifts under the reader.
 *
 * **The action is unconditional and lives beneath the slot, not inside the
 * panel.** It is the page's one guarantee — the file is always one click away —
 * so it deliberately does not depend on `useCanEmbedPdf`, which cannot be
 * verified on the browser it exists for. Putting a second action inside the
 * panel would give the fallback state two controls with the same name and the
 * same destination, and three counting Download.
 *
 * `secondary`, not `primary`: Download is this view's single `primary`
 * (`3-style-preference.md` §5.1).
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
        <div className={`${SLOT} flex items-center justify-center p-6`}>
          <p className="text-body-sm text-fg-muted">{NO_INLINE_PDF}</p>
        </div>
      ) : (
        <object
          data={RESUME.filePath}
          type="application/pdf"
          aria-label={`Resume, ${RESUME.fileType}`}
          className={SLOT}
        >
          {/* Rendered by the browser itself where the embed cannot load at all —
              a second layer beneath the capability check, not a duplicate. */}
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

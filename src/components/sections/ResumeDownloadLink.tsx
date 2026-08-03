import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import { RESUME } from '@/data/resume';

/**
 * The filename the visitor saves, derived from the asset path rather than
 * written twice. A second literal here is how the saved file keeps the old name
 * after the path changes.
 */
const downloadFileName = (filePath: string): string =>
  filePath.slice(filePath.lastIndexOf('/') + 1);

/**
 * The `h2: Download` section of `/resume` (docs/2-architecture.md §8,
 * docs/3-style-preference.md §6.7).
 *
 * It owns its own heading rather than taking one from the page, matching
 * `ProjectLinks` — a heading belongs next to the content it introduces.
 *
 * **The type and size sit beside the button, not inside its label.** §6.7 allows
 * either, but folding them in gives the control the accessible name "Download
 * PDF PDF 76 KB". They still precede the download in reading order, which is
 * what `1-prd.md` §3 asks for: the visitor knows what they are committing to
 * before they commit.
 */
export const ResumeDownloadLink = (): ReactElement => (
  <section aria-labelledby="resume-download-heading">
    <h2 id="resume-download-heading" className="text-h2 text-fg md:text-h2-md">
      Download
    </h2>

    <div className="mt-4 flex flex-wrap items-center gap-4">
      <Button href={RESUME.filePath} download={downloadFileName(RESUME.filePath)}>
        {RESUME.downloadLabel}
      </Button>

      <p className="text-body-sm text-fg-subtle">
        {RESUME.fileType}
        {/* Separator, not content — it must not land in the announced text. */}
        <span aria-hidden="true"> · </span>
        {RESUME.fileSize}
      </p>
    </div>
  </section>
);

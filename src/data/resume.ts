import type { ResumeType } from '@/types/resume.types';

/**
 * The resume path is defined exactly once and consumed by the hero CTA, the nav
 * button, the #resume section, and the /resume route. Four hardcoded copies of
 * a path is four chances for one of them to rot.
 *
 * The committed PDF is a DRAFT, generated from the supplied CV text and stamped
 * "Draft" across the top so it cannot be mistaken for the real thing. 1-prd.md
 * §6 permits a clearly marked draft during development; the resume file is NOT
 * acceptable as a launch placeholder.
 *
 * TODO(content): replace public/resume/shakhlyn-resume.pdf with your own
 * formatted resume, then update `fileSize` to match.
 */
export const RESUME: ResumeType = {
  filePath: '/resume/shakhlyn-resume.pdf',
  downloadLabel: 'Download PDF',
  viewLabel: 'View in browser',
  fileType: 'PDF',
  fileSize: '76 KB',
};

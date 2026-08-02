import type { ResumeType } from '@/types/resume.types';

/**
 * The resume path is defined exactly once and consumed by the hero CTA, the nav
 * button, the #resume section, and the /resume route. Four hardcoded copies of
 * a path is four chances for one of them to rot.
 *
 * TODO(content): replace the draft PDF at this path with the final resume, and
 * update fileSize to match. 1-prd.md §6 permits a clearly marked draft during
 * development; the resume file is NOT acceptable as a launch placeholder.
 */
export const RESUME: ResumeType = {
  filePath: '/resume/shakhlyn-resume.pdf',
  downloadLabel: 'Download PDF',
  viewLabel: 'View in browser',
  fileType: 'PDF',
  fileSize: 'TODO(content)',
};

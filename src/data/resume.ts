import type { ResumeType } from '@/types/resume.types';

/**
 * The resume path is defined exactly once and consumed by the hero CTA, the nav
 * button, and the /resume route. Three hardcoded copies of a path is three
 * chances for one of them to rot.
 *
 * There is no #resume home section — the resume is route-only
 * (docs/4-interaction-design.md §1, §5.6).
 *
 * The committed PDF is a DRAFT, generated from the supplied CV text and stamped
 * "Draft" across the top so it cannot be mistaken for the real thing. 1-prd.md
 * §6 permits a clearly marked draft during development; the resume file is NOT
 * acceptable as a launch placeholder.
 *
 * TODO(content): replace public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf with your own
 * formatted resume, then update `fileSize` to match.
 */
export const RESUME: ResumeType = {
  filePath: '/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf',
  downloadLabel: 'Download PDF',
  viewLabel: 'View in browser',
  fileType: 'PDF',
  fileSize: '76 KB',
};

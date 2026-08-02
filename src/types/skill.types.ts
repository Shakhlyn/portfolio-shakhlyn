/**
 * Note what is absent: there is no proficiency, level, percentage, or rating
 * field. Omitting it from the type is what prevents proficiency bars appearing
 * later — they are unverifiable and read as filler
 * (docs/3-style-preference.md §6.6).
 */
export interface SkillGroupType {
  id: string;
  /** Capability group label, e.g. "Frontend" (1-prd.md §3). */
  label: string;
  skills: string[];
}

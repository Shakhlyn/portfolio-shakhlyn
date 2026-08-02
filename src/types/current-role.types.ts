export interface CurrentRoleType {
  role: string;
  company: string;
  /** Human-readable range, e.g. "Jan 2024 — Present". */
  dateRange: string;
  /** Two to four lines of scope (docs/3-style-preference.md §6.3). */
  scope: string[];
  /** Stack in active use, rendered as badges. */
  stack: string[];
}

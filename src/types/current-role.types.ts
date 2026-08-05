export interface CurrentRoleType {
  role: string;
  /**
   * The **employer**. Not the client — see `client`. Keeping the two apart is
   * the reason this is not a single "organisation" field: collapsing them
   * either drops the client the work actually happens at, or implies the client
   * employs the author (docs/tickets/RV-tickets.md § RV-T01).
   */
  company: string;
  /** The current **placement** — the client team the author is embedded with. */
  client: string;
  /** Human-readable range, e.g. "Jan 2024 — Present". */
  dateRange: string;
  /**
   * One present-tense sentence of what the role currently involves
   * (docs/3-style-preference.md §6.3).
   */
  summary: string;
  /** Stack in active use, rendered as badges. */
  stack: string[];
  /** The one sentence naming the roles being targeted. Rendered with an accent rule. */
  availability: string;
  /**
   * Slugs of the projects built at the **current placement**, resolved against
   * `PROJECTS` at render.
   *
   * Not "the professional projects": earlier work for the same employer is
   * finished, and naming it under a present-tense heading would file completed
   * work as ongoing. Deriving this from `category` would do exactly that, which
   * is why it is an explicit list.
   */
  projectSlugs: readonly string[];
}

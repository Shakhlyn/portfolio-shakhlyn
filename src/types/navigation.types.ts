/**
 * A discriminated union, not `isAnchor?: boolean` (AGENTS.md §4). This makes an
 * anchor-with-a-route-target unrepresentable, and lets the header pick between
 * scroll-spy state and React Router's route-active state without guessing
 * (docs/4-interaction-design.md §3).
 */
export type NavItemType =
  | {
      kind: 'anchor';
      label: string;
      /** Section id without the hash, e.g. `projects`. */
      sectionId: string;
    }
  | {
      kind: 'route';
      label: string;
      path: string;
      /** Renders as a secondary Button rather than a text link. */
      emphasised?: boolean;
    };

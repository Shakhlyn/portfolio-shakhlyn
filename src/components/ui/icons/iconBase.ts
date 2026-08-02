/**
 * Shared inline-SVG attributes. 20px default, stroke-width 1.5, currentColor —
 * docs/3-style-preference.md §10. No icon font, no runtime icon package.
 */
export const ICON_BASE_PROPS = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

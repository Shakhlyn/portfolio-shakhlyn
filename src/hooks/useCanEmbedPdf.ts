import { useSyncExternalStore } from 'react';

export type PdfEmbedSupport = 'unknown' | 'supported' | 'unsupported';

/**
 * Reads the standardised `navigator.pdfViewerEnabled`, which is not present in
 * every TypeScript DOM lib. Narrowed through `unknown` rather than asserted — an
 * unchecked assertion would turn a missing property into `undefined` at runtime
 * with no warning, and that is exactly the case this must distinguish.
 */
const readPdfViewerEnabled = (): boolean | undefined => {
  const value = (navigator as unknown as Record<string, unknown>).pdfViewerEnabled;

  return typeof value === 'boolean' ? value : undefined;
};

const getSnapshot = (): PdfEmbedSupport => {
  const enabled = readPdfViewerEnabled();
  if (enabled === undefined) return 'unknown';

  return enabled ? 'supported' : 'unsupported';
};

/** Nothing to subscribe to: the value cannot change during a session. */
const subscribe = (): (() => void) => () => {};

/** Hydration only. There is no server here, but the argument is not optional. */
const getServerSnapshot = (): PdfEmbedSupport => 'unknown';

/**
 * Whether the browser can display a PDF inline, for the `/resume` viewer
 * (docs/4-interaction-design.md §5.6).
 *
 * **Three states, not a boolean.** An absent property resolves to `'unknown'`,
 * never `'unsupported'` — which is why the check is `typeof === 'boolean'` and
 * not a truthiness test. `ResumeViewer` renders the embed on `'unknown'`,
 * because attempting it is right for the large majority and an incorrect
 * negative is the more visible failure: a visitor who would have seen the
 * document instead gets a panel telling them they cannot.
 *
 * **`useSyncExternalStore`, not `useEffect` + `useState`.** The value is a
 * non-reactive browser capability, so reading it in an effect and setting state
 * would render the wrong branch once and then correct it — a cascading render
 * the `react-hooks/set-state-in-effect` rule exists to prevent, and a visible
 * flash of the wrong state. This settles on the first render instead.
 *
 * `subscribe` is a no-op because there is genuinely nothing to subscribe to, and
 * it is defined at module scope so its identity is stable across renders.
 *
 * **This hook is a progressive enhancement, not a correctness dependency.** The
 * action beneath the slot renders in both of `ResumeViewer`'s branches, so a
 * wrong answer in either direction still leaves the visitor a working path to
 * the PDF. That is deliberate: the iOS Safari case this exists to serve cannot
 * be verified without a real device, and no guarantee should rest on it.
 *
 * No user-agent sniffing. It is unreliable, it breaks on the next Safari
 * release, and the fallback above makes it unnecessary.
 */
export const useCanEmbedPdf = (): PdfEmbedSupport =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

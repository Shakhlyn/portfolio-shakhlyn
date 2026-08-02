/** ~1s at 60fps. Long enough for a 200ms route transition, short enough to give up. */
const DEFAULT_MAX_FRAMES = 60;

interface WhenElementReadyOptions {
  /** Returns the target once it exists, or null while it does not. */
  find: () => HTMLElement | null;
  run: (element: HTMLElement) => void;
  /** Called if the element never appears within `maxFrames`. */
  onTimeout?: () => void;
  maxFrames?: number;
}

/**
 * Runs `run` on the first frame where `find()` resolves.
 *
 * A single requestAnimationFrame — or even two — is not enough here.
 * `PageTransition` uses `AnimatePresence mode="wait"`, which deliberately holds
 * the incoming route unmounted until the outgoing one has finished exiting
 * (~200ms). Anything that waits a fixed number of frames looks for the target
 * before it exists, finds nothing, and gives up silently — which is how a
 * cross-route anchor ends up at the top of the page.
 *
 * Polling by frame rather than by timeout also means the work lands after a
 * paint, which docs/4-interaction-design.md §3 requires and which explicitly
 * rules out "a bare setTimeout guess".
 *
 * @returns cancel function; call it from effect cleanup.
 */
export const whenElementReady = ({
  find,
  run,
  onTimeout,
  maxFrames = DEFAULT_MAX_FRAMES,
}: WhenElementReadyOptions): (() => void) => {
  let frame = 0;
  let attempts = 0;
  let cancelled = false;

  const tick = (): void => {
    if (cancelled) return;

    const element = find();

    if (element) {
      run(element);
      return;
    }

    attempts += 1;

    if (attempts >= maxFrames) {
      onTimeout?.();
      return;
    }

    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
};

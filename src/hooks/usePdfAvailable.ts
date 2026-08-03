import { useEffect, useState } from 'react';

export type PdfAvailability = 'checking' | 'available' | 'missing';

/**
 * A 200 is not proof the file exists. This is a SPA behind a catch-all rewrite
 * (`/* /index.html 200`, docs/2-architecture.md §10), so a missing asset returns
 * **200 with the HTML shell**, not a 404 — verified against `yarn preview`, and
 * Netlify's rewrite behaves the same way. Checking only `response.ok` would
 * report every missing PDF as present, which is the exact failure this hook
 * exists to catch.
 *
 * A **missing** verdict therefore needs positive evidence: either a failed
 * status, or a content type that is present and is not a PDF. Where the header
 * is absent entirely the answer is optimistic, because hiding a working document
 * is a worse outcome than showing a frame that fails.
 */
const looksLikePdf = (response: Response): boolean => {
  if (!response.ok) return false;

  const type = response.headers.get('content-type');
  return type === null || type.includes('pdf');
};

/**
 * Whether the PDF at `url` actually exists, for the `/resume` viewer
 * (docs/4-interaction-design.md §5.6).
 *
 * **Why a request rather than an event.** `<object>` does not fire a usable
 * `error` event, and an `<iframe>` pointed at a missing same-origin path loads
 * the server's 404 body rather than failing. A `HEAD` is the only reliable
 * answer, and it is same-origin and bodyless, so it costs a round trip and
 * nothing else.
 *
 * **Separate from `useCanEmbedPdf` on purpose.** "Can this browser show a PDF"
 * and "is the file there" are different questions with different answers and
 * different copy — one is a capability, the other is a deploy defect
 * (`AGENTS.md` §5: one responsibility per hook).
 *
 * **`'checking'` is optimistic, and the caller must treat it as available.**
 * Collapsing the slot while the probe is in flight would shift the layout on
 * every load for a state that is almost always transient and almost never
 * `'missing'`. Only a confirmed `'missing'` changes what renders, so the happy
 * path stays at CLS 0.
 *
 * Unlike `useCanEmbedPdf`, this effect genuinely subscribes to something, so it
 * returns a cleanup function that aborts the request (`AGENTS.md` §5). Setting
 * state here is also correct rather than a repeat of E12-T03's mistake: the
 * `react-hooks/set-state-in-effect` rule targets *synchronous* `setState` in an
 * effect body, and this runs after an `await`.
 */
export const usePdfAvailable = (url: string): PdfAvailability => {
  const [availability, setAvailability] = useState<PdfAvailability>('checking');

  useEffect(() => {
    const controller = new AbortController();

    const probe = async (): Promise<void> => {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
        });
        setAvailability(looksLikePdf(response) ? 'available' : 'missing');
      } catch {
        // An aborted request is an unmount, not a verdict — leaving the state
        // alone avoids setting it on a component that is going away. A genuine
        // network failure lands here too and is reported as missing, which is
        // what the visitor experiences either way.
        if (!controller.signal.aborted) setAvailability('missing');
      }
    };

    void probe();

    return () => {
      controller.abort();
    };
  }, [url]);

  return availability;
};

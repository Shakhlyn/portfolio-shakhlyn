# E12 — Resume — Status

**6 of 6 tickets done.** 38 automated browser checks, all passing. No defect of its own;
two defects in its **own ticket file**, both found while building and corrected in the
docs rather than worked around in code.

Last updated: **2026-08-03**

---

## 1. Gates

All four pass on the final tree:

```
yarn typecheck    ✅ exit 0
yarn lint         ✅ exit 0
yarn format:check ✅ exit 0
yarn build        ✅ exit 0
```

`/resume` is still a separate lazy chunk: `dist/assets/ResumePage-*.js`, 2.10 kB raw /
0.94 kB gzip. Entry bundle unchanged at 378.89 kB / 121.26 kB gzip.

## 2. Cross-epic touch — E05's `Button`

`Button` gained a **`download?: string`** case on `ButtonAsLinkProps`, rendering a plain
same-origin `<a href download>`. Recorded in both this file and
[E05-status.md](E05-status.md).

Necessary, not convenient. The download points at `public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`,
and neither existing branch produces a working download:

- `<Link to="/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf">` is intercepted by React Router and resolves to
  the catch-all 404, because the path looks like a route.
- `external` renders `target="_blank"`, which opens the file instead of saving it.

The new case is checked **before** `external` in the render body, since a download is
same-origin and must not open a new tab. All four pre-existing call-site shapes still
typecheck unchanged, and the full E07–E11 regression suite is green (§6).

## 3. Two defects in E12's own ticket file

Both were found while implementing, and both were fixed in the specification rather than
absorbed into the code. `docs/tickets/README.md` says the source document wins and the
ticket is wrong — these are two cases of that, applied to a ticket file written hours
earlier.

### 3.1 The fallback panel specified a redundant control

E12-T01 wrote into `3-style-preference.md` §6.7 that the fallback panel carries a
`primary` action **and** that the direct link renders beneath the slot in both states. In
the fallback state that is two controls with the same accessible name pointing at the same
file — three, counting Download's button directly below. It also put two `primary` buttons
in one view, against §5.1's "one per view".

Corrected in §6.7 before the component was written: **the panel explains and the button
acts.** The panel holds one sentence and nothing else; a single `secondary` action sits
beneath the slot, identical in both states. Download keeps the view's only `primary`.

The harness asserts the corrected shape directly — "exactly one visible link to the PDF"
in each state, plus "it is the same link in both states". "Exactly one" is what stops the
fallback re-growing a duplicate.

### 3.2 The hook was specified as `useEffect` + `useState`

E12-T03 prescribed reading `navigator.pdfViewerEnabled` in a `useEffect` and calling
`setSupport`. `yarn lint` rejected it:

```
error  Calling setState synchronously within an effect can trigger cascading renders
       react-hooks/set-state-in-effect
```

The rule is right. Capturing a value that never changes by setting state in an effect
renders the wrong branch once and then corrects it — a cascading render, and a visible
flash of the wrong state on a slow device. Rewritten with **`useSyncExternalStore`**,
which settles on the first render.

The ticket's acceptance criterion — "returns `'unknown'` on its first render and a settled
value on the next" — was therefore describing the defect. Replaced with the stronger
property it was reaching for: the view section's `innerHTML` is byte-identical before and
after two `requestAnimationFrame`s. Verified passing.

## 4. What the three-state type is still for

`'unknown'` no longer appears as a transient state on the client, so it is worth recording
why the type kept three members rather than collapsing to a boolean:

- An **absent** `navigator.pdfViewerEnabled` is not the same as `false`. Browsers
  predating the property must attempt the embed, not fall back. This is why the read is
  `typeof value === 'boolean'`, not a truthiness test.
- `getServerSnapshot` needs a value, and `'unknown'` is the honest one.

Verified: with the property deleted before mount, `/resume` renders the embed.

## 5. Per-ticket evidence

| Ticket | Criteria | Result | Evidence                                                                                                                                                                                                                                                                                                     |
| ------ | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T01    | 6        | 6 pass | 4 files, all `docs/`, 0 under `src/`; `docs/2-architecture.md` diff empty; README row 13 present; §10 at 16 rows with rows 1–15 content-identical under `--ignore-all-space`; `aspect` present in §6.7; `format:check` clean                                                                                 |
| T02    | 7        | 7 pass | `<a>` not `<button>`, `href=/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`, `download="Shaokh_Al_Mahmud_Shakhlyn-resume.pdf"`, `target=null`; label `Download PDF` with `PDF` and `76 KB` outside it; click leaves `location.pathname` at `/resume`; `fetch` of the asset returns `application/pdf` / `%PDF-` |
| T03    | 6        | 6 pass | forced `true` → embed; forced `false` → panel; property deleted → embed; section HTML identical across two rAFs; no `any`/`@ts-expect-error`/`eslint-disable`; no `@/data` or `motion/react` imports                                                                                                         |
| T04    | 8        | 8 pass | `aspect-ratio: 210 / 297` and `max-width: 768px` in both states; `<object>` labelled `Resume, PDF`; panel has 0 interactive descendants; exactly one PDF link per state, identical across states; section height delta 0.00px at 1440 and 375; CLS 0; `scrollX=0` at all six widths                          |
| T05    | 6        | 6 pass | one `h1` "Resume", two `h2` View→Download, levels `H1 H2 H2`; stub comment gone; `tabindex=-1` retained and `document.activeElement` is the `h1` after nav; `main` has exactly two tab stops; `ResumePage-*.js` still split                                                                                  |
| T06    | 7        | 7 pass | this file; the four gates above; both duplication greps clean; STATUS.md and README.md rows added                                                                                                                                                                                                            |

**Total: 40 ticket criteria, all passing.** The 38 browser checks in §6 cover T02–T05;
T01 and T06 are verified by `git` and `grep`. The two counts are not the same measure — one
criterion ("no horizontal page scroll") is six browser checks on its own.

## 6. Harness

`scratchpad/verify-e12.mjs`, headless Chrome over CDP against a production build on
`:4173`. Three separate browser instances, because
`Page.addScriptToEvaluateOnNewDocument` must define `navigator.pdfViewerEnabled` before any
app code runs — the hook reads it during the first render, so a post-load override would
test nothing.

Regression suite re-run after the `Button` change:

| Harness           | Checks      |
| ----------------- | ----------- |
| verify-e12        | 38/38       |
| verify-e11        | 34/34       |
| verify-e11-nav    | 4/4         |
| verify-e10        | 63/63       |
| verify-e10-extra  | 14/14       |
| verify-motion     | 9/9         |
| verify-wheel      | 12/12       |
| verify-wheel-real | 10/10       |
| **Total**         | **184/184** |

## 7. Outstanding

**iOS Safari is unverified, and this is the epic's one real gap.** The fallback exists for
WebKit on iOS, which does not display an embedded PDF the way desktop browsers do. Headless
Chrome on Linux has no WebKit PDF pipeline, so every check above passes on a browser that
is not the one at risk — the harness verifies the hook's logic against a property it sets
itself, not iOS's actual behaviour with an `<object>`.

Mitigated by architecture rather than by testing, which was the only honest option:

- The `View in browser` action renders in **both** branches, so it does not depend on the
  detection.
- The `h2: Download` section is present on every browser.

Worst case if detection is wrong on iOS: a visitor sees an empty or single-page frame
**above two working links to the same file**, not a dead end. Needs a real device to close.

**The committed PDF is still a draft.** `public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf` is generated
from the supplied CV and stamped "Draft"; `resume.ts` carries the `TODO(content)` marker.
`1-prd.md` §6 permits a clearly marked draft during development and lists the resume file
as **not acceptable** at launch. E18's gate, unchanged by this epic — but note that
replacing the file means updating `RESUME.fileSize`, and **re-checking the slot ratio** in
`ResumeViewer.tsx` if the new file is US Letter rather than A4.

**Carried forward, not E12's:** the pre-existing E07 scroll-spy discrepancy recorded in
[E11-status.md](E11-status.md) §3 is still open and still awaiting an amendment ticket.

---

## 8. Post-ship rework — E12-T07 and E12-T08 (2026-08-03)

**Two defects reached a real viewport that 38 passing checks did not catch.** Both were
reported by eye, on `/resume` at a normal laptop width, minutes after the epic was
committed.

### 8.1 What was wrong

**The preview was flush left.** `SLOT` carried `max-w-content` with no `mx-auto`, so inside
`Container` the 768px frame sat hard against the left edge with ~288px of dead space beside
it — more at 1920, where the shell widens to 1280px.

**A missing PDF rendered one sentence inside a screen-high box.** `aspect-[210/297]` at
768px computes to **1086px**, taller than a laptop viewport. `<object>`'s fallback child
rendered inside that locked frame. The copy was wrong for the case as well: `<object>`
children render for a browser with no PDF viewer **and** for a file that will not load, and
both were given "This browser cannot display the PDF inline."

### 8.2 Why the harness missed them

It asserted the properties the ticket specified — `max-width: 768px`, `aspect-ratio:
210 / 297` — and never asked **where the box sat** or **how tall it got**. A check written
from the same sentence as the code cannot contradict the code. The new checks measure
position and height against the viewport instead: equal left/right gaps at six widths, a
shared left edge across four elements, and `height <= 0.8 * innerHeight`.

### 8.3 The fix

- One centred `max-w-content mx-auto` column owns the page; heading, preview, and both
  buttons share its edges.
- The embed frame keeps the A4 lock and gains a `max-h-[80vh]` ceiling.
- Both failure states use a compact, **un-locked** panel. The lock reserves space for a
  document that is arriving; where none is, it is a defect.
- A missing file became its own state with its own message.

### 8.4 A third defect, found while fixing the second

The availability probe was first written as `response.ok`. Against `yarn preview` a missing
asset returns **200 with `content-type: text/html`** — the SPA catch-all rewrite
(`2-architecture.md` §10) answers with the HTML shell, and Netlify behaves identically. So
`response.ok` is `true` for a file that does not exist, and the probe would have reported
every missing PDF as present — the exact failure it was added to catch.

Corrected to require a content type that is actually a PDF, with an absent header treated
optimistically. The harness asserts the underlying server behaviour directly, so the reason
the check exists cannot be edited away by someone who thinks it is redundant.

### 8.5 Verification

`scratchpad/verify-e12b.mjs`, **35 checks, all passing**, plus the original
`verify-e12.mjs` updated to the new design (four checks rewritten, not deleted: the
slot-width check now measures the column, and the two "height stable across states" checks
now assert the panel is _shorter_ than the embed, which is the point of the change).

Full suite after rework: **219/219**.

Unchanged by this rework: **iOS Safari is still unverified** (§7), and the committed PDF is
still the marked draft.

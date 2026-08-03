# E12 — Resume

Implementation tickets for `docs/5-epic-list.md` E12. One ticket, one commit.

The **Global Definition of Done** in `5-epic-list.md` applies to every ticket here and is
not repeated in any of them.

Depends on E07 (nav), E09 (hero CTA), and E03 (the `/resume` route and its lazy chunk),
all of which are done. The route, the data file, the committed PDF, and both entry points
already exist and are green — E12 replaces the stub page behind them.

---

## Decisions taken before writing these tickets

Four ambiguities were resolved with the user before decomposition. Decisions 2 and 3 fill
real gaps in the source documents and are propagated there by E12-T01. Decisions 1 and 4
changed nothing and are recorded here only.

| #   | Ambiguity                                                                                                  | Decision                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Whether the site should serve the resume from an external host, so a frequently updated file stays current | **No — the committed static PDF, as already specified.** `2-architecture.md` §5 and §12 already require a committed file and already exclude external asset pipelines, so this confirmed the spec rather than changing it. **No document is edited for this**: writing it up would only record that an alternative was considered, which is not what the decision table is for |
| 2   | What the `h2: View` slot shows when inline PDF embedding is unavailable                                    | **A bordered level-1 panel with one explanatory line and a "View in browser" action** that opens the PDF directly. Rendering nothing would leave an `h2` introducing nothing — the failure `3-style-preference.md` §6.10 rejected for the case-study `Links` heading                                                                                                           |
| 3   | Viewer slot dimensions, unspecified by every document                                                      | **Aspect-ratio-locked at the PDF's own page ratio**, `max-w-content`. Reserves its exact space before the PDF loads, so the slot contributes zero CLS — the same technique as the hero portrait slot in `HeroSection.tsx`                                                                                                                                                      |
| 4   | Whether to add a last-updated date beside the download                                                     | **No.** E12's criterion is file type and size; a date is a new content field that can go stale on its own. Not added                                                                                                                                                                                                                                                           |

`RESUME.viewLabel` (`'View in browser'`) is a fifth item that was flagged and needs no
decision: the fallback panel's action is exactly what that field describes, so E12-T04
consumes it. It is neither dead data nor a new requirement.

### Why the detection hook is not load-bearing

E12-T03 detects inline-PDF support, and E12-T04 uses it to choose between the embed and
the fallback panel. **Neither is a correctness dependency**, by design: the direct link to
the file is rendered unconditionally in both branches, and the `h2: Download` section
below is present on every browser. If detection is wrong in either direction, the visitor
still has a working path to the PDF from the same screen. That is what `5-epic-list.md`
E12 means by "always offer the direct link", and it is what keeps an unverifiable browser
check off the critical path.

---

### E12-T01 — Specify the resume viewer slot and its fallback in the source docs

**Depends on:** none
**Files:**

- Modify: `docs/3-style-preference.md` — §6.7
- Modify: `docs/4-interaction-design.md` — §5.6, §10 (one new row)
- Modify: `docs/5-epic-list.md` — E12 deliverables
- Modify: `docs/tickets/README.md` — decision table

**Commit:** `docs: specify the resume viewer slot and its embedding fallback`

**Scope**

- In: writing decisions 2 and 3 above into the three source documents and the ticket
  README's decision table. Documentation only.
- Out: every line of code. `ResumeViewer`, `ResumeDownloadLink`, `ResumePage`, and the
  hook are E12-T02 through E12-T05. Replacing the draft PDF with a final one is the E18
  content gate.
- Out: `docs/2-architecture.md`. Decision 1 confirmed §5 and §12 as already written, and a
  confirmed spec needs no edit. Documenting the alternative that was rejected would leave
  the next reader thinking it was once live.

**Implementation notes**

`3-style-preference.md` §6.7 currently specifies the download button and "the in-browser
viewer" without saying what the viewer looks like. Add the slot: `max-w-content`,
`rounded-lg`, `border border-border`, `bg-surface`, aspect-ratio-locked, elevation level 1
per §4.4. Add the fallback panel: same frame, centred, one `fg-muted` sentence, and a
`primary` action carrying `RESUME.viewLabel`.

`4-interaction-design.md` §5.6 is three sentences and says nothing about behaviour when
embedding is unavailable. Extend it with: the embed is attempted by default; the fallback
panel replaces the embed, never the section; and the direct link renders in both branches.
Add one row to §10 in the existing format, covering decisions 2 and 3 together — they are
one contract, not two.

E12's deliverable list in `5-epic-list.md` gains the fallback panel and the locked slot.
Its acceptance list is already correct and needs no new criterion — decision 2 is how
criterion 4 is satisfied, not a fifth thing to satisfy.

`docs/tickets/README.md`'s decision table ends at row 12. Add row 13 in the same
three-column shape.

The §8 animation inventory is **not** touched. E12 ships no animation: the resume page's
content arrives with the route transition (animation 5), and the closed-list rule gives
anything unnamed animation 2 with no child orchestration. `ProjectPage` and its three
section components are the precedent — they carry no `whileInView` either. Adding a
scroll reveal to a route whose content is entirely above the fold would fight the page
transition it just ran.

**Acceptance**

- `git show --name-only` for this commit lists four files, all under `docs/`, and zero
  files under `src/`.
- `docs/2-architecture.md` is not among them — `git diff HEAD~1 -- docs/2-architecture.md`
  is empty.
- `grep -c "^| 13 " docs/tickets/README.md` returns `1`.
- `docs/4-interaction-design.md` §10 has 16 numbered rows, up from 15, and rows 1–15 are
  content-identical under `git diff --ignore-all-space`.
- `grep -n "aspect" docs/3-style-preference.md` matches inside §6.7.
- `yarn format:check` passes — the tables reflow under Prettier and must be committed
  formatted.

**Traceability:** `3-style-preference.md` §6.7 · `4-interaction-design.md` §5.6, §10 ·
`5-epic-list.md` E12

---

### E12-T02 — Build `ResumeDownloadLink`, exposing file type and size before the download

**Depends on:** E12-T01
**Files:**

- Create: `src/components/sections/ResumeDownloadLink.tsx`
- Modify: `src/components/ui/Button.tsx` — add the `download` branch to `ButtonAsLinkProps`
- Modify: `docs/tickets/E05-status.md` — record the cross-epic touch

**Commit:** `feat(resume): build the download section with its file type and size`

**Scope**

- In: the `h2: Download` section, the `primary` download action, and the `PDF · 76 KB`
  metadata line. Plus the one `Button` capability this needs and does not have.
- Out: the viewer, the fallback panel, and the detection hook (E12-T03, E12-T04). The page
  that composes this (E12-T05). Changing `RESUME.fileSize` — the value in `resume.ts` is
  already correct for the committed file, and the file itself is E18's gate.

**Implementation notes**

**This ticket reaches into E05's `Button`, which is a cross-epic touch and is declared
rather than done quietly** (`AGENTS.md` §13). It is necessary: `Button`'s link branch
renders either a router `<Link>` or an external `<a target="_blank">`, and the download
needs neither. A router `<Link to="/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf">` is intercepted by React
Router and resolves to the catch-all 404 instead of the file, because the path looks like
a route. Add a third case to the existing discriminated union:

```tsx
interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
  /**
   * Renders a plain same-origin anchor carrying `download`. A router Link to a
   * static asset resolves to the SPA catch-all instead of the file.
   */
  download?: string;
  onClick?: never;
}
```

The `download` value is the suggested filename, so it is a `string`, not a `boolean` —
`download` with no value lets the server's `Content-Disposition` name the file, which on a
static host means the visitor saves `Shaokh_Al_Mahmud_Shakhlyn-resume.pdf` from a URL they cannot see.
Branch on `download` **before** `external` in the render body, since both may not be set
together and `external` currently wins by position.

The component itself follows the `ProjectLinks` precedent exactly: it owns its
`<section aria-labelledby>` and its own `h2`, rather than having the page own the heading.
That keeps `2-architecture.md` §8's `h2: Download` next to the content it introduces.

Name it `ResumeDownloadLink` even though it owns a section — that is the name
`2-architecture.md` §6 gives the component, and renaming it would be an undeclared
deviation from the component tree.

Content comes from `RESUME` in `src/data/resume.ts`; nothing here is hardcoded copy.
The metadata line is `fg-subtle`, `body-sm`, and reads `{fileType} · {fileSize}` — the
middle dot is a separator, not content, so it carries `aria-hidden` and the two values
stay separately readable. Place it **beside or beneath the button, not inside its label**:
`3-style-preference.md` §6.7 permits either, and a button whose accessible name is
"Download PDF PDF 76 KB" is the worse of the two.

**Acceptance**

- `/resume` renders `<h2>Download</h2>` and, beneath it, a `primary` anchor whose
  accessible name is `Download PDF`.
- The rendered anchor has `href="/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf"` and a `download` attribute
  whose value is `Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`. It is **not** a `<button>` and has no `target`.
- The text `PDF` and the text `76 KB` are both present in the DOM within the download
  section, outside the anchor's accessible name.
- Clicking the anchor in Chrome saves a file rather than navigating; the URL bar does not
  change to `/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`.
- Navigating directly to `/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf` in the preview server returns the
  PDF, not `index.html` — this is the SPA-catch-all case, and it must be checked against
  `yarn build && yarn preview`, not the dev server.
- `Button` still type-checks at all four existing call sites (`href`, `href external`,
  plain `<button>`, `<button type="submit">`); `yarn typecheck` passes.
- `docs/tickets/E05-status.md` gains a dated section recording the added `download` branch.

**Traceability:** `5-epic-list.md` E12 acceptance 3 · `3-style-preference.md` §6.7 ·
`2-architecture.md` §6, §8 · `1-prd.md` §3 Resume

---

### E12-T03 — Add `useCanEmbedPdf` for inline-PDF capability detection

**Depends on:** none
**Files:**

- Create: `src/hooks/useCanEmbedPdf.ts`

**Commit:** `feat(resume): detect inline PDF support for the viewer fallback`

**Scope**

- In: one hook returning whether the browser can display a PDF inline, read from browser
  APIs.
- Out: anything that renders. The viewer that consumes this is E12-T04, and the fallback
  panel's appearance is specified there.

**Implementation notes**

Return a three-state value, not a boolean:

```ts
export type PdfEmbedSupport = 'unknown' | 'supported' | 'unsupported';
```

Two states would force a guess during the first render, and both guesses are wrong: guess
`supported` and browsers without a PDF viewer flash an empty frame; guess `unsupported`
and every visitor sees the fallback for a frame before the embed replaces it. `'unknown'`
lets E12-T04 render the embed optimistically — which is the correct default, since it is
right for the large majority — and swap only on an explicit negative.

The signal is `navigator.pdfViewerEnabled`, the standardised property for exactly this
question. Browsers predating it do not define the property, which is why the check is
`typeof navigator.pdfViewerEnabled === 'boolean'` and not a truthiness test — an
undefined property must resolve to `'unknown'`, not `'unsupported'`.

**Read it with `useSyncExternalStore`, not `useEffect` + `useState`.** This was corrected
during implementation: the first version used an effect, and `react-hooks/`
`set-state-in-effect` rejected it as an error, correctly. Setting state in an effect to
capture a value that never changes renders the wrong branch once and then corrects it —
a cascading render, and a visible flash of the wrong state on the slowest devices.
`useSyncExternalStore` settles on the first render instead.

`subscribe` is a no-op returning a no-op, because there is genuinely nothing to subscribe
to, and it must be defined at module scope so its identity is stable across renders.
`getServerSnapshot` returns `'unknown'`; there is no server here, but the argument is not
optional. There is no cleanup function to write, because there is no subscription.

`navigator.pdfViewerEnabled` is not in the DOM lib types on every TypeScript version.
If `yarn typecheck` reports it missing, narrow through a local type guard on
`unknown` — **never** `as any`, and never a `@ts-expect-error`.

Do not attempt user-agent sniffing for iOS. It is unreliable, it breaks on the next
Safari release, and it is not needed: the fallback is a progressive enhancement over a
direct link that renders either way, per the note at the top of this file.

**Acceptance**

- `useCanEmbedPdf()` settles on its **first** render — `/resume` never paints the wrong
  branch and then corrects it. Verified by reading the DOM before and after a
  `requestAnimationFrame` and asserting the two are identical, which is the stronger form
  of the flash-free property the original criterion was reaching for.
- In headless Chrome with `navigator.pdfViewerEnabled === true`, `/resume` renders the
  embed and not the fallback panel.
- With `Object.defineProperty(navigator, 'pdfViewerEnabled', { value: false })` evaluated
  before the route mounts, `/resume` renders the fallback panel and not the embed.
- With the property deleted before mount, `/resume` renders the embed — the
  `'unknown'` path, not the `'unsupported'` path.
- `grep -nE "\bany\b|@ts-expect-error|eslint-disable" src/hooks/useCanEmbedPdf.ts` returns
  no match.
- The hook file imports nothing from `@/data/` and nothing from `motion/react`.

**Known limitation, stated rather than hidden:** the iOS Safari case this hook exists to
serve **cannot be verified in this environment**. Headless Chrome on Linux has no WebKit
PDF pipeline, so every check above passes on a browser that is not the one at risk. The
three checks above verify the hook's own logic against a controlled property, not iOS's
real behaviour. E12-T06 records this as outstanding and it needs a real iOS device before
it is closed.

**Traceability:** `5-epic-list.md` E12 acceptance 4, Open Risks table ·
`4-interaction-design.md` §5.6 · `AGENTS.md` §5

---

### E12-T04 — Build `ResumeViewer` with an always-visible direct link

**Depends on:** E12-T01, E12-T03
**Files:**

- Create: `src/components/sections/ResumeViewer.tsx`

**Commit:** `feat(resume): build the viewer with its aspect-locked slot and fallback`

**Scope**

- In: the `h2: View` section, the aspect-locked slot, the `<object>` embed, the fallback
  panel, and the direct link that renders in both branches.
- Out: the download section (E12-T02), the page composition (E12-T05), and the detection
  logic itself (E12-T03) — this ticket consumes the hook and does not reimplement it.

**Implementation notes**

Owns its `<section aria-labelledby="resume-view-heading">` and its `h2`, matching
`ProjectLinks` and `ResumeDownloadLink`.

The slot is aspect-ratio-locked so it reserves its exact space before the PDF paints:

```tsx
// A4, the committed file's page size (595x842pt). An arbitrary value because no
// token expresses aspect ratios — same exception as the hero portrait slot.
// Re-check this if the PDF is ever replaced with a US Letter one (8.5x11 is 51/66).
const SLOT = 'aspect-[210/297] w-full max-w-content rounded-lg border border-border';
```

Verified against the committed file: `/MediaBox [0 0 594.95996 841.91998]` is A4, so the
ratio is `210/297`. Do not write `1/1.414` — it is the same number less legibly, and it
does not say which paper size it came from.

Use `<object type="application/pdf">`, not `<iframe>` and not `<embed>`. `<object>` is the
only one of the three whose children render as fallback content when the resource cannot
be displayed, which gives a second layer of degradation underneath the hook for free.
The element needs an accessible name — give it `aria-label` naming the document, since an
unlabelled embedded region is announced as "embedded object" and nothing else.

The fallback panel, when the hook returns `'unsupported'`:

- The same slot frame, so the section's height does not change between branches and the
  page does not shift when detection settles.
- Centred contents: one `fg-muted` `body-sm` sentence explaining that the browser cannot
  display the PDF inline, and a `primary` `Button` carrying `RESUME.viewLabel`, opening
  `RESUME.filePath` in a new tab.
- No error styling. `danger` is reserved for form feedback (`3-style-preference.md` §2.5),
  and a browser without an inline PDF viewer is not an error state.

**The direct link renders in both branches**, beneath the slot, as an `accent` prose link
carrying `RESUME.viewLabel` and opening in a new tab. This is the "always offer the direct
link" requirement in `5-epic-list.md` E12, and it must not be conditional on the hook —
that would make the one guarantee depend on the one check that cannot be verified.

Both the embed and every link resolve from `RESUME.filePath`. This component hardcodes no
path.

**Acceptance**

- `/resume` renders `<h2>View</h2>` followed by an element whose computed
  `aspect-ratio` is `210 / 297`, at `max-width: 768px`.
- With `pdfViewerEnabled` true: the section contains one `<object>` whose `data` attribute
  is `/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf` and whose accessible name is non-empty. No fallback
  panel is present.
- With `pdfViewerEnabled` forced false before mount: no `<object>` is present, the panel
  is, and the panel contains no interactive element.
- **In both of the two states above**, exactly one link to `/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`
  is present and visible within the view section, is the same element in both, and has the
  accessible name `View in browser (opens in a new tab)`. Assert this in both branches of
  the same harness — it is the criterion the whole fallback design exists to guarantee,
  and "exactly one" is what stops the fallback growing a duplicate control.
- The bounding-box height of the view section is within 2px between the two states,
  measured at 1440 and at 375.
- CLS on `/resume` is 0 across a throttled load, measured with `PerformanceObserver` on
  `layout-shift`.
- `grep -n "shakhlyn-resume" src/components/sections/ResumeViewer.tsx` returns no match —
  the path comes from `RESUME`.
- No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920, checked via
  `window.scrollX` after `window.scrollTo(9999, 0)`.

**Traceability:** `5-epic-list.md` E12 acceptance 4 · `3-style-preference.md` §6.7, §4.4 ·
`4-interaction-design.md` §5.6 · `2-architecture.md` §5, §6

---

### E12-T05 — Compose `ResumePage` from the View / Download heading plan

**Depends on:** E12-T02, E12-T04
**Files:**

- Modify: `src/pages/ResumePage.tsx` — replace the stub body

**Commit:** `feat(resume): compose the resume page from the viewer and download sections`

**Scope**

- In: replacing the stub's empty body with `ResumeViewer` and `ResumeDownloadLink`, in the
  order `2-architecture.md` §8 fixes.
- Out: the two section components themselves (E12-T02, E12-T04). Route-level `<title>` and
  meta description, which are E15. The router entry and the lazy chunk, which are E03 and
  already correct.

**Implementation notes**

The stub's `h1` is already correct and must be kept exactly as it is, including
`tabIndex={-1}` and `focus-visible:outline-none` — that is the element `useRouteFocus`
moves focus to on route change, and E03's acceptance criterion depends on it. Change the
body beneath it, not the heading.

Order is `h1: Resume` → `h2: View` → `h2: Download`, fixed by `2-architecture.md` §8's
resume page heading plan. View precedes Download even though Download is the smaller
commitment: a visitor who can see the document decides whether they want the file, and the
plan is normative regardless.

Keep `Container as="section"`. Add vertical rhythm between the two sections with
`space-y-12`, matching `ProjectPage`'s `space-y-12` — the two inner routes should not have
different rhythms for no reason.

No motion. See E12-T01's note: the page arrives with the route transition, and
`ProjectPage` is the precedent for inner-page sections carrying no `whileInView`.

**Acceptance**

- `/resume` has exactly one `h1`, reading `Resume`, and exactly two `h2`s, reading `View`
  then `Download` in DOM order.
- Heading levels on `/resume` go 1 → 2 → 2 with no skip, read from
  `Accessibility.getFullAXTree`.
- The stub's placeholder is gone: `grep -n "Stub for /resume" src/pages/ResumePage.tsx`
  returns no match.
- The `h1` still carries `tabIndex="-1"`; navigating from `/` to `/resume` via the nav
  button leaves `document.activeElement` as that `h1`.
- Tab order on `/resume` is: skip link → header nav → the view section's direct link →
  the download anchor → social rail → footer. No element between the `h1` and the view
  link takes a tab stop.
- The `/resume` chunk is still emitted as a separate file in `yarn build` output.

**Traceability:** `2-architecture.md` §3, §8 · `5-epic-list.md` E12 deliverable 1 ·
`4-interaction-design.md` §5.6, §9

---

### E12-T06 — Verify E12 end to end and record `E12-status.md`

**Depends on:** E12-T01, E12-T02, E12-T03, E12-T04, E12-T05
**Files:**

- Create: `docs/tickets/E12-status.md`
- Modify: `docs/tickets/STATUS.md` — Phase 3 table and notes
- Modify: `docs/tickets/README.md` — Phase 3 table row for E12

**Commit:** `docs(tickets): record E12 status`

**Scope**

- In: the four gates, the browser verification pass, the single-path check, and the status
  files.
- Out: fixing anything the pass finds in another epic. A defect in E07, E09, or E05 that
  E12 surfaces gets recorded for an amendment ticket, exactly as E11 did with the scroll
  spy — it is not fixed inside a feature epic.

**Implementation notes**

`5-epic-list.md` E12 acceptance 1 — "one stable path, consumed by the hero CTA, the nav
button, and the `/resume` page" — is the criterion no single earlier ticket owns, because
it is a property of the whole. It is satisfied by **two** constants, not one, and the
status file should say so plainly rather than let a future reader think one went missing:

- `RESUME_ROUTE` in `src/data/navigation.ts` is the **route**, consumed by the hero CTA
  and the nav button. Both go to `/resume`, not to the file.
- `RESUME.filePath` in `src/data/resume.ts` is the **asset**, consumed by the viewer, the
  fallback action, the direct link, and the download anchor.

Both are single-sourced, which is what the criterion is protecting against. Verify by
grep, not by reading: no `.tsx` file outside `src/data/` may contain the literal
`/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf` or a second literal `'/resume'`.

Acceptance 2 — "download works on mobile browsers" — is verified in the strongest form
available here: CDP device emulation with a touch-capable mobile profile, asserting the
anchor's `download` attribute and same-origin `href`. State explicitly that emulation is
not a real handset and that iOS remains unverified, together with E12-T03's limitation.

Record in `E12-status.md`: the four gates; the cross-epic touch into E05's `Button`; the
per-ticket evidence; the harness check count; and an **Outstanding** section carrying the
iOS Safari item and the standing E18 gate that the committed PDF is still a draft.

**Acceptance**

- `yarn typecheck`, `yarn lint`, `yarn format:check`, and `yarn build` all pass on the
  final tree, with the output pasted into `E12-status.md` §1.
- `grep -rn "resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf" src --include=*.tsx` returns no match.
- `grep -rn "'/resume'" src --include=*.tsx` returns no match.
- Every acceptance criterion in E12-T02 through E12-T05 is listed in `E12-status.md` §5
  with pass/fail and the command or measurement that produced it. No criterion is recorded
  as passing on inspection alone.
- `docs/tickets/STATUS.md` Phase 3 table has an E12 row whose totals match the number of
  tickets in this file.
- `docs/tickets/README.md` Phase 3 table has an E12 row linking both this file and
  `E12-status.md`.
- `E12-status.md` has an **Outstanding** section naming the iOS Safari verification and
  the draft-PDF content gate.

**Traceability:** `5-epic-list.md` E12 acceptance 1, 2 · `AGENTS.md` §11 ·
`docs/tickets/README.md` ticket conventions

---

### E12-T07 — Centre the resume column and cap the preview height

**Depends on:** E12-T05
**Files:**

- Modify: `src/pages/ResumePage.tsx` — centred column wrapper
- Modify: `src/components/sections/ResumeViewer.tsx` — frame classes
- Modify: `docs/3-style-preference.md` — §6.7
- Modify: `docs/4-interaction-design.md` — §10 (one new row)

**Commit:** `fix(resume): centre the page column and cap the preview height`

**Scope**

- In: the centred column, the `80vh` ceiling on the embed frame, and the doc rows that
  record both.
- Out: the missing-file state and its probe (E12-T08). The social-rail gutter asymmetry,
  which is `4-interaction-design.md` §7's and applies site-wide.

**Implementation notes**

Two defects T04 shipped, neither caught by its harness — which asserted the properties the
ticket specified and never asked how the page read.

`SLOT` carried `max-w-content` with no `mx-auto`, so the preview sat flush left inside a
1120px shell with ~288px of dead space beside it. The fix is a column, not an `mx-auto` on
the slot: the `h1`, both `h2`s, the preview, and both buttons must share one left edge, or
a centred box hangs under left-aligned headings.

Wrap the page body in `<div className="mx-auto max-w-content space-y-12">` — an **inner
wrapper**, not `max-w-content` on `Container`'s `className`. `Container` carries
`2xl:max-w-container-wide`; `tailwind-merge` resolves the base `max-w-*` conflict but
leaves that variant standing, and the column would jump to 1280px above 1536px.

The frame drops `max-w-content` (the column owns width now) and gains `max-h-[80vh]`.
Unbounded, the A4 lock computes to 1086px at 768px wide — taller than a laptop viewport,
so the visitor scrolls the page to read a document that scrolls itself. Viewport units
resolve at first paint, so the cap costs no CLS.

**Acceptance**

- At 320, 375, 768, 1024, 1440 and 1920 the column's left and right gaps inside
  `Container`'s content box are equal within 1px.
- At 375 and 1440 the `h1`, the `View` heading, the preview frame, and the `Download`
  heading report an identical `getBoundingClientRect().left`.
- At every width above, the preview's rendered height is `<= 0.8 * window.innerHeight`.
- The embed still reports `aspect-ratio: 210 / 297` and a non-`none` `max-height`.
- The centred column measures exactly 768px at 1024 and above.
- CLS on `/resume` is still 0; no horizontal page scroll at any of the six widths.

**Traceability:** `3-style-preference.md` §6.7, §3.3, §4.2 · `4-interaction-design.md` §7,
§10 row 17

---

## Coverage

Every E12 deliverable and acceptance criterion from `docs/5-epic-list.md`, mapped to the
tickets that satisfy it.

### Deliverables

| Deliverable                                                                      | Tickets                         |
| -------------------------------------------------------------------------------- | ------------------------------- |
| `ResumePage` at `/resume` with `ResumeViewer` and `ResumeDownloadLink`           | T02, T03, T04, T05              |
| **No home-page `#resume` section** — resume is route-only, from hero CTA and nav | T06 (verified, already true)    |
| PDF committed at `public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`            | Already committed; T06 gates it |

### Acceptance criteria

| #   | Criterion                                                                                               | Tickets       |
| --- | ------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | One stable path, consumed by the hero CTA, the nav button, and the `/resume` page                       | T02, T04, T06 |
| 2   | Download works on mobile browsers                                                                       | T02, T06      |
| 3   | File type and size are visible before the user commits to the download                                  | T02           |
| 4   | The viewer degrades gracefully where inline PDF embedding is unsupported — always offer the direct link | T01, T03, T04 |

Every row has at least one ticket, and every ticket appears in at least one row.

---

## Risk

**E12-T03 and E12-T04 are the high-risk tickets, for one shared reason:** the browser this
work exists to serve is the one browser that cannot be tested here. Headless Chrome on
Linux has no WebKit PDF pipeline, so a green harness proves the hook's logic against a
property we set ourselves — not iOS Safari's actual behaviour with an `<object>`.

This is mitigated by architecture rather than by testing, which is the only honest option
available: the direct link renders unconditionally in both branches, and the `h2: Download`
section is present on every browser. The worst case if detection is wrong on iOS is a
visitor seeing an empty or single-page frame **above two working links to the same file**,
not a dead end. E12-T06 carries the item forward as outstanding rather than closing it.

Everything else in E12 is low risk: the route, the lazy chunk, the data file, the
committed PDF, and both entry points already exist and are verified green by E03, E07,
and E09.

The one non-obvious failure mode outside those two tickets is the SPA catch-all — a router
`<Link>` to a static asset resolves to the 404 rather than the file. E12-T02 avoids it by
construction with a plain anchor and asserts against `yarn preview`, not the dev server,
because Vite's dev server serves `public/` in a way that hides the problem.

---

## Open Questions

None outstanding. The four ambiguities found during decomposition were resolved before
these tickets were written and are recorded in the decisions table above; `viewLabel`'s
consumer followed from decision 2 and needed no separate call.

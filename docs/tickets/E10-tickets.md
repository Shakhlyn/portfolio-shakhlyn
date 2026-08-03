# E10 — Projects

**Goal:** The section hiring managers actually came for — one `h2`, two independent
carousels, and the case study route behind them.

**Depends on:** E02 (tokens), E04 (`PROJECTS`, `ProjectType`), E05 (`Button`, `Card`,
`Badge`, `Section`, `Container`, chevron icons), E06 (motion vocabulary, reduced motion),
E07 (`NAV_ITEMS`, `useActiveSection`, and the `#projects` anchor scaffold this epic
replaces).

The Global Definition of Done in `README.md` applies to every ticket and is not repeated.

**Largest epic in the plan.** Twelve tickets, twelve commits. `5-epic-list.md` suggests
splitting it into two commits; that was written before the decomposition and is
superseded — the seams below are finer and each one is independently verifiable.

---

## Decisions taken before writing

All four are **already fixed in the source documents**, not merely recorded here. See
`README.md` § "Decisions recorded during ticket writing" rows 7–8.

| #   | Question                                               | Decision                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Card title link target, and the no-case-study case     | **Not a link at all.** Three named `secondary` `sm` buttons — Case study → `/projects/:slug`, GitHub, Live — each rendering only when its data exists. A project with none renders no button row. The card is never an anchor, so nothing can nest inside one.         |
| 2   | Case study `Links` `h2` with no repository or live URL | **Omitted entirely.** `2-architecture.md` §8 lists the maximum heading set, not a per-project guarantee. A heading that introduces nothing costs the reader attention for no return.                                                                                   |
| 3   | Hiding the Projects nav item when no projects exist    | **In scope, and it edits E07's files.** There is no other way to satisfy `4-interaction-design.md` §5.3 — the nav is data, and the data must be derived. T05 owns it and records the cross-epic touch in both status files.                                            |
| 4   | Not enough content to exercise the carousel            | **Placeholder projects and generated screenshots (T02)**, each marked and added to E18's deploy gate. Five real projects (3/2) never overflow a 3-up track at `xl`, and no project has an image, so the 16:9 frame and the arrow states are unverifiable without them. |

---

## Risk register — retired before decomposition, not carried into the build

Three things in this epic can fail in ways that are expensive to find late. Each is
resolved by a design decision below, and each resolution is an acceptance criterion on
the ticket that creates the risk — not deferred to the verification pass.

| Risk                                                    | Retired by                                                                                                                                                                                                                         | Verified in |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Full-bleed track causes horizontal **page** scroll      | `Container` is asymmetric (`sm:pl-14 lg:pl-14 xl:pl-8`, clearing the social rail). Bleed is scoped to **below `sm` only**, where the gutter is a symmetric 20px and `-mx-5` restores exactly viewport width. Above `sm`, no bleed. | T06         |
| Arrow state lies after a resize or orientation change   | One `evaluate()` fed by mount, an rAF-throttled scroll listener, and a **`ResizeObserver` on the track** — not a `window.resize` listener, which misses container-only changes (zoom, font size, sheet open).                      | T07, T08    |
| Unknown `:slug` renders the error fallback, not the 404 | Never throw. `PROJECTS.find(…)`; on a miss render `<NotFoundPage />` directly. A `throw new Response(404)` would hit the route's existing `errorElement` and say "something went wrong" about a URL that is simply not a project.  | T10         |

---

## E10-T01 — Amend the card link model and the conditional Links heading in the docs

**Depends on:** none
**Files:** modified — `docs/2-architecture.md`, `docs/3-style-preference.md`,
`docs/4-interaction-design.md`, `docs/5-epic-list.md`, `docs/tickets/README.md`
**Commit:** `docs(e10): fix the card link model and make the links heading conditional`

**Scope**

- In: the two spec changes, applied to every document that states the superseded rule,
  plus the decision rows that record why.
- Out: all code. T03 builds the card the amended §6.4 describes; T11 builds the case
  study body.

**Implementation notes**

- Both changes are **spec changes, not implementation choices**, so they land in the
  documents before any code is written. A conflict resolved only in code is one the next
  reader re-litigates against a doc that still says the opposite — the same reason E09's
  hero conflicts were fixed in the sources (commit `ddb178a`).
- `3-style-preference.md` §6.4 said "`h4` title, which is the card's only link" and
  `4-interaction-design.md` §6 said "**The card title is the only card-level link**".
  Both are replaced by the three-button model. The stated reason for the old rule — no
  nested interactive elements inside an anchor — is preserved and better served: buttons
  are siblings, never children of a link.
- The card also loses `-translate-y-0.5` on hover. `Card`'s `interactive` prop means "one
  tab stop, the whole surface is the target", which a card with three buttons is not.
  Background and border hover stay; they group the card without promising a click.
- `2-architecture.md` §8 gains the "maximum heading set" clarification so the omitted
  `Links` heading does not read as a violation of the heading plan.
- `5-epic-list.md` E18's deploy gate widens to
  `grep -rnE "INVENTED FIGURE|PLACEHOLDER PROJECT|PLACEHOLDER SCREENSHOT" src/`, ahead of
  T02 introducing the second and third markers.

**Acceptance**

- [ ] The old rule survives in no source document, in any wording:
      `grep -rnE "card's only link|only card-level link" docs/*.md` returns nothing.
      (The history is preserved as "the sole card-level anchor", so the phrase itself
      cannot be resurrected by a search-and-replace that misses a paraphrase.)
- [ ] `3-style-preference.md` §6.4 names all three buttons and states the card is not an
      anchor; §6.10 states the `Links` heading is omitted with no repository or live URL.
- [ ] `4-interaction-design.md` §10 carries rows 10 and 11 recording both decisions with
      their propagation targets, and §9's keyboard map no longer names a card title link.
- [ ] `2-architecture.md` §8's project-page block marks `Links` conditional.
- [ ] `5-epic-list.md` E10 deliverables and acceptance match the new model; E18's gate
      covers all three markers.
- [ ] No file under `src/` is modified by this commit.

**Traceability:** `3-style-preference.md` §6.4, §6.10 · `4-interaction-design.md` §6,
§9, §10 · `2-architecture.md` §8, §11 · `5-epic-list.md` E10, E18

---

## E10-T02 — Add placeholder projects and screenshots, gated for E18

**Depends on:** none
**Files:** modified — `src/data/projects.ts`; created — `src/assets/projects/*.webp`
**Commit:** `feat(data): add placeholder projects and screenshots for carousel verification`

**Scope**

- In: enough project entries that **each** category overflows a 3-up track at `xl`, and
  16:9 screenshots on the placeholder entries only.
- Out: real screenshots of the real projects, and any change to the five existing
  entries' copy. Out: replacing the placeholders — that is E18's gate, not a ticket here.

**Implementation notes**

- Current content is 3 professional + 2 personal with no images. At `xl` three cards are
  visible, so neither track overflows, which makes "arrows hidden when nothing overflows"
  and "arrows disabled at the ends" indistinguishable from a broken build. Take each
  category to **at least four**.
- Every added entry carries `// TODO(content): PLACEHOLDER PROJECT` directly above it.
  `1-prd.md` §6 lists project names among the content that is **not** acceptable as a
  launch placeholder, so the marker plus E18's gate is what keeps this honest.
- Screenshots go on the **placeholder entries only**. Attaching a generated image to a
  real client project would assert a UI that is not that product's. The mix is
  deliberate and useful: it exercises both the image-frame path and the frame-omitted
  path (`3-style-preference.md` §6.4, "If a project has no image, the frame is omitted
  entirely") and proves the equal-height rule across both in one track.
- Images are WebP at a 16:9 ratio with `width`/`height` recorded in the data, per
  `ProjectImageType` and `2-architecture.md` §5. Marked
  `TODO(content): PLACEHOLDER SCREENSHOT` in the data, not only in the filename.
- Stored under `src/assets/projects/` (build-optimised, imported) rather than
  `public/projects/`, which §5 reserves for assets needing a stable public URL.
- Placeholder entries need `problem` / `approach` / `outcome` prose too, since T11 renders
  them — write it as visibly generic filler, not as plausible fake achievement.

**Acceptance**

- [ ] `PROJECTS.filter(p => p.category === 'professional')` and the `'personal'` filter
      each return ≥ 4 entries.
- [ ] Every added entry is preceded by `TODO(content): PLACEHOLDER PROJECT`; every added
      image field is marked `PLACEHOLDER SCREENSHOT`.
- [ ] `grep -rnE "PLACEHOLDER PROJECT|PLACEHOLDER SCREENSHOT" src/ | wc -l` equals the
      number of placeholder entries plus the number of placeholder images.
- [ ] Each committed `.webp` has a 16:9 pixel ratio, is under 60KB, and its `width` /
      `height` in `projects.ts` match the file's real dimensions.
- [ ] The five pre-existing entries are byte-identical apart from list position.
- [ ] `yarn typecheck` passes with no component file changed.

**Traceability:** `1-prd.md` §6 Projects, Acceptable Placeholder Content ·
`2-architecture.md` §5 Project Images · `3-style-preference.md` §6.4, §10 ·
`5-epic-list.md` E10, E18

---

## E10-T03 — Build `ProjectCard` and mount a minimal `ProjectsSection`

**Depends on:** T02
**Files:** created — `src/components/sections/ProjectCard.tsx`,
`src/components/sections/ProjectsSection.tsx`; modified — `src/pages/HomePage.tsx`
**Commit:** `feat(projects): build the project card`

**Scope**

- In: the card, and a `ProjectsSection` that renders every project in one vertical
  stack, replacing the E07-T03 `#projects` scaffold.
- Out: the Professional / Personal split (T04), the scroll track (T06), arrows (T08),
  motion (T09). Out: the other three scaffold sections — E11 and E13 own those.

**Implementation notes**

- Anatomy top to bottom (`3-style-preference.md` §6.4): 16:9 image frame → `h4` title as
  plain text → two-line clamped `body-sm` summary in `fg-muted` → `Badge` row, max 5 with
  the remainder as a `+N` badge → button row.
- **The card is not an anchor and the title is not a link.** Up to three `secondary` `sm`
  buttons: "Case study" → `/projects/{slug}` (internal, same tab, rendered only when
  `caseStudySlug` exists), "GitHub" → `githubUrl`, "Live" → `liveUrl` (both
  `external`, which `Button` already gives `target="_blank" rel="noreferrer"` and the
  visually hidden "(opens in a new tab)"). None present → no button row.
- `Card` is used **without** `interactive`. Hover background and border come from a
  local class; the lift does not (§6, T01's amendment).
- Image frame: `rounded-lg overflow-hidden`, `bg-surface-hover` behind it, explicit
  `width`/`height` from the data, `loading="lazy"` — this is below the fold, the exact
  inverse of the hero portrait. Omitted entirely when `image` is absent; no grey box
  ships.
- `h4`, not `h3` — the subsection heading arriving in T04 is the `h3`, and levels are
  never chosen for size (`3-style-preference.md` §3.3).
- `line-clamp-2` for the summary. Clamping is a paint-level truncation, so the full text
  stays in the accessibility tree.

**Acceptance**

- [ ] `document.querySelectorAll('#projects h4').length` equals `PROJECTS.length`, and
      no `h4` is inside an `<a>`.
- [ ] `document.querySelectorAll('#projects a[href] a, #projects a button').length === 0`
      — no nested interactive elements anywhere in the section.
- [ ] A project with `caseStudySlug` only renders exactly one button, labelled
      "Case study", whose `href` is `/projects/{slug}`.
- [ ] A project with no `caseStudySlug`, no `githubUrl` and no `liveUrl` renders zero
      buttons and no empty button row container.
- [ ] Every external button has `target="_blank"`, `rel="noreferrer"`, and an accessible
      name ending "(opens in a new tab)".
- [ ] A project with an `image` renders `<img loading="lazy">` with `width`/`height`
      attributes matching the data; a project without one renders no `img` and no
      placeholder element.
- [ ] The summary element's `scrollHeight` is capped at two lines, and its
      `textContent` is the untruncated string.
- [ ] A project with more than five tags renders exactly six badges, the last matching
      `/^\+\d+$/`.
- [ ] Hovering a card changes its background and border colour and leaves its
      `getBoundingClientRect().top` unchanged.

**Traceability:** `1-prd.md` §3 Projects · `2-architecture.md` §11 ·
`3-style-preference.md` §5.2, §5.3, §6.4, §10 · `4-interaction-design.md` §6

---

## E10-T04 — Group projects into the Professional and Personal `h3` subsections

**Depends on:** T03
**Files:** modified — `src/components/sections/ProjectsSection.tsx`
**Commit:** `feat(projects): group projects into professional and personal subsections`

**Scope**

- In: the `category` split into two labelled `h3` subsections, the eyebrow, and the
  empty-category and empty-section behaviour.
- Out: the nav item (T05) and the scroll track (T06). Out: filter controls of any kind —
  this is **grouping, not filtering** (`2-architecture.md` §12).

**Implementation notes**

- One `Section id="projects" title="Projects" eyebrow="WORK"` (the eyebrow is in
  `4-interaction-design.md` §5.3's diagram; Projects has one because it is a set you
  scan, unlike Current Role).
- Two `h3`s, **Professional then Personal**, in that order. Subsections separated by
  `mt-12` (`3-style-preference.md` §6.4).
- Grouping is computed during render from `PROJECTS` — no second data file, no
  `useState`, no `useEffect`. Two `filter` calls over a five-to-ten item array do not
  need `useMemo`; wrapping them would be the reflexive memoisation `AGENTS.md` §5 warns
  about.
- An empty category renders **nothing at all** for that subsection — no heading, no empty
  track, no "coming soon". Both empty and the whole `#projects` section does not render.
- The `h3` subsections do **not** drive scroll spy; only `#projects` does
  (`4-interaction-design.md` §3). They therefore carry no `id` that the spy observes.

**Acceptance**

- [ ] The section renders exactly two `h3`s, textContent "Professional" then "Personal",
      in DOM order.
- [ ] Each subsection's card count equals the corresponding `category` filter length.
- [ ] Temporarily setting every project to `category: 'personal'` renders one `h3`
      ("Personal") and no Professional heading or empty container.
- [ ] Temporarily emptying `PROJECTS` renders no `#projects` element at all —
      `document.getElementById('projects')` is `null`, not an empty section.
- [ ] The heading outline of the home page reads
      `h1 → h2 Current Role → h2 Projects → h3 Professional → h3 Personal → h2 About → …`
      with no skipped level.
- [ ] No filter control, tab, or select renders anywhere in the section.

**Traceability:** `2-architecture.md` §8, §12 · `3-style-preference.md` §6.4 ·
`4-interaction-design.md` §1, §3, §5.3

---

## E10-T05 — Derive the Projects nav item from project data

**Depends on:** T04
**Files:** modified — `src/data/navigation.ts`; verified — `src/components/layout/Navigation.tsx`,
`src/components/layout/MobileNavigation.tsx`, `src/hooks/useActiveSection.ts`,
`src/pages/NotFoundPage.tsx`
**Commit:** `feat(nav): omit the projects nav item when no projects exist`

**Scope**

- In: making `NAV_ITEMS`, `ANCHOR_SECTION_IDS`, and `NOT_FOUND_LINKS` drop their Projects
  entry when `PROJECTS` is empty.
- Out: every other nav behaviour. The desktop nav, the sheet, and the spy are E07's and
  must not change — this ticket changes only what they are given.

**Cross-epic, deliberately.** This edits `src/data/navigation.ts`, which E07 owns.
`4-interaction-design.md` §5.3 requires two empty categories to hide the section **and
its nav item**, and the nav is data: there is no way to satisfy it from inside
`components/sections/`. Record the touch in **both** `E07-status.md` and `E10-status.md`
so the next reader finds it from either end.

**Implementation notes**

- `PROJECTS` is a module-level constant, so the derivation is a module-level `filter`
  evaluated once at import — not a hook, not runtime state.
- Keep the predicate in one place and let all three exports read it, so a future third
  consumer cannot be forgotten. `ANCHOR_SECTION_IDS` already derives from `NAV_ITEMS`, so
  it follows for free; `NOT_FOUND_LINKS` is a separate literal and must be filtered too,
  or the 404 offers a link to a section that does not exist (`2-architecture.md` §11
  broken-link prevention).
- A nav item pointing at an absent anchor is exactly the dead internal link
  `1-prd.md` §5 Reliability forbids — this is the reason the requirement exists, not a
  hypothetical.
- With real data present this is unobservable, so the acceptance checks below are run
  against a temporary empty `PROJECTS` and then reverted. Say so in the status file; a
  criterion verified only by reading the code is not verified.

**Acceptance**

- [ ] With `PROJECTS` populated: the desktop nav renders 6 items including Projects, and
      `ANCHOR_SECTION_IDS` contains `'projects'`.
- [ ] With `PROJECTS` temporarily emptied: the desktop nav renders 5 items, none labelled
      Projects; the mobile sheet likewise; `ANCHOR_SECTION_IDS` omits `'projects'`; the
      404 page's link row omits Projects.
- [ ] With `PROJECTS` emptied, `useActiveSection` never returns `'projects'` while
      scrolling the full page height, and the observer is constructed with the shorter id
      list.
- [ ] No file under `src/components/layout/` or `src/hooks/` is modified by this commit.
- [ ] `PROJECTS` is restored before the commit — `git diff` on `projects.ts` is empty.

**Traceability:** `1-prd.md` §5 Reliability · `2-architecture.md` §11 ·
`4-interaction-design.md` §1, §3, §5.3 · `5-epic-list.md` E07, E10

---

## E10-T06 — Convert each subsection into a snap-scrolling `ProjectCarousel` track

**Depends on:** T04
**Files:** created — `src/components/sections/ProjectCarousel.tsx`; modified —
`src/components/sections/ProjectsSection.tsx`, `src/styles/index.css`
**Commit:** `feat(projects): build the scroll-snapped project carousel track`

**Scope**

- In: one component, two instances — the `h3` header, the horizontally scrolling
  snap track, card sizing, the mobile bleed, and the accessible region wrapper.
- Out: arrows (T08) and the hook that drives them (T07). Out: motion (T09).

**High-risk ticket.** This is the only place on the site where an element deliberately
extends past the container, and horizontal **page** scroll at any of six widths is a
Global DoD failure. The mitigation is in the notes and the measurement is in the
acceptance list.

**Implementation notes**

- Native CSS only: `overflow-x: auto`, `scroll-snap-type: x mandatory`, each card
  `scroll-snap-align: start`. **No carousel library** — momentum scrolling, trackpad
  gestures, and keyboard scrolling come free and correct
  (`4-interaction-design.md` §6).
- Card widths are computed, not measured: for `n` cards visible with gap `g`,
  `c = (100% − k·g) / n` where `k = ⌈n⌉ − 1`. With `gap-6` (24px) that is
  `w-[calc((100%-1.5rem)/1.15)] md:w-[calc((100%-3rem)/2.15)] xl:w-[calc((100%-3rem)/3)]`
  on a `flex-none` card. Arbitrary values with a comment, permitted by
  `3-style-preference.md` §9 — no token expresses a fractional card width.
- The 1.15 / 2.15 fractions are the point, not a rounding artefact: a partially visible
  next card is the clearest available signal that more exists sideways. `sm` inherits
  base and `lg` inherits `md`, per the breakpoint table in §2.
- **Mobile bleed, scoped to below `sm`:** `-mx-5 px-5 scroll-px-5 sm:mx-0 sm:px-0
sm:scroll-px-0`. `Container` is **not symmetric** — it carries `sm:pl-14 lg:pl-14
xl:pl-8` to clear the fixed social rail — so a symmetric negative margin anywhere from
  `sm` to `lg` would overhang the left viewport edge and produce page-level horizontal
  scroll. Below `sm` the rail is hidden and the gutter is a symmetric 20px, so `-mx-5`
  restores exactly viewport width and can never exceed it. `scroll-px-5` is what keeps the
  first card's leading edge on the container gutter and stops a focused card landing flush
  to the edge (§6).
- Scrollbar visually hidden, scrolling never disabled: a small `@utility` in
  `src/styles/index.css`, the one stylesheet the project allows (`AGENTS.md` §2).
- Each track is `role="region"` + `tabindex="0"` + an `aria-label` carrying the group and
  the count — "Professional projects, 6 items" (§6). Two carousels on one page cannot
  share a label. The count comes from the array length, never hardcoded.
- The two instances share no state. Each owns its own DOM node and its own scroll
  position; that independence is what makes "one component, two instances" safe.

**Acceptance**

- [ ] At 320, 375, 768, 1024, 1440 and 1920:
      `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [ ] At 375 the track's `getBoundingClientRect()` spans the full viewport width
      (`left === 0`, `right === innerWidth`); at 640 and above it does not, and its left
      edge matches the container's content box.
- [ ] Card width divided by track client width is within 2% of 1/1.15 at 375, 1/2.15 at
      768, and 1/3 at 1280.
- [ ] Scrolling the Professional track leaves the Personal track's `scrollLeft` at 0, and
      the reverse.
- [ ] Each track has `role="region"`, `tabindex="0"`, and a distinct `aria-label` whose
      count matches that category's project count.
- [ ] Focusing a track and pressing `ArrowRight` increases its `scrollLeft`.
- [ ] Tabbing from the last button of an on-screen card to a card scrolled out of view
      brings it into view with a non-zero gap between its left edge and the track's.
- [ ] No scrollbar is visible on the track in Chrome or Firefox, and the track still
      scrolls by wheel, trackpad and touch.

**Traceability:** `3-style-preference.md` §4.2, §6.4, §9 ·
`4-interaction-design.md` §2, §5.3, §6 · `2-architecture.md` §7

---

## E10-T07 — Build the `useCarousel` hook

**Depends on:** none
**Files:** created — `src/hooks/useCarousel.ts`
**Commit:** `feat(hooks): track carousel scroll position and arrow state`

**Scope**

- In: the ref, the measured state (`canScrollPrev`, `canScrollNext`, `hasOverflow`), the
  two scroll actions, rAF throttling, resize re-evaluation, and cleanup.
- Out: rendering anything. T08 builds the buttons that consume this.

**Implementation notes**

- One `evaluate()` reads `scrollLeft`, `scrollWidth` and `clientWidth` and derives all
  three booleans. Three call sites: mount (after layout), the scroll listener, and the
  resize observer. One reader means the three flags cannot disagree with each other.
- End detection: `scrollLeft <= 0` and
  `scrollLeft >= scrollWidth - clientWidth - 1`. The 1px absorbs sub-pixel rounding, which
  is what otherwise leaves the right arrow enabled at the true end
  (`4-interaction-design.md` §6). Overflow uses the same tolerance:
  `scrollWidth - clientWidth > 1`.
- The scroll listener is throttled through `requestAnimationFrame` — one measurement per
  frame, not one per scroll event, since scroll fires far faster than paint.
- Resize re-evaluation uses a **`ResizeObserver` on the track element**, not a
  `window.resize` listener. A window listener misses everything that changes the track's
  width without changing the viewport's: browser zoom, font-size changes, and the mobile
  sheet opening. Orientation change is covered by both; the observer is the one that also
  covers the rest.
- `useEffect` returns a cleanup that removes the listener, cancels any pending rAF, and
  disconnects the observer. `AGENTS.md` §5 makes this non-optional — three subscriptions,
  three teardowns.
- Scroll actions move by one card width plus one gap via
  `scrollBy({ behavior })`, where `behavior` is `'auto'` under reduced motion and
  `'smooth'` otherwise (animation 9, §8). The hook reads `reducedMotion` from
  `useMotionVariants` rather than calling `useReducedMotion` again — one check, defined
  once (E06).
- Card width is read from the first child element, not passed in as a magic number: the
  width is a computed `calc` that changes at two breakpoints, and duplicating it in JS is
  how the arrow step silently stops matching the layout.

**Acceptance**

- [ ] The hook's return type is explicit and exported; no `any`.
- [ ] `grep -n "window.addEventListener('resize'" src/hooks/useCarousel.ts` returns
      nothing; a `ResizeObserver` is constructed instead.
- [ ] The effect's cleanup removes the scroll listener, calls `cancelAnimationFrame`, and
      calls `observer.disconnect()`.
- [ ] `yarn lint` reports no `react-hooks/exhaustive-deps` warning, and no
      `eslint-disable` comment is added.
- [ ] Unmounting the home route (navigate to `/resume`) leaves no scroll listener
      attached — verified in DevTools' event listener panel.
- [ ] Behavioural state — the flags matching real scroll positions, and re-evaluation
      after a resize — is verified through the buttons in **T08**, which is the first
      point at which it is observable. This ticket ships with the structural checks above
      plus `yarn typecheck`; T08's acceptance is where the hook is proven correct.

**Traceability:** `2-architecture.md` §6 hooks · `4-interaction-design.md` §6, §8 ·
`AGENTS.md` §5

---

## E10-T08 — Add the carousel arrow controls

**Depends on:** T06, T07
**Files:** modified — `src/components/sections/ProjectCarousel.tsx`
**Commit:** `feat(projects): add carousel arrow controls`

**Scope**

- In: the two arrow buttons in the subsection header, their disabled and hidden states,
  their labels, and wiring them to `useCarousel`.
- Out: the hook's internals (T07) and the track itself (T06).

**Implementation notes**

- Positioned top-right of their **subsection**, on the `h3`'s baseline
  (`3-style-preference.md` §6.4). 36px `rounded-full` `ghost` buttons with a 16px chevron
  and `border border-border`; `ChevronLeftIcon` and `ChevronRightIcon` already exist from
  E05.
- **Hidden below `md`**, where swipe is the natural gesture and arrows only eat space.
  Keyboard access at those widths survives through the focusable track and the focusable
  cards (§6), so hiding them removes no capability.
- **Hidden entirely when nothing overflows** — a permanently disabled pair of arrows is
  a worse signal than no arrows.
- Disabled is `opacity-50` + `pointer-events-none` + `aria-disabled="true"`. Note that
  `pointer-events-none` does not block the keyboard: the click handler must also no-op
  when the direction is exhausted, or `Enter` on a focused "disabled" arrow still
  scrolls. Use `aria-disabled`, not the `disabled` attribute, so the control keeps its
  place in the tab order and screen readers announce the state rather than skipping it.
- Labels name the group: "Previous professional projects" / "Next personal projects". Two
  carousels on one page cannot share one label (§6). Built from the group name the
  component already receives — never hardcoded per instance.

**Acceptance**

- [ ] At 1280 with a track at `scrollLeft === 0`: the previous arrow has
      `aria-disabled="true"` and `opacity-50`; the next arrow does not.
- [ ] Scrolling that track to its end flips both, with the end test tolerant of a
      sub-pixel `scrollLeft` (e.g. 1247.5 against a 1248 maximum).
- [ ] Pressing `Enter` on a focused disabled arrow does not change `scrollLeft`.
- [ ] Clicking "next" advances `scrollLeft` by one card width plus 24px, ±2px.
- [ ] **Resize re-evaluation:** at 1440 scroll a track to its end (next arrow disabled),
      resize to 768, and the next arrow is enabled with `aria-disabled="false"` — matching
      the recomputed `scrollWidth - clientWidth`.
- [ ] A category with few enough projects to fit without overflow renders **no** arrow
      buttons at any width.
- [ ] Below `md` no arrow is visible, and the track still scrolls by touch and by
      `ArrowRight` when focused.
- [ ] The four arrow labels on the page are mutually distinct.
- [ ] Under `prefers-reduced-motion`, an arrow click jumps instantly — no smooth
      interpolation frame is observable.

**Traceability:** `3-style-preference.md` §6.4 · `4-interaction-design.md` §6, §8 row 9,
§9

---

## E10-T09 — Reveal the two subsections independently with staggered cards

**Depends on:** T06
**Files:** modified — `src/components/sections/ProjectCarousel.tsx`
**Commit:** `feat(projects): stagger card reveals per subsection`

**Scope**

- In: animation 3 — the parent-variant stagger, per subsection, on first scroll into
  view.
- Out: every other animation. The section heading reveals with animation 2, already
  owned by `Section`.

**Implementation notes**

- **Each subsection is its own motion parent**, revealing when _it_ enters view. One
  cascade across both groups would delay the second group's content behind the first
  group's animation (§8, closing rule) — this is why the stagger lives in
  `ProjectCarousel` and not in `ProjectsSection`.
- `whileInView` with `viewport={VIEWPORT_ONCE}` (`{ once: true, margin: '-80px' }`), from
  E06's constants. Re-animating on every scroll pass reads as unpolished.
- Stagger comes from `staggerContainer()` on the parent, never from hand-delayed children
  (`AGENTS.md` §7). Base is `STAGGER_CARDS` (60ms), capped so the group total stays
  within `STAGGER_MAX_TOTAL` (300ms): `Math.min(STAGGER_CARDS, STAGGER_MAX_TOTAL / count)`.
  Cap the stagger, not the card count.
- Children use the existing `fadeUp` — opacity 0→1, y 12→0, 400ms. Nothing new is added
  to `lib/motion.ts`; §8 is a closed list and animation 3 is already on it.
- Reduced motion is handled entirely by `useMotionVariants` returning final-state
  variants. No second `useReducedMotion` call.

**Acceptance**

- [ ] Loading the page at the top and scrolling only to the Professional subsection
      leaves the Personal cards un-animated (still at their `hidden` variant), which then
      run on their own when that subsection enters view.
- [ ] Card reveal offsets within one group differ by ~60ms, and the first-to-last delta
      is ≤ 300ms even with 8 cards in the group.
- [ ] Scrolling past a revealed subsection and back does not re-run the animation.
- [ ] With `prefers-reduced-motion: reduce` emulated, all cards are at opacity 1 and
      `transform: none` on first paint of the section — no transition frame.
- [ ] Only `opacity` and `transform` appear in the computed transition property list.
- [ ] `git diff src/lib/motion.ts src/constants/motion.ts` is empty.

**Traceability:** `3-style-preference.md` §8 · `4-interaction-design.md` §8 rows 2–3 and
closing rules · `AGENTS.md` §7

---

## E10-T10 — Build the `/projects/:slug` route: lookup, project hero, unknown-slug 404

**Depends on:** none
**Files:** modified — `src/pages/ProjectPage.tsx`; created —
`src/components/sections/ProjectHero.tsx`
**Commit:** `feat(projects): resolve project slugs and render the case study hero`

**Scope**

- In: the slug lookup, the unknown-slug path, and the page head — `h1`, summary, badge
  row, hero image.
- Out: the five `h2` body sections and the links row (T11). Out: route-level `<title>` and
  meta updates — `5-epic-list.md` E15 owns the metadata utility.

**High-risk ticket.** Getting the unknown-slug path wrong produces a crash or the wrong
error UI, which is the failure mode `5-epic-list.md` calls out for this epic.

**Implementation notes**

- **Never throw.** `PROJECTS.find(p => p.slug === slug)`; on a miss, render
  `<NotFoundPage />` directly. `throw new Response(null, { status: 404 })` would be caught
  by the route's existing `errorElement` (`RouteErrorBoundary`) and render "something went
  wrong" — the wrong answer for a URL that is simply not a project, and the reason this
  reads as a crash rather than a 404.
- **No redirect.** The URL stays `/projects/whatever` so it remains shareable and
  diagnosable; only the rendered content changes. `2-architecture.md` §11 requires the 404
  to preserve layout and theme, which rendering the page component in place does for free.
- The `h1` carries `tabIndex={-1}` — `useRouteFocus` moves focus to it on route change
  (E03/E07), and the existing stub already relies on this.
- Hero image, when present: explicit `width`/`height`, and **not** `loading="lazy"` — it
  is above the fold on this route, the same reasoning as the hero portrait in E09.
  Omitted entirely when absent, per §6.4's rule.
- Heading level is `h1` here, not `h4`: this is a page, not a card
  (`2-architecture.md` §8 project page plan).
- Slug validation against stable IDs is E15's deliverable; this ticket only needs the
  lookup to be total — every input produces a page.

**Acceptance**

- [ ] `/projects/deal-summary-comparison` renders `h1` with that project's `title`, its
      summary, and a badge per `stack` entry.
- [ ] `/projects/definitely-not-a-project` renders `h1` "Page Not Found", the URL is
      unchanged, `RouteErrorBoundary`'s message does not appear, and the console records
      no error.
- [ ] Every `slug` in `PROJECTS` resolves to a page whose `h1` matches that project's
      title — checked by iterating the array, not by spot-checking one.
- [ ] Navigating from a home-page "Case study" button moves keyboard focus to the new
      `h1` and resets scroll to the top.
- [ ] The header, footer, social rail and theme are intact on both the found and
      not-found renders.
- [ ] A project with an image renders it without `loading="lazy"` and with `width` and
      `height`; a project without one renders no `img`.

**Traceability:** `1-prd.md` §5 Reliability · `2-architecture.md` §3, §8, §11 ·
`3-style-preference.md` §6.10 · `4-interaction-design.md` §4

---

## E10-T11 — Build `ProjectCaseStudy` and `ProjectLinks`

**Depends on:** T10
**Files:** created — `src/components/sections/ProjectCaseStudy.tsx`,
`src/components/sections/ProjectLinks.tsx`; modified — `src/pages/ProjectPage.tsx`
**Commit:** `feat(projects): build the case study body and links section`

**Scope**

- In: the four content `h2` sections in fixed order, the conditional `Links` section, and
  the candidate's `role` line.
- Out: everything in T10. Out: prose styling beyond `max-w-content` — the tokens are
  E02's.

**Implementation notes**

- Fixed order, never reordered per project: **Problem → Approach → Stack → Outcome →
  Links** (`2-architecture.md` §8). Each block is `max-w-content`
  (`3-style-preference.md` §6.10).
- **`Links` is omitted entirely** when the project has neither `githubUrl` nor `liveUrl`
  (T01's amendment, `4-interaction-design.md` §10 row 11). Not a heading with an apology,
  not an empty list — absent. Most of this work is client software behind a login.
- `caseStudySlug` is _not_ a link on this page — it is how the visitor arrived. Only the
  two external URLs can appear here.
- `role` is rendered: `1-prd.md` §6 requires the candidate's own role on each project, and
  the card has no room for it. It belongs with Problem, not in a heading of its own — the
  five-heading plan is fixed and this ticket does not add a sixth.
- `Stack` renders the `stack` array as badges, not prose. The card's `tags` array is the
  scannable subset; `stack` is the full list and this is where it belongs.
- Links are `secondary` `Button`s with `external`, matching the card's treatment so the
  same action looks the same in both places.

**Acceptance**

- [ ] For a project with links, the page's `h2` list is exactly
      `["Problem", "Approach", "Stack", "Outcome", "Links"]` in that order.
- [ ] For a project with neither `githubUrl` nor `liveUrl`, the `h2` list is exactly
      `["Problem", "Approach", "Stack", "Outcome"]` — no `Links` element exists in the DOM.
- [ ] A project with only `liveUrl` renders the `Links` heading and exactly one button.
- [ ] Every rendered link button has `rel="noreferrer"`, `target="_blank"`, and an
      accessible name ending "(opens in a new tab)".
- [ ] The candidate's `role` text appears on the page and is not inside a heading.
- [ ] Each `stack` entry renders as a badge; the count matches the array length.
- [ ] Every prose block measures ≤ 768px wide at 1920.
- [ ] No heading level is skipped between `h1` and the `h2`s.

**Traceability:** `1-prd.md` §3 Projects, §6 Projects · `2-architecture.md` §8, §11 ·
`3-style-preference.md` §6.10 · `4-interaction-design.md` §10 row 11

---

## E10-T12 — Verification pass and `E10-status.md`

**Depends on:** T01–T11
**Files:** created — `docs/tickets/E10-status.md`; modified —
`docs/tickets/STATUS.md`, `docs/tickets/README.md`, `docs/tickets/E07-status.md`
**Commit:** `docs(tickets): record E10 status`

**Scope**

- In: the cross-cutting sweep that no single ticket owns, and the status record.
- Out: fixing what it finds. A defect found here becomes a fix commit against the ticket
  that owns the behaviour, recorded in the status file — not folded into this one.

**Implementation notes**

- Sweep the six widths (320, 375, 768, 1024, 1440, 1920) in **both themes**, plus reduced
  motion, plus a keyboard-only pass from the skip link through both carousels to the
  footer.
- Re-run the E08/E09 pairing checks that this epic could regress: the rail and the hero's
  `SocialLinks` are still never both visible, and the scroll spy still marks at most one
  nav item.
- Record the cross-epic edit from T05 in `E07-status.md` as well as `E10-status.md`.
- Follow `E09-status.md`'s shape: per-ticket evidence tables, a defect record, and an
  explicit record of anything that could not be verified and why.

**Acceptance**

- [ ] All four gates clean: `yarn typecheck`, `yarn lint`, `yarn format:check`,
      `yarn build`.
- [ ] No horizontal page scroll at any of the six widths, in both themes.
- [ ] Keyboard pass reaches every button in both carousels and both arrow pairs, with a
      visible focus ring at each stop and no keyboard trap.
- [ ] Both carousels verified independent after a resize from 1440 to 768 and back.
- [ ] `grep -rnE "INVENTED FIGURE|PLACEHOLDER PROJECT|PLACEHOLDER SCREENSHOT" src/`
      output is recorded in the status file as the outstanding content debt, with counts.
- [ ] `E10-status.md` records every acceptance criterion above with its evidence, and
      `STATUS.md` and `README.md` show E10 at 12 tickets.

**Traceability:** `AGENTS.md` §11, §14 · `3-style-preference.md` §12 ·
`4-interaction-design.md` §11

---

## Coverage

### Deliverables

| `5-epic-list.md` E10 deliverable                           | Tickets  |
| ---------------------------------------------------------- | -------- |
| `ProjectsSection` — one `h2`, two `h3`s, `category` filter | T03, T04 |
| `ProjectCarousel` — native overflow + snap, 1.15/2.15/3    | T06      |
| `useCarousel` — position, arrow state, rAF, resize         | T07      |
| Arrow buttons — header, hidden < `md`, disabled, labelled  | T08      |
| `ProjectCard` — image, title, summary, badges, buttons     | T02, T03 |
| `ProjectPage` + `ProjectCaseStudy` at `/projects/:slug`    | T10, T11 |

### Acceptance criteria

| `5-epic-list.md` E10 acceptance criterion                          | Tickets       |
| ------------------------------------------------------------------ | ------------- |
| The two carousels scroll independently                             | T06, T12      |
| Arrows disable at both ends and re-evaluate after resize           | T07, T08, T12 |
| Each scroller is a labelled `role="region"` with `tabindex="0"`    | T06           |
| Tabbing to an off-screen card scrolls it in, not flush to the edge | T06           |
| Only links present in the data render                              | T03, T11      |
| No nested interactive elements inside an anchor                    | T01, T03      |
| Empty category hides its subsection                                | T04           |
| Two empty categories hide the section **and its nav item**         | T04, T05      |
| Unknown `:slug` resolves to the 404, not a crash                   | T10           |

### Requirements reached beyond the epic list

| Source                                                        | Ticket |
| ------------------------------------------------------------- | ------ |
| Animation 3 — staggered cards, subsections reveal separately  | T09    |
| `1-prd.md` §6 — candidate's `role` on each project            | T11    |
| `4-interaction-design.md` §6 — mobile bleed, `scroll-padding` | T06    |
| `1-prd.md` §6 — three projects minimum, screenshots           | T02    |

---

## Open Questions

**None outstanding.** Three ambiguities were found during decomposition; all three were
decided and **fixed in the source documents** by T01 rather than left for the
implementer:

1. Card title link target, and what a project with no case study renders → three named
   conditional buttons, no title link.
2. The case study `Links` heading with no repository or live URL → omitted entirely.
3. Whether hiding the Projects nav item is E10's job, given it edits E07's data module →
   yes, and the cross-epic touch is recorded in both status files.

Two items are deliberately **out** of this epic and are not gaps: route-level `<title>`
and meta updates for `/projects/:slug` (E15's metadata utility) and slug validation
against stable project IDs (also E15).

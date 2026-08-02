# E07 — Header & Navigation

**Goal:** The hybrid navigation model works from every route, including the cross-route
anchor case that breaks most one-page sites.

**Highest-risk epic in the plan.** Scroll spy, smooth scroll, focus management, and the
mobile sheet interact in ways that are easy to get individually right and collectively
wrong. Each subscription behaviour is isolated into its own hook ticket, and the three
dangerous ones (T06 spy, T07 hash scroll, T12 sheet) are built and verified separately
before T14 combines them — following the epic's own mitigation note.

**Depends on:** E02 (tokens), E03 (router, RootLayout), E04 (navigation data),
E05 (Button, Container, icons, focus ring), E06 (motion tokens).

The Global Definition of Done in `README.md` applies to every ticket and is not
repeated.

---

## Decisions taken before writing (previously blocking)

| #   | Question                                                            | Decision                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Header blur: always on, or gained past `scrollY > 8`?               | **Blur always on; only the border fades in.** Matches `4-interaction-design.md` §3, `3-style-preference.md` §6.1, and the closed animation inventory §8 row 10, which lists only "Header border / opacity". §4's "and blur" wording is the outlier and is corrected by T02. |
| 2   | `SocialLinks` ownership — E07 needs it, epic list assigns it to E08 | **Built in E07** (T11), its first consumer. E08 keeps only `SocialRail`. `5-epic-list.md` amended by T11.                                                                                                                                                                   |
| 3   | `ThemeToggle` placement below `lg`                                  | **Stays in the header**, left of the hamburger. Theme is a persistent affordance, not a nav item, and it must work without opening the sheet.                                                                                                                               |
| 4   | Wordmark text — `profile.name` is the full legal name               | **New required `wordmark` field** in `profile.ts`. `name` stays the hero `h1`; `wordmark` is the header. No truncation logic, content stays in data.                                                                                                                        |

---

## E07-T01 — Add `useScrolledPast` hook

**Depends on:** none
**Files:** created — `src/hooks/useScrolledPast.ts`
**Commit:** `feat(nav): add useScrolledPast hook`

**Scope**

- In: a hook returning `true` once `window.scrollY` exceeds a threshold, with a
  `requestAnimationFrame`-throttled scroll listener and a cleanup function.
- Out: any header markup or styling — T02 owns that. The hook renders nothing and
  knows nothing about the header.

**Implementation notes**

- Threshold is passed by the caller. `HEADER_SCROLL_THRESHOLD = 8` already exists in
  `src/constants/site.ts` (§4 "Header gains its bottom border … once `scrollY > 8`").
- Throttle with `requestAnimationFrame` — §4 lists only two scroll-linked effects and
  calls them "both cheap"; an unthrottled listener on every scroll event is not.
- Read the initial value synchronously on mount, so a page loaded already-scrolled
  (browser scroll restoration, or a `/#contact` cold hit) does not render a border-less
  header for one frame.
- Must return a cleanup function removing the listener and cancelling any pending frame
  (`AGENTS.md` §5).

**Acceptance**

- [ ] `useScrolledPast(8)` returns `false` at `scrollY === 0` and `true` at
      `scrollY === 9`, observable in React DevTools.
- [ ] Scrolling fires at most one state update per animation frame — verified by a
      temporary counter logged in DevTools, then removed.
- [ ] Loading a page already scrolled past the threshold returns `true` on first render,
      with no false→true flip.
- [ ] Unmounting removes the `scroll` listener — verified in DevTools Event Listeners.

**Traceability:** `4-interaction-design.md` §4 · `AGENTS.md` §5

---

## E07-T02 — Build `Header` shell with wordmark and scrolled border

**Depends on:** E07-T01
**Files:** created — `src/components/layout/Header.tsx`; modified —
`src/components/layout/RootLayout.tsx`, `src/data/profile.ts`,
`src/types/profile.types.ts`, `docs/4-interaction-design.md`
**Commit:** `feat(nav): add Header with wordmark and scrolled border`

**Scope**

- In: the fixed header element, the wordmark and its navigation behaviour, the
  `ThemeToggle` slot, and the scroll-triggered border. Replaces the placeholder header
  in `RootLayout`. Adds the required `wordmark` field to `ProfileType` and `profile.ts`.
- In: correcting the `and blur` wording in `4-interaction-design.md` §4 per Decision 1.
- Out: the desktop nav items (T05), the hamburger and sheet (T12), the skip link
  (already owned by `RootLayout` from E03-T03 and left there).

**Implementation notes**

- Fixed, full width, `h-16`, `bg-bg/80 backdrop-blur-sm` (§3, `3-style` §6.1).
- **Blur is unconditional. Only the bottom `border-border` fades in** past the
  threshold, `opacity`, 150ms — animation 10 in the closed inventory (§8).
- The border must not shift layout when it appears (§4: "no element whose size changes
  with scroll position … that is what destroys CLS"). Render the border always and
  animate its opacity, or use a non-layout-affecting technique.
- Not auto-hiding on scroll-down (§3, explicit).
- Wordmark at left, `h3` scale, 600, `fg` (`3-style` §6.1). It "scrolls to `#home`, or
  navigates to `/` first if on another route" (§3).
- `ThemeToggle` last (§3), and it stays in the header at every width per Decision 3.
- `wordmark` is a **required** field on `ProfileType`, set to `'Shakhlyn'`. `name` keeps
  the full legal name for the hero `h1`.

**Acceptance**

- [ ] Header is fixed at the top and remains visible after scrolling to the page bottom.
- [ ] At `scrollY === 0` the header has `backdrop-filter` applied and no visible bottom
      border; both verified in DevTools computed styles.
- [ ] Scrolling past 8px makes the border appear; `backdrop-filter` is unchanged between
      the two states.
- [ ] Toggling the border produces no layout shift — Performance panel records no CLS
      entry attributed to the header.
- [ ] Clicking the wordmark from `/resume` navigates to `/`.
- [ ] `ThemeToggle` is present and operable at 320px and at 1440px.
- [ ] `4-interaction-design.md` §4 no longer says the header gains blur on scroll.

**Traceability:** `4-interaction-design.md` §3, §4, §8 row 10 · `3-style-preference.md` §6.1

---

## E07-T03 — Add home page section anchor scaffold

**Depends on:** E07-T02
**Files:** modified — `src/pages/HomePage.tsx`
**Commit:** `feat(nav): add home page section anchors`

**Scope**

- In: empty `Section` placeholders on the home page carrying the seven anchor ids and
  their `h2` headings, in the DOM order fixed by §1, so nav targets exist.
- Out: **all section content.** Hero is E09, Current Role E09, Projects E10, About and
  Skills E11, Resume E12, Contact E13. Each of those tickets replaces its placeholder.
  This ticket adds no copy, no cards, no forms.

**Implementation notes**

- Without anchor targets in the DOM, **no E07 acceptance criterion is verifiable** —
  scroll spy has nothing to observe, `focusSection` has nothing to focus, and every nav
  anchor is a dead link. This scaffold exists solely to make E07 testable and is
  explicitly temporary.
- Order and ids from §1 "Home page section order": `#home`, `#current-role`,
  `#projects`, `#about`, `#skills`, `#resume`, `#contact`.
- `#home` keeps the existing `h1`; the other six use the `Section` primitive from
  E05-T03, which already supplies `scroll-mt-20` and a `tabIndex={-1}` `h2`.
- Each placeholder needs enough height that sections are individually scrollable to,
  or scroll spy cannot distinguish them. Use spacing, not fake content.

**Acceptance**

- [ ] `document.getElementById(id)` resolves for all seven ids.
- [ ] DOM order matches §1 exactly, checked top to bottom in the elements panel.
- [ ] Every placeholder `h2` is reachable by `.focus()` and has `scroll-mt-20` applied.
- [ ] The page scrolls far enough that `#contact` can reach the top of the viewport.
- [ ] No placeholder contains invented copy — headings only.

**Traceability:** `4-interaction-design.md` §1 · `2-architecture.md` §8

---

## E07-T04 — Add `focusSection` scroll-and-focus helper

**Depends on:** E07-T03
**Files:** created — `src/lib/focusSection.ts`
**Commit:** `feat(nav): add focusSection scroll-and-focus helper`

**Scope**

- In: a pure DOM helper that scrolls a section into view and moves keyboard focus to its
  heading, returning whether the target was found.
- Out: deciding _when_ to call it. Nav clicks (T05) and hash resolution (T07) both call
  it; neither behaviour lives here.

**Implementation notes**

- "Scrolling moves the _eye_, not the _keyboard_" (§4). The target section's heading
  receives `tabIndex={-1}` + `.focus({ preventScroll: true })` — `preventScroll` matters
  because the scroll is already in flight and a second scroll would fight it.
- Lives in `src/lib/`, which is pure and imports no React (`AGENTS.md` §3).
- Returns `false` when the id does not resolve, so callers can decide what to do rather
  than failing silently.
- Scrolling honours the CSS `scroll-behavior: smooth` set in E06-T04, which is already
  disabled under `prefers-reduced-motion` — so this helper needs no motion branch.

**Acceptance**

- [ ] Calling `focusSection('about')` scrolls `#about` into view and leaves
      `document.activeElement` as the section's `h2`.
- [ ] The heading is not scrolled a second time after focus — no visible double-jump.
- [ ] `focusSection('nope')` returns `false` and throws nothing.
- [ ] With OS reduced-motion on, the scroll is instant (inherited from CSS, not branched
      here).
- [ ] The module imports nothing from `react`.

**Traceability:** `4-interaction-design.md` §4 · `AGENTS.md` §3, §5

---

## E07-T05 — Build desktop `Navigation` with anchor and route items

**Depends on:** E07-T04
**Files:** created — `src/components/layout/Navigation.tsx`; modified —
`src/components/layout/Header.tsx`
**Commit:** `feat(nav): add desktop navigation`

**Scope**

- In: the six nav items rendered from `NAV_ITEMS`, anchor items handling click →
  hash update → scroll → focus, route items as router links, Resume as a `secondary`
  Button. Visible at `lg` and up.
- Out: active/current styling (T06 owns scroll spy and `aria-current`), the mobile
  sheet (T12).

**Implementation notes**

- Six items in the §1 order: Home, Projects, About, Blog, Contact, Resume. Order mirrors
  DOM order deliberately — a nav that disagrees with page order makes the spy indicator
  appear to jump backwards (§1).
- Items come from `NAV_ITEMS` in `src/data/navigation.ts`, already a discriminated union
  on `kind: 'anchor' | 'route'` (E04-T01), so anchor-vs-route is a type-level
  distinction, not a runtime guess.
- **Resume renders as a `secondary` Button, not a text link** — it leaves the page, so it
  should look like a different kind of action (§3).
- Anchor clicks update the URL hash, "so positions are shareable and Back walks through
  visited sections" (§4), then call `focusSection`.
- Anchor items on a non-home route must navigate to `/#section` rather than scrolling —
  T07 resolves the scroll after the home route mounts.
- Rendered `lg:` and up; below that the hamburger replaces it (§2 breakpoint table).
- Styling: `body-sm`, `fg-muted` (`3-style` §6.1).

**Acceptance**

- [ ] Six items render in the order Home, Projects, About, Blog, Contact, Resume.
- [ ] Resume is a `<a>`/`<Link>` styled as a secondary Button, not a `<button>`.
- [ ] Clicking About on `/` sets `location.hash` to `#about`, scrolls there, and leaves
      focus on the About `h2`.
- [ ] Browser Back after two anchor clicks returns through the visited hashes.
- [ ] Blog navigates to `/writing`; Resume navigates to `/resume`.
- [ ] The nav is not rendered below 1024px.
- [ ] Every item shows the shared focus ring on keyboard focus.

**Traceability:** `4-interaction-design.md` §1, §3, §4 · `3-style-preference.md` §6.1

---

## E07-T06 — Add `useActiveSection` scroll spy and wire active state

**Depends on:** E07-T05
**Files:** created — `src/hooks/useActiveSection.ts`; modified —
`src/components/layout/Navigation.tsx`
**Commit:** `feat(nav): add scroll spy for active nav item`

**⚠️ High risk.** Three failure modes that only appear in combination: flicker while a
smooth scroll passes intermediate sections, the spy running on routes that have no
sections, and two items reading as active at once.

**Scope**

- In: the `IntersectionObserver` spy, its suppression window, and the active styling
  plus `aria-current` on anchor items.
- Out: route-active state for Blog and Resume — those "use React Router's route-active
  state, never section state" (§3) and are handled by the router's own link API in T05.

**Implementation notes**

- One `IntersectionObserver` watching all anchor targets (§3). Anchor targets means the
  four ids in `NAV_ITEMS`, not all seven sections — `#current-role`, `#skills`, and
  `#resume` have no nav entry (§1).
- `rootMargin: '-20% 0px -70% 0px'` — "a section activates once it crosses the upper
  third of the viewport, which is where people actually read" (§3). Already in
  `src/constants/site.ts` as `SCROLL_SPY_ROOT_MARGIN`.
- **When several sections intersect, the topmost wins** (§3).
- Runs **only on the home route**; disconnected on unmount (§3).
- Suppressed for ~700ms after a nav click (`NAV_CLICK_SUPPRESS_MS`, already in
  `constants/site.ts`). **Suppress by watching `location.hash`**, not by wiring a
  callback from the click handler: §4 states every nav click updates the hash, so the
  hash change _is_ the signal. This keeps the spy decoupled from `Navigation`.
- The Projects `h3` subsections do not drive the spy — only `#projects` does (§3).
- Active styling: `fg-muted` → `fg`, plus a 2px `accent` underline, plus
  `aria-current="true"` (§3). Colour is not the sole indicator (`3-style` §2.5).

**Acceptance**

- [ ] Scrolling the home page marks exactly one item active at any scroll position —
      checked by counting `[aria-current="true"]` in the console at five positions.
- [ ] Clicking Contact does not flash Projects or About active during the smooth scroll.
- [ ] On `/writing` and `/resume`, no `IntersectionObserver` is created — verified by a
      breakpoint on the constructor.
- [ ] Navigating away from `/` disconnects the observer.
- [ ] The active item is distinguishable with colour disabled (underline present).
- [ ] Scrolling to `#current-role` (no nav entry) leaves the previous item active rather
      than clearing all of them.

**Traceability:** `4-interaction-design.md` §1, §3 · `3-style-preference.md` §2.5, §6.1

---

## E07-T07 — Add `useHashScroll` for cross-route and cold-load anchors

**Depends on:** E07-T04
**Files:** created — `src/hooks/useHashScroll.ts`; modified —
`src/components/layout/RootLayout.tsx`
**Commit:** `feat(nav): resolve hash anchors after paint`

**⚠️ High risk.** "The case that breaks naively-built hybrid sites" (§3). It also races
`useRouteFocus` from E03-T06, which moves focus to the `h1` on every pathname change.

**Scope**

- In: resolving `/#section` on mount and on hash change, after paint.
- Out: the in-page click path — T05 already scrolls directly when the section is on the
  current page.

**Implementation notes**

- Sequence from §3: navigate to `/#about` → home route mounts → scroll to target.
  **The scroll must run _after_ paint — "never a bare `setTimeout` guess"** (§3).
- A direct external hit on `https://site/#contact` must behave identically (§3).
- **Known conflict with `useRouteFocus` (E03-T06):** that hook resets scroll to top and
  focuses the `h1` on pathname change. Arriving at `/#about` changes the pathname, so
  both run. The hash must win when one is present — otherwise a cross-route anchor lands
  at the top of the home page, which is exactly the bug this epic exists to prevent.
  Resolve explicitly; do not leave it to ordering luck.
- Reuses `focusSection` from T04, so scroll and focus stay consistent with in-page clicks.

**Acceptance**

- [ ] From `/writing`, clicking About lands on `/` scrolled to `#about`, not at the top.
- [ ] Same from `/resume`.
- [ ] Pasting `http://localhost:5173/#contact` into a fresh tab lands on Contact.
- [ ] After either, the next Tab press lands inside that section.
- [ ] Navigating to `/resume` with **no** hash still resets scroll to top and focuses the
      `h1` — E03-T06 is not regressed.
- [ ] Changing only the hash does not re-trigger the page transition.

**Traceability:** `4-interaction-design.md` §3, §4 · `2-architecture.md` §8

---

## E07-T08 — Add `useMediaQuery` hook

**Depends on:** none
**Files:** created — `src/hooks/useMediaQuery.ts`
**Commit:** `feat(nav): add useMediaQuery hook`

**Scope**

- In: a hook wrapping `window.matchMedia` with a change listener and cleanup.
- Out: the `lg`-crossing close behaviour itself — T12 consumes this.

**Implementation notes**

- Needed because the sheet "closes on … viewport crossing `lg`" (§3), which requires
  observing the breakpoint rather than a one-off read.
- `lg` is 1024px, a Tailwind default (§2 breakpoint table).
- Listener must be removed on unmount (`AGENTS.md` §5).
- Named in `AGENTS.md` §3's example hook list, so it is not a new invention.

**Acceptance**

- [ ] `useMediaQuery('(min-width: 1024px)')` returns `false` at 1023px and `true` at
      1024px when the window is resized live.
- [ ] The value is correct on first render, without a false initial value that corrects
      itself a frame later.
- [ ] Unmounting removes the `change` listener.

**Traceability:** `4-interaction-design.md` §2, §3 · `AGENTS.md` §3, §5

---

## E07-T09 — Add `useFocusTrap` hook

**Depends on:** none
**Files:** created — `src/hooks/useFocusTrap.ts`
**Commit:** `feat(nav): add useFocusTrap hook`

**Scope**

- In: trapping Tab and Shift+Tab within a container while active, moving focus in on
  activate, and restoring it to the previously focused element on deactivate.
- Out: `Escape` handling, outside-click, and every other close trigger — T12 owns those.
  This hook only governs where Tab can go.

**Implementation notes**

- "**Focus is trapped** while open" and "On close, focus returns to the hamburger" (§3).
- Restoring focus is part of the trap because the trap is what captured it; splitting
  restore into T12 would mean two places reasoning about the same focus stack.
- "No keyboard traps" in `1-prd.md` §5 refers to traps with no escape — a modal trap that
  releases on close is the required pattern, not a violation.
- Listener removed and focus restored on deactivate and on unmount (`AGENTS.md` §5).

**Acceptance**

- [ ] With the trap active, Tab from the last focusable element moves to the first.
- [ ] Shift+Tab from the first moves to the last.
- [ ] Activating moves focus into the container.
- [ ] Deactivating returns focus to the element focused before activation.
- [ ] Unmounting while active restores focus rather than leaving it on a removed node.

**Traceability:** `4-interaction-design.md` §3 · `2-architecture.md` §8 Focus Management

---

## E07-T10 — Add `useScrollLock` hook

**Depends on:** none
**Files:** created — `src/hooks/useScrollLock.ts`
**Commit:** `feat(nav): add useScrollLock hook`

**Scope**

- In: locking page scroll while active and restoring the **exact** prior scroll position
  on release.
- Out: when to lock — T12 decides.

**Implementation notes**

- "Page scroll is locked while open, restoring the exact prior position on close" (§3).
  "Exact" is the requirement that rules out simply toggling `overflow: hidden`, which
  drops the position on some mobile browsers.
- Must not cause a layout shift when the scrollbar disappears — §4 forbids content
  reflowing as a scroll-linked effect, and a jump on menu-open is the same defect.
- Restores on unmount as well as on release, so a route change while open cannot leave
  the page permanently unscrollable.

**Acceptance**

- [ ] Scrolled to y=800, locking then unlocking returns to exactly y=800.
- [ ] While locked, mouse wheel and touch drag do not move the page.
- [ ] Locking causes no horizontal shift of page content.
- [ ] Unmounting while locked restores scrolling.

**Traceability:** `4-interaction-design.md` §3, §4

---

## E07-T11 — Add `SocialLinks` component

**Depends on:** none
**Files:** created — `src/components/layout/SocialLinks.tsx`; modified —
`docs/5-epic-list.md`
**Commit:** `feat(nav): add SocialLinks component`

**Scope**

- In: the inline list form of the social links, rendering only links present in
  `profile.ts`. Amends `5-epic-list.md` to move `SocialLinks` from E08 to E07 per
  Decision 2.
- Out: `SocialRail` — the fixed left-edge expanding rail stays in E08. This ticket does
  not touch it.

**Implementation notes**

- Moved into E07 because `MobileNavigation` (T12) and `Footer` (T13) both need it and
  E07 cannot be built without it. E08 retains `SocialRail` only.
- Composes the `IconLink` primitive from E05-T07, which already handles `aria-label`,
  `rel="noreferrer"`, the new-tab announcement, and the `mailto:` same-tab case.
- **Tiles render only for links present in `src/data/profile.ts`. No placeholder tiles**
  (§7). `profile.ts` currently has email, LinkedIn, and GitHub but no X, so three render.
- Icons already exist from E05-T01: `GitHubIcon`, `LinkedInIcon`, `EmailIcon`, `XIcon`.

**Acceptance**

- [ ] Renders exactly three links today (GitHub, LinkedIn, Email) and no X placeholder.
- [ ] Adding an `x` URL to `profile.ts` makes a fourth render with no component change.
- [ ] Each link has an `aria-label`; the icons are `aria-hidden`.
- [ ] External links carry `target="_blank"` and `rel="noreferrer"`; the mailto link does
      not.
- [ ] Every link is keyboard reachable with a visible focus ring.

**Traceability:** `4-interaction-design.md` §7 · `2-architecture.md` §6 ·
`3-style-preference.md` §5.5

---

## E07-T12 — Build `MobileNavigation` sheet

**Depends on:** E07-T05, E07-T08, E07-T09, E07-T10, E07-T11
**Files:** created — `src/components/layout/MobileNavigation.tsx`; modified —
`src/components/layout/Header.tsx`
**Commit:** `feat(nav): add mobile navigation sheet`

**⚠️ High risk.** Five close paths, a focus trap, a scroll lock, and an animation all
in one component. The failure mode is a path that closes the sheet without releasing the
trap or restoring scroll, leaving the page unusable.

**Scope**

- In: the hamburger trigger, the sheet, its five close triggers, focus trap, scroll lock,
  and the animation.
- Out: `ThemeToggle` — per Decision 3 it stays in the header at all widths and is not a
  sheet row. Out: the desktop nav (T05).

**Implementation notes**

- Hamburger at right, 44×44px, below `lg` (§3). Per Decision 3 the ThemeToggle sits to
  its left, in the header.
- Sheet is a **full-width sheet directly beneath the header — not a full-screen overlay,
  not a side drawer** (§3).
- Animation 6: `opacity 0→1`, `y −8→0`, 200ms `ease-out`. **Height is not animated**
  (§3, §8). Use the reduced-motion wrapper from E06-T02.
- Rows are 48px; Resume last, behind a divider; `SocialLinks` row at the bottom
  (§3, `3-style` §6.1).
- Surface: `bg-surface`, `border-b`, `shadow-lg` (`3-style` §6.1) — the one place
  `shadow-lg` is permitted (§4.4 elevation level 2).
- **Closes on all five: item click, `Escape`, outside click, route change, and crossing
  `lg`** (§3).
- Trigger carries `aria-expanded` and `aria-controls` (§3).
- On close, focus returns to the hamburger — supplied by `useFocusTrap` (T09).

**Acceptance**

- [ ] Hamburger renders below 1024px only; the desktop nav renders at 1024px and above.
- [ ] The sheet closes on each of the five triggers, tested individually: item click,
      `Escape`, click outside, navigating to `/writing`, resizing 1023px → 1024px.
- [ ] After each of those five, focus is on the hamburger and the page scrolls normally.
- [ ] While open, Tab cycles within the sheet and never reaches page content behind it.
- [ ] While open at scroll position y=500, the page does not scroll; on close it is still
      at y=500.
- [ ] `aria-expanded` reads `false` closed and `true` open; `aria-controls` matches the
      sheet's `id`.
- [ ] With OS reduced-motion on, the sheet appears with no transform and no delay.
- [ ] Hamburger hit area is at least 44×44px at 320px.

**Traceability:** `4-interaction-design.md` §2, §3, §8 row 6 · `3-style-preference.md`
§4.4, §6.1 · `2-architecture.md` §8 Focus Management

---

## E07-T13 — Build `Footer`

**Depends on:** E07-T11
**Files:** created — `src/components/layout/Footer.tsx`; modified —
`src/components/layout/RootLayout.tsx`
**Commit:** `feat(nav): add Footer`

**Scope**

- In: the footer, replacing the `RootLayout` placeholder from E03-T03.
- Out: the social rail (E08).

**Implementation notes**

- `border-t border-border`, `py-12`. Name and current year at left in `fg-subtle`,
  social icons at right (`3-style` §6.12).
- **"No sitemap sprawl, no newsletter, no 'built with ❤️'"** (`3-style` §6.12) — the
  footer is deliberately minimal and gains no nav duplication.
- Goes horizontal at `md` (§2 breakpoint table).
- Reuses `SocialLinks` from T11.

**Acceptance**

- [ ] Renders name + current year at left and social icons at right at `md` and above.
- [ ] Stacks without horizontal overflow at 320px.
- [ ] Contains no nav list, newsletter field, or attribution line.
- [ ] The year is computed, not hardcoded.
- [ ] Correct in both themes.

**Traceability:** `3-style-preference.md` §6.12 · `4-interaction-design.md` §2

---

## E07-T14 — Integration verification pass

**Depends on:** E07-T01 … E07-T13
**Files:** none expected; fixes only
**Commit:** none unless a fix is needed → `fix(nav): <specific defect>`

**⚠️ High risk by definition.** This ticket exists because several E07 acceptance
criteria are cross-cutting and belong to no single component. The epic's own mitigation
note says to build and verify the three behaviours separately before combining them —
this is the combining step.

**Scope**

- In: verifying the criteria that span components, and fixing what fails.
- Out: new features. If verification reveals missing scope, it becomes a new ticket
  rather than growing this one.

**Implementation notes**

- Re-check the `PageTransition` / `useRouteFocus` / `useHashScroll` three-way ordering
  flagged in `E06-status.md` and T07 — this is the first point at which all three run
  together.
- Walk the keyboard map in §9 end to end: skip link → header → nav → main → footer.
  (Social rail is E08 and is absent from the tab order for now.)

**Acceptance**

- [ ] All four anchor items reach their target from `/`, from `/writing`, and from
      `/resume` — 12 checks.
- [ ] `https://<host>/#contact` in a fresh tab lands on Contact.
- [ ] Exactly one nav item is active at a time, with no flicker during a nav-click scroll.
- [ ] No `IntersectionObserver` is constructed on `/writing` or `/resume`.
- [ ] After every anchor click, the next Tab lands inside that section.
- [ ] The sheet closes on all five triggers and restores focus and scroll each time.
- [ ] Every observer, listener, and timer added in E07 is released on unmount — checked
      in DevTools after navigating away.
- [ ] No horizontal scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] Tab order matches §9.

**Traceability:** `4-interaction-design.md` §3, §4, §9, §11 · `5-epic-list.md` E07

---

## Coverage table

Every E07 deliverable and acceptance criterion from `5-epic-list.md`, mapped to the
tickets that satisfy it.

### Deliverables

| E07 deliverable                                                                                                               | Tickets                 |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `Header` — fixed, `h-16`, blur, border fading past `scrollY > 8`                                                              | T01, T02                |
| `Navigation` — six items, Resume as `secondary` Button, `ThemeToggle` last                                                    | T02 (toggle), T05       |
| `MobileNavigation` — hamburger, sheet, focus trap, scroll lock, `SocialLinks`, five close triggers, restores focus and scroll | T08, T09, T10, T11, T12 |
| `useActiveSection` — spy, rootMargin, topmost-wins, home only, 700ms suppression                                              | T06                     |
| `useHashScroll` — resolves `/#section` after paint, on mount and hash change                                                  | T07                     |
| Anchor navigation moves focus to target heading                                                                               | T04, T05, T07           |
| `Footer`                                                                                                                      | T11, T13                |

### Acceptance criteria

| E07 acceptance criterion                                                         | Tickets                      |
| -------------------------------------------------------------------------------- | ---------------------------- |
| Every anchor item works from `/`, from `/writing`, and from `/resume`            | T05, T07, T14                |
| External link to `https://site/#contact` lands on Contact                        | T07, T14                     |
| Exactly one nav item active at a time; no flicker during smooth scroll           | T06, T14                     |
| Scroll spy does not run on `/writing` or `/resume`                               | T06, T14                     |
| After clicking a nav anchor, the next Tab lands inside that section              | T04, T05, T07, T14           |
| Sheet closes on item click, `Escape`, outside click, route change, crossing `lg` | T08, T12, T14                |
| Observer and scroll listeners disconnected on unmount                            | T01, T06, T08, T09, T10, T14 |

Supporting tickets not tied to a stated E07 criterion but required to build it: **T03**
(anchor targets — without them nothing in E07 is verifiable) and **T11** (`SocialLinks`,
moved from E08 per Decision 2).

---

## Open Questions

Non-blocking. Each has a defensible default recorded below and implemented as such; say
the word and I will change any of them.

1. **`aria-current` value on route links.** §3 specifies `aria-current="true"` for the
   section-based active state. It does not say what Blog and Resume use when their route
   is active. **Default taken:** `aria-current="page"`, the standard value for a link to
   the current page, and what React Router's `NavLink` emits by default.

2. **Focus-trap technique — background inertness.** §3 requires the trap but does not say
   whether background content should also be `inert` / `aria-hidden` for screen readers.
   **Default taken:** trap Tab only; no `inert`. Adding `aria-hidden` to `<main>` risks
   hiding the page from assistive tech if a close path ever fails to clean it up.

3. **Scroll-lock technique.** §3 requires "the exact prior position" but not the method.
   **Default taken:** save `scrollY`, apply `position: fixed` with a negative `top` to
   `<body>`, restore on release. This is the only approach that holds on iOS Safari;
   `overflow: hidden` alone drops the position there.

4. **Who hides the Projects nav item when both categories are empty?** §5.3 says an empty
   Projects section "does not render and the nav item is omitted", but that is stated
   under Projects, and `5-epic-list.md` lists it under E10's acceptance, not E07's.
   **Default taken:** E07 renders `NAV_ITEMS` as given; **E10** owns filtering the item
   out. Flagging because it means E10 must modify `Navigation`.

5. **When does the Blog nav item appear?** `5-epic-list.md` E14 notes it "should be
   hidden until at least one real post exists, or a recruiter clicks through to an empty
   page". `writing.ts` is currently an empty array. **Default taken:** E07 renders Blog
   unconditionally per §1's six-item nav; **E14** owns hiding it. Same shape as (4).

6. **Header wordmark heading level.** `3-style` §6.1 says the wordmark is at "`h3` scale".
   **Default taken:** styled at `h3` scale but rendered as a non-heading element, since a
   real `<h3>` in the header would sit above the page `h1` and break the outline that
   `2-architecture.md` §8 fixes.

7. **Does the mobile sheet's `SocialLinks` row duplicate the footer's?** Both render the
   same three links, and §7 forbids the rail and the hero row being visible together for
   exactly this reason. The sheet and footer are never visible simultaneously, so this
   appears intentional. **Default taken:** render both, as §3 and `3-style` §6.12 each
   specify one.

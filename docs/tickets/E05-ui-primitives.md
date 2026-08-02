# E05 — UI Primitives

**Goal:** The nine reusable, content-agnostic components everything else composes from.

**Depends on:** E02. Independent of E03, E04, E06.

**The bar for every component in this epic:** prop-driven, zero hardcoded copy, zero
route knowledge, under ~200 lines, correct in both themes, and composition preferred
over configuration once it passes 4–5 optional props (`AGENTS.md` §3, §5).

**Traceability:** `3-style-preference.md` §5 · `2-architecture.md` §6 · `AGENTS.md` §5 ·
`5-epic-list.md` E05

---

## [ ] E05-T01 — Shared focus ring and inline icon set

**Files:** `src/constants/styles.ts` (new), `src/components/ui/icons/` (new)

**The focus ring is defined once and imported everywhere** (`3-style-preference.md`
§4.5, `5-epic-list.md` E05 deliverables). Nine components each spelling out five
utility classes is nine chances to drop the `-offset` and produce a ring invisible
against a dark card.

**Scope**

- `FOCUS_RING` constant:
  ```
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
  focus-visible:ring-offset-2 focus-visible:ring-offset-bg
  ```
  **`focus-visible:` only, never `focus:`** (`AGENTS.md` §10). `focus:` fires on mouse
  click and makes every button look permanently selected.
- Icon set as inline SVG components: chevron-left, chevron-right, sun, moon, menu,
  close, external-link, check, alert, spinner, plus GitHub, LinkedIn, Email, X.
- Icons use `currentColor`, 20px default (16px in `body-sm` contexts),
  `stroke-width 1.5` (`3-style-preference.md` §10).
- Every icon accepts `className` and spreads `aria-hidden="true"` by default —
  decorative unless the caller says otherwise.
- **No icon package, no icon font.** A runtime icon library is only acceptable if it
  tree-shakes to just the icons used, and fourteen inline SVGs are smaller than proving
  that.

**Acceptance**

- [ ] `FOCUS_RING` used by every interactive primitive in this epic; grep finds no
      second definition of the ring classes.
- [ ] No `focus:` variant anywhere in `src/`.
- [ ] Icons inherit colour from their parent in both themes.
- [ ] No icon dependency in `package.json`.

**Commit:** `feat: add shared focus ring constant and inline icon set`

---

## [ ] E05-T02 — `Container`

**Files:** `src/components/ui/Container.tsx` (new)

**Scope**

- Owns exactly: `mx-auto w-full max-w-container 2xl:max-w-container-wide px-5 sm:px-6
  lg:px-8` (`3-style-preference.md` §4.2).
- **No section reimplements this.** A second copy is how one section ends up 4px off at
  `lg` and nobody can find why.
- Accepts `children`, `className` (merged via `cn`), and an `as` prop for the rendered
  element, defaulting to `div`.

**Acceptance**

- [ ] Caps at 1120px, widens to 1280px at `2xl`, and stops growing.
- [ ] Gutters correct at 320, 640, and 1024.
- [ ] A `className` override merges rather than duplicating (proves `cn` is used).
- [ ] No horizontal scroll at 320px.

**Commit:** `feat: add Container primitive`

---

## [ ] E05-T03 — `Section`

**Files:** `src/components/ui/Section.tsx` (new)

**Scope**

- Renders `<section>` with the `id` used as the in-page anchor target.
- Owns the vertical rhythm: `py-16 md:py-20 lg:py-24` (`3-style-preference.md` §4.2).
- **`scroll-mt-20`** (80px) so an anchored jump is not hidden under the fixed `h-16`
  header (`4-interaction-design.md` §4). Getting this wrong means every nav click lands
  on a heading obscured by the header.
- Optional mono `eyebrow` label in `accent`, the `h2` title, and an optional `fg-muted`
  description.
- The `h2` carries `tabIndex={-1}` so E07's anchor navigation can move focus to it.
- Hero is the documented exception to the rhythm (`pt-24 pb-16` / `pt-32 pb-24`) and
  overrides via `className` rather than a `variant` prop.
- Wraps its children in `Container` — or accepts the caller doing so, but pick one and
  document it in a comment so sections do not double-wrap.

**Acceptance**

- [ ] Anchored navigation to a section leaves its heading fully visible below the
      header.
- [ ] Eyebrow and description are genuinely optional and render nothing when absent.
- [ ] The `h2` is focusable programmatically but not in the Tab order.
- [ ] Heading level is fixed at `h2` — sections do not choose their own level for visual
      reasons (`3-style-preference.md` §11).

**Commit:** `feat: add Section primitive`

---

## [ ] E05-T04 — `Button`

**Files:** `src/components/ui/Button.tsx` (new)

**Scope**

- Three variants × three sizes exactly per `3-style-preference.md` §5.1. No fourth
  variant without updating that document.
- **A button that navigates renders `<a>` or `<Link>`, never `<button>` with an
  `onClick`.** A `<button>` that navigates cannot be middle-clicked, opened in a new
  tab, or copied as a link, and screen readers announce the wrong role. Model this as a
  **discriminated union** on the props type (`AGENTS.md` §4) so a `href` + `onClick`
  combination is unrepresentable, rather than an optional-prop soup resolved at runtime.
- `Container`-style base: `rounded-md inline-flex items-center gap-2`, `FOCUS_RING`,
  `transition-colors duration-150`, `disabled:opacity-50 disabled:pointer-events-none`.
- **`sm` is desktop-only** — 32px fails the 44×44px touch minimum
  (`3-style-preference.md` §5.1, `1-prd.md` §5).
- Route knowledge stays out: the component takes an `href`, it never imports from
  `navigation.ts`.
- External links: `target="_blank" rel="noreferrer"` plus a visually hidden "(opens in a
  new tab)".

**Acceptance**

- [ ] All nine variant × size combinations render correctly in both themes.
- [ ] A link-button renders an anchor element in the DOM — verified in devtools, not
      assumed.
- [ ] Passing both `href` and `onClick` is a **type error**.
- [ ] Focus ring visible on all three variants, including `ghost` on `surface`.
- [ ] Disabled buttons are not focusable and not clickable.
- [ ] `md` and `lg` meet 44px touch targets at mobile widths.

**Commit:** `feat: add Button primitive`

---

## [ ] E05-T05 — `Card`

**Files:** `src/components/ui/Card.tsx` (new)

**Scope**

- Base: `bg-surface border border-border rounded-lg p-5 md:p-6`
  (`3-style-preference.md` §5.2).
- **Hover styles apply only when the whole card is interactive**, and only on pointer
  devices via `@media (hover: hover)` (`4-interaction-design.md` §6). On touch, hover
  fires on tap and sticks until the next tap elsewhere.
- Hover: `bg-surface-hover`, `border-accent/30`, `-translate-y-0.5`. **No scale
  transforms, no shadow bloom.**
- **Nested interactive elements inside a linked card are not allowed** — invalid HTML,
  and it breaks the GitHub/Live buttons in `ProjectCard`. Prefer composition
  (`Card` + `CardHeader` + `CardBody`) over an `interactive` mega-prop once this passes
  4–5 optional props (`AGENTS.md` §5).

**Acceptance**

- [ ] Static and interactive forms both render correctly in both themes.
- [ ] Hover transform does not fire on a touch device.
- [ ] The interactive form is one tab stop with the title as its accessible name.
- [ ] No nested-anchor structure is constructible from the exported API.

**Commit:** `feat: add Card primitive`

---

## [ ] E05-T06 — `Badge`

**Files:** `src/components/ui/Badge.tsx` (new)

**Scope**

- `inline-flex items-center rounded-sm px-2 py-0.5`, `body-sm` at 500 weight.
- Accent variant: `bg-accent-soft text-accent-strong`. Neutral variant:
  `bg-surface text-fg-muted border border-border` (`3-style-preference.md` §5.3).
- **Badges are never interactive in v1.** No filtering exists (`2-architecture.md` §12),
  so no `onClick`, no `href`, no hover state. A badge that looks clickable and is not is
  a small credibility leak on a site whose whole argument is attention to detail.

**Acceptance**

- [ ] Both variants meet AA contrast in both themes (§2.4 pairs
      `accent-strong`/`accent-soft` at 6.48 / 9.30).
- [ ] No interactive props on the type.
- [ ] Long labels wrap or truncate without breaking the row at 320px.

**Commit:** `feat: add Badge primitive`

---

## [ ] E05-T07 — `IconLink`

**Files:** `src/components/ui/IconLink.tsx` (new)

**Scope**

- 40×40px `rounded-full` hit area, 20px icon, `text-fg-muted` → `text-fg` and
  `bg-surface-hover` on hover (`3-style-preference.md` §5.5).
- **Every icon link carries an `aria-label`.** An icon-only control with no label is
  announced as "link" and nothing else.
- The icon itself is `aria-hidden="true"` — otherwise the accessible name is announced
  twice.
- External: `target="_blank" rel="noreferrer"` plus a visually hidden "(opens in a new
  tab)". `mailto:` opens in the same tab.
- `FOCUS_RING`.
- Content-agnostic: it takes an icon, a label, and an href. It knows nothing about
  GitHub or `profile.ts`; `SocialLinks` (E08) composes it.

**Acceptance**

- [ ] Accessible name is the label, announced once, not twice.
- [ ] 44×44px effective touch target at mobile widths.
- [ ] External links carry `rel="noreferrer"` and the new-tab announcement.
- [ ] Focus ring visible against both `bg` and `surface`.

**Commit:** `feat: add IconLink primitive`

---

## [ ] E05-T08 — `TextInput` and `TextArea`

**Files:** `src/components/ui/TextInput.tsx`, `src/components/ui/TextArea.tsx` (new)

**Scope**

- **Visible `<label>` above the field, always. Placeholders are never a label
  substitute** (`3-style-preference.md` §5.6, §11) — placeholder text disappears the
  moment someone types, taking the field's meaning with it.
- Field: `h-11` (textarea `min-h-32`), `rounded-md`, `bg-bg`,
  `border border-border-strong`, `px-3`, `body` in `fg`, placeholder in `fg-subtle`.
- `border-border-strong`, **not `border`** — decorative `border` is 1.27:1 and fails the
  3:1 non-text contrast requirement for an interactive control boundary
  (`3-style-preference.md` §2.4).
- Focus: `border-accent` plus `FOCUS_RING`.
- Error state: `border-danger`, `aria-invalid="true"`, `aria-describedby` pointing at
  the message id, and the message rendered beneath in `danger` **with a 16px alert
  icon** — colour never carries meaning alone (§2.5).
- **Required fields marked in the label text (`Email *`), not by colour.**
- `id` generated with `useId` and wired to the label's `htmlFor` — no manual id props to
  forget.
- Presentational only. Validation logic and state live in `ContactForm` (E13); this
  component receives `error` as a prop.

**Acceptance**

- [ ] Clicking the label focuses the field.
- [ ] Error state sets `aria-invalid` and `aria-describedby`, and a screen reader reads
      the message on focus.
- [ ] Required marking survives with colour disabled.
- [ ] Two instances on one page have unique ids.
- [ ] Focus ring and error border are distinguishable in both themes.

**Commit:** `feat: add TextInput and TextArea primitives`

---

## [ ] E05-T09 — `FormStatus`

**Files:** `src/components/ui/FormStatus.tsx` (new)

**Scope**

- `role="status" aria-live="polite"` region, placed above the submit button
  (`3-style-preference.md` §5.7).
- Four states as a **discriminated union**, not four optional booleans
  (`AGENTS.md` §4):

  | State | Renders |
  |---|---|
  | `idle` | nothing |
  | `submitting` | spinner + "Sending…" in `fg-muted` |
  | `success` | check icon + message, `success` on `surface`, `rounded-md p-3` |
  | `error` | alert icon + message **plus the direct email address as a fallback** |

- **The error state must always expose the mailto fallback.** `2-architecture.md` §9
  requires no silent failure path — if the form breaks, the recruiter still has a way to
  reach you, which is the only thing that actually matters here.
- The email address is passed in as a prop. This component holds no content.
- Under `prefers-reduced-motion` the spinner becomes a static "Sending…" label
  (`4-interaction-design.md` §8, animation 11).
- The live region must be **present in the DOM while idle** and merely empty. Mounting
  it at the same moment its message appears means assistive tech never announces the
  change.

**Acceptance**

- [ ] Idle renders nothing visible but the live region exists in the DOM.
- [ ] A screen reader announces success and error text without moving focus.
- [ ] Error always shows the email fallback.
- [ ] Reduced motion replaces the spinner with static text.
- [ ] Success and error colours meet AA in both themes (§2.4).

**Commit:** `feat: add FormStatus primitive`

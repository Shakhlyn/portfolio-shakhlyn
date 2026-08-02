# E02 — Design Tokens & Theming

**Goal:** Every colour, size, and radius in the app resolves to a named token, and dark
mode works before a single component exists.

**Why here:** Components built against raw Tailwind palette classes (`bg-zinc-50`) have
to be rewritten when tokens arrive. Building tokens first makes that mistake impossible
to make.

**Depends on:** E01. **Blocks:** E03, E04, E05, E06 — i.e. everything else.

**Traceability:** `1-prd.md` §3 Theme Support, §5 Accessibility · `2-architecture.md` §4
· `3-style-preference.md` §2, §7, §9 · `5-epic-list.md` E02

---

## [ ] E02-T01 — Semantic colour tokens in `index.css`

**Files:** `src/styles/index.css`

Every value comes from `3-style-preference.md` §2.2 (light) and §2.3 (dark). Copy them
exactly — these ratios were computed, not eyeballed, and §2.4 is the proof.

**Scope**

- `@custom-variant dark (&:where(.dark, .dark *));` directly after the Tailwind import.
  This is v4's replacement for `darkMode: 'class'`.
- All 13 tokens on `:root`, all 13 overridden under `.dark`: `bg`, `surface`,
  `surface-hover`, `border`, `border-strong`, `fg`, `fg-muted`, `fg-subtle`, `accent`,
  `accent-strong`, `accent-soft`, `on-accent`, `danger`, `success`.
- **Stored as space-separated RGB channels** (`--bg: 255 255 255;`), wrapped in `rgb()`
  only inside `@theme`. This is what makes `bg-accent/30` resolve against a
  runtime-swapped variable. Storing hex breaks every opacity modifier in the codebase.
- Keep the scaffold's `font-synthesis: none`, `text-rendering: optimizeLegibility`,
  `-webkit-font-smoothing: antialiased`, and `color-scheme: light dark` on `:root`
  (`3-style-preference.md` §3.1, §7).
- Base layer: `body` gets `bg-bg text-fg font-sans`.

**Acceptance**

- [ ] All 13 tokens defined in both themes; none missing from either.
- [ ] Manually adding `class="dark"` to `<html>` in devtools swaps every token.
- [ ] Spot-check three pairs against the §2.4 table with a contrast checker — use
      `fg-subtle` on `bg` (4.83 / 5.79), `accent` on `bg` (5.70 / 7.19), and
      `border-strong` on `bg` (3.38 / 3.10). These are the three tightest.
- [ ] No hex literal survives outside the `:root` / `.dark` blocks.

**Commit:** `feat: add semantic colour tokens for light and dark themes`

---

## [ ] E02-T02 — `@theme` mapping: colours, type scale, layout, shadows

**Files:** `src/styles/index.css`

Turns the raw variables from T01 into Tailwind utilities. Without this block,
`bg-surface` and `max-w-container` do not exist as classes.

**Scope**

- `@theme inline { … }` — **the `inline` keyword is load-bearing.** Plain `@theme`
  captures values at build time and dark mode stops swapping. This is the single most
  likely way to get this ticket subtly wrong.
- Colours: one `--color-<token>: rgb(var(--<token>));` per token from T01.
- `--font-sans` and `--font-mono` — the exact stacks in `3-style-preference.md` §3.1.
- The full type scale from §3.2 as `--text-*` with their line-height, weight, and
  tracking pairs: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `body-sm`, `eyebrow`,
  `code`. Each has a mobile and a `md:` value — encode the mobile value as the token
  and apply the desktop step with a `md:` utility at the call site.
- `--container-container: 1120px`, `--container-container-wide: 1280px`,
  `--container-content: 768px`. The doubled word is namespace + token name, not a typo;
  it is what produces `max-w-container`.
- `--shadow-sm` and `--shadow-lg` from §4.4, with the doubled dark-mode alphas applied
  under `.dark`.
- Do **not** redefine the spacing scale or breakpoints. Tailwind's 4px default scale and
  default breakpoints are exactly what §4.1 and §2 specify; restating them adds a second
  source of truth for no gain. The subset in §4.1 is a usage rule, not a config change.

**Acceptance**

- [ ] `bg-surface`, `text-fg-muted`, `border-border-strong`, `max-w-container`,
      `max-w-content`, `text-display`, `font-mono`, `shadow-lg` all resolve.
- [ ] `bg-accent/30` renders at 30% opacity — the check that proves the RGB-channel
      storage and `inline` keyword are both right.
- [ ] Radii come from Tailwind defaults and match §4.3 (`rounded-sm` 4px, `rounded-md`
      6px, `rounded-lg` 10px); if a default disagrees, override only that one.
- [ ] `yarn build` emits CSS containing the custom tokens.

**Commit:** `feat: map design tokens into tailwind theme`

---

## [ ] E02-T03 — Pre-paint theme script

**Files:** `index.html`

**The single most visible polish failure on a portfolio.** Without this, a dark-mode
visitor reloading the page sees a white flash before React mounts. It is non-optional
(`3-style-preference.md` §7, `5-epic-list.md` E02 acceptance).

**Scope**

- A small **blocking, inline, non-module** `<script>` in `<head>`, before any stylesheet
  link. Not `defer`, not `type="module"` — both defer execution past first paint, which
  is the entire thing this ticket prevents.
- Resolution order: `localStorage` → `prefers-color-scheme` → light.
- Applies `.dark` to `document.documentElement`.
- Wrap in `try/catch`. `localStorage` throws in Safari private mode and in some embedded
  webviews; an unhandled throw here blanks the page before React ever loads.
- Use the same storage key as `useTheme` (E02-T04). Define it once in
  `src/constants/theme.ts` as `THEME_STORAGE_KEY` and mirror the literal in the inline
  script with a comment noting the coupling — the script cannot import.

**Acceptance**

- [ ] Set dark, hard-reload with network throttled to Slow 3G: **no white flash at
      any point.**
- [ ] Same test in light mode: no dark flash.
- [ ] With `localStorage` disabled entirely, the page still renders and follows the OS
      preference.
- [ ] The script is under ~15 lines and adds no measurable blocking time.

**Commit:** `feat: apply theme before first paint to prevent flash`

---

## [ ] E02-T04 — `useTheme` hook

**Files:** `src/hooks/useTheme.ts` (new), `src/types/theme.types.ts` (new),
`src/constants/theme.ts` (new)

camelCase filename per the decision in `docs/tickets/README.md`.

**Scope**

- `src/constants/theme.ts`: `THEME_STORAGE_KEY` in `SCREAMING_SNAKE_CASE`
  (`AGENTS.md` §3).
- `src/types/theme.types.ts`: `export type Theme = 'light' | 'dark';`
- Hook returns `{ theme, toggleTheme }` with an explicit return interface — the name
  states what it returns (`AGENTS.md` §5).
- Initialise from the DOM (`documentElement.classList.contains('dark')`), **not** by
  re-reading `localStorage`. The pre-paint script already resolved it; re-resolving
  invites the two to disagree.
- `useEffect` writes the class and `localStorage` on change, with a **complete**
  dependency array.
- Subscribe to `matchMedia('(prefers-color-scheme: dark)')` so a live OS theme change is
  followed **only when the user has never set an explicit preference**. Following it
  after an explicit choice overrides the user, which is worse than not following it.
- That listener **must** return a cleanup function (`AGENTS.md` §5 — this is a leak, not
  a style choice).
- No context. One consumer (`ThemeToggle`) means `useContext` is not yet proven
  necessary (`AGENTS.md` §5). Revisit only if a second consumer appears.

**Acceptance**

- [ ] Toggling updates every token with no page reload.
- [ ] Preference survives a full browser restart.
- [ ] With no stored preference, changing the OS theme live updates the page.
- [ ] With a stored preference, changing the OS theme does **not** override it.
- [ ] `matchMedia` listener is removed on unmount — verified by unmounting in devtools.
- [ ] No `any`, explicit return type, no `eslint-disable`.

**Commit:** `feat: add useTheme hook`

---

## [ ] E02-T05 — `ThemeToggle` component

**Files:** `src/components/layout/ThemeToggle.tsx` (new), `src/components/ui/icons/`
(sun + moon SVGs)

**Placement note:** this lives in `components/layout/`, not `components/ui/`. It owns
theme behaviour and calls a hook, which fails the `components/ui/` bar of "dumb,
reusable, no business logic" (`AGENTS.md` §3). The sun and moon icons themselves are
`components/ui/icons/` and are content-agnostic.

**Scope**

- 40×40px, `rounded-full`, sun/moon icon swap (`3-style-preference.md` §7).
- **`aria-label` describes the action, not the state**: `"Switch to dark theme"` when
  light. Labelling it with the current state tells a screen reader user what they
  already have rather than what the button does.
- The shared focus ring from §4.5 — `focus-visible:` only, never `focus:`.
- Icons: inline SVG, `currentColor`, `stroke-width 1.5`, `aria-hidden="true"` (the
  button carries the accessible name). No icon package (`3-style-preference.md` §10).
- `transition-colors duration-150`. No rotation or morph animation — it is not on the
  §8 animation inventory, and anything not on that list does not ship.
- Not yet mounted in the header; that is E07. Render it in `App.tsx` temporarily to
  test, and remove that before commit.

**Acceptance**

- [ ] Reachable by keyboard alone; `Enter` and `Space` both activate it.
- [ ] Visible focus ring, not clipped by any parent.
- [ ] `aria-label` updates to describe the _next_ action after toggling.
- [ ] 40×40px hit area; meets the 44px touch minimum via padding at mobile widths.
- [ ] Correct in both themes.
- [ ] No temporary mount left in `App.tsx`.

**Commit:** `feat: add ThemeToggle component`

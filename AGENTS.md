# AGENTS.md — Personal Portfolio Project

This file governs how any AI coding agent (Codex CLI) works in this repository.
Treat it as a binding contract, not a suggestion. If a request conflicts with
this file, follow this file and flag the conflict instead of silently picking one.

---

## 1. Project Identity

- **What this is**: A personal portfolio site — the single highest-leverage
  artifact in a job search. Every commit should read like it was reviewed by
  a staff engineer before merge.
- **Audience**: Hiring managers, recruiters, and engineers doing a 90-second
  scan before deciding whether to read further. Performance, polish, and
  clarity matter more than feature count.
- **Non-goals**: No CMS, no backend, no over-engineering. This is a static,
  content-driven site — the engineering rigor is in the *code quality*, not
  in unnecessary infrastructure.

---

## 2. Tech Stack (locked — do not swap without explicit instruction)

| Layer | Choice | Notes |
|---|---|---|
| Language | TypeScript (strict mode) | No `any` unless justified with a comment |
| UI | React 18+ (function components + hooks only) | No class components |
| Routing | `react-router-dom` v6+ | Use data router (`createBrowserRouter`) |
| Styling | Tailwind CSS v4 (CSS-first config) | No CSS-in-JS, no separate `.css` files except `index.css` for the Tailwind import, design tokens, and the `@theme` mapping. No `tailwind.config.ts` |
| Animation | **Motion (formerly Framer Motion)** — `motion/react` | See §6 |
| Build tool | Vite | Fast HMR, sane defaults for React+TS |
| Package manager | yarn | Never mix lockfiles |
| Linting | ESLint (typescript-eslint, react-hooks, jsx-a11y) | |
| Formatting | Prettier (with `prettier-plugin-tailwindcss` for class sorting) | |
| Deployment target | Vercel or Netlify (static export) | |

Do not add GSAP, React Spring, Lottie, or AOS unless a specific effect is
impossible in Motion and the user explicitly approves the addition.

---

## 3. Architecture & Folder Structure

```
src/
  app/
    router.tsx          # createBrowserRouter config, route definitions
    App.tsx             # RouterProvider + global providers only
  components/
    ui/                 # Dumb, reusable, no business logic (Button, Card, Badge)
    layout/             # Header, Footer, Nav, PageWrapper
    sections/           # Home page sections (Hero, About, Projects, Contact)
  pages/                # One file per route, composed from sections/ui
  data/                 # Static content: projects.ts, experience.ts, skills.ts
  hooks/                # Custom hooks (useScrollDirection, useMediaQuery, etc.)
  lib/                  # Pure utility functions, no React
  types/                # Shared TS types/interfaces
  constants/            # Store all the constants. Constants must be with capital letter snake case
  assets/               # Images, icons, fonts
  styles/
    index.css           # Tailwind directives + CSS custom properties (design tokens)
```

**Rules:**
- No component file should exceed ~200 lines.
- `components/ui/` components must be prop-driven and content-agnostic —
  zero hardcoded copy, zero knowledge of routes.
- Page-level data (project list, work history, skills) lives in `data/*.ts`
  as typed constants — never hardcoded inline in JSX. This makes the content
  editable without touching component logic.
- One component per file. File name matches the default export.

---

## 4. TypeScript Standards

- `strict: true` in `tsconfig.json`. No exceptions.
- Explicit return types on all exported functions and components.
- Props always typed via `interface`, not inline object types, for anything
  reused more than once:
  ```tsx
  interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    href?: string;
  }
  ```
- Do not use `React.FC` or `React.FunctionComponent`.
- Use Arrow function for components.
- Destructure props directly in the function parameters with default values where appropriate.
- Discriminated unions over optional-prop soup when a component has
  meaningfully different states.
- Never use `any`. Use `unknown` + narrowing, or a proper generic.

---
## 5. React Component Design Rules (code-review-level discipline)

These are the rules a tech lead actually blocks a PR over — not style
preferences, but things that cause bugs, re-renders, or maintenance debt.

### Component structure
- **One reason to change per component.** If a component fetches data,
  computes derived state, *and* renders complex markup, split it: a
  container (logic) + a presentational component (markup only).
- **Props over context, until context is proven necessary.** Don't reach for
  `useContext` for things that can be passed down 1–2 levels. Reserve
  context for genuinely cross-cutting concerns (theme, auth).
- **No prop drilling past 2 levels** as an excuse to overuse context either —
  prefer composition (`children`, render props) to thread UI through layers
  instead of passing the same prop through 4 components untouched.
- **Composition over configuration.** Prefer `<Card><CardHeader />
  <CardBody /></Card>` over a single `<Card variant="withHeader"
  headerText="..." />` mega-prop component once a component grows past 4–5
  optional props.
- **Derive, don't duplicate.** If a value can be computed from existing
  props/state in one line, compute it inline or via `useMemo` — don't store
  it in a second `useState`. Duplicated state is a top source of stale-UI
  bugs.

### Hooks discipline
- Custom hooks encapsulate *behavior*, not just "reused `useEffect`." A
  custom hook should have a clear single responsibility and a name that
  states what it returns (`useScrollDirection`, not `useScrollStuff`).
- Every `useEffect` must have a complete, honest dependency array — no
  `// eslint-disable-line react-hooks/exhaustive-deps` unless there's a
  comment directly above explaining exactly why it's safe.
- Every `useEffect` that subscribes to something (event listener,
  `IntersectionObserver`, timer) must return a cleanup function. No
  exceptions — this is a leak, not a style choice.
- Don't use `useEffect` to derive state from props — compute during render
  instead. `useEffect` is for synchronizing with something *outside* React
  (DOM APIs, subscriptions), not for calculating values.
- `useMemo`/`useCallback` are used deliberately, not reflexively — only when
  (a) passing a callback to a memoized child, (b) the computation is
  genuinely expensive, or (c) it's a dependency of another hook. Wrapping
  every function in `useCallback` "just in case" is noise a lead will flag.

### Rendering & keys
- List rendering always uses a stable, unique `key` — never array index,
  unless the list is provably static and never reordered/filtered.
- No inline object/array/function literals passed as props to components
  wrapped in `React.memo` — it defeats the memoization silently. Hoist or
  memoize the value first.
- Conditional rendering uses early returns or ternaries for clarity — avoid
  nested ternaries beyond one level; extract to a small helper or if/else
  instead.

### Error & edge-case handling
- Wrap the app (or at minimum, each route) in an **Error Boundary**. A
  portfolio that white-screens on an unhandled error in front of a recruiter
  is the worst possible failure mode.
- Every component that renders a list or optional data handles the
  empty/undefined case explicitly — no assuming data is always present.
- Async operations (if any — e.g. a contact form submission) have explicit
  loading, error, and success states. No silent failures.

### Naming & imports
- PascalCase for components and their files (`ProjectCard.tsx`), camelCase
  for hooks/utils (`useScrollDirection.ts`, `formatDate.ts`).
- Absolute imports via a `@/` path alias (configured in `tsconfig.json` +
  `vite.config.ts`) instead of long relative `../../../` chains.
- Routes: src/app/api/[epic-name]/
- Components: src/components/[epic-name]/
- Hooks: src/hooks/useFeature.ts — camelCase, file name matches the exported hook
  (`useTheme.ts`, `useActiveSection.ts`). Hooks are the one exception to the
  kebab-case file convention used by services and types below.
- Services: src/services/[epic-name].service.ts
- Types: src/types/[epic-name].types.ts
- Import order enforced by ESLint (`eslint-plugin-import` or `simple-import-sort`):
  external packages → internal aliases → relative imports → styles.
---

## 6. Styling Conventions (Tailwind)

- Design tokens (colors, font sizes, spacing scale) are defined once in
  `src/styles/index.css` — CSS custom properties on `:root`/`.dark`, exposed to
  Tailwind through an `@theme inline` block (Tailwind v4 CSS-first config).
  Never use arbitrary values (`text-[17px]`, `bg-[#1a1a1a]`) unless there is
  truly no token that fits.
- Class order is enforced by `prettier-plugin-tailwindcss` — don't hand-order
  classes, let the formatter do it.
- Use `clsx` (or `cn` utility wrapping `clsx` + `tailwind-merge`) for
  conditional classes — never string concatenation.
- Dark mode: class-based from day one, declared with
  `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`, even if only
  one theme ships initially. It's a near-zero-cost signal of engineering care.
- Responsive-first: write mobile styles unprefixed, then layer `sm:` `md:`
  `lg:` `xl:`.
- No inline `style={}` props except for values genuinely computed at runtime
  (e.g. a dynamic transform from a hook).

---

## 7. Animation Guidelines (Motion)

- Respect `prefers-reduced-motion`. Wrap animation config in a check (Motion
  supports this via `useReducedMotion()`) — this is a real accessibility
  requirement, not optional polish.
- Page transitions: wrap route outlet in `AnimatePresence mode="wait"`,
  animate opacity + small y-offset (8–16px). Keep it under 300ms.
- Scroll reveals: use `whileInView` with `viewport={{ once: true }}` so
  elements don't re-animate on every scroll pass — re-triggering reads as
  unpolished.
- Stagger children (project cards, skill badges) via `staggerChildren` in a
  parent `variants` object rather than manually delaying each child.
- Never animate `width`/`height`/`top`/`left` — animate `transform` and
  `opacity` only, for GPU-accelerated 60fps animation.
- Every animation needs a purpose (draw attention, indicate state change,
  guide the eye). If you can't articulate why an element animates, cut it.

---

## 8. Routing (react-router-dom)

- Use the data router API (`createBrowserRouter` + `RouterProvider`).
- Route config lives in one place: `src/app/router.tsx`.
- Use lazy-loaded routes (`React.lazy` + `Suspense`, or router-native
  `lazy:` loaders) for any route beyond the home page to keep initial bundle
  small.
- 404 route required. No dead ends.

---

## 9. Performance Budget

- Lighthouse Performance score target: **95+** on mobile.
- Images: use modern formats (WebP/AVIF), explicit `width`/`height` to avoid
  layout shift, and lazy-load below-the-fold images (`loading="lazy"`).
- Fonts: self-host or use `font-display: swap`; subset if using a large
  variable font.
- No unused dependencies. Before adding any npm package, ask: "does Tailwind
  or Motion already solve this?"
- Total JS bundle (gzipped) target: keep under ~200KB for the initial route.

---

## 10. Accessibility (non-negotiable)

- Semantic HTML first — `<nav>`, `<main>`, `<section>`, `<article>`, headings
  in logical order (one `<h1>` per page).
- All interactive elements keyboard-navigable and focus-visible (Tailwind's
  `focus-visible:` variant, not `focus:`).
- All images have meaningful `alt` text (or `alt=""` if purely decorative).
- Color contrast meets WCAG AA minimum.
- `jsx-a11y` ESLint plugin errors are treated as build-breaking, not warnings.

---

## 11. Code Quality Gates (must pass before considering a task done)

1. `tsc --noEmit` — zero type errors.
2. `eslint .` — zero errors, warnings should be justified or fixed.
3. `prettier --check .` — fully formatted.
4. Manual check: no `console.log` left in committed code.
5. Manual check: no commented-out dead code blocks.

If the agent cannot run these (e.g. sandboxed), it should still write code
that would obviously pass them, and say so explicitly rather than assuming.

---

## 12. Git & Commit Conventions

- Conventional Commits format: `feat:`, `fix:`, `refactor:`, `chore:`,
  `style:`, `docs:`, `perf:`.
- Small, atomic commits over large sweeping ones — one logical change per
  commit.

---

## 13. Working Agreement for the Agent

- **Plan before large changes.** For anything touching more than 2–3 files,
  state a short plan first (files to touch, approach) before writing code.
- **Don't invent content.** Project descriptions, work history, and bio copy
  come from the user or `data/*.ts` — never fabricate achievements, metrics,
  or company names.
- **Prefer editing over adding.** Before creating a new component/util,
  check if an existing one can be extended.
- **No silent scope creep.** If a task implies adding a new dependency,
  changing the folder structure, or deviating from this file, say so
  explicitly and ask, rather than doing it quietly.
- **Explain non-obvious decisions** in a short code comment, not in a
  separate essay — the code should be self-documenting where possible.
- **Ask when ambiguous**, but only when the ambiguity would meaningfully
  change the output — don't stall on things with an obvious sensible default.

---

## 14. Definition of Done (per feature/section)

A section (e.g. "Hero", "Projects grid") is done when:
- [ ] Responsive from 320px to 1920px, no horizontal scroll, no overlap.
- [ ] Keyboard navigable and screen-reader sane.
- [ ] Animates in on scroll/mount per §6, respects reduced motion.
- [ ] Typed with no `any`, no ESLint errors.
- [ ] Content pulled from `data/`, not hardcoded.
- [ ] Visually consistent with the design tokens in `src/styles/index.css`.
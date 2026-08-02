# Personal Portfolio — Epic List

The implementation plan. Each epic is a shippable slice with its own deliverables and
acceptance criteria, ordered so that nothing is built before what it depends on.

Derived from `1-prd.md`, `2-architecture.md`, `3-style-preference.md`, and
`4-interaction-design.md`. Where an epic implements a specific requirement, the source
is cited. If an epic and a source document disagree, the source document wins.

```
1-prd.md                 What we are building and why
2-architecture.md        Structure: routes, data, components, performance
3-style-preference.md    Appearance: tokens, type, component styling
4-interaction-design.md  Behaviour: layout, navigation, scroll, motion
5-epic-list.md           Build order and acceptance criteria          ← this file
AGENTS.md                Code rules — wins over all of the above
```

---

## Global Definition of Done

Applies to **every** epic. Not repeated in each one.

- `tsc --noEmit` clean, `eslint .` clean, `prettier --check .` clean, `yarn build`
  succeeds (`AGENTS.md` §11).
- No `any`, no `React.FC`, explicit return types on exports, arrow-function components.
- No `console.log`, no commented-out dead code.
- Every `useEffect` that subscribes to anything returns a cleanup function.
- Correct in both light and dark themes.
- No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920.
- Keyboard reachable with a visible `focus-visible` ring.
- Animations respect `prefers-reduced-motion`.
- Content comes from `src/data/`, never hardcoded in JSX.
- Commits are Conventional Commits, one logical change each (`AGENTS.md` §12).

---

## Dependency Graph

```
E01 Tooling
 └─ E02 Tokens & Theming
     ├─ E03 Routing & Shell
     │   └─ E07 Header & Nav ──┐
     ├─ E04 Data Layer ────────┤
     ├─ E05 UI Primitives ─────┤
     └─ E06 Motion Foundation ─┤
                               ├─ E08 Social Rail
                               ├─ E09 Hero & Current Role
                               ├─ E10 Projects
                               ├─ E11 About & Skills
                               ├─ E12 Resume
                               ├─ E13 Contact
                               └─ E14 Writing
                                   └─ E15 SEO
                                       └─ E16 A11y & Responsive Hardening
                                           └─ E17 Performance
                                               └─ E18 Deployment
```

E04, E05, and E06 are independent of each other and can be built in any order once E02
lands. E09–E14 are independent of each other once E07 lands.

---

# Phase 1 — Foundation

Nothing visible ships in this phase. It exists so that everything after it is fast to
build and impossible to build wrong.

## E01 — Tooling & Project Scaffold

**Goal:** A correctly configured Vite + React + TS project that enforces the rules in
`AGENTS.md` automatically rather than by memory.

**Why first:** Import sorting, path aliases, and Tailwind class ordering are painful to
retrofit across a finished codebase. Lint rules added late produce hundreds of errors
at once.

**Deliverables**

- Tailwind CSS v4 installed via `@tailwindcss/vite` and wired to
  `src/styles/index.css`; the scaffold's `src/App.css` and default `index.css`
  content removed. No `tailwind.config.ts` — v4 is configured in CSS.
- `@/` path alias in both `tsconfig.json` and `vite.config.ts`.
- ESLint: `typescript-eslint`, `react-hooks`, `jsx-a11y`, `simple-import-sort`.
  **`jsx-a11y` errors configured as errors, not warnings** (`AGENTS.md` §10).
- Prettier with `prettier-plugin-tailwindcss`.
- `strict: true` confirmed in `tsconfig.json`.
- `clsx` + `tailwind-merge`, and `src/lib/cn.ts` wrapping them.
- Full folder scaffold per `2-architecture.md` §6 (`app/`, `components/{ui,layout,sections}`,
  `pages/`, `data/`, `hooks/`, `lib/`, `types/`, `constants/`, `assets/`, `styles/`).
- `App.tsx` moved to `src/app/`.

**Acceptance**

- `yarn lint` reports zero errors on the scaffold.
- An intentionally unsorted import block is reordered by `--fix`.
- An intentionally missing `alt` attribute fails lint.
- `import { cn } from '@/lib/cn'` resolves in both the editor and `yarn build`.

**Traceability:** `AGENTS.md` §2, §3, §11 · `2-architecture.md` §6, §10

---

## E02 — Design Tokens & Theming

**Goal:** Every colour, size, and radius in the app resolves to a named token, and dark
mode works before a single component exists.

**Why here:** Components built against raw Tailwind palette classes have to be rewritten
when tokens arrive. Building tokens first makes that impossible.

**Deliverables**

- All semantic tokens from `3-style-preference.md` §2.2–2.3 as CSS custom properties in
  `src/styles/index.css`, stored as space-separated RGB channels so `/30` opacity
  modifiers work.
- `@theme inline` block in the same file mapping every token into Tailwind: colours,
  `--font-*`, the type scale from §3.2, `--container-*` (`container` 1120px,
  `container-wide` 1280px, `content` 768px), and the two shadows. Plus
  `@custom-variant dark` for class-based dark mode. No `tailwind.config.ts`.
- `useTheme` hook (`src/hooks/useTheme.ts`): `localStorage` → `prefers-color-scheme` →
  light, applying `.dark` to `<html>`.
- `ThemeToggle` component — 40×40px, `rounded-full`, `aria-label` describing the
  _action_ ("Switch to dark theme"), not the current state.
- **Pre-paint inline script in `index.html`** that sets the theme class before first
  paint.

**Acceptance**

- Reloading in dark mode produces **no white flash**. This is the single most visible
  polish failure on a portfolio and is the reason the inline script is non-optional.
- Toggling theme updates every token without a page reload.
- Preference survives a full browser restart.
- Toggle is reachable and operable by keyboard alone.
- Spot-check three token pairs against the contrast table in §2.4.

**Traceability:** `1-prd.md` §3 Theme Support, §5 Accessibility · `2-architecture.md` §4 ·
`3-style-preference.md` §2, §7, §9

---

## E03 — Routing, App Shell & Error Handling

**Goal:** All five routes resolve, lazy-load correctly, and no error can produce a white
screen.

**Deliverables**

- `src/app/router.tsx` using `createBrowserRouter`; `App.tsx` holds `RouterProvider` and
  global providers only.
- Routes: `/` (eager), `/projects/:slug`, `/resume`, `/writing`, `/writing/:slug` (all
  lazy), `/*` (404).
- `RootLayout` with `<Header />`, `<main>`, `<Footer />`, and the skip link as the first
  focusable element.
- `ErrorBoundary` at the root plus route-level error elements.
- `NotFoundPage` — `h1` "Page Not Found", links to Home, Projects, Resume, Contact,
  layout and theme preserved.
- Error fallback UI with a "Reload page" action; never a raw stack trace in production.
- Route-change focus management: focus moves to the new page's `h1`, scroll resets to
  top.

**Acceptance**

- Every route renders; unknown paths hit the 404 with the layout intact.
- A deliberately thrown render error shows the fallback, not a blank page.
- Lazy routes appear as separate chunks in the build output.
- After navigating, the next Tab press lands inside the new page, not at the document
  top.

**Traceability:** `1-prd.md` §5 Reliability · `2-architecture.md` §3, §8, §11 ·
`3-style-preference.md` §6.13–6.14

---

## E04 — Content Data Layer & Types

**Goal:** All site content lives in typed constants, so every later epic renders from
data on day one and never hardcodes copy it will have to tear out.

**Deliverables**

- Types in `src/types/`: `profile.types.ts`, `project.types.ts`, `skill.types.ts`,
  `resume.types.ts`, `current-role.types.ts`, `writing.types.ts`.
- `ProjectType` carries `category: 'professional' | 'personal'` and optional
  `githubUrl`, `liveUrl`, `caseStudySlug`, `image`.
- `ProfileType` carries a **`layout: 'stacked' | 'split'`** discriminator selecting the
  hero layout, plus a separate **optional `portrait`** asset field
  (`4-interaction-design.md` §5.1). The layout is never inferred from the portrait.
- Data files: `profile.ts`, `projects.ts`, `skills.ts`, `resume.ts`, `navigation.ts`,
  `currentRole.ts`, `writing.ts`.
- `src/constants/` for shared constants in `SCREAMING_SNAKE_CASE` (`AGENTS.md` §3).
- Real content where it exists; clearly marked placeholders only for the items
  `1-prd.md` §6 permits (screenshots, OG image, draft resume, bio polish).

**Acceptance**

- No `any`. Optional link fields are genuinely optional, so "no live demo" is
  representable without an empty string.
- Nav targets exist in exactly one place (`navigation.ts`).
- The resume path is defined once and consumed everywhere.
- Adding a project to `projects.ts` requires touching no component.

**Traceability:** `1-prd.md` §6 · `2-architecture.md` §5 · `AGENTS.md` §3, §4

> **Content gate.** This epic is blocked on real content for: candidate name, target
> role, contact links, project names and descriptions, skills, and the resume file.
> `1-prd.md` §6 lists these as _not acceptable_ as launch placeholders. Draft copy is
> fine to start; launch is not.

---

## E05 — UI Primitives

**Goal:** The nine reusable, content-agnostic components everything else composes from.

**Deliverables** — per `3-style-preference.md` §5:

`Button` (3 variants × 3 sizes) · `Card` · `Badge` · `Section` · `Container` ·
`IconLink` · `TextInput` · `TextArea` · `FormStatus`

- Every component prop-driven, zero hardcoded copy, zero route knowledge.
- `Section` owns vertical rhythm, the `id` anchor, `scroll-mt-20`, optional eyebrow, and
  the `h2`.
- `Container` owns `max-w-container 2xl:max-w-container-wide` and gutters — **no section
  reimplements this**.
- The shared focus ring is defined once and used by every interactive primitive.
- Icons as inline SVG using `currentColor`; no icon-font, no runtime icon package unless
  it tree-shakes.

**Acceptance**

- Every primitive renders correctly in both themes.
- `Button` as a link renders `<a>`/`<Link>`, never `<button>` with `onClick` navigation.
- Touch targets ≥ 44×44px at mobile sizes; the `sm` button size is desktop-only.
- No component exceeds ~200 lines.
- Composition is preferred over configuration once a component passes 4–5 optional props
  (`AGENTS.md` §5).

**Traceability:** `3-style-preference.md` §5 · `2-architecture.md` §6 · `AGENTS.md` §5

---

## E06 — Motion Foundation

**Goal:** One shared motion vocabulary, so eleven animations do not become eleven
bespoke implementations with eleven different easings.

**Why before the sections:** Retrofitting reduced-motion handling across a dozen finished
components is exactly the kind of sweep that gets half-done.

**Deliverables**

- `src/lib/motion.ts` (or `constants/`): shared `variants` objects for fade-up, stagger
  containers, and page transitions; the durations and easings from
  `4-interaction-design.md` §8.
- A reduced-motion wrapper built on Motion's `useReducedMotion()` so the check is written
  once, not eleven times.
- `PageTransition` component wrapping the route outlet in `AnimatePresence mode="wait"`.
- `scroll-behavior: smooth` on `html`, disabled under `prefers-reduced-motion`.

**Acceptance**

- With OS reduced-motion enabled, content renders in final state instantly — visible,
  never hidden, never non-functional.
- Only `opacity` and `transform` animate. The single `width` exception (social rail,
  §7) is not in scope here.
- Page transitions complete under 300ms.

**Traceability:** `AGENTS.md` §7 · `2-architecture.md` §7 · `3-style-preference.md` §8 ·
`4-interaction-design.md` §8

---

# Phase 2 — Layout & Navigation

## E07 — Header & Navigation

**Goal:** The hybrid navigation model works from every route, including the cross-route
anchor case that breaks most one-page sites.

**Highest-risk epic in the plan.** Scroll spy, smooth scroll, focus management, and the
mobile sheet interact in ways that are easy to get individually right and collectively
wrong.

**Deliverables**

- `Header` — fixed, `h-16`, blur, border fading in past `scrollY > 8`.
- `Navigation` — six items (Home, Projects, About, Blog, Contact, Resume); Resume as a
  `secondary` Button; `ThemeToggle` last.
- `MobileNavigation` — hamburger below `lg`, full-width sheet, focus trap, scroll lock,
  `SocialLinks` row, closes on all five triggers, restores focus and scroll position.
- `useActiveSection` — `IntersectionObserver` scroll spy, `rootMargin
'-20% 0px -70% 0px'`, topmost-wins, home route only, suppressed ~700ms after a nav
  click.
- `useHashScroll` — resolves `/#section` after paint on mount and on hash change.
- Anchor navigation moves focus to the target heading (`tabIndex={-1}` +
  `focus({ preventScroll: true })`).
- `SocialLinks` — **moved here from E08.** `MobileNavigation` and `Footer` both consume
  it, so E07 cannot be built without it. E08 retains `SocialRail` only.
- `Footer`.

**Acceptance**

- Every anchor item works from `/`, **and** from `/writing`, **and** from `/resume`.
- An external link to `https://site/#contact` lands on Contact.
- Exactly one nav item is active at a time; it does not flicker while a smooth scroll
  passes through intermediate sections.
- Scroll spy does not run on `/writing` or `/resume`.
- After clicking a nav anchor, the next Tab press lands inside that section.
- Sheet closes on: item click, `Escape`, outside click, route change, and crossing the
  `lg` breakpoint.
- Observer and scroll listeners are disconnected on unmount.

**Traceability:** `1-prd.md` §5 Cross-Device · `2-architecture.md` §3, §8 ·
`3-style-preference.md` §6.1 · `4-interaction-design.md` §1, §3, §4

---

## E08 — Social Rail

**Goal:** The fixed left rail from `docs/img.png`, plus the `SocialLinks` fallback below
`lg`.

**Deliverables**

- `SocialRail` in `components/layout/` — fixed left edge, vertically centred, `sm`+ only.
- Tiles: GitHub, LinkedIn, Email, X. 48px collapsed, expanding rightward on hover **and
  focus**, `rounded-r-md`.
- ~~`SocialLinks`~~ — **built in E07**, its first consumer. Still reused by the hero
  below `lg`,
  the contact section, and the footer.
- Both driven by the same `profile.ts` link data; tiles render only for links that exist.
- `<nav aria-label="Social links">`, placed after `<main>` in DOM order.

**Acceptance**

- Focus expansion works identically to hover — a keyboard user sees the same labels.
- Each tile has an `aria-label`, so the visual label is enhancement only.
- The rail does not overlap page content at any width where it is visible. It overlays
  the container gutter by design (`4-interaction-design.md` §7).
- Rail and hero social links are never both visible.
- Profiling confirms the `width` animation triggers no layout recalculation outside the
  rail. If it does, fall back to `scaleX` per `4-interaction-design.md` §7.

**Traceability:** `1-prd.md` §3 Contact · `3-style-preference.md` §6.11 ·
`4-interaction-design.md` §7

---

# Phase 3 — Home Page Sections

## E09 — Hero & Current Role

**Goal:** The LCP section, in both supported layouts.

**Deliverables**

- `HeroSection` — **one component, two layouts**, selected by `profile.layout`.
  `stacked` ships now; the `split` seam ships alongside it with an aspect-ratio-locked
  portrait slot.
- Content stack: eyebrow → `h1` name (**name only**) → role framing → value proposition
  → current position → `primary` "View Resume" + `secondary` "Contact" → `SocialLinks`
  (below `sm` only).
- `CurrentRoleSection` — static card, role/company `h3`, date range, scope bullets,
  stack badges. **No eyebrow**; badges do not stagger
  (`4-interaction-design.md` §5.2, §8).

**Deferred — blocked on the portrait asset, tracked here rather than silently missing**

- Portrait treatment: crop, focal point, responsive sources, `fetchpriority="high"`,
  explicit dimensions, real `alt`. Ships when a real photograph exists; tuning it against
  a stand-in encodes that stand-in's accidental properties into the CSS.

**Acceptance**

- Hero text is in the DOM and readable at first paint; the mount animation never gates
  its presence on JS state.
- `h1` contains the name and nothing else; the role framing is a sibling element.
- Switching `profile.layout` between `stacked` and `split` changes the layout with no
  other file edited, and the `split` slot reserves its space with no image present.
- At 320px the CTAs are not pushed below the fold.
- LCP under 2.5s on a throttled mobile profile.
- Closes the criterion E08 deferred here: the rail and the hero's `SocialLinks` row are
  never both visible.

_Blocked, not skipped:_ the portrait uses `fetchpriority="high"`, **never**
`loading="lazy"`, with explicit `width`/`height` and real `alt` text — verifiable only
once the asset lands.

**Traceability:** `1-prd.md` §3 Hero, §6 Hero Content · `3-style-preference.md` §6.2–6.3 ·
`4-interaction-design.md` §5.1–5.2

---

## E10 — Projects

**Goal:** The section hiring managers actually came for — one `h2`, two carousels, plus
the case study route.

**Largest epic.** Split into two commits (sections, then case study page) if it grows
unwieldy.

**Deliverables**

- `ProjectsSection` — one `h2`, two `h3` subsections, filtering `projects.ts` by
  `category`.
- `ProjectCarousel` — one component, two independent instances. Native
  `overflow-x: auto` + `scroll-snap`, **no carousel library**. 1.15 / 2.15 / 3 cards
  visible at base / `md` / `xl`.
- `useCarousel` — scroll position, arrow disabled state, `requestAnimationFrame`
  throttling, resize re-evaluation.
- Arrow buttons — subsection header, hidden below `md`, disabled at both ends, hidden
  entirely when nothing overflows, distinctly labelled per group.
- `ProjectCard` — 16:9 image, `h4` title as the **only** card-level link, clamped
  summary, badges, conditional GitHub and Live buttons.
- `ProjectPage` + `ProjectCaseStudy` at `/projects/:slug` — `h2` order Problem →
  Approach → Stack → Outcome → Links.

**Acceptance**

- The two carousels scroll independently.
- Arrows disable correctly at both ends and re-evaluate after a resize or orientation
  change.
- Each scroller is a labelled `role="region"` with `tabindex="0"`; arrow keys scroll it.
- Tabbing to an off-screen card scrolls it into view without landing flush to the edge.
- **Only links present in the data render** — no dead links, no disabled placeholders.
- No nested interactive elements inside an anchor.
- An empty category hides its subsection; two empty categories hide the section and its
  nav item.
- Unknown `:slug` resolves to the 404, not a crash.

**Traceability:** `1-prd.md` §3 Projects, §4 Hiring Manager Journey, §5 Reliability ·
`2-architecture.md` §3, §5, §11 · `3-style-preference.md` §6.4, §6.10 ·
`4-interaction-design.md` §5.3, §6

---

## E11 — About & Skills

**Deliverables**

- `AboutSection` — `max-w-content` prose. No accordion, no "read more".
- `SkillsSection` + `SkillGroup` — grouped by capability per `1-prd.md` §3 (Frontend,
  Backend, AI/LLM, Data, Infrastructure, Practices).

**Acceptance**

- No proficiency bars, percentages, or star ratings — unverifiable and read as filler.
- Skill groups render from data; an empty group does not render.
- Prose respects the ~68-character measure.

**Traceability:** `1-prd.md` §3 About, Skills · `3-style-preference.md` §6.5–6.6

---

## E12 — Resume

**Deliverables**

- `ResumeSection` (`#resume`) — download PDF + view in browser, both from
  `resume.ts`.
- `ResumePage` at `/resume` with `ResumeViewer` and `ResumeDownloadLink`.
- PDF committed at `public/resume/shakhlyn-resume.pdf`.

**Acceptance**

- One stable path, consumed by the hero CTA, the nav button, and the section.
- Download works on mobile browsers.
- File type and size are visible before the user commits to the download.
- The viewer degrades gracefully where inline PDF embedding is unsupported (notably iOS
  Safari) — always offer the direct link.

**Traceability:** `1-prd.md` §3 Resume, §6 · `2-architecture.md` §5 ·
`3-style-preference.md` §6.7

---

## E13 — Contact

**Deliverables**

- `ContactSection` — form left (60%), direct links right (40%) at `lg`; stacked below.
- `ContactForm` — Netlify Forms: static markup, hidden `form-name`, honeypot, client
  validation.
- State machine: idle → submitting → success | error.
- Validation timing: none while typing, on blur once touched, all fields on submit with
  focus moved to the first invalid field.
- `FormStatus` — `role="status" aria-live="polite"`.
- Email address rendered as real, selectable text — copyable without JavaScript.

**Acceptance**

- **Values are never cleared on error**, and the error state always exposes the mailto
  fallback.
- No silent failures.
- Errors are announced, associated via `aria-describedby`, and carry `aria-invalid`.
- Required fields are marked in the label text, not by colour alone.
- The honeypot is visually hidden but present for Netlify detection.
- A real submission arrives in the Netlify dashboard (verified in E18).

**Traceability:** `1-prd.md` §3 Contact, §5 Reliability · `2-architecture.md` §9, §11 ·
`3-style-preference.md` §5.6–5.7, §6.8 · `4-interaction-design.md` §5.7

---

# Phase 4 — Secondary Routes

## E14 — Writing / Blog

**Deliverables**

- `WritingPage` at `/writing` — `WritingCard` rows separated by dividers, plus
  `WritingEmptyState`.
- `WritingPostPage` at `/writing/:slug` rendering from typed local data.
- **No MDX dependency in v1.**
- `noindex` on placeholder-only writing pages until real posts exist.

**Acceptance**

- Empty state is honest — no fake "coming soon" posts.
- Unknown slug resolves to the 404 or a writing-specific empty state, never a broken
  page.
- Placeholder-only pages are not indexable.

**Traceability:** `2-architecture.md` §3, §8 · `3-style-preference.md` §6.9

> **Known conflict, already resolved in favour of the architecture.** `1-prd.md` §3
> Optional Blog says to include writing only with two credible posts, and §7 puts it out
> of scope below that threshold. `2-architecture.md` §3 supersedes this: the routes ship
> in v1 with a placeholder-safe empty state and `noindex`. That supersession is explicit
> in the architecture doc, so no further decision is needed — but the nav's Blog item
> should be hidden until at least one real post exists, or a recruiter clicks through to
> an empty page.

---

# Phase 5 — Hardening

These epics are not polish. Each maps to a numeric target the site is expected to hit.

## E15 — SEO & Metadata

**Deliverables**

- Static title, meta description, Open Graph and Twitter card metadata in `index.html`.
- A small internal metadata utility for route-level title/description updates — **no
  heavy dependency**.
- Optimised OG image committed at `public/og/portfolio-og.png`.
- Human-readable project slugs, validated against stable project IDs.
- `noindex` where `2-architecture.md` §8 requires it.

**Acceptance**

- Lighthouse SEO 95+.
- Link preview renders correctly when pasted into LinkedIn and Slack.
- One `h1` per page; heading levels never skip.
- No empty placeholder page is indexable.

**Traceability:** `1-prd.md` §5 SEO · `2-architecture.md` §5, §8

---

## E16 — Accessibility & Responsive Hardening

**Goal:** A dedicated audit pass. Accessibility is checked _within_ each epic; this
verifies the assembled whole, where most real failures live.

**Deliverables**

- Full keyboard traversal against the map in `4-interaction-design.md` §9.
- Screen reader pass on the home page, one project, and the contact form.
- Contrast verification against `3-style-preference.md` §2.4 in both themes.
- Responsive sweep at 320, 375, 768, 1024, 1440, 1920.
- 200% zoom check.
- Reduced-motion pass across all eleven animations.

**Acceptance**

- Lighthouse Accessibility 95+.
- Zero `jsx-a11y` errors.
- No keyboard traps; the mobile sheet's trap releases correctly on every close path.
- No horizontal scroll, text overlap, or clipped CTAs at any tested width.
- Focus is never lost after navigation, sheet close, or form submission.

**Traceability:** `1-prd.md` §5 Accessibility, Cross-Device · `3-style-preference.md`
§11–12 · `4-interaction-design.md` §9, §11

---

## E17 — Performance

**Deliverables**

- Images converted to WebP/AVIF with explicit dimensions; below-fold images lazy-loaded;
  the hero portrait explicitly not.
- Bundle analysis of the initial route.
- Confirmation that lazy routes are genuinely split.
- Dependency audit — remove anything Tailwind or Motion already solves.

**Acceptance**

- Lighthouse Performance **95+ on mobile**.
- Initial route JS under ~200KB gzipped.
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- No layout shift from images or the header border transition.
- No unused dependencies in `package.json`.

**Traceability:** `1-prd.md` §5 Performance · `2-architecture.md` §7

---

## E18 — Deployment

**Deliverables**

- Netlify site connected, production deploys from `main`.
- Deploy previews enabled for pull requests.
- SPA fallback redirect: `/* /index.html 200`.
- Netlify Forms verified end to end with a real submission.
- Custom domain and HTTPS if applicable.

**Acceptance**

- A deep link to `/projects/some-slug` resolves on a hard refresh — this is what the SPA
  fallback exists for and it is the classic post-deploy failure.
- A contact form submission arrives in the Netlify dashboard.
- Lighthouse targets confirmed **against the deployed site**, not just locally.
- No broken internal or external links in production.
- Yarn is the only package manager used in the build (`packageManager` field honoured).
- **`grep -rn "INVENTED FIGURE" src/` returns nothing.** Development placeholder
  metrics were added to the data layer on 2026-08-03; `1-prd.md` §6 lists fabricated
  metrics as never acceptable at launch, so this is a hard deploy gate, not a checklist
  nicety. Each marker is replaced with a real figure or its clause is deleted.

**Traceability:** `1-prd.md` §5 Reliability · `2-architecture.md` §1, §9, §10

---

## Sequencing Notes

**Critical path:** E01 → E02 → E03 → E07 → E10 → E17 → E18. Everything else can slip a
day without moving the launch date.

**Parallelisable:** E04, E05, E06 after E02. E09, E11, E12, E13, E14 after E07.

**Start content collection during Phase 1.** E04, E09, E10, E12, and E15 are each gated
on real content — project write-ups, the resume PDF, the OG image, bio copy. Content is
the most common reason a portfolio stalls at 90% built, and it is the one dependency
that writing code cannot unblock.

**Suggested first shippable milestone:** E01–E10. That is a deployable one-page
portfolio with working navigation and real projects — the minimum that serves a
recruiter's 90-second scan. E11–E14 broaden it; E15–E18 make it fast and correct.

## Open Risks

| Risk                                                         | Epic               | Mitigation                                                        |
| ------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------- |
| Scroll spy + smooth scroll + focus management interact badly | E07                | Build and verify the three behaviours separately before combining |
| Carousel arrow state desyncs after resize                    | E10                | Resize re-evaluation is an explicit acceptance criterion          |
| Rail `width` animation causes layout recalculation           | E08                | Profile it; documented `scaleX` fallback                          |
| Inline PDF viewer unsupported on iOS Safari                  | E12                | Always offer the direct download link                             |
| Theme flash on reload                                        | E02                | Pre-paint inline script, treated as non-optional                  |
| Content not ready at launch                                  | E04, E09, E10, E12 | Begin collection in Phase 1                                       |

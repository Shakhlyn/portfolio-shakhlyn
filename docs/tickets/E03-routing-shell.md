# E03 — Routing, App Shell & Error Handling

**Goal:** All five routes resolve, lazy-load correctly, and no error can produce a white
screen.

**Depends on:** E02. **Blocks:** E07 (Header & Nav).

**Traceability:** `1-prd.md` §5 Reliability · `2-architecture.md` §3, §8, §11 ·
`3-style-preference.md` §6.13–6.14 · `5-epic-list.md` E03

---

## [ ] E03-T01 — Route page stubs

**Files:** `src/pages/HomePage.tsx`, `ProjectPage.tsx`, `ResumePage.tsx`,
`WritingPage.tsx`, `WritingPostPage.tsx` (all new)

Stubs first so E03-T02 has something real to route to. Each renders its correct `h1`
from `2-architecture.md` §8 and nothing else — the sections that fill them are E09–E14.

**Scope**

- One component per file, arrow function, explicit return type, file name matches the
  export (`AGENTS.md` §3, §4).
- Correct `h1` per page: project name, `Resume`, `Writing`, post title, and for the home
  page the hero `h1` (which E09 replaces).
- `:slug` pages read the param via `useParams` and render it. Unknown-slug handling is
  E10/E14 — for now, render the raw slug.
- Every `h1` carries `tabIndex={-1}` so E03-T06 can move focus to it.
- No copy beyond headings. Content comes from `src/data/` (E04), never hardcoded.

**Acceptance**

- [ ] Exactly one `h1` per page.
- [ ] Every file typechecks with no `any` and no `React.FC`.
- [ ] Each `h1` is focusable programmatically but not in the Tab order.

**Commit:** `feat: add route page stubs`

---

## [ ] E03-T02 — Router with lazy routes

**Files:** `src/app/router.tsx` (new), `src/app/App.tsx`, `package.json`

**Scope**

- `yarn add react-router-dom` (v6+ / v7 data router).
- `createBrowserRouter` in `router.tsx`. Route config lives **here and nowhere else**
  (`AGENTS.md` §8).
- Routes per `2-architecture.md` §3:

  | Path | Loading |
  |---|---|
  | `/` | eager — it is the LCP route |
  | `/projects/:slug` | lazy |
  | `/resume` | lazy |
  | `/writing` | lazy |
  | `/writing/:slug` | lazy |
  | `/*` | 404 (E03-T05) |

- Lazy via the router's native `lazy:` property rather than `React.lazy` + `Suspense` —
  the data router resolves it before rendering, so there is no fallback flash between
  routes.
- `App.tsx` holds `RouterProvider` and global providers **only** (`AGENTS.md` §3). No
  markup, no layout, no state.

**Acceptance**

- [ ] All five routes render their stub.
- [ ] `yarn build` output shows the four lazy routes as **separate chunks**, not folded
      into the entry bundle. Check the build manifest, do not assume.
- [ ] The home route's JS does not include project, resume, or writing page code.
- [ ] Direct navigation to `/resume` in `yarn dev` works (production deep-link handling
      needs the Netlify redirect from E18).

**Commit:** `feat: add data router with lazy routes`

---

## [ ] E03-T03 — `RootLayout` and skip link

**Files:** `src/components/layout/RootLayout.tsx` (new), `src/app/router.tsx`

**Scope**

- Structure: skip link → `<Header />` placeholder → `<main id="main">` with `<Outlet />`
  → `<Footer />` placeholder. Header and Footer are real components in E07; here they
  are minimal semantic shells so the landmark structure is correct from the start.
- **The skip link is the first focusable element on every page** (`3-style-preference.md`
  §6.1, `4-interaction-design.md` §9). Visually hidden until focused, then pinned
  top-left as an accent-bordered pill. It targets `#main`.
- Semantic landmarks only: `<header>`, `<main>`, `<footer>`. One `<main>` per page.
- Top padding on `<main>` clearing the fixed `h-16` header, so page content is never
  underneath it.
- Set as the router's root route `element`, with all five routes as children.

**Acceptance**

- [ ] First `Tab` on any route reveals the skip link.
- [ ] Activating it moves focus into `<main>`, and the next `Tab` continues from there —
      not from the document top.
- [ ] Skip link is invisible until focused and does not shift layout when it appears.
- [ ] Layout persists across route changes without remounting.
- [ ] Correct in both themes.

**Commit:** `feat: add RootLayout with skip link`

---

## [ ] E03-T04 — Error boundary and fallback UI

**Files:** `src/components/layout/ErrorBoundary.tsx` (new),
`src/components/layout/ErrorFallback.tsx` (new), `src/app/router.tsx`

**A portfolio that white-screens in front of a recruiter is the worst possible failure
mode** (`AGENTS.md` §5). This is the ticket that makes that impossible.

**Scope**

- Two mechanisms, because they catch different things:
  - The router's `errorElement` on the root route and on each lazy route — catches
    loader errors, lazy-chunk load failures, and thrown responses. Use
    `useRouteError` + `isRouteErrorResponse`.
  - A React error boundary for render-phase errors the router does not see.
- **The boundary is the one permitted class component** — React has no hook equivalent
  for `componentDidCatch`. Note this in a one-line comment so it is not read as a
  violation of `AGENTS.md` §2.
- `ErrorFallback` presentation per `3-style-preference.md` §6.14: same shape as the 404,
  plus a `primary` "Reload page" action. Header, footer, and theme preserved.
- **Never a raw stack trace in production.** Gate any detail behind `import.meta.env.DEV`.
- A 404-shaped route error (`isRouteErrorResponse` with `status === 404`) renders the
  NotFound content, not the crash fallback.

**Acceptance**

- [ ] A deliberately thrown render error shows the fallback, not a blank page.
- [ ] A deliberately thrown loader error shows the fallback.
- [ ] Header, footer, and the current theme survive the error.
- [ ] "Reload page" works and is keyboard reachable.
- [ ] A production build exposes no stack trace or error message internals.
- [ ] Both probes reverted before commit.

**Commit:** `feat: add error boundary and fallback UI`

---

## [ ] E03-T05 — 404 page

**Files:** `src/pages/NotFoundPage.tsx` (new), `src/app/router.tsx`

"No dead ends" (`AGENTS.md` §8). A recruiter who mistypes a URL must land somewhere
useful, not somewhere apologetic.

**Scope**

- Per `3-style-preference.md` §6.13: centred, `py-32`, large `fg-subtle` "404", `h1`
  "Page Not Found", one `fg-muted` sentence, then links to **Home, Projects, Resume,
  Contact**.
- Layout and theme preserved — it renders inside `RootLayout`, not instead of it.
- Links use `<Link>` for routes and `/#section` for anchors. Targets come from
  `src/data/navigation.ts` once E04 lands; until then, mark the hardcoded paths with a
  `TODO(E04)` comment and replace them in E04-T02.
- The large "404" is decorative — ensure the `h1` is the accessible page title and the
  numeral does not become a heading for visual reasons (`3-style-preference.md` §11).

**Acceptance**

- [ ] Any unknown path renders it with the layout intact.
- [ ] `h1` is exactly "Page Not Found"; the "404" numeral is not a heading.
- [ ] All four links work and are keyboard reachable.
- [ ] Correct in both themes; no horizontal scroll at 320px.

**Commit:** `feat: add 404 page`

---

## [ ] E03-T06 — Route-change focus and scroll management

**Files:** `src/hooks/useRouteFocus.ts` (new), `src/components/layout/RootLayout.tsx`

**Scrolling moves the eye, not the keyboard.** Without this, a keyboard or screen reader
user who navigates to `/resume` is still positioned at the old page's tab index and hears
nothing announced. It is the most common serious accessibility failure in SPAs
(`2-architecture.md` §8, `4-interaction-design.md` §4).

**Scope**

- Hook keyed on `useLocation().pathname`:
  1. Scroll to top.
  2. Move focus to the new page's `h1` (`tabIndex={-1}` +
     `.focus({ preventScroll: true })`).
- **Fires on pathname change only, never on hash change.** Hash navigation is in-page
  and is handled by `useHashScroll` in E07; running both would fight each other.
- Run after paint so the new `h1` exists — `useEffect` after the router has committed,
  not a `setTimeout` guess.
- Cleanup: cancel any pending frame on unmount.
- Fall back to focusing `<main>` if no `h1` is found, so focus is never simply lost.

**Acceptance**

- [ ] After navigating to any route, the next `Tab` press lands **inside** the new page,
      not at the document top.
- [ ] Scroll position resets to top on every route change.
- [ ] A screen reader announces the new page heading on navigation.
- [ ] Changing only the hash does **not** trigger it.
- [ ] No `eslint-disable` on the dependency array; cleanup function present.

**Commit:** `feat: manage focus and scroll on route change`

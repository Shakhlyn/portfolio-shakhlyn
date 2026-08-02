# E03 — Routing, App Shell & Error Handling · Status

Tickets: [E03-routing-shell.md](E03-routing-shell.md) · Overview: [STATUS.md](STATUS.md)

**6 / 6 written. 2 need manual browser verification.** Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                             | Status | Notes                                       |
| ------- | --------------------------------- | ------ | ------------------------------------------- |
| E03-T01 | Route page stubs                  | ✅     | 5 pages, one `h1` each, all `tabIndex={-1}` |
| E03-T02 | Router with lazy routes           | ✅     | Chunk splitting confirmed in build output   |
| E03-T03 | `RootLayout` and skip link        | 🔍     | Needs the keyboard skip-link check          |
| E03-T04 | Error boundary and fallback       | ✅     | Both mechanisms wired                       |
| E03-T05 | 404 page                          | ✅     |                                             |
| E03-T06 | Route focus and scroll management | 🔍     | Needs the Tab-after-navigation check        |

## Files

```
src/app/router.tsx                       createBrowserRouter, all route config
src/app/App.tsx                          RouterProvider only
src/components/layout/RootLayout.tsx     skip link, header, main, footer
src/components/layout/ErrorBoundary.tsx  render-phase errors (class component)
src/components/layout/RouteErrorBoundary.tsx  loader / lazy-chunk errors
src/components/layout/ErrorFallback.tsx  shared fallback UI
src/hooks/useRouteFocus.ts
src/pages/{HomePage,ProjectPage,ResumePage,WritingPage,WritingPostPage,NotFoundPage}.tsx
```

## Verified mechanically

**Lazy routes are genuinely split** — checked in the build manifest, not assumed:

```
dist/assets/index-*.js            443.35 kB   entry (home is eager)
dist/assets/ProjectPage-*.js        0.28 kB
dist/assets/ResumePage-*.js         0.25 kB
dist/assets/WritingPage-*.js        0.25 kB
dist/assets/WritingPostPage-*.js    0.28 kB
```

## Still to verify manually (needs a browser)

- [ ] First `Tab` on any route reveals the skip link; activating it moves focus into
      `<main>` and the next `Tab` continues from there.
- [ ] After navigating to any route, the next `Tab` lands **inside** the new page, not
      at the document top.
- [ ] A screen reader announces the new page heading on navigation.
- [ ] A deliberately thrown render error shows the fallback with header, footer, and
      theme intact — and a thrown loader error does too.
- [ ] A production build exposes no stack trace (gated behind `import.meta.env.DEV`).
- [ ] No horizontal scroll on the 404 at 320px.

## Implementation notes

**Two error mechanisms, because they catch different things.** `RouteErrorBoundary`
is the router's `errorElement` and catches loader errors, thrown responses, and
lazy-chunk load failures. `ErrorBoundary` is a React class component catching
render-phase errors the router never sees. A 404-shaped route error renders the
NotFound content rather than the crash fallback — a mistyped URL is not a crash.

**`ErrorBoundary` is the one permitted class component.** React has no hook equivalent
for `componentDidCatch`, so `AGENTS.md` §2's function-components-only rule cannot be
satisfied here. Noted in a comment in the file so it is not read as a violation.

**Lazy loading uses the router's native `lazy:`, not `React.lazy` + `Suspense`.** The
data router resolves the module before rendering, so there is no fallback flash
between routes.

**`useRouteFocus` keys on `pathname` only, never the hash.** Hash navigation is
in-page and belongs to `useHashScroll` (E07); running both would make them fight. It
waits a frame so the new route has painted, falls back to `<main>` when no `h1` is
found so focus is never simply lost, and cancels the pending frame on unmount.

**Known interaction to watch in E07.** `PageTransition` uses `mode="wait"`, which
delays the new route's mount until the old one exits. `useRouteFocus` waits one frame.
These currently coexist, but if E07's anchor focus management is layered on top, verify
the ordering again — it is the exact failure the E06-T03 ticket flags.

## Deviations from the ticket

**No `TODO(E04)` phase.** The ticket sequenced E03 before E04 and told the 404 to
hardcode its links temporarily. E04 was implemented in the same pass, so
`NotFoundPage` reads `NOT_FOUND_LINKS` from `src/data/navigation.ts` directly and no
temporary hardcoding ever existed.

**Named exports, no default exports.** The ticket did not specify. Every page uses a
named export and `lazy:` destructures it, keeping one convention across the codebase.

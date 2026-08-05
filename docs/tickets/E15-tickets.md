# E15 — SEO & Metadata

Implementation tickets for `docs/5-epic-list.md` E15. One ticket, one commit.

The **Global Definition of Done** in `5-epic-list.md` applies to every ticket here and is
not repeated in any of them.

Depends on E03 (`router.tsx`, `RootLayout`, `NotFoundPage`, and the `/writing` stubs),
E04 (`src/constants/site.ts`, which was written in E04 with the comment "Consumed by E15"
— this is that consumption), E10 (`ProjectPage`, `getProjectBySlug`), and E12
(`ResumePage`). All are done and green.

**E14 is deliberately skipped.** `/writing` and `/writing/:slug` are still the E03 stubs.
E15 does not build them and does not wait for them: the `noindex` deliverable keys off
`getPublishedPosts().length`, which is `0` against a stub and against a finished empty
state alike, so T06 is correct now and stays correct when E14 lands. Every place that
depends on E14 carries a `TODO(E14)` marker.

---

## Markers this epic introduces

E15 adds three greppable markers to the two already in the tree (`TODO(content)`,
`INVENTED FIGURE`). Anything unreal or unfinished that E15 ships is findable with:

```
grep -rn "TODO(E14)\|TODO(deploy)\|TODO(content)\|INVENTED FIGURE" src/ docs/ index.html vite.config.ts scripts/
```

| Marker          | Means                                                                   | Cleared by |
| --------------- | ----------------------------------------------------------------------- | ---------- |
| `TODO(E14)`     | Correct against the writing stubs; revisit when real posts exist        | E14        |
| `TODO(deploy)`  | Correct in code, unverifiable until the site is live on its real domain | E18        |
| `TODO(content)` | Placeholder asset or copy, already the repo's convention                | Author     |

---

## Decisions taken before writing these tickets

Six questions were resolved before decomposition. Q1 is the user's; Q2–Q7 were delegated
with the instruction to pick what a senior portfolio would do and mark anything unreal.
All are propagated into the source documents by E15-T01.

| #   | Ambiguity                                                                                                           | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | E14 is unbuilt and E15 sits downstream of it in the dependency graph                                                | **E15 ships against the E03 stubs.** User decision. The graph edge existed so that writing pages would exist before they were marked non-indexable; a stub is a page with no real content, which is exactly the condition `noindex` keys off. Recorded as `TODO(E14)` in the status files, not as a blocked ticket                                                                                                                                                                                        |
| 2   | Image tooling — no image binary is installed, and E09-T08 converted the portrait through a headless browser         | **`sharp` as a devDependency plus `scripts/optimize-images.mjs` and a `yarn images` script.** This is the one dependency E15 adds and `AGENTS.md` §13 requires saying so out loud. It is a devDependency: it never enters the bundle, and the ~200 kB budget is untouched. The browser-canvas route is not repeatable by the author later, and three project screenshots are still missing — the pipeline is what makes adding them a one-command job instead of a ritual                                 |
| 3   | What "slugs validated against stable project IDs" means — no doc specifies a mechanism, and there is no test runner | **One invariant function, called from two places.** `assertValidProjectSlugs()` throws on a duplicate id, a duplicate slug, or a slug that is not lowercase-kebab. It runs at dev-server boot (`import.meta.env.DEV` guard in `projects.ts`). **The build-time call site was withdrawn during implementation: `vite.config.ts` is esbuild-bundled and cannot import `projects.ts` at all, because of its `.webp` imports — see T07 and `E15-status.md` §3.** No test framework is added for one assertion |
| 4   | Canonical, `robots.txt`, `sitemap.xml` — none appears in any source document                                        | **All three ship.** Lighthouse SEO audits `robots.txt` validity directly, so criterion 1 is not reachable without it. The canonical is per-route and set by the metadata utility: an SPA answers every path with the same shell, and a canonical is the only signal that `/projects/x` and `/projects/x?utm_source=…` are one page. The sitemap is a static seven-URL file — a generator for seven URLs is infrastructure the PRD's non-goals rule out                                                    |
| 5   | Twitter card type and handle                                                                                        | **`summary_large_image`, `twitter:creator` and `twitter:site` both `@Shakhlyn`** from `PROFILE.socials.x`. `summary` crops a 1200×630 asset into a square thumbnail; the OG image was authored at that ratio, so the large card is the one that renders what exists                                                                                                                                                                                                                                       |
| 6   | Criterion 2 (LinkedIn/Slack preview) needs a public URL, and `SITE_URL` is an unregistered guess                    | **Deferred to E18 with a named hand-off, not marked passing here.** T02 makes every absolute URL derive from the single `SITE_URL` constant, so the fix at deploy time is one line. The precedent is E08's rail criterion deferred to E09. Marked `TODO(deploy)`                                                                                                                                                                                                                                          |
| 7   | Whether the 404 is `noindex` — §8 names only the writing routes                                                     | **Yes, and it is not optional.** Under the SPA fallback every unknown path answers `200` with the shell, so a crawler that follows a stale link indexes a "Page Not Found" page as a live one. `noindex` is the only status signal available without a server                                                                                                                                                                                                                                             |

**Where E15 and E17 overlap, and who owns what.** The E15 deliverable now reads
"optimised all the images that are used in this project", which reaches into territory
E17 also claims ("images converted to WebP/AVIF with explicit dimensions; below-fold
images lazy-loaded"). The split held here: **E15 owns the bytes** — what format each
asset is, how large the file is, whether it is referenced at all. **E17 keeps the render
behaviour** — `loading="lazy"`, `fetchpriority`, and the LCP measurement. T09 does not
touch a single `<img>` attribute; T10 and E17 do.

---

### E15-T01 — Record the metadata, slug, and image decisions in the source docs

**Depends on:** none

**Files:**

- Modify: `docs/2-architecture.md` — §5 (Project Images, Open Graph Image Handling), §8
  (SEO Strategy)
- Modify: `docs/5-epic-list.md` — E15 deliverables (commit the pending image-scope edit),
  E15 acceptance criterion 2, E18 deliverables
- Modify: `docs/tickets/README.md` — Phase 4 and Phase 5 tables, decision rows 15–20
- Modify: `docs/tickets/STATUS.md` — Phase 4 and Phase 5 roll-up tables

**Commit:** `docs: specify route metadata, slug validation, and the image pipeline`

**Scope**

- In: writing decisions 1–7 above into the source documents; adding the Phase 4/5 tables
  that `STATUS.md` and `README.md` have never had; committing the working-tree edit to
  E15's third deliverable that is currently uncommitted.
- Out: every line of code and every asset. Nothing in `src/`, `public/`, `index.html`, or
  `vite.config.ts` changes in this ticket.

**Implementation notes**

`docs/5-epic-list.md` has an uncommitted one-line edit broadening the image deliverable
from "Optimised OG image committed at `public/og/portfolio-og.png`" to "Optimised all the
images that are used in this project". It ships in this commit rather than riding along
with a code change.

§8's SEO Strategy gains four bullets and no rewrite — canonical per route, `robots.txt`
and `sitemap.xml` as static files, `noindex` on the 404, and the Twitter card type. §8
already says "route-level metadata updates … through a small internal metadata utility
rather than adding a heavy dependency"; that sentence is the contract T04 implements and
must not be reworded.

§5's Project Images section says images should carry "explicit dimensions recorded in
project data" — this stays true, and `ProjectImageType` already enforces it. Add only the
pipeline: `scripts/optimize-images.mjs`, `yarn images`, `sharp` as a devDependency, and
the rule that the OG asset stays PNG or JPEG because LinkedIn's and Slack's crawlers do
not reliably decode WebP.

E15's acceptance criterion 2 gains an explicit hand-off sentence naming E18, per decision 6. Do not delete the criterion — E18's deliverables gain the matching line.

In `STATUS.md`, the Phase 4 table lists **E14 as `TODO` — not started, deliberately
deferred by the author**, with a note that E15 shipped past it. The Phase 5 table lists
E15 with its eleven tickets and E16–E18 as not started.

**Acceptance**

- `git status` shows `docs/5-epic-list.md` clean after the commit.
- `grep -n "canonical" docs/2-architecture.md` returns a line inside §8.
- `docs/tickets/STATUS.md` contains a Phase 4 table whose E14 row reads `TODO`, and a
  Phase 5 table whose E15 row shows `0 / 11`.
- `docs/tickets/README.md` Phase 5 table links `E15-tickets.md` and `E15-status.md`.
- E15 criterion 2 in `5-epic-list.md` names E18 as the verifying epic.
- `yarn format:check` passes (Prettier formats Markdown in this repo).

**Traceability:** `2-architecture.md` §5, §8 · `5-epic-list.md` E15, E18

---

### E15-T02 — Inject the static site metadata into `index.html` at build time

**Depends on:** E15-T01

**Files:**

- Modify: `index.html`
- Modify: `vite.config.ts` — new `siteMetadata()` plugin
- Modify: `src/constants/site.ts` — `SITE_NAME`, `SITE_LOCALE`, `TWITTER_HANDLE`,
  `OG_IMAGE_WIDTH`, `OG_IMAGE_HEIGHT`, `OG_IMAGE_ALT`, `absoluteUrl()`

**Commit:** `feat(seo): inject the site title, description, and social card metadata`

**Scope**

- In: the static default `<title>`, `meta[name=description]`, the full Open Graph set, the
  Twitter card set, and `meta[name=author]`, emitted into `index.html` by a Vite
  `transformIndexHtml` hook that reads `src/constants/site.ts`.
- Out: route-level updates (T04), `noindex` (T06), canonical (T04 — it is per-route, and a
  single static canonical on an SPA shell would claim every route is the home page),
  `robots.txt` and `sitemap.xml` (T03).

**Implementation notes**

**The tags are generated, not hand-written, and the reason is `SITE_URL`.** Open Graph
requires absolute URLs — a relative `og:image` is silently dropped by every crawler that
matters. `SITE_URL` is a placeholder today (`2-architecture.md` §5, and `STATUS.md`
records it as a guess), so the domain will change exactly once, at deploy. Hand-written
tags would put that string in `index.html` four times and in `site.ts` once, and the
deploy-day edit would miss one. The plugin makes `site.ts` the only place it appears.

`src/constants/site.ts` is plain constants with no imports, so `vite.config.ts` can import
it directly — esbuild compiles the config, and no asset or JSX import is pulled in. Verify
this rather than assuming it: if the import ever pulls React in, the config build breaks
loudly, which is the correct failure.

Add to `site.ts`:

```ts
export const SITE_NAME = 'Shaokh Al Mahmud Shakhlyn';
export const SITE_LOCALE = 'en_US';
/** Mirrors PROFILE.socials.x — the handle, not the URL, is what the card wants. */
export const TWITTER_HANDLE = '@Shakhlyn';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = `${SITE_NAME} — software engineer portfolio`;

/** Absolute URL from a site-root path. Every crawler-facing URL goes through here. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();
```

Confirm `OG_IMAGE_WIDTH`/`HEIGHT` against the committed file before writing them
(`public/og/portfolio-og.png` was generated at 1200×630 per `STATUS.md`, but declaring
dimensions the asset does not have is worse than declaring none).

The plugin, in `vite.config.ts`:

```ts
const siteMetadata = (): Plugin => ({
  name: 'portfolio-site-metadata',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => ({
      html,
      tags: [/* one entry per meta tag, injected head-prepend */],
    }),
  },
});
```

Tag set, in this order: `description`, `author`, `og:type` (`website`), `og:site_name`,
`og:title`, `og:description`, `og:url` (`absoluteUrl('/')`), `og:image`
(`absoluteUrl(OG_IMAGE_PATH)`), `og:image:width`, `og:image:height`, `og:image:alt`,
`og:locale`, `twitter:card` (`summary_large_image`), `twitter:site`, `twitter:creator`,
`twitter:title`, `twitter:description`, `twitter:image`. Decision 5 fixes the card type
and handle.

`<title>` stays literal in `index.html` but changes from `Portfolio` to `SITE_TITLE`'s
value, with a comment naming `src/constants/site.ts` as the source and T04's utility as
what overwrites it per route. Injecting `<title>` through the plugin as well is the
tempting symmetry and is wrong: the file would then have no title in the editor, and every
`view-source` reader would think the page has none.

Add a `TODO(deploy)` comment beside `SITE_URL` — it already carries a `TODO(content)`
note; upgrade it so the deploy-blocking grep finds it.

Do not add `theme-color`. The site has two themes and the tag takes one value; a browser
chrome colour that matches the light theme and fights the dark one is worse than the
default.

**Acceptance**

- `yarn build` succeeds and `grep -c 'og:' dist/index.html` returns `10`. **(Corrected
  from `7` during implementation — the tag list in this ticket enumerates ten `og:`
  properties. Arithmetic error in the ticket, not in the code.)**
- `dist/index.html` contains `<meta property="og:image" content="https://shakhlyn.dev/og/portfolio-og.png">`
  — absolute, not `/og/…`.
- `dist/index.html` contains `<meta name="twitter:card" content="summary_large_image">`.
- `dist/index.html` `<title>` is the value of `SITE_TITLE`, not `Portfolio`.
- Changing `SITE_URL` in `src/constants/site.ts` and rebuilding changes the host in
  `og:url`, `og:image`, and `twitter:image` together, with no other edit.
- `yarn dev` serves the same tags — check the served HTML, not the React tree.
- `grep -rn "shakhlyn.dev" index.html vite.config.ts` returns nothing: the domain lives in
  exactly one file.

**Traceability:** `1-prd.md` §5 SEO · `2-architecture.md` §5, §8 · `5-epic-list.md` E15
deliverable 1

**Risk: medium.** A `transformIndexHtml` hook that throws breaks both `yarn dev` and
`yarn build`, and the failure surfaces as a blank page rather than a type error. Verify
against the dev server and the built file separately.

---

### E15-T03 — Add `robots.txt` and `sitemap.xml`

**Depends on:** E15-T02

**Files:**

- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Commit:** `feat(seo): add robots.txt and the route sitemap`

**Scope**

- In: two static crawler files at the site root, listing the four indexable routes.
- Out: the writing routes, which are `noindex` until E14 ships real posts (T06 enforces it
  in the page; this ticket enforces it by omission). Also out: any generator — decision 4.

**Implementation notes**

`robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://shakhlyn.dev/sitemap.xml
```

The `Sitemap:` line must be absolute — the format has no relative form. Carry a
`TODO(deploy)` note in the sitemap file's XML comment rather than in `robots.txt`, which
has no comment syntax crawlers agree on beyond `#` and does not need two.

`sitemap.xml` lists exactly seven URLs (**corrected from "four" during implementation —
the sentence then enumerates seven; the enumeration is right**): `/`, `/projects/:slug`
for each of the five entries
in `PROJECTS` whose slug is not prefixed `placeholder-`, and `/resume`. Confirm the count
against the data when writing it — `projects.ts` currently holds eight entries, three of
them `placeholder-*`, which are development fixtures and must not be advertised to a
crawler. `/writing` is omitted per the scope above; add a `TODO(E14)` XML comment where it
would go.

These are static files under `public/` and are copied verbatim. That is the point: a
`sitemap.xml` generated from `router.tsx` would have to be regenerated on every content
edit, and for six URLs the generator is more moving parts than the thing it generates.

**Acceptance**

- `yarn build && ls dist/robots.txt dist/sitemap.xml` — both present.
- `dist/sitemap.xml` parses as XML: `python3 -c "import
xml.dom.minidom,sys;xml.dom.minidom.parse('dist/sitemap.xml')"` exits 0.
- No `<loc>` in the sitemap contains `placeholder-`.
- No `<loc>` contains `/writing`.
- Every `<loc>` host matches `SITE_URL`.
- Visiting each `<loc>` path in `yarn preview` renders the intended page, not the 404.

**Traceability:** decision 4 · `1-prd.md` §5 SEO · `5-epic-list.md` E15 criterion 1

---

### E15-T04 — Add the route metadata utility and its hook

**Depends on:** E15-T02

**Files:**

- Create: `src/types/metadata.types.ts`
- Create: `src/lib/metadata.ts`
- Create: `src/hooks/useDocumentMetadata.ts`

**Commit:** `feat(seo): add the route metadata utility and useDocumentMetadata`

**Scope**

- In: the mechanism — a pure module that writes title, description, canonical, and robots
  into the document head, plus the hook that applies it for a route's lifetime and
  restores the defaults on unmount.
- Out: every call site (T05) and every `noindex` decision (T06). This ticket ships a
  utility nothing calls yet, on purpose: the restore-on-unmount behaviour is the part that
  breaks, and it is reviewable here in isolation.

**Implementation notes**

`2-architecture.md` §8 requires "a small internal metadata utility … rather than adding a
heavy dependency". No `react-helmet`, no `react-head`. React 19 hoists `<title>` and
`<meta>` rendered anywhere in the tree, which is the tempting zero-code answer — it is not
used here, because it cannot express _removal_: a route that renders no `<meta
name="robots">` does not clear one a previous route rendered, and that is exactly the bug
T06 must not have.

```ts
export interface RouteMetadataType {
  /** Page-specific title. Composed as `${title} — ${SITE_NAME}`, except on home. */
  title: string;
  description: string;
  /** Site-root path, e.g. '/projects/data-slicing'. Made absolute internally. */
  path: string;
  /** Omit for indexable routes. `true` emits `noindex, nofollow`. */
  noindex?: boolean;
}
```

`src/lib/metadata.ts` exports:

- `buildTitle(title: string): string` — returns `SITE_TITLE` unchanged when `title` equals
  `SITE_NAME`, so the home page does not read "Shaokh Al Mahmud Shakhlyn — Shaokh Al
  Mahmud Shakhlyn". Pure, no DOM.
- `applyMetadata(metadata: RouteMetadataType): void` — writes `document.title`, and
  upserts `meta[name=description]`, `link[rel=canonical]`, and `meta[name=robots]`.
- `resetMetadata(): void` — restores `SITE_TITLE` and `SITE_DESCRIPTION`, points the
  canonical at `absoluteUrl('/')`, and **removes** the robots tag entirely.

Upsert, never blind-append: query for the element, create and append to `document.head`
only when absent, then set its content. Appending unconditionally leaves one stale
`description` per navigation and crawlers read the first.

`useDocumentMetadata(metadata: RouteMetadataType): void` is a single `useEffect` whose
dependency array is the four primitive fields — not the object, which is a fresh reference
every render and would rewrite the head on every keystroke in the contact form. Its
cleanup calls `resetMetadata()`. That cleanup is the whole reason the hook exists:
without it, visiting `/writing` and navigating to `/` leaves the home page `noindex`.

Explicit return type `void` on the hook, per `AGENTS.md` §4.

The description is passed through, never truncated. Search engines truncate at display
time and a hard cut here would produce a mid-word ellipsis in a card. Do add a comment
noting the practical 155–160 character target so the copy in T05 is written to fit.

**Acceptance**

- `buildTitle(SITE_NAME)` returns `SITE_TITLE` exactly; `buildTitle('Resume')` returns
  `Resume — Shaokh Al Mahmud Shakhlyn`.
- Calling `applyMetadata` twice in a row leaves exactly one `meta[name=description]` and
  one `link[rel=canonical]` in the head.
- `applyMetadata({ …, noindex: true })` then `resetMetadata()` leaves zero
  `meta[name=robots]` elements — removed, not set to `index`.
- `useDocumentMetadata` returns `undefined` and its effect has a cleanup function.
- `yarn lint` reports no `react-hooks/exhaustive-deps` warning for the hook.
- No new entry in `package.json`.

**Traceability:** `2-architecture.md` §8 (SEO Strategy) · `5-epic-list.md` E15
deliverable 2

**Risk: high.** The cleanup contract is the load-bearing part and the failure mode is
silent — a leaked `noindex` de-indexes the home page and nothing in the UI shows it. T11
verifies it by navigation, not by reading the code.

---

### E15-T05 — Apply route metadata to the home, project, and resume routes

**Depends on:** E15-T04

**Files:**

- Create: `src/data/metadata.ts`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/ProjectPage.tsx`
- Modify: `src/pages/ResumePage.tsx`

**Commit:** `feat(seo): set per-route titles and descriptions on the indexable routes`

**Scope**

- In: the three indexable route types calling `useDocumentMetadata`, with copy from
  `src/data/metadata.ts`.
- Out: `/writing`, `/writing/:slug`, and the 404 — all three are `noindex` cases and
  belong to T06.

**Implementation notes**

Copy lives in `src/data/metadata.ts`, not in the components — `AGENTS.md` §14 and the
Global Definition of Done both require it, and this is page copy a crawler reads.

```ts
export const HOME_METADATA: RouteMetadataType = { … };
export const RESUME_METADATA: RouteMetadataType = { … };
/** Project descriptions come from the project's own summary — never a second copy. */
export const buildProjectMetadata = (project: ProjectType): RouteMetadataType => ({ … });
```

Home's title is `SITE_TITLE`, which already carries the positioning keywords §8 says
belong in `<title>` rather than in the `h1`. Its description is `SITE_DESCRIPTION`. Both
are already written and this ticket does not reword them.

Project metadata derives from `project.title` and `project.summary` — do not author a
second description per project. `2-architecture.md` §8 says "keep project summaries …
rendered as real text", and a description that disagrees with the visible summary is the
kind of thing a crawler penalises and a reviewer notices.

`ProjectPage` renders `<NotFoundPage />` for an unknown slug. **Call the hook before that
early return, not after** — hooks cannot be conditional, and the 404 branch sets its own
metadata in T06 anyway. Pass the resolved metadata or the not-found metadata, chosen
above the return:

```tsx
const project = slug ? getProjectBySlug(slug) : undefined;
useDocumentMetadata(project ? buildProjectMetadata(project) : NOT_FOUND_METADATA);
if (!project) return <NotFoundPage />;
```

`NOT_FOUND_METADATA` is created in T06, so this ticket wires the project branch and T06
completes the other. If T06 has not landed, this ticket may not reference the constant —
sequence them, do not interleave.

Descriptions are written to fit 155–160 characters. Check each one; a description cut at
120 characters in a Google result reads as unfinished.

**Acceptance**

- Loading `/` shows the browser tab title `Shaokh Al Mahmud Shakhlyn — Software Engineer`
  and a `meta[name=description]` matching `SITE_DESCRIPTION`.
- Loading `/resume` shows `Resume — Shaokh Al Mahmud Shakhlyn` and a canonical of
  `https://shakhlyn.dev/resume`.
- Loading `/projects/data-slicing` shows that project's title in the tab and its `summary`
  as the description, with no string duplicated between `projects.ts` and `metadata.ts`.
- Navigating `/` → `/resume` → back leaves the home title restored, and exactly one
  `meta[name=description]` in the head at every step.
- Every description in `metadata.ts` is 120–160 characters.
- No page copy is hardcoded in a `.tsx` file.

**Traceability:** `2-architecture.md` §8 · `AGENTS.md` §14 · `5-epic-list.md` E15
deliverable 2

---

### E15-T06 — Mark the placeholder writing routes and the 404 `noindex`

**Depends on:** E15-T05

**Files:**

- Modify: `src/data/metadata.ts`
- Modify: `src/pages/WritingPage.tsx`
- Modify: `src/pages/WritingPostPage.tsx`
- Modify: `src/pages/NotFoundPage.tsx`

**Commit:** `feat(seo): mark the placeholder writing routes and the 404 noindex`

**Scope**

- In: `noindex` on `/writing` while no published post exists, on `/writing/:slug` for any
  slug without a published post, and unconditionally on the 404.
- Out: building the writing pages. They stay E03 stubs — this ticket adds one hook call to
  each and changes nothing visible.

**Implementation notes**

`2-architecture.md` §8: "Set `noindex` on placeholder-only writing pages and any writing
route without real post content. Allow indexing for writing posts only after real manually
maintained content exists." That is a **condition, not a constant** — the rule is written
so E14 does not have to remember to undo anything:

```tsx
const hasPosts = getPublishedPosts().length > 0;
useDocumentMetadata({ ...WRITING_METADATA, noindex: !hasPosts });
```

`WRITING_POSTS` is empty today, so this evaluates to `noindex` now and flips itself the
day the first post is published. Mark it `TODO(E14)` — not because the code needs
changing, but so the E14 pass can confirm the flip actually happened.

`WritingPostPage` resolves via `getPostBySlug(slug)`. `noindex` is `true` when the post is
missing **or** `published` is false. A missing post also currently renders the slug as the
`h1`, which is an E14 concern and stays out of this ticket — but its metadata must not
claim a title that does not exist, so use `NOT_FOUND_METADATA` in the missing case.

The 404 is `noindex` unconditionally (decision 7). `NotFoundPage` is rendered in two
places — the router's `path: '*'` and `ProjectPage`'s early return — and both must get
the tag, which they do for free because the hook lives inside the component rather than at
either call site. This is why the hook goes in `NotFoundPage`, not in `router.tsx`.

`noindex` emits `noindex, nofollow`. `nofollow` matters on the 404 specifically: its
`NOT_FOUND_LINKS` list points at real routes, and a crawler that treats a soft-404 as a
hub is how a "Page Not Found" title ends up ranking.

**Acceptance**

- `/writing` head contains `<meta name="robots" content="noindex, nofollow">`.
- `/writing/anything` contains the same tag.
- `/does-not-exist` contains the same tag.
- `/projects/not-a-real-slug` contains the same tag — the 404 rendered from inside
  `ProjectPage` is covered, not just the router's catch-all.
- Navigating `/writing` → `/` leaves **zero** `meta[name=robots]` elements in the head.
  This is the leak the whole utility is shaped around; check it explicitly.
- Adding a published entry to `WRITING_POSTS` locally removes the tag from `/writing` with
  no code edit. Revert the entry afterwards.
- `/` and `/resume` never carry a robots tag.

**Traceability:** `2-architecture.md` §8 · `5-epic-list.md` E15 deliverable 5, criterion 4
· E14 acceptance criterion 3

**Risk: high.** Every check here is invisible in the rendered page. A wrong condition
de-indexes the site and the only symptom is traffic that never arrives.

---

### E15-T07 — Validate project slugs against their stable IDs

**Depends on:** E15-T01

**Files:**

- Create: `src/lib/validateProjects.ts`
- Modify: `src/data/projects.ts`
- Modify: `vite.config.ts`

**Commit:** `feat(data): validate project slugs against their stable ids`

**Scope**

- In: one invariant covering id uniqueness, slug uniqueness, and slug shape, enforced at
  dev-server boot and at build.
- Out: changing any existing slug — all eight are already valid lowercase-kebab and match
  their ids. The ticket adds the guard, not a migration.

**Implementation notes**

`project.types.ts` already documents the contract: "Stable identity. Slugs are validated
against this, never derived at runtime." E15 is where that sentence becomes executable.

```ts
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const assertValidProjectSlugs = (projects: readonly ProjectType[]): void => {
  /* throws with the offending id in the message */
};
```

Three checks, each with a message naming the offending entry — an invariant that throws
`Invalid project data` and stops is a worse debugging experience than no invariant:

1. Every `id` is unique.
2. Every `slug` is unique.
3. Every `slug` matches `SLUG_PATTERN`.

Deliberately **not** checked: that `slug === id`. They are equal for all eight entries
today, and enforcing it would collapse the two fields into one — which is the opposite of
what the type comment protects. The id is stable identity; the slug is a URL that may be
rewritten for readability without breaking the data that references it.

Call sites, per decision 3:

- `src/data/projects.ts`, module scope, guarded by `if (import.meta.env.DEV)`. Fails at
  the dev server on the edit that broke it.
- ~~`vite.config.ts`, in the `siteMetadata` plugin's `buildStart`.~~ **Withdrawn during
  implementation — this call site is impossible.** `vite.config.ts` is bundled by esbuild,
  which has no loader for the `.webp` imports at the top of `projects.ts`; importing the
  data there fails config loading outright with
  `[UNRESOLVED_IMPORT] Could not resolve '@/assets/projects/placeholder-recipe-api.webp'`.
  Verified by trying it. T02's plugin imports `src/constants/site.ts`, which is pure
  constants with no asset imports — that is why the pattern works there and not here.

  The build gate is **not** replaced by another mechanism. Eight hand-edited entries, no
  CI, and a dev server that throws on the same edit three seconds earlier make the
  dev-time assert proportionate. Recorded in `E15-status.md` §3.

No test framework is added. `AGENTS.md` §9 — ask whether the platform already solves it —
and a `throw` at dev-server boot does.

**Acceptance** _(revised with the withdrawal above)_

- `yarn dev` boots clean against current data.
- `yarn build` succeeds against current data.
- Temporarily duplicating a slug in `projects.ts` makes `yarn dev` **fail loudly** in the
  browser overlay, with the duplicated slug in the message. Revert.
- Temporarily setting a slug to `Data Slicing` fails the same way, naming the pattern.
  Revert.
- Setting `slug` to a value different from `id` on one project does **not** fail — the two
  fields stay independent by design. Revert.
- `/projects/<each slug in PROJECTS>` renders a case study, not the 404, for all eight.

**Traceability:** `1-prd.md` §5 SEO ("human-readable URLs") · `2-architecture.md` §8 ·
`5-epic-list.md` E15 deliverable 4

---

### E15-T08 — Delete the unused image assets

**Depends on:** E15-T01

**Files:**

- Delete: `src/assets/img.png`
- Delete: `src/assets/portfolio_img.jpg`
- Modify: `src/data/profile.ts` — the comment referencing the deleted original

**Commit:** `chore(assets): remove the unreferenced source images`

**Scope**

- In: removing two image files that nothing imports, and correcting the one comment that
  points at them.
- Out: the assets that are referenced — the portrait and the three project placeholders
  are T09's.

**Implementation notes**

`grep -rn "img.png\|portfolio_img" src/` returns exactly one hit, and it is a prose
comment in `profile.ts` describing `portfolio_img.jpg` as "the uncropped original". Vite
only bundles what is imported, so neither file has ever reached `dist/` — this is 147 kB
of repository weight, not of payload. Removing them is still correct: an asset directory
where two of five files are dead is a directory nobody trusts, and "optimised all the
images that are used in this project" is best served for an unused image by deleting it.

The uncropped portrait original is preserved in git history at commit `cf3abd8`'s parent
and can be recovered with `git show`. Say so in the commit body so the next person looking
for it does not re-upload it.

Rewrite the `profile.ts` comment to record the crop (3:4, 720×960 WebP) and point at git
history rather than at a path that no longer exists. Do not delete the comment — the crop
ratio is the useful part and E09 learned it the hard way.

**Acceptance**

- `ls src/assets/` lists `portrait.webp` and the `projects/` directory only.
- `grep -rn "img.png\|portfolio_img" src/` returns nothing.
- `yarn build` succeeds and the hero portrait still renders on `/`.
- `git log --oneline -1 --stat` shows two deletions and one modification.

**Traceability:** `5-epic-list.md` E15 deliverable 3

---

### E15-T09 — Add the image pipeline and re-encode the shipped assets

**Depends on:** E15-T08

**Files:**

- Create: `scripts/optimize-images.mjs`
- Modify: `package.json` — `sharp` devDependency, `images` script
- Modify: `public/og/portfolio-og.png` (re-encoded)
- Modify: `src/assets/portrait.webp`, `src/assets/projects/*.webp` if the script improves
  them measurably

**Commit:** `perf(assets): add the image optimisation pipeline and re-encode the assets`

**Scope**

- In: a repeatable optimisation command, and running it over every committed image.
- Out: `loading`, `fetchpriority`, and `decoding` attributes on `<img>` elements — those
  are render behaviour and belong to E17, per the overlap note above. Out: authoring a
  real OG image or real project screenshots, which is content the author owns.

**Implementation notes**

This ticket adds **`sharp` as a devDependency** — the only dependency E15 adds, flagged
here because `AGENTS.md` §13 forbids adding one quietly. Justification is decision 2: it
never enters the bundle, and three project screenshots are still outstanding, so the
alternative is repeating E09-T08's headless-browser conversion by hand each time.

`scripts/optimize-images.mjs` walks `src/assets/**` and `public/og/**`, and for each file:

- **WebP sources** are re-encoded at quality 82, `effort: 6`, and written back **only if
  the result is smaller**. An optimiser that grows a file is worse than none.
- **The OG image stays PNG.** `public/og/portfolio-og.png` is re-encoded with
  `compressionLevel: 9` and `palette: true` — it is generated from the design tokens, so
  it is flat colour and quantises without visible loss. Do not convert it to WebP:
  LinkedIn's and Slack's unfurlers do not reliably decode WebP, and criterion 2 is the one
  this asset exists for.
- Dimensions are **never** changed. `portrait.webp` is 720×960 and `ProjectImageType`
  records explicit dimensions per project; a script that silently resizes would desync the
  data from the file and reintroduce the CLS E09 measured away.
- The script prints a before/after byte table and exits non-zero on a read or encode
  failure.

`yarn images` runs it. It is **not** wired into `yarn build`: the outputs are committed,
and a build step that rewrites tracked files makes every CI run dirty.

Run it and commit whatever it actually improves. If it improves nothing, say so in the
commit body and commit only the script — an honest empty result is a valid outcome and
the pipeline still earns its place for the screenshots that are coming.

Verify the OG image is visually unchanged after re-encoding before committing it. A
palette-quantised gradient can band, and this is the one image whose whole job is to look
right at 1200×630 in someone else's feed.

**Acceptance**

- `yarn images` exits 0 and prints a per-file before/after size table.
- Running it twice in a row leaves the second run reporting no change — it is idempotent.
- `public/og/portfolio-og.png` is still a PNG, still 1200×630, and no larger than before.
- `identify`/`sharp` metadata confirms `portrait.webp` is still 720×960.
- `yarn build` succeeds; the portrait and every project card image still render.
- `sharp` appears under `devDependencies`, never `dependencies`.
- The built entry bundle's gzip size is unchanged from the pre-ticket figure.

**Traceability:** `5-epic-list.md` E15 deliverable 3 · `2-architecture.md` §5 (Project
Images, Open Graph Image Handling) · `AGENTS.md` §9, §13

**Risk: medium.** `sharp` ships platform-specific native binaries; a lockfile resolved
here may not install on the deploy host. Confirm `yarn install --immutable` succeeds and
note the platform in the commit body, so E18 is not surprised.

---

### E15-T10 — Audit the heading hierarchy across all five page types

**Depends on:** E15-T06

**Files:**

- Modify: whichever page or section components the audit finds wrong — expected to be
  none or few
- Create: nothing

**Commit:** `fix(a11y): correct the heading levels the outline audit found`

**Scope**

- In: verifying every page type against `2-architecture.md` §8's Structured Heading Plan,
  and fixing what disagrees.
- Out: adding headings §8 explicitly excludes. **Skills has no `h3` level and the resume
  preview has no heading — both are decisions with reasons written into §8, and both look
  exactly like the omission an audit would "fix".** They are not oversights. Do not add
  them.

**Implementation notes**

Five outlines to check, all specified in §8: home, project, resume, writing, writing post,
and not-found. Home is `h1` name → `h2` Current Role, Projects, About, Skills, Contact,
with `h3` Professional/Personal under Projects and `h4` project titles under those.

The check is mechanical and should be run as one, not read for:

```js
[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => [
  h.tagName,
  h.textContent.trim(),
]);
```

Then assert per page: exactly one `h1`, and no jump greater than one level between
consecutive headings. A jump _down_ by more than one (`h2` → `h4`) is the failure;
returning from `h4` to `h2` is not.

Run it against a **production build** (`yarn preview`), not the dev server, and on each of
`/`, `/projects/data-slicing`, `/projects/meal-management-system` (which has no `liveUrl`
and so may omit the `Links` `h2` — §8 says that variance is intended, not a defect),
`/resume`, `/writing`, `/writing/some-slug`, and `/nope`.

The writing stubs render a single `h1` and nothing else, which passes trivially. Note this
in the commit body as `TODO(E14)` rather than treating it as verified coverage of a page
that does not exist yet.

If the audit finds nothing, this ticket commits nothing and is closed in the status file
with the evidence. A ticket that finds no defect is a result, not a failure — record the
per-page outline dumps in `E15-status.md` so the claim is checkable.

**Acceptance**

- Every page type has exactly one `h1`.
- No page skips a heading level downward.
- Home's outline matches §8's plan exactly, including `h3` Professional/Personal.
- `SkillsSection` still renders zero `h3` elements — its groups are
  `ul[role=list][aria-labelledby]`, per §8 and `3-style-preference.md` §6.6.
- `ResumeViewer` still has no heading and still carries its `aria-label`.
- `yarn lint` reports zero `jsx-a11y` errors.
- The outline for each of the seven URLs above is pasted into `E15-status.md`.

**Traceability:** `2-architecture.md` §8 (Structured Heading Plan) · `1-prd.md` §5 SEO ·
`5-epic-list.md` E15 criterion 3

---

### E15-T11 — Verify Lighthouse SEO and record E15 status

**Depends on:** E15-T03, E15-T05, E15-T06, E15-T07, E15-T09, E15-T10

**Files:**

- Create: `docs/tickets/E15-status.md`
- Modify: `docs/tickets/STATUS.md` — Phase 5 counts
- Modify: `docs/tickets/README.md` — E15 row

**Commit:** `docs(tickets): record E15 status`

**Scope**

- In: running Lighthouse SEO against a production build, verifying the social card markup
  with the tooling available locally, and writing the status file.
- Out: verifying the LinkedIn and Slack previews themselves — decision 6 defers that to
  E18, and the status file must say so rather than claiming a pass.

**Implementation notes**

Run against `yarn preview`, not `yarn dev`: the dev server serves an untransformed
`index.html` for some plugin orderings and does not serve `dist/robots.txt` the same way.

Lighthouse SEO on `/` and on one project route. The category's checks that E15 owns:
document has a title, has a meta description, has a valid `robots.txt`, links are
crawlable, `hreflang`/canonical valid, page is not blocked from indexing. Record the score
and the failing audits verbatim — a number with no audit list is not evidence.

Verify `/writing` scores its `noindex` **as intended**: Lighthouse reports "Page is
blocked from indexing" as a _failure_ there, and that failure is the correct result. The
status file must say this explicitly, or the next reader will fix it.

The social card markup is checkable locally without a public URL by parsing
`dist/index.html` and asserting the required OG properties are present and absolute.
That is the most that can be proven here; the actual unfurl needs a live host.

`E15-status.md` follows the E12/E13 shape: gates, what shipped per ticket, defects found,
and a numbered list of criteria that are **not** verified with the reason. It must carry:

- Criterion 2 (LinkedIn/Slack preview) — deferred to E18, `TODO(deploy)`, with the exact
  check to run once the domain resolves.
- `SITE_URL` is still an unregistered guess, and every absolute URL in `dist/` is
  therefore wrong until E18. One constant fixes it.
- The OG image is still the generated placeholder — `TODO(content)`, and a launch blocker
  under `1-prd.md` §6.
- E14 is not built; `/writing` coverage here is coverage of a stub. `TODO(E14)`.

**Acceptance**

- Lighthouse SEO **95+** on `/` and on `/projects/data-slicing`, with the audit list
  recorded.
- `dist/index.html` contains `og:title`, `og:description`, `og:image`, `og:url`,
  `twitter:card`, and every URL among them is absolute.
- `docs/tickets/E15-status.md` exists and lists all eleven tickets.
- `STATUS.md` Phase 5 shows E15 at `11 / 11` with the deferred criterion counted as
  deferred, not done.
- `STATUS.md` Phase 4 still shows E14 as `TODO`.
- The four markers grep clean of anything unaccounted for:
  `grep -rn "TODO(E14)\|TODO(deploy)" src/ docs/ public/` returns only entries this file
  predicts.

**Traceability:** `5-epic-list.md` E15 criteria 1–2 · `docs/tickets/README.md` conventions

---

## Coverage

Every E15 acceptance criterion, mapped to the tickets that satisfy it.

| E15 acceptance criterion                     | Tickets                           |
| -------------------------------------------- | --------------------------------- |
| Lighthouse SEO 95+                           | T02, T03, T05, T10, **T11**       |
| Link preview renders in LinkedIn and Slack   | T02, T09, **T11** (→ E18, dec. 6) |
| One `h1` per page; heading levels never skip | **T10**                           |
| No empty placeholder page is indexable       | T03, T04, **T06**                 |

Every E15 deliverable, likewise.

| E15 deliverable                                    | Tickets               |
| -------------------------------------------------- | --------------------- |
| Static title, description, OG and Twitter metadata | T02                   |
| Internal route metadata utility                    | T04, T05              |
| Optimised images                                   | T08, T09              |
| Human-readable slugs validated against stable IDs  | T07                   |
| `noindex` where `2-architecture.md` §8 requires it | T06 (T03 by omission) |

T01 covers no criterion — it is the documentation commit that makes the other ten
legible, per the E12 and E13 precedent.

## High-risk tickets

| Ticket | Why                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| T04    | The cleanup contract is load-bearing and its failure is invisible: a leaked `noindex` de-indexes the home page with no UI symptom       |
| T06    | Every check is head-only. A wrong condition either de-indexes a real page or indexes an empty one, and neither shows up in a screenshot |
| T02    | A throwing `transformIndexHtml` hook breaks dev and build as a blank page, not a type error                                             |
| T09    | `sharp` ships native binaries; a lockfile that installs here may not install on the deploy host                                         |

## Deferred out of E15

| Item                                     | Owner  | Marker          |
| ---------------------------------------- | ------ | --------------- |
| LinkedIn and Slack preview verification  | E18    | `TODO(deploy)`  |
| `SITE_URL` set to the registered domain  | E18    | `TODO(deploy)`  |
| Real OG image replacing the placeholder  | Author | `TODO(content)` |
| Writing pages themselves                 | E14    | `TODO(E14)`     |
| `loading`/`fetchpriority` on images, LCP | E17    | —               |

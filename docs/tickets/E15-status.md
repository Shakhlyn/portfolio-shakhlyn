# E15 — SEO & Metadata · Status

Per-ticket detail for [E15-tickets.md](E15-tickets.md). Roll-up in [STATUS.md](STATUS.md).

Last updated: **2026-08-05**

## 1. Gates

All four pass on the current tree:

```
yarn typecheck    ✅ exit 0
yarn lint         ✅ zero errors, zero warnings
yarn format:check ✅ All matched files use Prettier code style
yarn build        ✅ succeeds
```

**`yarn tsc --noEmit` was also run and is not a gate.** The root `tsconfig.json` is a
solution file with `"files": []`, so bare `tsc --noEmit` compiles nothing and exits 0
unconditionally. `yarn typecheck` (`tsc -b --noEmit`) is the one that types. This was
found in E09 and is repeated here because the instruction to run the bare form recurs.

Build output after E15:

| Chunk                      | Raw       | Gzip      |
| -------------------------- | --------- | --------- |
| `index-*.js` (entry)       | 359.20 kB | 114.87 kB |
| `chunk-62JRHF6Z-*.js`      | 90.38 kB  | 29.95 kB  |
| `useDocumentMetadata-*.js` | 38.30 kB  | 13.02 kB  |
| `index-*.css`              | 34.51 kB  | 7.03 kB   |
| four lazy route chunks     | ≤ 3.10 kB | ≤ 1.17 kB |

## 2. What shipped, per ticket

| #   | Ticket                                   | State | Note                                                        |
| --- | ---------------------------------------- | ----- | ----------------------------------------------------------- |
| T01 | Record the decisions in the source docs  | ✅    | Decisions 1–7 into §5, §8, `5-epic-list.md`, README, STATUS |
| T02 | Static site metadata into `index.html`   | ✅    | Build-time `transformIndexHtml` plugin, one `SITE_URL`      |
| T03 | `robots.txt` + `sitemap.xml`             | ✅    | 7 URLs, 3 `placeholder-*` projects excluded                 |
| T04 | Metadata utility + `useDocumentMetadata` | ✅    | Apply on mount, reset on unmount                            |
| T05 | Route metadata on the indexable routes   | ✅    | Home, resume, project, writing post                         |
| T06 | `noindex` on `/writing` and the 404      | ✅    | Keys off `getPublishedPosts().length`                       |
| T07 | Slug validation                          | ✅\*  | Build-time call site withdrawn as impossible — see §3       |
| T08 | Delete the unused assets                 | ✅    | 147 kB of untracked-by-any-import weight removed            |
| T09 | Image pipeline                           | ✅    | 39,293 bytes saved; one defect found and fixed — see §3     |
| T10 | Heading-hierarchy audit                  | ✅    | No code defect; two §8 amendments — see §3.3, §3.4          |
| T11 | Lighthouse SEO + this file               | ✅    | 100 on `/` and on `/projects/data-slicing`                  |

## 3. Defects and spec corrections found while implementing

Five, and **only one is a code defect** (3.2). Two are E15's own ticket file being wrong
about itself, and two are earlier epics' heading decisions that never made it back into
`2-architecture.md` §8. The pattern is the one E12 hit: a criterion written from the same
sentence as the design cannot contradict the design, so arithmetic and feasibility only get
checked by running it.

### 3.1 T07's specified build-time call site is impossible — withdrawn, not substituted

Decision 3 specified `assertValidProjectSlugs()` running twice: at dev-server boot, and in
the Vite plugin's `buildStart` so `yarn build` fails on bad data. The second one cannot
exist. `vite.config.ts` is bundled by **esbuild**, which has no loader for the `.webp`
imports at the top of `projects.ts`. Verified by adding the import and building:

```
src/data/projects.ts (1:412) [UNRESOLVED_IMPORT]
  Could not resolve '@/assets/projects/placeholder-recipe-api.webp'
  failed to load config from vite.config.ts
```

T02's plugin imports `src/constants/site.ts` and works precisely because that module is
pure constants — no asset imports, no JSX, no browser globals. Its file comment now says
so, so the next person does not repeat this.

**No replacement mechanism was invented.** Eight hand-edited entries, no CI wired up, and
a dev server that throws on the same edit three seconds earlier make the dev-time assert
proportionate to the risk. If CI ever exists, the natural home is a `node --import tsx`
check there, not a config-load hack.

Verified in a real browser against `yarn dev`, since the assert now runs in the client
module graph rather than in Node:

| Temporary edit                      | Result                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `data-slicing` → `bhoganti-web-app` | `Error: Duplicate project slug: "bhoganti-web-app" (src/data/projects.ts)`, `#root` empty       |
| `data-slicing` → `Data Slicing`     | `Error: Project slug "Data Slicing" (id "data-slicing") is not lowercase-kebab.`, `#root` empty |
| `data-slicing` → `data-slicing-v2`  | Page renders, no error — `slug ≠ id` stays legal by design                                      |

All three reverted; `git diff src/data/projects.ts` shows only T07's 15-line addition.

### 3.2 T09's image pipeline was not idempotent — fixed with a hash manifest

The first implementation re-encoded every file on every run and wrote back "only if
smaller". WebP and JPEG are **lossy**: re-encoding an already-encoded file produces a
different, slightly smaller, slightly worse file every time, so "only if smaller" does not
prevent the loop — it feeds it. The second run rewrote four of the five images:

```
portrait.webp   36714 → 32224 (run 1) → 30912 (run 2) → …
```

Fixed by committing `scripts/image-manifest.json`, a map of output path → sha256. A file
whose hash is already in the manifest is this script's own output and is skipped. Change
the source image or the encoder settings and the hash stops matching, so it is picked up
again. Second run now reports `0 bytes saved` and rewrites nothing.

### 3.3 §8's home heading outline was missing two `h3`s that have shipped since E09

The T10 audit found the home page renders two headings §8's plan does not list:

- `h3: Software Engineer · Penta Global Limited` under `h2: Current Role`
  (`CurrentRoleSection.tsx:42`, shipped by E09)
- `h3: Or reach me directly` under `h2: Contact` (`ContactSection.tsx:42`, shipped by E13)

**The plan was amended; the headings were not deleted.** Each labels a real subsection —
the role card's title, and the direct-links block beside the form — so removing them would
strip two accessible names to satisfy an outline written before either section existed.
Neither introduces a level skip, and the home page still has exactly one `h1`. Recorded in
`2-architecture.md` §8 with the reason.

### 3.4 §8 still listed a resume `h2: Download` that E12 deliberately removed

The audit found `/resume` renders one `h1` and nothing else. `ResumePage.tsx` explains why
— both actions share a single row beneath the preview, so a heading over one button is an
outline entry for nothing — but E12 never carried that back into §8, which still specified
the `h2`. §8 is corrected to match the shipped page, with the reasoning attached. **No code
changed**; adding the heading back would undo an E12 decision from inside E15, which the
scope forbids.

Two of the three §8 amendments in this epic (3.3 and 3.4) are the same failure: a section
epic made a well-reasoned heading decision, wrote it into a component comment, and left the
architecture doc stating the opposite. A heading audit is the only thing that finds that.

### 3.5 Two arithmetic errors in E15's own acceptance criteria

| Ticket | Said                                                           | Correct | Fixed in                       |
| ------ | -------------------------------------------------------------- | ------- | ------------------------------ |
| T02    | `grep -c 'og:' dist/index.html` returns `7`                    | `10`    | The ticket enumerates ten tags |
| T03    | "`sitemap.xml` lists exactly four URLs", then enumerates seven | `7`     | The enumeration was right      |

Both corrected in `E15-tickets.md` in place, with the correction visible rather than
silently overwritten.

## 4. Verification evidence

### 4.1 Lighthouse SEO — production build via `yarn preview`, headless Chrome

**`/` — 100.** `is-crawlable`, `document-title`, `meta-description`, `http-status-code`,
`link-text`, `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`, `canonical` — all
pass, no failures.

**`/projects/data-slicing` — 100.** Same list minus `image-alt` (not applicable — the case
study renders no `<img>`), no failures.

**`/writing` — 66, and that is the correct result.** The one failing audit is
`is-crawlable — Page is blocked from indexing`. That failure **is** E15 criterion 4
passing: `/writing` is an empty placeholder and must not be indexed. Do not "fix" this.
It flips to a pass in E14, when `getPublishedPosts()` returns a real post and the
`noindex` lifts on its own — no code change is needed for that.

### 4.2 Heading outlines — all seven URLs, production build

```
/                              h1 Shaokh Al Mahmud Shakhlyn
                               h2 Current Role · h3 Software Engineer · Penta Global Limited
                               h2 Projects
                                 h3 Professional · h4 ×4
                                 h3 Personal     · h4 ×4
                               h2 About · h2 Skills
                               h2 Contact · h3 Or reach me directly
/projects/data-slicing         h1 Data Slicing · h2 Problem, Approach, Stack, Outcome
/projects/meal-management-system  h1 Meal Management System · h2 Problem, Approach, Stack, Outcome
                               (no `Links` h2 — it has neither URL; §8 says that variance is intended)
/resume                        h1 Resume            (viewer: aria-label="Resume preview", 0 headings)
/writing                       h1 Writing           TODO(E14) — a stub, not coverage of a real page
/writing/some-slug             h1 some-slug         TODO(E14) — renders the raw slug; rendering is E14's
/nope                          h1 Page Not Found
```

Exactly one `h1` on every one. No downward level skip on any. `#skills h3` count is **0**,
as §8 and `3-style-preference.md` §6.6 require.

`/resume` renders **one `h1` and no `h2`**. §8 listed `h2: Download`; E12 dropped it
deliberately — both actions share one row beneath the preview, so there is no second block
for a heading to introduce — and recorded the reason at the top of `ResumePage.tsx` without
amending §8. §8 is now corrected to match the code. See §3.4.

### 4.3 Head state per route — the metadata utility applying and resetting

| Route                    | `<title>`                                     | `robots`            | `canonical`                                  |
| ------------------------ | --------------------------------------------- | ------------------- | -------------------------------------------- |
| `/`                      | Shaokh Al Mahmud Shakhlyn — Software Engineer | _(absent)_          | `https://shakhlyn.dev/`                      |
| `/projects/data-slicing` | Data Slicing — Shaokh Al Mahmud Shakhlyn      | _(absent)_          | `https://shakhlyn.dev/projects/data-slicing` |
| `/resume`                | Resume — Shaokh Al Mahmud Shakhlyn            | _(absent)_          | `https://shakhlyn.dev/resume`                |
| `/writing`               | Writing — Shaokh Al Mahmud Shakhlyn           | `noindex, nofollow` | `https://shakhlyn.dev/writing`               |
| `/writing/some-slug`     | Page Not Found — Shaokh Al Mahmud Shakhlyn    | `noindex, nofollow` | `https://shakhlyn.dev/404`                   |
| `/nope`                  | Page Not Found — Shaokh Al Mahmud Shakhlyn    | `noindex, nofollow` | `https://shakhlyn.dev/404`                   |

**Exactly one** `meta[name=description]`, one `link[rel=canonical]`, and at most one
`meta[name=robots]` on every route — the utility upserts and removes, it never appends.
`robots` being **absent** rather than `index, follow` on the four indexable routes is the
point of `resetMetadata()`: a leaked `noindex` would silently deindex the site.

This is why React 19's native `<title>`/`<meta>` hoisting was rejected for this: it can
render a tag, but it cannot express _removal_.

### 4.4 Social card markup in `dist/index.html`

Ten `og:` properties and six `twitter:` properties, injected at build time. Every URL among
them is absolute: `og:url = https://shakhlyn.dev/`,
`og:image = https://shakhlyn.dev/og/portfolio-og.png`. `twitter:card = summary_large_image`.
`og:image:width/height = 1200/630`, matching the committed asset.

### 4.5 Images

| File                                       | Before | After  | Dimensions | Format          |
| ------------------------------------------ | ------ | ------ | ---------- | --------------- |
| `public/og/portfolio-og.png`               | 56,604 | 22,301 | 1200×630   | PNG (unchanged) |
| `src/assets/portrait.webp`                 | 36,714 | 32,224 | 720×960    | WebP            |
| `.../placeholder-recipe-api.webp`          | 6,694  | 6,546  | 1280×720   | WebP            |
| `.../placeholder-reporting-dashboard.webp` | 7,920  | 7,792  | 1280×720   | WebP            |
| `.../placeholder-task-runner.webp`         | 6,956  | 6,732  | 1280×720   | WebP            |

**39,293 bytes saved, no dimension changed, no format changed.** The OG image was
pixel-diffed against its pre-encode self: mean channel delta **0.031**, max **28** at
antialiased glyph edges only. No banding — checked visually, not inferred.

Entry bundle gzip is **114.87 kB before and after T09**, measured by building with the
images stashed and again with them applied. Images are emitted as separate assets and
never enter a JS chunk.

`sharp@0.35.3` is in **`devDependencies`**. `yarn install --immutable` succeeds on
`linux-x64` — the platform is recorded here because sharp ships native binaries and a
lockfile resolved on one platform is E18's classic install failure.

## 5. Not verified here — and why

Numbered so E18 can close them by number.

1. **E15 criterion 2 — the LinkedIn and Slack link preview.** `TODO(deploy)`. An unfurler
   needs a public URL and `SITE_URL` is `https://shakhlyn.dev`, which is **not
   registered**. What is proven here is the markup: present, complete, and absolute in
   `dist/index.html` (§4.4). **The check to run at E18:** paste the production URL into
   LinkedIn's Post Inspector and into a Slack DM; confirm a large-image card with the
   title, the description, and the 1200×630 image. Re-fetch through the Post Inspector
   after any OG change — both services cache hard.
2. **`SITE_URL` is still a guess, so every absolute URL in `dist/` is currently wrong** —
   `og:url`, `og:image`, all seven `<loc>` entries, the `Sitemap:` line, and every
   canonical. All of them derive from that one constant, so E18 is a one-line change
   plus a rewrite of `public/sitemap.xml`'s host.
3. **The OG image is the generated placeholder**, not a designed asset. `TODO(content)`,
   and a launch blocker under `1-prd.md` §6. It is correctly sized and encoded; it is not
   final.
4. **E14 is not built.** `/writing` and `/writing/:slug` coverage above is coverage of
   **stubs**. `TODO(E14)`. When real posts land: `/writing`'s `noindex` lifts on its own
   (it keys off `getPublishedPosts().length`), the post page stops rendering the raw slug
   as its `h1`, and both routes go into `sitemap.xml`.
5. **Lighthouse was run headless on this machine**, not on the deployed site. E18's
   criterion is confirmation against production.

Markers left behind, all accounted for above:

```
grep -rn "TODO(E14)\|TODO(deploy)" src/ docs/ public/
```

## 6. Note for whoever reads `profile.ts` next

T08 deleted `src/assets/img.png` and `src/assets/portfolio_img.jpg` — 147 kB that no
module imported and that therefore never reached `dist/`. T08's own acceptance said
`grep -rn "img.png\|portfolio_img" src/` should return nothing; it returns **one** hit, in
`profile.ts`:

```
git show 528ecb3:src/assets/portfolio_img.jpg
```

That is a deliberate recovery pointer to the uncropped 960×960 original, added so deleting
it is reversible without archaeology (verified: 101,793 bytes retrievable). It is a better
outcome than the criterion asked for, recorded here rather than silently passed.

# E04 — Content Data Layer & Types

**Goal:** All site content lives in typed constants, so every later epic renders from
data on day one and never hardcodes copy it will have to tear out.

**Depends on:** E02. Independent of E03, E05, E06.

> **Content gate.** This epic is blocked on real content for: candidate name, target
> role, contact links, project names and descriptions, skills, and the resume file.
> `1-prd.md` §6 lists these as **not acceptable** as launch placeholders. Draft copy is
> fine to start; launch is not. Placeholders are permitted only for the items §6
> explicitly allows: project screenshots, OG image, draft resume PDF, unfinished bio
> polish, and unfinalised outcome metrics — and each must carry a `TODO(content)`
> comment so they are findable before launch.
>
> **Never fabricate** achievements, metrics, employers, job titles, or credentials
> (`AGENTS.md` §13, `1-prd.md` §6). An empty field is recoverable; an invented one is
> not.

**Traceability:** `1-prd.md` §6 · `2-architecture.md` §5 · `AGENTS.md` §3, §4 ·
`5-epic-list.md` E04

---

## [ ] E04-T01 — Shared types

**Files:** `src/types/profile.types.ts`, `project.types.ts`, `skill.types.ts`,
`resume.types.ts`, `current-role.types.ts`, `writing.types.ts` (all new)

Types kebab-case per `AGENTS.md` §5. Types before data — the type is the contract the
data has to satisfy, and writing the data first means the type gets bent to fit whatever
was typed.

**Scope**

- `ProfileType` — name, role framing, value proposition, current position, social links,
  and an **optional `portrait`** (`{ src, width, height, alt }`). Its presence selects
  the hero layout (`4-interaction-design.md` §5.1) — this one field is the entire
  layout switch, so it must be genuinely optional, not `string | ''`.
- `ProjectType` — id, slug, title, summary, `category: 'professional' | 'personal'`,
  problem, role, approach, stack, outcome, tags, and **optional** `githubUrl`,
  `liveUrl`, `caseStudySlug`, `image`.
- `SkillGroupType` — group label + skill list.
- `ResumeType` — file path, label, file type, file size.
- `CurrentRoleType` — role, company, date range, scope bullets, stack.
- `WritingPostType` — slug, title, date, summary, body, and a published flag.
- `NavItemType` — label, target, and a discriminator distinguishing anchors from routes
  (`4-interaction-design.md` §1). A discriminated union, not `isAnchor?: boolean`
  (`AGENTS.md` §4).
- `interface` for object shapes, `type` for unions. No `any`, no `unknown` without
  narrowing.

**Acceptance**

- [ ] Optional link fields are genuinely optional — "no live demo" is representable
      without an empty string. This is what makes the no-dead-links rule enforceable at
      the type level rather than by discipline.
- [ ] `category` is a literal union, not `string`.
- [ ] `NavItemType` makes an anchor-with-a-route-target unrepresentable.
- [ ] No `any` anywhere; `yarn typecheck` clean.

**Commit:** `feat: add shared content types`

---

## [ ] E04-T02 — `profile.ts` and `navigation.ts`

**Files:** `src/data/profile.ts`, `src/data/navigation.ts` (new),
`src/pages/NotFoundPage.tsx`

**Scope**

- `profile.ts`: real name, role framing, value proposition (two lines max), current
  position, and the four social links — GitHub, LinkedIn, Email, X
  (`2-architecture.md` §9).
- **Omit `portrait` entirely** for now. Text-only is the launch default
  (`1-prd.md` §6); adding the field later is the whole hero-layout switch.
- Links a person does not have are **omitted**, not set to `''` or `'#'`. Rendering is
  conditional on presence (`2-architecture.md` §11).
- `navigation.ts`: the six items from `4-interaction-design.md` §1 in **scroll order** —
  Home (`#home`), Projects (`#projects`), About (`#about`), Blog (`/writing`), Contact
  (`#contact`), Resume (`/resume`). Nav order must mirror DOM order or the scroll spy
  appears to jump backwards.
- Replace the `TODO(E04)` hardcoded links in `NotFoundPage` with these.
- Exported as `const` with the type annotation. Consider `as const satisfies ProfileType`
  so literal types survive for consumers.

**Acceptance**

- [ ] **Nav targets exist in exactly one place.** Grep for `'#projects'` and `'/writing'`
      — each appears once outside this file.
- [ ] No fabricated content; every value is real or absent.
- [ ] No empty-string or `'#'` link values anywhere.
- [ ] `NotFoundPage` has no remaining `TODO(E04)`.

**Commit:** `feat: add profile and navigation data`

---

## [ ] E04-T03 — `projects.ts`

**Files:** `src/data/projects.ts` (new)

**Scope**

- **Minimum three strong projects** at launch (`1-prd.md` §6). Preferred mix: one
  full-stack app, one AI/LLM/automation project, one polished frontend.
- Each carries every required field from `1-prd.md` §3: name, one-line summary, problem,
  the candidate's role, approach, stack, outcome or learning, plus at least one credible
  link.
- `category` splits them into the Professional and Personal subsections. This is
  **grouping, not filtering** — no filter controls exist (`2-architecture.md` §12).
- Ordered by relevance to full-stack / AI roles, most relevant first. Array order is the
  render order; there is no sort at render time.
- Slugs are human-readable and derived from stable ids (`2-architecture.md` §11,
  `1-prd.md` §5 SEO). Do not slugify the title at runtime — a title edit would silently
  break a shared URL.
- Image fields omitted until real screenshots exist. `3-style-preference.md` §6.4: **if
  a project has no image, the frame is omitted entirely** — no grey placeholder box
  ships. Do not invent a placeholder path.
- Outcomes may be honest placeholders if metrics are unfinalised (`1-prd.md` §6), marked
  `TODO(content)`. They may **not** be invented numbers.

**Acceptance**

- [ ] At least three projects, each with every required field populated.
- [ ] Every slug unique, human-readable, and stable.
- [ ] Both categories represented, or the empty one is genuinely empty (E10 hides an
      empty subsection).
- [ ] No dead, placeholder, or `#` links.
- [ ] **Adding a fourth project requires touching no component file.**

**Commit:** `feat: add projects data`

---

## [ ] E04-T04 — `skills.ts` and `currentRole.ts`

**Files:** `src/data/skills.ts`, `src/data/currentRole.ts` (new)

**Scope**

- `skills.ts` grouped by capability per `1-prd.md` §3: Frontend, Backend, AI/LLM,
  Data/databases, Infrastructure/deployment, Engineering practices.
- **No proficiency levels, percentages, or star ratings** — the type must not even have
  a field for them. They are unverifiable and read as filler
  (`3-style-preference.md` §6.6). Omitting the field is what prevents them appearing
  later.
- Skills reflect actual experience. Avoid overclaiming (`1-prd.md` §3) — a hiring
  manager who probes an overclaimed skill in an interview has learned something worse
  than a shorter list.
- A group with no skills is omitted from the array rather than included empty.
- `currentRole.ts`: role, company, date range, two-to-four scope bullets, and the stack
  in active use (`3-style-preference.md` §6.3). Real employer and title only.

**Acceptance**

- [ ] Groups match the `1-prd.md` §3 capability list.
- [ ] No proficiency field exists on the type.
- [ ] No empty groups in the array.
- [ ] Current role is real, with no fabricated scope or metrics.

**Commit:** `feat: add skills and current role data`

---

## [ ] E04-T05 — `resume.ts`, `writing.ts`, and shared constants

**Files:** `src/data/resume.ts`, `src/data/writing.ts`, `src/constants/site.ts` (new),
`public/resume/` (draft PDF)

**Scope**

- `resume.ts`: **one** stable path — `/resume/shakhlyn-resume.pdf`
  (`2-architecture.md` §5) — plus label, file type, and file size. That single constant
  is consumed by the hero CTA, the nav button, the `#resume` section, and `/resume`.
  Four hardcoded copies of a path is four chances for one of them to rot.
- File size is displayed before the user commits to a download
  (`5-epic-list.md` E12 acceptance), so it belongs in the data, not computed at runtime.
- Commit a clearly marked **draft** PDF at that path. `1-prd.md` §6 permits a draft
  during development; a missing file makes E12 untestable.
- `writing.ts`: an empty-but-typed post array is correct and honest. **No fake "coming
  soon" posts** (`3-style-preference.md` §6.9).
- `src/constants/site.ts` in `SCREAMING_SNAKE_CASE` (`AGENTS.md` §3): site URL, site
  title, meta description, OG image path, and the scroll-spy timings E07 needs
  (`NAV_CLICK_SUPPRESS_MS = 700`, `SCROLL_SPY_ROOT_MARGIN`). Values from
  `4-interaction-design.md` §3.

**Acceptance**

- [ ] **The resume path is defined once** — grep confirms one literal occurrence.
- [ ] The draft PDF exists at that exact path and loads in the browser.
- [ ] `writing.ts` exports a typed empty array, not `undefined` and not fake posts.
- [ ] Constants are `SCREAMING_SNAKE_CASE`; no magic numbers left for E07 to invent.
- [ ] The draft resume is marked `TODO(content)` so it is not shipped by accident.

**Commit:** `feat: add resume, writing, and site constants`

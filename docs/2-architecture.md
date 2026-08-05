# Personal Portfolio Website Architecture

## 1. Architecture Overview

### Decision

The v1 portfolio will use the locked repository stack: Vite, React 18+, TypeScript, React Router data router, Tailwind CSS, and Motion from `motion/react`.

The site will be a static SPA deployed to Netlify. It will have no backend application server. Contact submission will POST to FormSubmit (§9), with direct email, LinkedIn, GitHub, and Twitter/X links available as alternate contact paths.

### Deployment Shape

- Static build output from Vite.
- Hosted on Netlify.
- Netlify preview deployments enabled for pull requests.
- Netlify SPA fallback configured so client routes resolve correctly.
- FormSubmit used for the contact form submission endpoint, so the form does not depend on the host (§9).
- No analytics in v1.
- No GitHub Actions CI in v1.
- Writing routes included in v1 with placeholder-safe content when no posts exist.

### Requirements Traceability

- The SPA decision follows the explicit project stack in `AGENTS.md` and the user's rendering answer.
- The no-backend shape traces to PRD Out of Scope: "Backend application server" and "Complex contact form backend unless explicitly approved."
- FormSubmit traces to PRD Contact module: optional form only if reliable loading, success, and error states are implemented.
- Netlify deployment and PR previews support PRD Non-Functional Requirements: Reliability and Performance.
- No analytics traces to the user's discovery answer and PRD Out of Scope: "Analytics dashboard."
- Writing in v1 traces to the user's updated product decision; placeholder-only writing routes must use `noindex` to preserve the PRD SEO requirement against indexing empty placeholder pages.

## 2. Rendering Strategy

### Decision: Vite + React Router SPA

The architecture will keep the current Vite SPA model with `react-router-dom` data router via `createBrowserRouter`.

### Requirements Traceability

- Recruiter journey: fast scan of hero, skills, projects, resume, and contact.
- Hiring Manager journey: inspect projects, demos, GitHub, about, skills, resume, and contact.
- PRD Performance target: Lighthouse Performance 95+ and initial route JavaScript under approximately 200KB gzipped.
- PRD SEO target: descriptive title, meta description, Open Graph metadata, structured headings, and crawlable content where practical.

## 3. Routing Architecture

### Route Map

```text
/                    Home page: Hero, Current Role, Projects, About, Skills, Contact
/projects/:slug      Lazy-loaded project case study page
/resume              Lazy-loaded resume view page
/writing             Lazy-loaded writing index, shipped in v1 with placeholder-safe empty state
/writing/:slug       Lazy-loaded writing detail route, shipped in v1 for manually maintained posts
/*                   Not Found route
```

### Route Responsibilities

`/`

- Primary conversion page.
- Contains the full scan path for recruiters and sourcers.
- Contains above-the-fold role positioning and CTAs.
- Navigation is hybrid: Home, Projects, About, and Contact are in-page anchors on this
  route; Blog and Resume are real routes. Anchor targets must resolve both from within
  `/` and from `/writing` or `/resume` via `/#section`. See
  `docs/4-interaction-design.md` §1 and §3.
- Includes a Current Role section immediately after the hero to describe the candidate's active software engineering work.
- Keeps key content crawlable in the initial HTML shell and hydrated app.

`/projects/:slug`

- Used for deeper case studies when a project needs more space than the home page card.
- Lazy-loaded because detailed review is a secondary path after the home page scan.

`/resume`

- Browser-viewable resume page.
- Links to the committed PDF asset for download.
- Lazy-loaded because the hero and nav can link directly to the PDF for users who only need the file.

`/writing` and `/writing/:slug`

- Included in v1 and available from navigation.
- `/writing` renders a clear placeholder-safe empty state when no posts exist.
- `/writing/:slug` renders manually maintained post content from typed local data when matching content exists.
- Missing writing slugs resolve to the Not Found route or a writing-specific empty state, not a broken page.
- No MDX dependency will be added in v1.
- Future implementation can add lazy-loaded MDX support or typed markdown ingestion in a separate follow-up architecture decision.
- Placeholder-only writing pages must set `noindex` metadata until real posts exist.

`/*`

- Required 404 route.
- Provides a clear path back to home, projects, resume, and contact.

### Code-Splitting Plan

- Home route remains the only eagerly loaded route.
- Project detail pages are lazy-loaded.
- Resume view route is lazy-loaded.
- Writing routes are lazy-loaded.
- Heavy assets such as project screenshots are loaded only where rendered.
- Motion usage remains limited and imported only where animation is needed.

### Requirements Traceability

- Route map traces to PRD Core Feature Modules: Hero, Projects, About, Skills, Resume, Contact, Theme Support, Optional Blog, and the user's updated decision to include Writing in v1.
- Lazy routes trace to PRD Performance: initial JavaScript under approximately 200KB gzipped.
- 404 traces to PRD Reliability: "404 route required if multiple routes are used."
- Writing placeholder behavior intentionally updates the original PRD Optional Blog threshold while preserving the PRD SEO requirement that empty placeholder pages must not be indexed.

## 4. State Management Strategy

### Decision

Use local React state and browser APIs only. Do not add a global state library.

### State Needed

Theme state:

- `light` / `dark` preference.
- Persisted in `localStorage`.
- Initialized from stored preference or system preference.
- Applied to the document root using Tailwind's `class` dark mode strategy.

Contact form state:

- Field values.
- Validation errors.
- Submission state: idle, submitting, success, error.
- Implemented locally inside the contact form component.

Navigation state:

- Mobile menu open/closed state if the header uses a collapsible menu.
- Local to the layout/header component.

Route state:

- Managed by React Router.
- Used for route transitions and 404 handling.

Reduced motion:

- Read through Motion's `useReducedMotion()`.
- Used to disable or simplify animations.

### State Not Needed

No global store:

- Content is static and imported from typed local data files.
- No authentication exists.
- No user dashboard exists.
- No remote application state exists.

No duplicated derived state:

- Filtered or grouped content should be computed from typed constants during render or through deliberate `useMemo` only when needed.

### Requirements Traceability

- Theme state traces to PRD Theme Support: dark/light modes, keyboard accessible toggle, persisted preference where feasible.
- Contact state traces to PRD Contact and Reliability: loading, success, and error states for the contact form.
- Reduced motion traces to PRD Accessibility and Performance: respect `prefers-reduced-motion` and keep animations lightweight.
- No global state traces to PRD Non-goals and Out of Scope: no backend, no auth, no dashboard, no over-engineering.

## 5. Content & Data Architecture

### Decision

Portfolio content will live in typed local data files under `src/data/`. Components will render from those typed constants rather than hardcoded JSX copy.

### Data Files

```text
src/data/profile.ts       Candidate identity, role, value proposition, social links,
                          hero `layout` discriminator, optional portrait asset
src/data/projects.ts      Project summaries and case study data, each carrying a
                          `category: 'professional' | 'personal'` discriminator
src/data/skills.ts        Skill groups by capability
src/data/resume.ts        Resume file metadata and labels
src/data/navigation.ts    Nav labels and route targets
src/data/currentRole.ts   Current software engineering role summary
src/data/about.ts         Bio prose paragraphs for AboutSection
src/data/writing.ts       V1 writing metadata and manually maintained post content
```

### Types

Project grouping is by the `category` discriminator on a single project type in a
single data file. Professional and personal projects are rendered as two subsections
of one Projects section — this is **grouping, not filtering**, and adds no filter
controls (see §12). The home page never needs a second projects data file.

`profile.ts` carries an explicit `layout: 'stacked' | 'split'` discriminator that selects
between the two hero layouts specified in `docs/4-interaction-design.md` §5.1 — one
component, no duplicated hero. `portrait` is a separate optional field holding the image
that fills the `split` layout's slot.

The two are deliberately not collapsed into one. Inferring the layout from `portrait`'s
presence would mean the layout could not be built or reviewed before the photograph
existed, and that removing the photograph to fix an image problem would silently
restructure the page. Same reasoning as the `category` discriminator on projects: an
explicit field beats an inference from whether optional data happens to be populated.

Shared types will live in `src/types/`:

```text
src/types/profile.types.ts
src/types/project.types.ts
src/types/skill.types.ts
src/types/resume.types.ts
src/types/current-role.types.ts
src/types/about.types.ts
src/types/writing.types.ts
src/types/navigation.types.ts
```

### Resume Handling

The resume PDF should be committed as a static file because:

- The PRD requires a stable browser-viewable and downloadable resume path.
- `AGENTS.md` identifies this as a static, content-driven site with no unnecessary infrastructure.
- A build-time resume generation pipeline would add avoidable complexity.

Recommended path:

```text
public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf
```

The `/resume` route can embed or link to this file, and all direct download CTAs should use the same stable asset path.

### Open Graph Image Handling

The OG image should be committed as an optimized static asset, not generated at build time.

Recommended path:

```text
public/og/portfolio-og.png
```

The asset should be optimized before commit and referenced from `index.html` metadata. A placeholder OG image is acceptable during development, but not as a launch placeholder.

**The OG asset stays PNG or JPEG — never WebP.** LinkedIn's and Slack's unfurlers do not reliably decode WebP, and those two crawlers are the entire reason the asset exists. It is re-encoded in place by the pipeline below (`compressionLevel: 9`, `palette: true`), which is lossless for flat token colour.

### Image Pipeline

Every committed image is optimised by one repeatable command rather than by hand:

```text
scripts/optimize-images.mjs   # walks src/assets/** and public/og/**
yarn images                   # runs it
```

`sharp` is a **devDependency** — it never enters the bundle, so the ~200 KB budget in §7 is untouched. The script re-encodes WebP at quality 82, keeps PNG and JPEG in their own format, **never changes dimensions**, and writes a file back only when the result is smaller.

It is not wired into `yarn build`: the outputs are committed, and a build step that rewrites tracked files makes every CI run dirty. `scripts/image-manifest.json` records the hash of each optimised output so a second run is a no-op — WebP and JPEG are lossy, and re-encoding an already-encoded file otherwise degrades it a little on every pass.

### Project Images

Project images should be stored as static assets, preferably optimized WebP or AVIF with explicit dimensions recorded in project data.

Recommended paths:

```text
src/assets/projects/
public/projects/
```

Use `src/assets/projects/` for imported build-optimized images and `public/projects/` only when a stable public URL is required.

### Requirements Traceability

- Typed data files trace to `AGENTS.md`: page-level data lives in `data/*.ts` as typed constants.
- Resume handling traces to PRD Resume module and Content Requirements: final PDF, browser-viewable path, downloadable path, stable file path.
- OG handling traces to PRD SEO: Open Graph metadata.
- Image handling traces to PRD Performance: optimized formats, explicit dimensions, lazy loading below the fold.
- No fabricated content traces to PRD About and Content Requirements: no fabricated achievements, metrics, company names, credentials, or outcomes.

## 6. Component Architecture

### Folder Alignment

The component architecture will follow `AGENTS.md`:

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    layout/
    sections/
    ui/
  pages/
  data/
  hooks/
  lib/
  types/
  constants/
  assets/
  styles/
```

### Component Tree

```text
App
  RouterProvider
    RootLayout
      ErrorBoundary
      Header
        Navigation
        ThemeToggle
        MobileNavigation
          SocialLinks
      SocialRail                      # fixed left rail, lg+ only
      PageTransition
        HomePage
          HeroSection                 # two layouts, selected by profile.layout
          CurrentRoleSection
          ProjectsSection             # one h2
            ProjectCarousel           # h3 "Professional" + track
              ProjectCard
            ProjectCarousel           # h3 "Personal" + track
              ProjectCard
          AboutSection
          SkillsSection
            SkillGroup
          ContactSection
            ContactForm
            SocialLinks
        ProjectPage
          ProjectHero
          ProjectCaseStudy
          ProjectLinks
        ResumePage
          ResumeViewer
          ResumeDownloadLink
        WritingPage
          WritingEmptyState
          WritingCard
        WritingPostPage
          WritingArticle
        NotFoundPage
      Footer
```

### UI Components

Reusable, content-agnostic components:

```text
Button
Card
Badge
Section
Container
IconLink
TextInput
TextArea
FormStatus
```

Rules:

- `components/ui/` components receive all content through props.
- No route knowledge in UI components.
- No hardcoded portfolio copy in UI components.
- One component per file.
- Exported components have explicit return types.
- Components use arrow functions and typed props interfaces.
- Components should stay under approximately 200 lines.

### Feature Modules to Components

Hero / Intro:

- `HeroSection`
- `SocialLinks`
- `Button`

Current Role:

- `CurrentRoleSection`
- Describes the candidate's active software engineering role, day-to-day scope, and relevant full-stack / AI engineering signals.

Projects Showcase:

- `ProjectsSection` — one section, one `h2`, containing two `ProjectCarousel`
  instances (Professional, Personal) filtered from `projects.ts` by `category`.
- `ProjectCarousel` — labelled `h3` subsection with a horizontally scrolling,
  scroll-snapped track and its own arrow controls. One component, two instances; the
  two carousels scroll independently.
- `ProjectCard`
- `ProjectPage`
- `ProjectCaseStudy`

Social:

- `SocialRail` — fixed left-edge rail of expand-on-hover/focus tiles, `lg` and up.
- `SocialLinks` — the inline list form, reused in the mobile nav sheet, the contact
  section, and the footer. The rail does not replace it.

Both are driven by the same link data in `profile.ts`.

About / Bio:

- `AboutSection`

Skills / Tech Stack:

- `SkillsSection`
- `SkillGroup`
- `Badge`

Resume:

The resume lives on its own route only; there is no home-page resume section
(`docs/4-interaction-design.md` §1, §5.6). The hero CTA and the nav button are its two
entry points.

- `ResumePage`
- `ResumeViewer`
- `ResumeDownloadLink`

Contact:

- `ContactSection`
- `ContactForm`
- `SocialLinks`
- `FormStatus`

Theme Support:

- `ThemeToggle`
- `useTheme`

Navigation and scroll behaviour (see `docs/4-interaction-design.md` §3–§4):

- `useActiveSection` — `IntersectionObserver` scroll spy driving the active nav item.
  Home route only.
- `useHashScroll` — resolves `/#section` after paint, including arrival from
  `/writing` and `/resume`.
- `useCarousel` — scroll position, arrow enabled/disabled state, and resize
  re-evaluation for one carousel track.

Each of these subscribes to something outside React, so each must return a cleanup
function (`AGENTS.md` §5).

Writing:

- `WritingPage`
- `WritingPostPage`
- `WritingCard`
- `WritingEmptyState`
- Included in v1 with placeholder-safe empty state if no posts exist.
- No MDX dependency in v1; content is manually maintained through typed local data.

### Requirements Traceability

- Component modules trace directly to PRD Core Feature Modules and the user's updated Writing v1 decision.
- `CurrentRoleSection` supports the recruiter's need to understand current role fit quickly and the hiring manager's need to assess active engineering scope.
- `SocialLinks` includes email, LinkedIn, GitHub, and Twitter/X based on the user's contact answer.
- `ContactForm` traces to PRD Contact and Reliability requirements.
- Error boundary traces to PRD Reliability and `AGENTS.md` React Component Design Rules.
- Folder and component conventions trace to `AGENTS.md` Architecture and React Component Design Rules.

## 7. Performance Architecture

### Lighthouse Targets

The implementation will target:

- Lighthouse Performance: 95+ on mobile.
- Lighthouse Accessibility: 95+.
- Lighthouse Best Practices: 95+.
- Lighthouse SEO: 95+.
- Initial route JavaScript: under approximately 200KB gzipped.
- LCP: under 2.5 seconds.
- CLS: below 0.1.
- INP: below 200ms.

### Bundle Strategy

- Keep home route lightweight and eagerly loaded.
- Lazy-load project detail, resume, and writing routes.
- Avoid adding dependencies unless the platform, Tailwind, React Router, or Motion cannot reasonably solve the need.
- Do not add analytics scripts in v1.
- Do not add MDX tooling in v1.
- Use direct browser APIs for metadata, theme persistence, and simple interactions where appropriate.

### Image Strategy

- Use WebP or AVIF for project screenshots and visual assets.
- Provide explicit width and height data.
- Use `loading="lazy"` for below-the-fold images.
- Keep above-the-fold hero media lightweight if used.
- Avoid dark, blurred, stock-like, or purely atmospheric media when project inspection matters.

### Font Strategy

- Prefer system fonts for v1 unless a strong brand need justifies self-hosted fonts.
- If custom fonts are used, self-host them with `font-display: swap`.
- Avoid remote font loading that can delay rendering.

### Animation Strategy

- Use Motion from `motion/react`, but **never the `motion` component** — use `m` inside a
  single `<LazyMotion features={domAnimation} strict>` in `App.tsx`. `motion` statically
  pulls the whole animation engine (layout projection, drag, gestures) into the entry
  chunk; this site animates `opacity` and `transform` only, which is exactly what
  `domAnimation` carries. Measured: **13.8 KB gzip off the entry bundle.** `strict` makes
  it enforceable — importing `motion` throws at render instead of quietly restoring the
  weight.
- Animate only `opacity` and `transform`.
- Page transitions should stay under 300ms.
- Scroll reveals use `whileInView` with `viewport={{ once: true }}`.
- Use parent variants and `staggerChildren` for grouped project cards or skill badges.
- Respect `useReducedMotion()`.

### CSS Strategy

- Tailwind CSS v4 for styling, using its CSS-first configuration. No `tailwind.config.ts`.
- Design tokens in `src/styles/index.css`, exposed to Tailwind via `@theme inline`.
- No CSS-in-JS.
- No separate CSS files except `src/styles/index.css` for the Tailwind import, design tokens, and the theme mapping.
- Use `clsx` or local `cn` utility for conditional classes if already present or if needed.

### Requirements Traceability

- Performance mechanisms trace to PRD Non-Functional Requirements: Performance.
- Image handling traces to PRD Performance and Content Requirements: project imagery, screenshots, diagrams.
- Animation constraints trace to PRD Performance and Accessibility plus `AGENTS.md` Animation Guidelines.
- No analytics and no MDX in v1 reduce bundle size and trace to user discovery answers.

## 8. Accessibility & SEO Architecture

### Accessibility Strategy

- Use semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Maintain one logical `h1` per page.
- Use ordered heading levels.
- Ensure all interactive controls are keyboard accessible.
- Use `focus-visible` styles for buttons, links, form inputs, nav items, and theme toggle.
- Ensure contact form fields have visible labels and accessible error messages.
- Use clear accessible names for social links and icon buttons.
- Maintain WCAG AA color contrast in light and dark modes.
- Respect reduced motion globally.

### Focus Management

- On route navigation, move focus to the main page heading or main content container.
- Mobile navigation should trap focus only if implemented as a modal-style menu; otherwise it must preserve normal keyboard flow.
- Closing mobile navigation should return focus to the menu trigger.
- Form submission success and error messages should be announced through an accessible status region.

### SEO Strategy

- Set a strong static default title and meta description in `index.html`.
- Include Open Graph and Twitter card metadata in `index.html`.
- Use route-level metadata updates for project and resume pages through a small internal metadata utility rather than adding a heavy dependency.
- Keep project summaries, skills, about copy, and contact links rendered as real text.
- Use human-readable project URLs with stable slugs. Slugs are lowercase-kebab and are **validated, never derived at runtime**: `assertValidProjectSlugs()` throws on a duplicate id, a duplicate slug, or a malformed slug. A bad slug otherwise produces a `/projects/:slug` that silently renders the 404.
- Set a **canonical link per route**, written by the same metadata utility. An SPA answers every path with the same shell, so a canonical is the only signal that `/projects/x` and `/projects/x?utm_source=…` are one page. A single static canonical in `index.html` would claim every route is the home page, so there is none.
- Ship `public/robots.txt` and `public/sitemap.xml` as **static files**. Lighthouse audits `robots.txt` validity directly. The sitemap is hand-maintained — a generator for seven URLs is infrastructure the PRD's non-goals rule out.
- Set `noindex` on the **404 page**. Under the SPA fallback every unknown path answers `200` with the shell, so a crawler following a stale link would otherwise index "Page Not Found" as a live page; `meta[name=robots]` is the only status signal available without a server.
- Use the **`summary_large_image`** Twitter card. `summary` crops a 1200×630 asset to a square thumbnail, and the OG image is authored at that ratio.
- Include `/writing` and `/writing/:slug` in v1.
- Set `noindex` on placeholder-only writing pages and any writing route without real post content.
- Allow indexing for writing posts only after real manually maintained content exists.

### Structured Heading Plan

Home page:

```text
h1: Candidate name
h2: Currently
  h3: Role title · Employer
h2: Projects
  h3: Professional
    h4: Project titles
  h3: Personal
    h4: Project titles
h2: About
h2: Skills
h2: Contact
  h3: Direct-contact heading
```

The two `h3`s under Current Role and Contact were **added to this plan by the E15-T10
audit**, which found them already rendering (`CurrentRoleSection.tsx`,
`ContactSection.tsx`) and shipped by E09 and E13. They are recorded rather than deleted:
each labels a real subsection — the role card's title, and the direct-links block beside
the form — so removing them would strip two accessible names to satisfy an outline written
before either section existed. Neither introduces a level skip.

The first `h2` reads **"Currently"**, not "Current Role" — the section is a present-tense
status panel rather than a résumé entry (`docs/tickets/RV-tickets.md` RV-T01). Its
**anchor id is still `current-role`**: heading text and anchor id are two decisions, and
the id is a public hash that `src/data/navigation.ts` names. The `h3` beneath it is
unchanged. The project links the panel gained are `Button`s inside a labelled list, not
headings, so the outline is unaffected — same reasoning as the skill group labels below.

The home `h1` is the **candidate name only**. The role positioning sits immediately
beneath it as body copy (`docs/4-interaction-design.md` §5.1 items 2–3), so the block
still reads as "name + positioning" while the heading stays one thing. Positioning
keywords belong in `<title>` and `meta[description]`, which is where a crawler looks for
them anyway — an `h1` padded with role keywords buys nothing and costs the clean
document outline this plan exists to keep.

Projects is a single `h2` with two `h3` subsections. Professional and personal work
are one topic viewed two ways, not two separate topics, and one `h2` keeps the
document outline honest while still labelling each group for screen reader users.

**Skills has no `h3` level, by decision.** Its six capability groups are labelled lists —
`<ul role="list" aria-labelledby>` — not subsections
(`docs/3-style-preference.md` §6.6). Six more headings would enter the outline that a
screen reader user pages through on the way to Contact, and a heading cannot carry the
group's item count the way a labelled list does. The absence above is deliberate, not an
oversight: do not add them.

There is no `Writing` heading on the home page. Blog is a route (`/writing`), not a
home section, so its heading lives on that page.

The Current Role section appears immediately after the hero because the candidate is currently working as a software engineer. This gives recruiters and hiring managers a fast, credible signal of active professional engineering experience before they inspect projects.

Project page:

```text
h1: Project name
h2: Problem
h2: Approach
h2: Stack
h2: Outcome
h2: Links          # only when the project has a repository or live URL
```

This is the **maximum** heading set for a project page, not a guarantee that all five
render. `Links` is omitted when the project has neither a `githubUrl` nor a `liveUrl`
(`docs/3-style-preference.md` §6.10, `docs/4-interaction-design.md` §10 row 11) — most of
this work is client software behind a customer login, and a heading introducing an empty
list is worse than an outline that varies by project. The four content headings always
render and never reorder.

Resume page:

```text
h1: Resume
```

**`h2: Download` was dropped by E12 and this outline is corrected to match** (found by the
E15-T10 audit — the page renders one `h1` and nothing else). Both actions share a single
row beneath the preview, so there is no second block of content for a heading to
introduce, and a heading over one button is an outline entry for nothing. The reasoning is
recorded at the top of `ResumePage.tsx`.

**The preview has no heading, by decision.** It is a labelled region
(`<section aria-label="Resume preview">`), not a subsection: a heading reading "View" above
an embedded document introduces nothing the document does not already announce, and it
bought a second `h2` in an outline two items long. The region keeps an accessible name so
it is still reachable and announced. Do not re-add the heading without also restoring the
`aria-labelledby` it labelled.

Writing page:

```text
h1: Writing
h2: Technical Notes
```

Writing post page:

```text
h1: Post title
h2: Section headings defined by the post content
```

Not Found page:

```text
h1: Page Not Found
```

### Requirements Traceability

- Accessibility strategy traces to PRD Accessibility requirements.
- SEO strategy traces to PRD SEO requirements.
- Heading plan supports recruiter and hiring manager scan order from PRD User Journeys.
- Current Role placement supports the user's updated direction to describe current software engineering work immediately after name and positioning.
- `noindex` for placeholder-only writing routes preserves the PRD SEO requirement: "No empty placeholder pages indexed."

## 9. Third-Party Integrations

### Contact Form: FormSubmit

The v1 contact form will POST to FormSubmit's AJAX endpoint
(`https://formsubmit.co/ajax/{token}`).

**This supersedes Netlify Forms**, which was specified here while Netlify was the settled
host. Netlify Forms is not an endpoint that can be called from anywhere: it is a
build-time scan of the deployed HTML plus an intercept of the POST at Netlify's edge.
Hosted on Vercel or Render, neither step happens and the POST resolves against the SPA
fallback — returning `200` and the HTML shell, which a `fetch` cannot distinguish from a
successful submission. The visitor would see a confirmation for a message that was never
delivered, the silent failure §11 forbids. A provider-hosted endpoint keeps the form
working on any host, and keeps it verifiable before deploy rather than after.

Implementation requirements:

- POST to the **token** endpoint, never the plain-address one, so the contact address is
  not shipped in the JS bundle as a URL.
- `_honey` honeypot field for spam reduction.
- `_captcha: 'false'`, since the AJAX endpoint is consumed by the page rather than
  redirected to.
- `_replyto` set from the sender's address, so a reply reaches the sender.
- Client-side validation for required fields.
- Explicit submission states: idle, submitting, success, error.
- Graceful fallback text that provides direct email contact if submission fails.
- The transport isolated in a single service module, so changing provider touches one
  file and no component.

Three fields: **Name (optional), Email (required), Message (required)**, submitted by a
button labelled "Send message".

The endpoint token is not a secret. It reaches the bundle on any static host, so it lives
in `src/constants/` as a plain constant rather than an environment variable — a `VITE_`
var would keep it out of git history and not out of the deployed JavaScript.

Hosting and form transport are now independent decisions. §10's Netlify deployment
recommendation is unaffected by this change.

Direct contact links must also be present:

- Email.
- LinkedIn.
- GitHub.
- Twitter/X.

### Analytics: None in v1

No analytics script or page-view tracking will be included in v1.

### Requirements Traceability

- FormSubmit traces to PRD Contact module and to the host being unsettled: the form must work on Netlify, Vercel, or Render without being rebuilt.
- Submission states trace to PRD Reliability: contact form must have loading, success, and error states.
- Direct links trace to PRD Recruiter and Peer Engineer journeys: fast contact and social inspection.
- No analytics traces to user discovery answer and supports PRD Performance.

## 10. Build, CI, and Deployment Architecture

### Package Manager

Use `yarn` only. Do not mix lockfiles.

### Local Quality Gates

Before considering a task done locally, run:

```text
tsc --noEmit
eslint .
prettier --check .
yarn build
```

These remain local/manual for v1 because the user chose no CI.

### CI

No GitHub Actions CI in v1.

This is intentional for the solo portfolio stage. The architecture keeps the quality commands simple so CI can be added later without restructuring.

### Deployment

Deploy through Netlify:

- Production deploy from the main branch.
- Preview deployments for pull requests.
- SPA fallback configured through Netlify redirect rules.
- No Netlify-side form configuration: contact submissions go to FormSubmit (§9), which is why the deploy target and the form are now independent.

Recommended Netlify redirect:

```text
/* /index.html 200
```

### Build Output

Vite will generate the static production bundle.

Recommended commands:

```text
yarn build
yarn preview
```

### Requirements Traceability

- Yarn traces to `AGENTS.md` Tech Stack.
- Local gates trace to `AGENTS.md` Code Quality Gates.
- Netlify deployment traces to user discovery answer and PRD deployment target.
- Preview deployments trace to user's hosting answer.
- No CI traces to user's CI answer.

## 11. Error Handling & Reliability

### Error Boundary Placement

Use an app or route-level error boundary around the routed application.

Recommended placement:

- Root layout error boundary for unexpected app failures.
- Route-specific error elements for project, resume, and writing routes where useful.

### 404 Handling

Use a catch-all route:

```text
*
```

The 404 page should:

- Explain that the page was not found.
- Link back to Home.
- Link to Projects, Resume, and Contact.
- Preserve the main layout and theme.

### Broken-Link Prevention

Project and social links must be modeled as typed data and rendered conditionally:

- Do not render empty links.
- External links open safely with `rel="noreferrer"`.
- Resume path defined once in resume data.
- Navigation targets defined in one data file.
- Project slugs generated or validated from stable project IDs.

### Contact Reliability

Contact form must:

- Validate required fields before submission.
- Show loading state during submission.
- Show success state after successful submission.
- Show error state and direct email fallback on failure.
- Avoid silent failures.

### Requirements Traceability

- Error boundaries trace to PRD Reliability and `AGENTS.md` React Component Design Rules.
- 404 route traces to PRD Reliability.
- Broken-link prevention traces to PRD Projects, Resume, Contact, and Reliability requirements.
- Contact reliability traces to PRD Contact module and Reliability requirements.

## 12. Explicit Non-Decisions

The following are deliberately out of scope for v1 architecture:

- CMS or admin editing interface.
- Backend application server.
- User authentication.
- Analytics dashboard.
- Any analytics tracking.
- Complex custom contact form backend.
- Newsletter signup.
- Comment system.
- Project filtering beyond simple grouping or ordering.
- MDX dependency and automated blog ingestion.
- Multi-language support.
- Heavy animation libraries beyond Motion.
- 3D experiences or decorative interactive effects that do not improve hiring outcomes.
- Testimonials unless real and approved for public use.
- Automated resume parsing.
- Dynamic job-application tracking.
- AI chatbot or portfolio assistant.
- Build-time resume generation.
- Build-time OG image generation.
- GitHub Actions CI.

### Requirements Traceability

- These non-decisions match PRD Out of Scope for v1.
- No analytics, no CI, and no build-time asset generation additionally trace to user discovery answers.
- Including Writing in v1 with placeholder-safe behavior traces to the user's updated requirement.
- Deferring MDX and automated blog ingestion preserves the PRD Performance and no-over-engineering constraints.

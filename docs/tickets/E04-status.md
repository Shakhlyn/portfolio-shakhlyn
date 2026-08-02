# E04 — Content Data Layer & Types · Status

Tickets: [E04-data-layer.md](E04-data-layer.md) · Overview: [STATUS.md](STATUS.md)

**5 / 5 done.** Unblocked by the CV supplied on 2026-08-02.
Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                                  | Status | Notes                                             |
| ------- | -------------------------------------- | ------ | ------------------------------------------------- |
| E04-T01 | Shared types                           | ✅     | 7 type files, no `any`                            |
| E04-T02 | `profile.ts` + `navigation.ts`         | ✅     | Real name, role, company, email, LinkedIn, GitHub |
| E04-T03 | `projects.ts`                          | ✅     | **5 projects** — 3 professional, 2 personal       |
| E04-T04 | `skills.ts` + `currentRole.ts`         | ✅     | 6 skill groups; real employer and scope           |
| E04-T05 | `resume.ts` + `writing.ts` + constants | ✅     | Except the PDF itself — see below                 |

## Content now in place

All sourced from the CV. Nothing invented.

| File                | Content                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `profile.ts`        | Shaokh Al Mahmud Shakhlyn · Software Engineer · Dhaka · Penta Global Limited · email, LinkedIn, GitHub                |
| `currentRole.ts`    | Penta Global Limited, Mar 2024 – Present, 4 scope lines, 8 stack items                                                |
| `projects.ts`       | Deal Summary & Comparison · Data Slicing · Bhoganti Web App · Meal Management System · Developer Tooling & Automation |
| `skills.ts`         | Languages · Frontend · Backend · Data · Infrastructure · Practices                                                    |
| `constants/site.ts` | Real page title and meta description                                                                                  |

## Positioning mismatch — needs your decision

**The CV contains no AI or LLM work, but `1-prd.md` is built around "full-stack and
AI engineering roles" throughout** — the personas, the value proposition, the meta
description, the recommended skills groups, and the preferred project mix ("one AI /
LLM / automation project") all assume it.

I did not invent an AI/LLM skills group to fill the gap. `skills.ts` ships the five
capability groups the CV actually supports, plus Practices, with a comment recording
why the sixth is absent.

Two honest ways forward, and this is your call:

1. **Reframe the PRD** to full-stack / product engineering, matching the CV. Touches
   `1-prd.md` §1–§3, the meta description, and the hero value proposition.
2. **Keep the AI framing** and add real AI/LLM work — a project and the corresponding
   skills — before launch. `1-prd.md` §6 already asks for one AI/LLM/automation project
   in the preferred mix, so this is the plan as written.

Until one is chosen, the site is internally consistent but positions more narrowly than
the PRD intends.

## Placeholder assets generated (2026-08-02)

Nothing is missing any more — the gaps are filled with working placeholders rather than
empty strings, so every downstream epic has something real to build against.

| Asset                               | What shipped                                                                                                                                                    | Replace before launch? |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `public/resume/shakhlyn-resume.pdf` | Real 2-page PDF typeset from your CV text, **stamped "Draft" in red across the top** so it cannot be mistaken for the real thing. 76 KB, wired into `resume.ts` | **Yes**                |
| `public/og/portfolio-og.png`        | 1200×630 card built from the project's own design tokens — navy background, violet rule, name, role, stack chips                                                | **Yes**                |
| `src/data/about.ts`                 | Three draft paragraphs, every fact from the CV, wording mine                                                                                                    | **Yes — voice**        |
| `SITE_URL`                          | `https://shakhlyn.dev` — a **guess**, not a registered domain                                                                                                   | **Yes**                |

The resume PDF is generated, not fabricated: every line came from the CV text you
supplied. It exists so E12 (`ResumeViewer`, download link, file-size label) is testable
today rather than blocked.

## Remaining TODO(content)

Five markers, none blocking Phase 2:

```
grep -rn "TODO(content)" src/
```

| Marker                                | Effect if left                                  | Launch blocker? |
| ------------------------------------- | ----------------------------------------------- | --------------- |
| `resume.ts` — draft PDF               | Recruiters download a draft-stamped resume      | **Yes**         |
| `site.ts` — `SITE_URL` guess          | Link previews fetch a domain that may not exist | **Yes**         |
| `about.ts` — draft voice              | Bio reads as written-about-you, not by you      | **Yes**         |
| `projects.ts` — screenshots           | Cards omit the image frame; layout is text-only | No              |
| `projects.ts` — Meal Mgmt `githubUrl` | GitHub button does not render on that card      | No              |

`1-prd.md` §6 permits all five as development placeholders.

## Link policy applied

Client work has no public repository or demo, so `githubUrl` and `liveUrl` are
**omitted** on the three professional projects rather than pointed somewhere plausible.
Only `linux-setup-script` has a real, verified GitHub URL. Every project carries a
`caseStudySlug`, so each card still has exactly one real destination and no card
renders a dead button (`docs/2-architecture.md` §11).

**Emails differ between sources.** The CV uses `shakhlyn.sh.du@gmail.com`; the git
config uses `shakhlyn.kst@gmail.com`. The CV address is in `profile.ts` on the
assumption it is the professional one — say if that is backwards.

## About copy — written, needs your voice

`src/data/about.ts` and `src/types/about.types.ts` now exist, so E11 is unblocked.
Neither was in E04's ticket list; `docs/2-architecture.md` §5 has been updated to
include them rather than leaving the doc and the tree disagreeing.

Three paragraphs, ordered so the **career transition leads** — `1-prd.md` §3 asks for
the non-traditional background to be framed as a differentiator rather than apologised
for, and the B.Sc. in Leather Products Engineering → software route is the most
distinctive thing on the CV.

Every fact is from the CV. The _wording_ is mine, which is the part to replace: bio
copy in someone else's voice is the fastest way for an About section to read as
generic, and "bio feels generic or inflated" is listed in `1-prd.md` §4 as a hiring
manager bounce trigger.

## Files

```
src/types/profile.types.ts        ProfileType, PortraitType, SocialLinksType
src/types/project.types.ts        ProjectType, ProjectCategory, ProjectImageType
src/types/skill.types.ts          SkillGroupType
src/types/resume.types.ts         ResumeType
src/types/current-role.types.ts   CurrentRoleType
src/types/writing.types.ts        WritingPostType
src/types/navigation.types.ts     NavItemType (discriminated union)
src/data/{profile,navigation,projects,skills,currentRole,resume,writing}.ts
src/constants/site.ts             SITE_*, OG_IMAGE_PATH, scroll-spy timings
```

## Type decisions worth knowing

**Optional links are genuinely optional**, never `string | ''`. This is what makes the
no-dead-links rule enforceable by the compiler rather than by discipline.

**`ProfileType.portrait` is optional and currently absent.** ~~Its presence is the
entire hero-layout switch~~ — **superseded by E09.** The switch is now an explicit
`layout: 'stacked' | 'split'` field; `portrait` is only the asset that fills the `split`
slot, and the slot reserves its space without it. Rationale in
`docs/4-interaction-design.md` §5.1 and §10 row 1.

**`SkillGroupType` has no proficiency, level, or rating field.** Omitting it from the
type is what stops proficiency bars appearing later; they are unverifiable and read as
filler (`docs/3-style-preference.md` §6.6).

**`NavItemType` is a discriminated union on `kind: 'anchor' | 'route'`**, not
`isAnchor?: boolean`. An anchor-with-a-route-target is unrepresentable, and E07 can
pick between scroll-spy state and router-active state without guessing.

**Slugs are stored, not derived.** `ProjectType` carries both a stable `id` and a
written `slug`. Slugifying the title at runtime would silently break a shared URL the
moment a title is edited.

**Nav targets and the resume path each exist in exactly one place** —
`navigation.ts` and `resume.ts`. `NotFoundPage` already consumes `NOT_FOUND_LINKS`.

## Extra scope taken

- `src/types/navigation.types.ts` — the ticket named six type files while separately
  requiring a `NavItemType` discriminated union. Added as its own file per
  `AGENTS.md` §3 rather than smuggled into another.
- `CONTACT_EMAIL` exported from `profile.ts` as a bare address, because E13 must render
  the email as real selectable text a recruiter can copy without JavaScript, and the
  `social.email` value is a `mailto:` URL.

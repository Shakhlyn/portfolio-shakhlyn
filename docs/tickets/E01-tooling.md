# E01 — Tooling & Project Scaffold

**Goal:** A correctly configured Vite + React + TS project that enforces the rules in
`AGENTS.md` automatically rather than by memory.

**Why first:** Import sorting, path aliases, and Tailwind class ordering are painful to
retrofit across a finished codebase. Lint rules added late produce hundreds of errors at
once.

**Depends on:** nothing. **Blocks:** everything.

**Starting state:** a stock `yarn create vite` React + TS scaffold. React 19.2, Vite 8,
TypeScript 6, ESLint 10 flat config, yarn 4.13. No Tailwind, no router, no Motion, no
path alias, and `strict` is **not** set.

**Traceability:** `AGENTS.md` §2, §3, §11 · `2-architecture.md` §6, §10 ·
`5-epic-list.md` E01

---

## [ ] E01-T01 — Enable TypeScript strict mode and the `@/` path alias

**Files:** `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`

The scaffold ships `noUnusedLocals` and `noUnusedParameters` but **not** `strict`.
`AGENTS.md` §4 says `strict: true`, no exceptions. Turning it on later, after components
exist, is how a codebase ends up with a `strict: false` that nobody dares flip.

The alias must be declared **twice** — TypeScript resolves it for the editor and
`tsc --noEmit`, Vite resolves it for the actual bundle. Configuring only one produces
imports that typecheck and then fail at build, or vice versa.

**Scope**

- `tsconfig.app.json` → `compilerOptions`: add `"strict": true`, `"baseUrl": "."`, and
  `"paths": { "@/*": ["./src/*"] }`.
- `vite.config.ts` → add the matching `resolve.alias` entry. Use
  `fileURLToPath(new URL('./src', import.meta.url))`, not `__dirname` — the config is
  ESM (`"type": "module"`).
- Do not add `strict` to `tsconfig.node.json` unless it lints clean; that project only
  covers the Vite config.

**Acceptance**

- [ ] `yarn build` (which runs `tsc -b`) succeeds with `strict: true`.
- [ ] A file importing `@/main` typechecks in the editor **and** builds.
- [ ] No `any` or `@ts-expect-error` was introduced to make strict mode pass.

**Commit:** `chore: enable TS strict mode and @/ path alias`

---

## [ ] E01-T02 — Install and wire Tailwind CSS v4

**Files:** `package.json`, `vite.config.ts`, `src/styles/index.css` (new),
`src/main.tsx`, `src/index.css` (deleted), `src/App.css` (deleted)

Tailwind **v4**, configured in CSS. There is no `tailwind.config.ts` and none should be
created — see the decisions table in `docs/tickets/README.md`. This ticket lands the
plumbing only; the actual token values are E02-T01.

**Scope**

- `yarn add -D tailwindcss @tailwindcss/vite`
- Register `tailwindcss()` in `vite.config.ts` `plugins`. No PostCSS config file is
  needed with the Vite plugin — do not add one.
- Create `src/styles/index.css` containing `@import 'tailwindcss';` and nothing else
  yet.
- Point `src/main.tsx` at `@/styles/index.css`.
- **Delete** `src/index.css` and `src/App.css`. `AGENTS.md` §2 permits exactly one
  stylesheet. Strip the `import './App.css'` from `App.tsx` in the same commit so the
  build never references a deleted file.

**Acceptance**

- [ ] A `className="text-red-500"` probe renders red in `yarn dev`, then is removed
      before commit.
- [ ] `src/index.css` and `src/App.css` no longer exist and nothing imports them.
- [ ] No `tailwind.config.ts`, no `postcss.config.js` in the repo.
- [ ] `yarn build` succeeds and emits a CSS asset.

**Commit:** `chore: install and wire tailwind css v4`

---

## [ ] E01-T03 — ESLint: a11y, import sorting, and the rules `AGENTS.md` requires

**Files:** `eslint.config.js`, `package.json`

**`jsx-a11y` violations must be errors, not warnings** (`AGENTS.md` §10 — "treated as
build-breaking"). A warning is a thing people scroll past; this is the single most
important line in this ticket.

**Scope**

- `yarn add -D eslint-plugin-jsx-a11y eslint-plugin-simple-import-sort`
- Extend the existing flat config (keep `js.configs.recommended`,
  `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`,
  `reactRefresh.configs.vite`) with:
  - `jsxA11y.flatConfigs.recommended`, then an explicit override block setting every
    `jsx-a11y/*` rule that ships as `warn` to `error`.
  - `simple-import-sort/imports` and `simple-import-sort/exports` as `error`.
  - `simple-import-sort` groups matching `AGENTS.md` §5: external packages → `@/`
    aliases → relative → styles.
  - `@typescript-eslint/no-explicit-any: 'error'`.
  - `@typescript-eslint/explicit-module-boundary-types: 'error'` — this is what enforces
    "explicit return types on all exported functions and components".
- Add `"typecheck": "tsc --noEmit"` to `package.json` scripts while you are in there.

**Acceptance**

- [ ] `yarn lint` reports **zero** errors on the current scaffold.
- [ ] A deliberately unsorted import block is reordered by `yarn lint --fix`.
- [ ] `<img src="x" />` with no `alt` fails `yarn lint` as an **error**.
- [ ] An exported function with no return type fails `yarn lint`.
- [ ] The probes above are reverted before commit.

**Commit:** `chore: add jsx-a11y and import-sort eslint rules`

---

## [ ] E01-T04 — Prettier with Tailwind class sorting

**Files:** `.prettierrc.json` (new), `.prettierignore` (new), `package.json`,
`eslint.config.js`

Class order is the formatter's job, never a human's (`AGENTS.md` §6). With Tailwind v4
the sorting plugin cannot find a config file to read the theme from, so it must be
pointed at the stylesheet explicitly via `tailwindStylesheet` — without that line the
plugin silently sorts against stock Tailwind and misses every custom token.

**Scope**

- `yarn add -D prettier prettier-plugin-tailwindcss`
- `.prettierrc.json`:
  ```json
  {
    "singleQuote": true,
    "semi": true,
    "trailingComma": "all",
    "printWidth": 90,
    "plugins": ["prettier-plugin-tailwindcss"],
    "tailwindStylesheet": "./src/styles/index.css",
    "tailwindFunctions": ["cn", "clsx"]
  }
  ```
- `.prettierignore`: `dist`, `node_modules`, `.yarn`, `yarn.lock`, `public`.
- Scripts: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`.
- Run `yarn format` once across the repo as part of this commit.
- Confirm no ESLint stylistic rule now fights Prettier. Neither
  `js.configs.recommended` nor `tseslint.configs.recommended` enables formatting rules,
  so `eslint-config-prettier` should **not** be needed — verify rather than assume, and
  only add it if `yarn lint` actually conflicts.

**Acceptance**

- [ ] `yarn format:check` passes on a clean tree.
- [ ] A hand-scrambled `className` is reordered by `yarn format`.
- [ ] A class using a custom token (e.g. `bg-surface`, once E02 lands) sorts into the
      right position rather than being treated as unknown.
- [ ] `yarn lint` still passes after formatting.

**Commit:** `chore: add prettier with tailwind class sorting`

---

## [ ] E01-T05 — Folder scaffold and `App.tsx` relocation

**Files:** `src/app/App.tsx` (moved), `src/main.tsx`, plus the folder tree

**Scope**

- Create the full tree from `2-architecture.md` §6 / `AGENTS.md` §3:
  ```
  src/app/  src/components/{ui,layout,sections}/  src/pages/  src/data/
  src/hooks/  src/lib/  src/types/  src/constants/  src/assets/  src/styles/
  ```
- Move `src/App.tsx` → `src/app/App.tsx` with `git mv` so history follows.
- Update `src/main.tsx` to import `@/app/App` — relative-path imports are what the
  alias exists to eliminate.
- Empty directories do not survive git. Either add the file that belongs there in a
  later ticket, or commit a one-line `.gitkeep`. Do **not** commit placeholder `.ts`
  files that export nothing — they trip `noUnusedLocals` and read as clutter.
- Reduce `App.tsx` to a minimal component. The counter demo, the Vite/React logos in
  `src/assets/`, and their imports all go.

**Acceptance**

- [ ] Every directory in `2-architecture.md` §6 exists.
- [ ] `src/App.tsx` and `src/App.css` are gone; `src/app/App.tsx` is present.
- [ ] `main.tsx` imports via `@/`, not `./`.
- [ ] No Vite scaffold demo code or logo assets remain.
- [ ] `yarn dev` renders without console errors.

**Commit:** `refactor: scaffold folder structure and move App to src/app`

---

## [ ] E01-T06 — `cn()` class-merging utility

**Files:** `src/lib/cn.ts` (new), `package.json`

Every conditional class in the codebase goes through this one function — never template
strings (`AGENTS.md` §6). `clsx` handles the conditionals; `tailwind-merge` resolves
conflicts so a `className` prop can override a component's own defaults instead of
producing `px-4 px-6` and depending on stylesheet order.

**Scope**

- `yarn add clsx tailwind-merge` — runtime dependencies, not dev.
- ```ts
  import { type ClassValue, clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
  ```
- Use `tailwind-merge` v3+, which understands Tailwind v4 token syntax.

**Acceptance**

- [ ] `import { cn } from '@/lib/cn'` resolves in the editor **and** in `yarn build`.
- [ ] `cn('px-4', 'px-6')` returns `'px-6'`.
- [ ] `cn('p-2', condition && 'p-4', undefined)` behaves correctly for both branches.
- [ ] Explicit return type present; no `any`.

**Commit:** `feat: add cn class-merging utility`

---

## [ ] E01-T07 — Verify the gates actually gate

**Files:** none (verification only — may be folded into E01-T06's commit if it produces
no diff)

E01's whole justification is that the rules are enforced mechanically rather than
remembered. That claim is worth ten minutes of proof. Every probe below is written,
observed to fail, then reverted.

**Scope**

Run all four gates clean:

```
yarn typecheck && yarn lint && yarn format:check && yarn build
```

Then confirm each rule bites:

| Probe                              | Expected                                          |
| ---------------------------------- | ------------------------------------------------- |
| `const x: any = 1`                 | `yarn lint` errors                                |
| `<img src="/x.png" />`             | `yarn lint` errors (not warns)                    |
| Imports in wrong order             | `yarn lint --fix` reorders them                   |
| `export function f() { return 1 }` | `yarn lint` errors on missing return type         |
| `const s: string = 1`              | `yarn typecheck` errors                           |
| Scrambled `className` order        | `yarn format` reorders                            |
| `let a: string; a.length`          | `yarn typecheck` errors (strict null checks live) |

**Acceptance**

- [ ] All four gate commands pass on a clean tree.
- [ ] All seven probes behave as tabulated.
- [ ] Every probe reverted; `git status` clean afterwards.
- [ ] Any probe that did **not** fail is fixed by amending T01–T04 rather than noted as
      a known gap.

**Commit:** none, unless a config fix was needed → `fix: <the specific gate that was
not enforcing>`

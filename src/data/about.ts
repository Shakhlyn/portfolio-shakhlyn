import type { AboutType } from '@/types/about.types';

/**
 * DRAFT COPY — every fact here is from the CV, but the wording is mine, not
 * yours. 1-prd.md §6 permits unpolished bio copy during development and expects
 * it rewritten in your own voice before launch.
 *
 * The transition story leads deliberately: 1-prd.md §3 asks for the
 * non-traditional background to be framed as a differentiator rather than
 * apologised for.
 *
 * TODO(content): rewrite in your own voice. Keep it to two or three paragraphs —
 * docs/3-style-preference.md §6.5 rules out an accordion or a "read more".
 *
 * **Figures marked `TODO(content): INVENTED FIGURE` are development
 * placeholders**, not facts (`1-prd.md` §6, `AGENTS.md` §13).
 *
 *     grep -rn "INVENTED FIGURE" src/
 */
export const ABOUT: AboutType = {
  paragraphs: [
    // TODO(content): INVENTED FIGURE — "operators in nine markets". The stack,
    // the embedded contract role, and the three countries are real.
    'I build enterprise web applications, mostly in TypeScript and React, with backend work in Python and FastAPI. For the past two years I have worked as a contracted engineer embedded in a telecom product team whose platform serves operators in nine markets, collaborating day to day with engineers, QA, business analysts, product managers, and UX designers across Bangladesh, India, and the United States.',
    'My degree is in Leather Products Engineering, not computer science. I moved into software through independent study and shipping real things, and I think that route left me better at the parts of the job that are not writing code — clarifying a requirement before building against it, asking what a feature is actually for, and debugging a production problem without assuming I already know the cause.',
    // TODO(content): INVENTED FIGURE — "a dozen screens", "20+ forms". The three
    // pieces of work themselves are real.
    'The work I am proudest of is the kind that removes repeated effort rather than adding a screen: a configuration-driven table framework now behind a dozen screens, which made complex deal comparison possible without a third-party dependency; a validation engine that 20+ forms declare rules against instead of reimplementing them; and a Linux setup system that is safe to re-run because it was designed to be idempotent.',
  ],
};

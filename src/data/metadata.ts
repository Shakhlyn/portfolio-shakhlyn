import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/site';
import type { RouteMetadataType } from '@/types/metadata.types';
import type { ProjectType } from '@/types/project.types';
import type { WritingPostType } from '@/types/writing.types';

/**
 * Per-route titles and descriptions. Copy lives here rather than in the page
 * components (AGENTS.md §14) — a meta description is page copy, and it is the
 * one piece of copy a recruiter reads before they ever load the site.
 *
 * Descriptions are written to 120–160 characters: shorter reads as unfinished
 * in a search result, longer is cut mid-clause.
 */

export const HOME_METADATA: RouteMetadataType = {
  // buildTitle returns SITE_TITLE unchanged for SITE_NAME. The positioning
  // keywords already live there, which is where 2-architecture.md §8 puts them
  // rather than padding the h1.
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: '/',
};

export const RESUME_METADATA: RouteMetadataType = {
  title: 'Resume',
  description:
    'Resume of Shaokh Al Mahmud Shakhlyn — software engineer working in TypeScript, React, Python, and FastAPI. Viewable in the browser and downloadable as a PDF.',
  path: '/resume',
};

/**
 * TODO(E14): the writing route is a stub. `noindex` is applied at the call site
 * from the published-post count, not hardcoded here, so this constant needs no
 * edit when real posts land.
 */
export const WRITING_METADATA: RouteMetadataType = {
  title: 'Writing',
  description:
    'Technical notes by Shaokh Al Mahmud Shakhlyn on building and shipping enterprise web applications — what the work actually involved, written up afterwards.',
  path: '/writing',
};

export const NOT_FOUND_METADATA: RouteMetadataType = {
  title: 'Page Not Found',
  description:
    'That page does not exist. Links back to the home page, the project work, the resume, and the contact section of the portfolio of Shaokh Al Mahmud Shakhlyn.',
  path: '/404',
  noindex: true,
};

/**
 * A project's description is its own `summary` — never a second copy of it.
 * `2-architecture.md` §8 requires project summaries be rendered as real text,
 * and a meta description that disagrees with the visible summary is exactly
 * what a crawler penalises and a reviewer notices.
 */
export const buildProjectMetadata = (project: ProjectType): RouteMetadataType => ({
  title: project.title,
  description: project.summary,
  path: `/projects/${project.slug}`,
});

/**
 * Same rule as projects: the post's own `summary` is the description. Only
 * called for published posts — an unpublished or missing slug takes
 * `NOT_FOUND_METADATA` instead, so nothing here needs a `noindex` branch.
 */
export const buildWritingPostMetadata = (post: WritingPostType): RouteMetadataType => ({
  title: post.title,
  description: post.summary,
  path: `/writing/${post.slug}`,
});

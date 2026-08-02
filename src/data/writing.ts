import type { WritingPostType } from '@/types/writing.types';

/**
 * An empty-but-typed array is the correct and honest state. No fake
 * "coming soon" posts (docs/3-style-preference.md §6.9).
 *
 * While this is empty, /writing renders WritingEmptyState and the route stays
 * `noindex` (docs/2-architecture.md §8). The nav's Blog item should stay hidden
 * until at least one published post exists, or a recruiter clicks through to an
 * empty page (docs/5-epic-list.md E14).
 */
export const WRITING_POSTS: readonly WritingPostType[] = [];

export const getPublishedPosts = (): WritingPostType[] =>
  WRITING_POSTS.filter((post) => post.published);

export const getPostBySlug = (slug: string): WritingPostType | undefined =>
  WRITING_POSTS.find((post) => post.slug === slug);

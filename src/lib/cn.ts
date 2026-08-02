import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, resolving Tailwind conflicts so a caller's `className`
 * can override a component's own defaults instead of producing `px-4 px-6` and
 * depending on stylesheet order.
 *
 * Every conditional class in the codebase goes through this — never template
 * string concatenation (AGENTS.md §6).
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

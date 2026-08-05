import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

import {
  absoluteUrl,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  TWITTER_HANDLE,
} from './src/constants/site.ts';

/**
 * Emits the static crawler metadata into `index.html` at build time
 * (docs/2-architecture.md §8).
 *
 * The tags are generated rather than hand-written because Open Graph requires
 * absolute URLs — a relative `og:image` is silently dropped by every unfurler
 * that matters — and `SITE_URL` is a placeholder that changes exactly once, at
 * deploy. Hand-written tags would put that host in this file four times and in
 * `site.ts` once, and the deploy-day edit would miss one.
 *
 * `<title>` is deliberately *not* injected here. It stays literal in
 * `index.html` so the file still shows a title to anyone reading the source.
 */
const siteMetadata = (): Plugin => ({
  name: 'portfolio-site-metadata',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => ({
      html,
      tags: [
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'author', content: SITE_NAME },

        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: absoluteUrl('/') },
        { property: 'og:image', content: absoluteUrl(OG_IMAGE_PATH) },
        { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
        { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
        { property: 'og:image:alt', content: OG_IMAGE_ALT },
        { property: 'og:locale', content: SITE_LOCALE },

        // summary_large_image: `summary` crops a 1200x630 asset into a square
        // thumbnail, and the OG image was authored at that ratio.
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: TWITTER_HANDLE },
        { name: 'twitter:creator', content: TWITTER_HANDLE },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: absoluteUrl(OG_IMAGE_PATH) },
      ].map((attrs) => ({ tag: 'meta', attrs, injectTo: 'head' as const })),
    }),
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetadata()],
  resolve: {
    alias: {
      // Must stay in sync with compilerOptions.paths in tsconfig.app.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

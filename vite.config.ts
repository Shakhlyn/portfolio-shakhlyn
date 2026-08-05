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

/**
 * Inlines the built stylesheet into `index.html` and drops its `<link>`.
 *
 * The stylesheet was the page's only render-blocking resource, and it cost
 * ~730ms of First Contentful Paint on a throttled mobile profile — almost all
 * of it the extra round trip, not the parse. At 34 KB raw (7 KB gzipped over
 * the wire) it is small enough that a request of its own costs more than the
 * bytes do.
 *
 * The trade is caching: an inlined stylesheet is re-sent with every HTML
 * response instead of being cached separately. That is the right trade *here*
 * and only here — this is a single-page app, so a visitor fetches the HTML once
 * and then navigates entirely client-side. It would be the wrong trade for a
 * multi-page site.
 *
 * `enforce: 'post'` so it runs after Vite has emitted the bundle and rewritten
 * the HTML; `apply: 'build'` because the dev server has no built stylesheet and
 * must keep its own HMR-injected styles.
 */
const inlineStylesheet = (): Plugin => ({
  name: 'portfolio-inline-stylesheet',
  enforce: 'post',
  apply: 'build',
  generateBundle: (_options, bundle) => {
    const html = Object.values(bundle).find(
      (asset) => asset.type === 'asset' && asset.fileName.endsWith('.html'),
    );
    const css = Object.values(bundle).find(
      (asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'),
    );

    if (html?.type !== 'asset' || css?.type !== 'asset') return;

    const link = new RegExp(
      `<link[^>]+href="[^"]*${css.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
    );
    const source = String(html.source);
    if (!link.test(source)) return;

    html.source = source.replace(link, `<style>${String(css.source)}</style>`);
    delete bundle[css.fileName];
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetadata(), inlineStylesheet()],
  build: {
    /*
     * Never inline an asset as a base64 data URI. The default 4 KB threshold
     * caught the narrow `srcset` variants, which are 3–4 KB each, and inlining
     * them was strictly worse in three ways: base64 costs ~33% over the binary,
     * the bytes land in the entry chunk instead of a cacheable file, and an
     * image embedded in JavaScript cannot be lazy-loaded at all — the whole
     * point of `loading="lazy"` on the below-fold cards. Measured: +12 KB gzip
     * on the entry bundle before this was set.
     */
    assetsInlineLimit: 0,
    /*
     * One stylesheet, inlined into `index.html` by `inlineStylesheet` below.
     * `cssCodeSplit: false` guarantees there is exactly one to inline.
     */
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      // Must stay in sync with compilerOptions.paths in tsconfig.app.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

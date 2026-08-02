import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', '.yarn']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // AGENTS.md §5 — external packages → @/ aliases → relative → styles.
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^node:', '^@?\\w'], ['^@/'], ['^\\.'], ['^.+\\.css$']],
        },
      ],
      'simple-import-sort/exports': 'error',

      // AGENTS.md §4 — never use any; explicit return types on exports.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',

      // AGENTS.md §11 — no console.log left in committed code.
      'no-console': 'error',

      /*
       * AGENTS.md §10 — jsx-a11y violations are build-breaking, not warnings.
       * The recommended config ships most of these as 'warn', and a warning is
       * a thing people scroll past.
       *
       * Only 'warn' is promoted. Rules recommended has deliberately turned off
       * (deprecated ones such as label-has-for) stay off — enabling those would
       * be adding rules the plugin no longer stands behind, not enforcing
       * accessibility.
       */
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules ?? {})
          .filter(([, level]) => level === 'warn' || level === 1)
          .map(([rule]) => [rule, 'error']),
      ),
    },
  },
]);

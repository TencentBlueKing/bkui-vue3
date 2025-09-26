import { defineConfig } from 'eslint/config';

import vue3tsConfig from '@blueking/eslint-config-bk/vue3ts';

export default defineConfig([
  {
    ignores: ['**/node_modules', '**/release-dir', '**/release-dist'],
  },
  vue3tsConfig,
]);

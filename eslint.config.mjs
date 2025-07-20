import { defineConfig, globalIgnores } from 'eslint/config';
import { react, recommended } from 'eslint-config-satya164';

export default defineConfig([
  recommended,
  react,

  globalIgnores([
    '**/node_modules/',
    '**/coverage/',
    '**/dist/',
    '**/lib/',
    '**/.expo/',
    '**/.yarn/',
    '**/.vscode/',
  ]),
]);

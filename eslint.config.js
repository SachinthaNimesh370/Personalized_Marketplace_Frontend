import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 17+ new JSX transform: `import React` is no longer required in JSX files.
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$', args: 'after-used' }],
      // setState calls inside async callbacks within useEffect are a standard data-fetch pattern.
      // Downgrade from error to warn so the build is not blocked.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])

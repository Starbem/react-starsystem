import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'docs-site/dist', '*.config.*'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Story files use a CSF-style `render: (args) => { ... }` function that
    // legitimately calls hooks; it isn't a component/hook by naming
    // convention, so react-hooks/rules-of-hooks doesn't recognize it.
    // (Previously handled by eslint-plugin-storybook's flat/recommended config.)
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  prettier,
)

import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import parserTs from '@typescript-eslint/parser'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    // 👇 添加这个 settings
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // 指定 tsconfig 文件
        },
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            0,
            {
              devDependencies: true,
              peerDependencies: false,
            },
          ],
          // optionalDependencies: false,
        },
      ],
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.test.ts'],
  },
)

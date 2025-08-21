import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintPluginAstro from 'eslint-plugin-astro'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/public',
      '**/dist/**',
      '**/tests/**',
      'coverage',
      '.astro/**',
      'node_modules/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    files: [ '**/*.astro' ],
    plugins: {
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'astro/semi': [ 'error', 'never' ],
      indent: [ 'error', 2 ],
      '@stylistic/indent': 'off',
    },
  },
  {
    files: [ '**/*.{js,jsx,ts,tsx,mjs,cjs}' ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/array-bracket-spacing': [ 'error' ,'always' ],
      '@stylistic/curly-newline': [ 'error', 'always' ],
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/quotes': [ 'error', 'single' ],
      '@stylistic/semi': [ 'error', 'never' ],
      '@stylistic/jsx-wrap-multilines': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: [ 'PascalCase' ],
        },
      ],
      '@stylistic/jsx-curly-spacing': [
        'error',
        {
          when: 'always',
          children: true,
        },
      ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
          },
        },
      ],
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'warn',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: [ 'builtin',
            'external',
            'sibling',
            'parent' ],
          'newlines-between': 'never',
          pathGroupsExcludedImportTypes: [ 'builtin' ],
          pathGroups: [
            { group: 'external', pattern: '@/**', position: 'after' },
          ],
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: [ 'let', 'const', 'var' ], next: '*' },
        { blankLine: 'any', prev: [ 'let', 'const', 'var' ], next: [ 'let', 'const', 'var' ] },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      quotes: [ 'error', 'single' ],
      indent: [ 'error', 2 ],
      'max-len': [ 'error', { code: 136 } ],
    },
  },
  {
    files: [ '**/*.{ts,tsx}' ],
    rules: {
      indent: 'off',
      '@stylistic/indent': [ 'error', 2 ],
    },
  },
  {
    files: [ '**/*.{ts,tsx,js,jsx,astro}' ],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-relative-parent-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [ '../**' ]
        },
      ],
    },
  }
)

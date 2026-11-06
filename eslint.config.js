import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import perfectionist from 'eslint-plugin-perfectionist'
import playwright from 'eslint-plugin-playwright'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const ALLOWED_COMMENT = /^\s*(eslint-|@ts-expect-error|\/ <reference )/

const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/

const CAMEL_CASE = /^[a-z][A-Za-z0-9]*$/

const KIND_SUFFIX = /^\.(types|constants|functions|hooks)\.ts$/

const LOCAL_PLUGIN = {
  rules: {
    'one-component-per-file': {
      meta: {
        type: 'problem',
        messages: {
          tooMany:
            'Only one component per file. Move {{name}} into its own component folder.',
          nested:
            'Do not define components inside components. Move {{name}} into its own component folder.',
        },
        schema: [],
      },
      create(context) {
        let seen = 0
        return {
          FunctionDeclaration(node) {
            if (!node.id || !PASCAL_CASE.test(node.id.name)) {
              return
            }
            const nested = context.sourceCode
              .getAncestors(node)
              .some((ancestor) => ancestor.type.includes('Function'))
            if (nested) {
              context.report({
                node: node.id,
                messageId: 'nested',
                data: { name: node.id.name },
              })
              return
            }
            seen += 1
            if (seen > 1) {
              context.report({
                node: node.id,
                messageId: 'tooMany',
                data: { name: node.id.name },
              })
            }
          },
        }
      },
    },
    'single-object-params': {
      meta: {
        type: 'suggestion',
        messages: {
          tooMany:
            '{{name}} takes {{count}} parameters. Pass a single object parameter instead.',
        },
        schema: [],
      },
      create(context) {
        return {
          FunctionDeclaration(node) {
            if (node.params.length > 1) {
              context.report({
                node: node.id ?? node,
                messageId: 'tooMany',
                data: {
                  name: node.id?.name ?? 'Function',
                  count: node.params.length,
                },
              })
            }
          },
        }
      },
    },
    'file-naming': {
      meta: {
        type: 'problem',
        messages: { badName: '{{reason}}' },
        schema: [],
      },
      create(context) {
        return {
          Program(node) {
            const reason = fileNamingProblem(context.filename)
            if (reason) {
              context.report({ node, messageId: 'badName', data: { reason } })
            }
          },
        }
      },
    },
    'no-comments': {
      meta: {
        type: 'suggestion',
        messages: { noComments: 'Comments are not allowed.' },
        schema: [],
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (!ALLOWED_COMMENT.test(comment.value)) {
                context.report({ loc: comment.loc, messageId: 'noComments' })
              }
            }
          },
        }
      },
    },
  },
}

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'test-results', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: { local: LOCAL_PLUGIN, perfectionist },
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'local/no-comments': 'error',
      'local/one-component-per-file': 'error',
      'local/file-naming': 'error',
      'local/single-object-params': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['global', 'const'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Import from src using the @/ alias.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program > VariableDeclaration[kind="let"]',
          message: 'Module-level mutable state is not allowed.',
        },
        {
          selector:
            'Program > ExportNamedDeclaration > VariableDeclaration[kind="let"]',
          message: 'Module-level mutable state is not allowed.',
        },
        {
          selector: 'CallExpression[callee.name="createContext"]',
          message: 'Context stores are not allowed. Keep state local.',
        },
        {
          selector: 'ClassDeclaration',
          message: 'Use function components.',
        },
        {
          selector: 'TSEnumDeclaration',
          message: 'Use a const object with as const instead of an enum.',
        },
        {
          selector: 'TSTypeAliasDeclaration > TSUnionType > TSLiteralType',
          message:
            'Derive literal unions from a const object: (typeof X)[keyof typeof X].',
        },
      ],
      'func-style': ['error', 'declaration'],
      'perfectionist/sort-modules': [
        'error',
        {
          type: 'alphabetical',
          groups: [
            ['export-interface', 'export-type'],
            'export-function',
            ['interface', 'type'],
            'function',
          ],
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['e2e/**/*.ts', 'src/**/__e2e__/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/missing-playwright-await': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/prefer-locator': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/no-standalone-expect': 'off',
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionPatterns: ['^expect[A-Z]'],
        },
      ],
    },
  },
  {
    files: ['src/**/__e2e__/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              message: 'Import test and expect from @e2e/playwrightExtensions.',
            },
          ],
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Import from src using the @/ alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['e2e/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  {
    files: ['*.config.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
])

function fileNamingProblem(filename) {
  const parts = filename.split('/src/')
  if (parts.length < 2) {
    return null
  }
  const segments = parts.at(-1).split('/')
  const [area] = segments
  if (segments.length === 1) {
    return segments[0] === 'main.tsx'
      ? null
      : 'Only main.tsx may sit directly in src.'
  }
  if (area === 'components' || area === 'views') {
    return componentFileProblem(area, segments.slice(1))
  }
  if (area === 'common') {
    return commonFileProblem(segments.slice(1))
  }
  return `Code must live in src/components, src/views or src/common, not src/${area}.`
}

function componentFileProblem(area, segments) {
  const [folder, ...rest] = segments
  if (folder === 'ui') {
    return null
  }
  if (rest.length === 0) {
    return `Put ${folder} in its own folder: src/${area}/<Name>/<Name>.tsx.`
  }
  if (!PASCAL_CASE.test(folder)) {
    return `Folder ${folder} must be PascalCase.`
  }
  const file = rest.at(-1)
  if (rest.length === 1) {
    const suffix = file.slice(folder.length)
    return file.startsWith(folder) &&
      (suffix === '.tsx' || KIND_SUFFIX.test(suffix))
      ? null
      : `${file} must be ${folder}.tsx or ${folder}.<types|constants|functions|hooks>.ts.`
  }
  if (rest.length === 2 && rest[0] === '__tests__') {
    return /^[A-Z][A-Za-z0-9]*\.functions\.test\.ts$/.test(file) &&
      file.startsWith(`${folder}.`)
      ? null
      : `${file} must be ${folder}.functions.test.ts. Only functions are unit tested.`
  }
  if (rest.length === 2 && rest[0] === '__e2e__' && area === 'views') {
    return /^[a-z][A-Za-z0-9]*\.e2e\.test\.ts$/.test(file)
      ? null
      : `${file} must be <feature>.e2e.test.ts. Put helpers on the page object in e2e/.`
  }
  return `${rest.join('/')} is not an allowed location inside ${folder}.`
}

function commonFileProblem(segments) {
  const file = segments.at(-1)
  const [name, ...suffix] = file.split('.')
  if (segments.length === 1) {
    return CAMEL_CASE.test(name) && KIND_SUFFIX.test(`.${suffix.join('.')}`)
      ? null
      : `${file} must be camelCase <name>.<types|constants|functions|hooks>.ts.`
  }
  if (segments.length === 2 && segments[0] === '__tests__') {
    return CAMEL_CASE.test(name) && suffix.join('.') === 'functions.test.ts'
      ? null
      : `${file} must be <name>.functions.test.ts.`
  }
  return `${segments.join('/')} is not an allowed location in src/common.`
}

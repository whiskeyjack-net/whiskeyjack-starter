import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

/**
 * Whiskeyjack app lint rules – the AGENTS.md conventions a machine can check.
 * Every rule is chosen for a near-zero false-positive rate: a noisy rule
 * trains everyone, human and agent alike, to reach for eslint-disable.
 *
 * Deliberately NOT enforced here: the copywriting rule against contrastive
 * negation ("It's not X, it's Y"). Its legitimate exceptions ("no email
 * needed", error text) are indistinguishable from the banned form by regex,
 * so that one stays a review concern.
 */

/** Tailwind palette hues the design system does NOT map to tokens. */
const RAW_HUES = [
  'red', 'blue', 'green', 'purple', 'pink', 'gray', 'grey', 'slate', 'zinc',
  'stone', 'amber', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo',
  'violet', 'fuchsia', 'rose',
].join('|')

// bg-red-500, text-slate-700, border-sky-200, … but NOT the token-backed
// scales (neutral, warm, accent, success, warning, error, info, orange, yellow).
const RAW_PALETTE = String.raw`\b(bg|text|border|ring|divide|from|via|to|outline|decoration|shadow|fill|stroke|accent|caret)-(${RAW_HUES})-\d{2,3}\b`
// bg-[#ff0000], text-[#123], …
const ARBITRARY_HEX = String.raw`-\[#[0-9a-fA-F]{3,8}\]`

const EM_DASH = 'Use an en dash (–), never an em dash (—).'
const USE_TOKENS =
  'Use a design-system token scale (accent, neutral, warm, success, warning, error, info) instead of a raw Tailwind palette color.'
const USE_TOKEN_VAR =
  'Use a token CSS variable, e.g. bg-[var(--color-accent-500)], instead of a hardcoded hex.'

/* Four rules taken from dmmulroy/anti-slop (MIT), restated as selectors so no
   second linter has to be installed to enforce them. They reject types and test
   seams that assert more than the code can show. */
const NO_MODULE_MOCKING =
  'Do not mock a module. Pass the dependency in and substitute it at that seam -- a module mock asserts against a shape the test invented, so it keeps passing after the real module stops matching it.'
const NO_CHAINED_ASSERTION =
  'An assertion through `unknown` erases the evidence the next one claims. Narrow at the boundary (a type guard, a parse) or declare the real type -- for a global added by a native shell, that is a `Window` declaration.'
const NO_REFLECT =
  'Call the function or read the property directly. Reflect.get / Reflect.apply return `any`, so nothing below the call is checked.'
const NO_OBJECT_PARAM =
  'The `object` type says only "not a primitive". Name the shape the function actually reads.'

/** Hoisted so the test override below can drop one selector and keep the rest. */
const RESTRICTED_SYNTAX = [
  // Em dashes are banned project-wide, in UI copy and comments alike.
  { selector: 'Literal[value=/\\u2014/]', message: EM_DASH },
  { selector: 'TemplateElement[value.raw=/\\u2014/]', message: EM_DASH },
  { selector: 'JSXText[value=/\\u2014/]', message: EM_DASH },
  // Color must come from tokens, so raw Tailwind palette hues and arbitrary hex
  // values in a className are both wrong. The token-backed scales (neutral,
  // warm, accent, success, warning, error, info, orange, yellow) stay allowed.
  {
    selector: `JSXAttribute[name.name='className'] Literal[value=/${RAW_PALETTE}/]`,
    message: USE_TOKENS,
  },
  {
    selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${RAW_PALETTE}/]`,
    message: USE_TOKENS,
  },
  {
    selector: `JSXAttribute[name.name='className'] Literal[value=/${ARBITRARY_HEX}/]`,
    message: USE_TOKEN_VAR,
  },
  {
    selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${ARBITRARY_HEX}/]`,
    message: USE_TOKEN_VAR,
  },
  // anti-slop: a test seam is a parameter, never a module registry entry.
  {
    selector:
      "CallExpression[callee.object.name=/^(vi|jest)$/][callee.property.name=/^(mock|doMock|unmock|setMock)$/]",
    message: NO_MODULE_MOCKING,
  },
  // anti-slop: `x as unknown as Y`, and its angle-bracket spelling.
  { selector: 'TSAsExpression > TSAsExpression', message: NO_CHAINED_ASSERTION },
  { selector: 'TSTypeAssertion > TSTypeAssertion', message: NO_CHAINED_ASSERTION },
  // anti-slop: both of these hand back `any`.
  {
    selector:
      "CallExpression[callee.object.name='Reflect'][callee.property.name=/^(get|apply)$/]",
    message: NO_REFLECT,
  },
  // anti-slop: `object` in a parameter position. A `T extends object`
  // constraint is deliberately untouched -- there it bounds a type rather than
  // describing a value the function reads.
  {
    selector:
      ':function > :matches(Identifier, ObjectPattern, ArrayPattern, RestElement, AssignmentPattern) > TSTypeAnnotation > TSObjectKeyword',
    message: NO_OBJECT_PARAM,
  },
]

/**
 * A test stubs browser globals its runner does not implement and builds partial
 * event objects, and the double assertion is the standard spelling of both. The
 * ban holds everywhere it describes real evidence -- source.
 */
const RESTRICTED_SYNTAX_IN_TESTS = RESTRICTED_SYNTAX.filter(
  (rule) => rule.message !== NO_CHAINED_ASSERTION,
)

export default tseslint.config(
  { ignores: ['dist', 'src-tauri', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // `const { id, ...rest } = row` is the idiomatic way to OMIT a field;
          // the binding is unused on purpose. Flagging it pushes people toward a
          // delete or a lodash-shaped helper, both worse.
          ignoreRestSiblings: true,
        },
      ],

      // Icons: Phosphor only. The design system ships no icon library and takes
      // icon nodes as props, so a second one is always an accident.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              message: 'Icons are Phosphor only. Import from @phosphor-icons/react.',
            },
            {
              name: 'react-icons',
              message: 'Icons are Phosphor only. Import from @phosphor-icons/react.',
            },
            {
              name: '@radix-ui/react-icons',
              message: 'Icons are Phosphor only. Import from @phosphor-icons/react.',
            },
            {
              name: '@tabler/icons-react',
              message: 'Icons are Phosphor only. Import from @phosphor-icons/react.',
            },
          ],
          patterns: [
            {
              group: ['@heroicons/*'],
              message: 'Icons are Phosphor only. Import from @phosphor-icons/react.',
            },
          ],
        },
      ],

      'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX],
    },
  },
  {
    // Tests stub globals and assert on fixtures; `any`, non-null assertions and
    // the double assertion that spells a partial stub are load-bearing there.
    files: ['**/*.test.{ts,tsx}', '**/vitest.setup.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX_IN_TESTS],
    },
  },
)

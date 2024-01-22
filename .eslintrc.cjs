const maxLenIgnorePatterns = [
  // className prop
  'className=".+"',
  'className=\\{`.+`\\}',
  // Assuming strings that are length on their own line
  // are just className strings or constants
  "^\\s+'.*'[,:;]?\\s*$",

  // href attributes
  'href=".+"',

  // import statements
  '^import\\s.+\\sfrom\\s.+;$',

  // SVG d attributes
  '\\s+d=".+"',

  // eslint rules
  '(//|/\\*) eslint-',

  // FaqEntry titles
  'title=".+"',

  // backgroundImage style entry
  'backgroundImage: .+',
];

const rules = {
  'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  'eslint-comments/no-restricted-disable': [
    'error',
    // `alert` and `confirm` cannot be used in iframes so we can't allow it
    'no-alert',
    'eslint-comments/no-restricted-disable',
    'react-hooks/rules-of-hooks',
  ],
  'eslint-comments/no-unused-disable': 'error',
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      mjs: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/no-cycle': ['error', { maxDepth: 1 }],
  'import/order': [
    'error',
    {
      alphabetize: {
        order: 'asc',
      },
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
    },
  ],
  'jsx-a11y/anchor-is-valid': [
    'warn',
    {
      aspects: ['invalidHref', 'preferButton'],
      components: ['Link'],
      specialLink: ['hrefLeft', 'hrefRight'],
    },
  ],
  'max-len': [
    'warn',
    {
      ignoreComments: true,
      ignorePattern: `(${maxLenIgnorePatterns.join('|')})`,
    },
  ],
  'no-console': [
    'error',
    {
      allow: ['error'],
    },
  ],
  'no-underscore-dangle': 'off',
  'no-param-reassign': [
    'error',
    {
      ignorePropertyModificationsForRegex: ['state(_(.*?))?'],
      props: true,
    },
  ],
  'no-plusplus': [
    'error',
    {
      allowForLoopAfterthoughts: true,
    },
  ],
  'react/function-component-definition': 'off',
  'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
  'react/jsx-sort-props': ['warn', { reservedFirst: false }],
  'react/no-danger': 'off',
  // Not needed in Next
  'react/react-in-jsx-scope': 'off',
  // Adds unnecessary syntax for optional props
  'react/require-default-props': 'off',
  'react/sort-prop-types': 'warn',
  // TODO Remove once Airbnb allows this
  'react/static-property-placement': ['warn', 'static public field'],
  'react-hooks/exhaustive-deps': [
    'warn',
    {
      additionalHooks: '(useDrag|useDrop|useEnterKey)',
    },
  ],
  'rulesdir/no-dynamic-in-function': 'error',
  'rulesdir/no-typeof-window-outside-useeffect': 'error',
  'rulesdir/prefer-use-date': [
    'warn',
    {
      ignoreStories: true,
      ignoreTests: true,
    },
  ],
  'sort-destructure-keys/sort-destructure-keys': 'warn',
  'sort-imports': [
    'warn',
    {
      ignoreDeclarationSort: true,
    },
  ],
  'sort-keys': [
    'warn',
    'asc',
    {
      natural: true,
    },
  ],
};
const commonExtends = [
  'prettier',
  'plugin:compat/recommended',
  'plugin:eslint-comments/recommended',
  "plugin:cypress/recommended",
  "plugin:chai-friendly/recommended"
];

const rulesDirPlugin = require('eslint-plugin-rulesdir');

rulesDirPlugin.RULES_DIR = 'eslint-rules';

const commonPlugins = [
  'sort-destructure-keys',
  'rulesdir',
  "import",
  "react",
  "react-hooks",
  "jsx-a11y",
  "cypress"
];

module.exports = {
  ignorePatterns: ['**/*.d.ts'],
  overrides: [
    {
      extends: ['airbnb', ...commonExtends],
      files: ['*.js', '*.jsx', '*.cjs', '*.mjs'],
      parser: '@babel/eslint-parser',
      plugins: commonPlugins,
      rules
    },
    {
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      files: ['*.test.tsx, *.test.ts'],
      rules: { '@typescript-eslint/unbound-method': 'off' },
    },
    {
      extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended-type-checked',
        ...commonExtends,
      ],
      files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
      excludedFiles: ["*.test.js", "*.test.ts"],
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['deprecation', ...commonPlugins],
      rules: {
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            "checksVoidReturn": false
          }
        ],
        '@typescript-eslint/member-ordering': [
          'warn',
          {
            classes: {
              // Prefer react/sort-comp
              memberTypes: 'never',
            },
            default: {
              order: 'alphabetically',
            },
          },
        ],
        'deprecation/deprecation': 'warn',
        ...rules,
      },
    },
    {
      "files": ["*.json", "*.json5"],
      "parser": "jsonc-eslint-parser",
    }
  ],
  rules,
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
    // https://github.com/vercel/next.js/blob/canary/packages/
    // next-polyfill-nomodule/src/index.js
    polyfills: [
      'fetch',
      'Object.entries',
      'Object.fromEntries',
      'Object.values',
      'Promise',
      'String.prototype.replaceAll',
      'URL',
      'URLSearchParams',
    ],
    // tailwindcss: {
    //   config: 'tailwind.config.cjs',
    // },
  },
  env: {
    "cypress/globals": true,
  }
};

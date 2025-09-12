import type { Config } from 'stylelint'
import { defu } from 'defu'

const ignoreAtRules = [
  // tailwindcss
  'tailwind',
  'theme',
  'apply',
  'source',
  'utility',
  'variant',
  'custom-variant',
  'reference',
  'config',
  'plugin',
  // unocss
  'unocss',
]
function createDefaultConfig(): Config {
  return {
    extends: [
      // https://www.npmjs.com/package/stylelint-config-standard-scss
      // extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss']
      'stylelint-config-standard-scss',
      // https://github.com/ota-meshi/stylelint-config-recommended-vue/blob/main/lib/index.js
      // https://github.com/ota-meshi/stylelint-config-recommended-vue/blob/main/scss/index.js
      'stylelint-config-recommended-vue/scss',
      'stylelint-config-recess-order',
    ], // .map(module => require.resolve(module)),
    overrides: [
      // {
      //   files: ['*.vue', '**/*.vue'],
      //   rules: {
      //     'unit-allowed-list': ['em', 'rem', 's'],
      //   },
      // },
    ],
    rules: {
      // https://stylelint.io/user-guide/rules/unit-no-unknown/#ignoreunits-regex-regex-string
      'unit-no-unknown': [
        true,
        {
          ignoreUnits: ['rpx'],
        },
      ],
      // https://stylelint.io/user-guide/rules/selector-type-no-unknown/
      'selector-type-no-unknown': [
        true,
        {
          ignoreTypes: ['page'],
        },
      ],
      'at-rule-no-deprecated': [
        true,
        {
          ignoreAtRules,
        },
      ],
      'scss/selector-no-redundant-nesting-selector': true,
      'scss/at-rule-no-unknown': [
        true,
        {
          ignoreAtRules,
        },
      ],
    },
  }
}

// import.meta.resolve
export function icebreaker(config?: Config): Config {
  return defu(config, createDefaultConfig())
}

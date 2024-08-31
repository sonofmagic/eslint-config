import type { Config } from 'stylelint'

export function icebreaker(): Config {
  return {
    extends: [
      // extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss']
      'stylelint-config-standard-scss',
      // https://github.com/ota-meshi/stylelint-config-recommended-vue/blob/main/lib/index.js
      // https://github.com/ota-meshi/stylelint-config-recommended-vue/blob/main/scss/index.js
      'stylelint-config-recommended-vue/scss',
    ],
    overrides: [
      // {
      //   files: ['*.vue', '**/*.vue'],
      //   rules: {
      //     'unit-allowed-list': ['em', 'rem', 's'],
      //   },
      // },
    ],
  }
}

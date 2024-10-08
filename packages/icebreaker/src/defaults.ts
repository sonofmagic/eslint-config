import type { OptionsTypescript, OptionsVue } from './antfu'

export function getDefaultVueOptions() {
  const vueOptions: OptionsVue = {
    overrides: {
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/custom-event-name-casing': 'off',
      'vue/no-mutating-props': 'warn',
      // https://eslint.vuejs.org/rules/no-useless-v-bind.html
      'vue/no-useless-v-bind': [
        'error',
        {
          // 不允许注释
          ignoreIncludesComment: false,
          // 允许在里面使用转义
          // 比如 v-bind:foo="'bar\nbaz'"
          ignoreStringEscape: true,
        },
      ],
    },

  }
  return vueOptions
}

export function getDefaultTypescriptOptions() {
  const typescriptOptions: OptionsTypescript = {
    overrides: {
      'ts/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'ts/prefer-ts-expect-error': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/no-use-before-define': 'warn',
      'ts/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  }
  return typescriptOptions
}

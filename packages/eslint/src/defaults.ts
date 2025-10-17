import type { OptionsTypescript, OptionsVue } from './antfu'
import type { UserDefinedOptions } from './types'
import INLINE_ELEMENTS from 'eslint-plugin-vue/lib/utils/inline-non-void-elements.json'

//  'vue/no-deprecated-slot-attribute': 'off',
export function getDefaultVueOptions(opts?: UserDefinedOptions) {
  const overrides: OptionsVue['overrides'] = {
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
    // https://eslint.vuejs.org/rules/no-unused-refs.html
    'vue/no-unused-refs': 'warn',
  }
  // ionic 启用
  // 这是因为 ionic vue 也是依赖 web component 的 slot 的，这个会和 vue slot 有冲突
  if (opts?.ionic) {
    overrides['vue/no-deprecated-slot-attribute'] = 'off'
  }
  // 小程序启用
  if (opts?.weapp) {
    overrides['vue/singleline-html-element-content-newline'] = [
      'warn',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: [
          // 小程序标签
          'text',
          ...INLINE_ELEMENTS,
        ],
        externalIgnores: [],
      },
    ]
  }
  const vueOptions: OptionsVue = {
    overrides,
  }
  return vueOptions
}

export function getDefaultTypescriptOptions(opts?: UserDefinedOptions) {
  const overrides: OptionsTypescript['overrides'] = {
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
  }
  if (opts?.nestjs) {
    Object.assign(overrides, {
      'ts/interface-name-prefix': 'off',
      'ts/explicit-function-return-type': 'off',
      'ts/explicit-module-boundary-types': 'off',
      'ts/no-explicit-any': 'off',
      'ts/consistent-type-imports': 'off',
    })
  }
  const typescriptOptions: OptionsTypescript = {
    overrides,
  }
  return typescriptOptions
}

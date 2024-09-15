import type { Linter } from 'eslint'
import type { UserConfigItem, UserDefinedOptions } from './types'
import { interopDefault } from './antfu'

export function getPresets(options: UserDefinedOptions) {
  const {
    tailwindcss: enableTailwindcss,
    mdx: enableMDX,
    a11y: enableA11y,
    vue: enableVue,
    react: enableReact,
    // ...opts
  } = options
  const presetRules: Partial<Linter.RulesRecord> = {
    'curly': ['error', 'all'],
    'no-console': ['warn'],
    // 问题在于 auto fix 的时候，会直接 remove 整个 import ，而我们想让用户自己去 remove
    // 'unused-imports/no-unused-imports': 'error',
    // https://typescript-eslint.io/rules/no-unused-vars/
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',

  }
  if (enableVue) {
    Object.assign(presetRules, {
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/custom-event-name-casing': 'off',
      'vue/no-mutating-props': 'warn',
    } as Partial<Linter.RulesRecord>)
    if (typeof enableVue === 'object') {
      if (enableVue.vueVersion === 2) {
        Object.assign(presetRules, {
          'vue/no-v-for-template-key-on-child': 'off',
          'vue/no-v-for-template-key': 'error',
          'vue/no-deprecated-v-bind-sync': 'off',
        } as Partial<Linter.RulesRecord>)
      }
      else {
        Object.assign(presetRules, {
          'vue/no-v-for-template-key-on-child': 'error',
          'vue/no-v-for-template-key': 'off',
        } as Partial<Linter.RulesRecord>)
      }
    }
  }
  const presets: UserConfigItem[] = [
    {
      rules: presetRules,
    },
  ]

  // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/335
  if (enableTailwindcss) {
    presets.push(
      interopDefault(
        // @ts-ignore
        import('eslint-plugin-tailwindcss'),
      ).then((tailwind) => {
        return tailwind.configs['flat/recommended']
      }),
    )
    presets.push({
      rules: {
        'tailwindcss/no-custom-classname': 'off',
      },
    })
  }

  if (enableMDX) {
    presets.push(interopDefault(import('eslint-plugin-mdx')).then((mdx) => {
      return [
        {
          ...mdx.flat,
          processor: mdx.createRemarkProcessor({
            lintCodeBlocks: true,
            languageMapper: {},
          }),
        },
        {
          ...mdx.flatCodeBlocks,
          rules: {
            ...mdx.flatCodeBlocks.rules,
          },
        },
      ]
    }))
  }

  if (enableA11y) {
    if (enableVue) {
      presets.push(
        interopDefault(
          // @ts-ignore
          import('eslint-plugin-vuejs-accessibility'),
        ).then((pluginVueA11y) => {
          return pluginVueA11y.configs['flat/recommended']
        }),
      )
    }

    if (enableReact) {
      presets.push(
        interopDefault(
          // @ts-ignore
          import('eslint-plugin-jsx-a11y'),
        ).then((jsxA11y) => {
          return jsxA11y.flatConfigs.recommended
        }),
      )
    }
  }
  return presets
}

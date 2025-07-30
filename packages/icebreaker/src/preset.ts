import type { Linter } from 'eslint'
import type { UserConfigItem, UserDefinedOptions } from './types'
import { defu } from 'defu'
import { interopDefault } from './antfu'
import { getDefaultTypescriptOptions, getDefaultVueOptions } from './defaults'
import { isObject } from './utils'

export function getPresets(options?: UserDefinedOptions, mode?: 'legacy'): [UserDefinedOptions, ...UserConfigItem[]] {
  const opts = defu<UserDefinedOptions, UserDefinedOptions[]>(options, {
    formatters: true,
    javascript: {
      overrides: {
        'curly': ['error', 'all'],
        'no-console': ['warn'],
        // 问题在于 auto fix 的时候，会直接 remove 整个 import ，而我们想让用户自己去 remove
        // 'unused-imports/no-unused-imports': 'error',
        // https://typescript-eslint.io/rules/no-unused-vars/
        // https://github.com/antfu/eslint-config/blob/main/src/configs/javascript.ts
        // 'no-unused-vars': 'error',
        // 'no-undef': 'error',
        // 'prefer-const': 'off',
      },
    },
  })
  // #region vue rules

  const vueOptions = getDefaultVueOptions(options)
  if (opts.vue === true) {
    opts.vue = vueOptions
  }
  else if (isObject(opts.vue)) {
    opts.vue = defu(opts.vue, vueOptions)
  }
  // #endregion

  // #region typescript start
  const typescriptOptions = getDefaultTypescriptOptions(options)
  if (opts.typescript === undefined || opts.typescript === true) {
    opts.typescript = typescriptOptions
  }
  else if (isObject(opts.typescript)) {
    opts.typescript = defu(opts.typescript, typescriptOptions)
  }
  //  #endregion
  const {
    tailwindcss: enableTailwindcss,
    mdx: enableMDX,
    a11y: enableA11y,
    vue: enableVue,
    react: enableReact,
    // ...opts
  } = opts
  const presetRules: Partial<Linter.RulesRecord> = {
    'unused-imports/no-unused-vars': 'off',
  }
  const isLegacy = mode === 'legacy'
  // legacy preset
  if (isLegacy) {
    presetRules['perfectionist/sort-imports'] = 'off'
  }
  if (enableVue) {
    if (typeof enableVue === 'object') {
      const overrides = enableVue.overrides
      if (overrides) {
        if (enableVue.vueVersion === 2) {
          Object.assign(overrides, {
            'vue/no-v-for-template-key-on-child': 'off',
            'vue/no-v-for-template-key': 'error',
            'vue/no-deprecated-v-bind-sync': 'off',
          } as Partial<Linter.RulesRecord>)
        }
        else {
          Object.assign(overrides, {
            'vue/no-v-for-template-key-on-child': 'error',
            'vue/no-v-for-template-key': 'off',
          } as Partial<Linter.RulesRecord>)
        }
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
      // @ts-ignore
      interopDefault(
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
  return [opts, ...presets]
}

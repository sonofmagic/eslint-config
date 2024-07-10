import type {
  ConfigNames,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import { defu } from 'defu'
import { antfu, interopDefault } from './antfu'
import type { UserConfigItem, UserDefinedOptions } from './types'

export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    tailwindcss: enableTailwindcss = isPackageExists('tailwindcss'),
    mdx: enableMDX,
    a11y: enableA11y,
    ...opts
  } = defu<UserDefinedOptions, UserDefinedOptions[]>(options, {
    formatters: true,
  })

  const presets: UserConfigItem[] = [
    {
      rules: {
        'curly': ['error', 'all'],
        'no-console': ['warn'],
        'ts/prefer-ts-expect-error': 'off',
        'ts/ban-ts-comment': 'off',
        'vue/attribute-hyphenation': 'off',
        // 问题在于 auto fix 的时候，会直接 remove 整个 import ，而我们想让用户自己去 remove
        // 'unused-imports/no-unused-imports': 'error',
        // https://typescript-eslint.io/rules/no-unused-vars/
        'no-unused-vars': 'off',
        'ts/no-unused-vars': 'error',
      },
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
    if (opts.vue) {
      presets.push(
        interopDefault(
          // @ts-ignore
          import('eslint-plugin-vuejs-accessibility'),
        ).then((pluginVueA11y) => {
          return pluginVueA11y.configs['flat/recommended']
        }),
      )
    }

    if (opts.react) {
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

  return antfu(opts, ...presets, ...userConfigs)
}

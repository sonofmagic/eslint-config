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
        'unused-imports/no-unused-imports': 'error',
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

  return antfu(opts, ...presets, ...userConfigs)
}

import type {
  ConfigNames,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { isPackageExists } from 'local-pkg'
// @ts-ignore
import tailwind from 'eslint-plugin-tailwindcss'
import { antfu, interopDefault } from './antfu'
import type { UserConfigItem, UserDefinedOptions } from './types'

export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    prettier: enablePrettier,
    tailwindcss: enableTailwindcss = isPackageExists('tailwindcss'),
    mdx: enableMDX,
    ...opts
  } = options

  const presets: UserConfigItem[] = [
    {
      rules: {
        'curly': ['error', 'all'],
        'no-console': ['warn'],
        'ts/prefer-ts-expect-error': 'off',
        'ts/ban-ts-comment': 'off',
      },
    },
  ]
  if (enablePrettier) {
    presets.push(eslintPluginPrettierRecommended)
  }
  // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/335
  if (enableTailwindcss) {
    presets.push(...tailwind.configs['flat/recommended'])
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

import type {
  ConfigNames,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { FlatCompat } from '@eslint/eslintrc'
import { isPackageExists } from 'local-pkg'
import { antfu, interopDefault } from './antfu'
import type { UserConfigItem, UserDefinedOptions } from './types'

const compat = new FlatCompat()

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
    presets.push(...compat.config({
      extends: ['plugin:tailwindcss/recommended'],
    }))
  }

  if (enableMDX) {
    presets.push(interopDefault(import('eslint-plugin-mdx')).then((mdx) => {
      return [
        {
          ...mdx.flat,
          // optional, if you want to lint code blocks at the same
          processor: mdx.createRemarkProcessor({
            lintCodeBlocks: true,
            // optional, if you want to disable language mapper, set it to `false`
            // if you want to override the default language mapper inside, you can provide your own
            languageMapper: {},
          }),
        },
        {
          ...mdx.flatCodeBlocks,
          rules: {
            ...mdx.flatCodeBlocks.rules,
            // if you want to override some rules for code blocks
            // 'no-var': 'error',
            // 'prefer-const': 'error',
          },
        },
      ]
    }))
  }

  return antfu(opts, ...presets, ...userConfigs)
}

import type {
  ConfigNames,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { FlatCompat } from '@eslint/eslintrc'
import { isPackageExists } from 'local-pkg'
import { antfu } from './antfu'
import type { UserConfigItem, UserDefinedOptions } from './types'

const compat = new FlatCompat()

export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const { prettier, tailwindcss: enableTailwindcss = isPackageExists('tailwindcss'), ...opts } = options

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
  if (options?.prettier) {
    presets.push(eslintPluginPrettierRecommended)
  }
  // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/335
  if (enableTailwindcss) {
    presets.push(...compat.config({
      extends: ['plugin:tailwindcss/recommended'],
    }))
  }

  return antfu(opts, ...presets, ...userConfigs)
}

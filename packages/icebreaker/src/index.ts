import type { Linter } from 'eslint'
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { antfu } from './antfu'

export type UserDefinedOptions = OptionsConfig &
  TypedFlatConfigItem & { prettier?: boolean }

export type UserConfigItem = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.FlatConfig[]
>

export function icebreaker(
  options?: UserDefinedOptions,
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
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

  return antfu(options, ...presets, ...userConfigs)
}

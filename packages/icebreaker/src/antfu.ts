import { antfu } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export function icebreaker(
  options?: OptionsConfig & TypedFlatConfigItem,
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.FlatConfig[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu(options, {
    rules: {
      'curly': ['error', 'all'],
      'no-console': ['warn'],
    },
  }, ...userConfigs)
}

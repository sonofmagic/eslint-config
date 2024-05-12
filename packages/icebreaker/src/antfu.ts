import { antfu } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { TypedFlatConfigItem, ConfigNames, OptionsConfig, Awaitable } from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export function icebreakerWithoutPrettier(
  options?: OptionsConfig & TypedFlatConfigItem,
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu(options, ...userConfigs)
}




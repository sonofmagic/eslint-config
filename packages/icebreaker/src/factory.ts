import type {
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import { defu } from 'defu'
import { antfu } from './antfu'
import type { UserConfigItem, UserDefinedOptions } from './types'
import { getPresets } from './preset'

export function getRestConfigAndPresets(options?: UserDefinedOptions): [OptionsConfig & TypedFlatConfigItem, ...UserConfigItem[]] {
  const opts = defu<UserDefinedOptions, UserDefinedOptions[]>(options, {
    formatters: true,
  })
  const presets = getPresets(opts)
  return [opts, ...presets]
}

// for vue2 @see https://github.com/antfu/eslint-config/issues/367#issuecomment-1979646400
export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu(...getRestConfigAndPresets(options), ...userConfigs)
}

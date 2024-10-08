import type {
  ConfigNames,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { UserConfigItem, UserDefinedOptions } from './types'
import { antfu } from './antfu'
import { getPresets } from './preset'

// for vue2 @see https://github.com/antfu/eslint-config/issues/367#issuecomment-1979646400
export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu(...getPresets(options), ...userConfigs)
}

export function icebreakerLegacy(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
) {
  return antfu(...getPresets(options, 'legacy'), ...userConfigs)
}

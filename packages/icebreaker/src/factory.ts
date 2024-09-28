import type {
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { UserConfigItem, UserDefinedOptions } from './types'
import { defu } from 'defu'
import { antfu } from './antfu'
import { getPresets } from './preset'

export function getRestConfigAndPresets(options?: UserDefinedOptions, mode?: 'legacy'): [OptionsConfig & TypedFlatConfigItem, ...UserConfigItem[]] {
  const opts = defu<UserDefinedOptions, UserDefinedOptions[]>(options, {
    formatters: true,
    typescript: {
      overrides: {
        'ts/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        'ts/prefer-ts-expect-error': 'off',
        'ts/ban-ts-comment': 'off',
        'ts/no-use-before-define': 'warn',
        'ts/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
          },
        ],
      },
    },
  })

  const presets = getPresets(opts, mode)

  return [opts, ...presets]
}

// for vue2 @see https://github.com/antfu/eslint-config/issues/367#issuecomment-1979646400
export function icebreaker(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu(...getRestConfigAndPresets(options), ...userConfigs)
}

export function icebreakerLegacy(
  options: UserDefinedOptions = {},
  ...userConfigs: UserConfigItem[]
) {
  return icebreaker(...getRestConfigAndPresets(options, 'legacy'), ...userConfigs)
}

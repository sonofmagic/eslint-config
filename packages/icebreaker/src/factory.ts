import { defu } from 'defu'
import type {
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import { antfu } from './antfu'
import { getPresets } from './preset'
import type { UserConfigItem, UserDefinedOptions } from './types'

export function getRestConfigAndPresets(options?: UserDefinedOptions): [OptionsConfig & TypedFlatConfigItem, ...UserConfigItem[]] {
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

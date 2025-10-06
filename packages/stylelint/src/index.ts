import type { Config } from 'stylelint'
import { createIcebreakerStylelintConfig } from './config'

export { createIcebreakerStylelintConfig as createStylelintConfig } from './config'
export type {
  IcebreakerStylelintOptions,
  IgnoreListOptions,
  PresetToggles,
} from './types'

function mergeConfigs(base: Config, overrides?: Config): Config {
  if (!overrides) {
    return base
  }

  return {
    ...base,
    ...overrides,
    rules: {
      ...(base.rules ?? {}),
      ...(overrides.rules ?? {}),
    },
  }
}

export function icebreaker(config?: Config): Config {
  const base = createIcebreakerStylelintConfig()
  return mergeConfigs(base, config)
}

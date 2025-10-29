import type { Config } from 'stylelint'
import type { IcebreakerStylelintOptions, PresetToggles } from './types'
import { createRequire } from 'node:module'
import { PRESET_RECESS_ORDER, PRESET_STANDARD_SCSS, PRESET_VUE_SCSS } from './constants'
import { normalizeExtends, resolveIgnoreList, toArray, unique } from './utils'

const requireFromConfig = createRequire(import.meta.url)

const PRESET_PATH_STANDARD_SCSS = requireFromConfig.resolve(PRESET_STANDARD_SCSS)
const PRESET_PATH_VUE_SCSS = requireFromConfig.resolve(PRESET_VUE_SCSS)
const PRESET_PATH_RECESS_ORDER = requireFromConfig.resolve(PRESET_RECESS_ORDER)

function resolvePresetExtends(presets: PresetToggles | undefined): string[] {
  const entries: string[] = []
  if (presets?.scss !== false) {
    entries.push(PRESET_PATH_STANDARD_SCSS)
  }
  if (presets?.vue !== false) {
    entries.push(PRESET_PATH_VUE_SCSS)
  }
  if (presets?.order !== false) {
    entries.push(PRESET_PATH_RECESS_ORDER)
  }
  return entries
}

function resolveExtends(options: IcebreakerStylelintOptions | undefined): Config['extends'] {
  const presets = resolvePresetExtends(options?.presets)
  const extras = toArray(options?.extends)
  const values = unique([...presets, ...extras])
  return normalizeExtends(values)
}

function resolveOverrides(options: IcebreakerStylelintOptions | undefined): Config['overrides'] | undefined {
  const overrides = options?.overrides
  if (!overrides || overrides.length === 0) {
    return []
  }

  return [...overrides]
}

function resolveRules(options: IcebreakerStylelintOptions | undefined): Config['rules'] {
  const ignoreUnits = resolveIgnoreList('units', options?.ignores)
  const ignoreTypes = resolveIgnoreList('types', options?.ignores)
  const ignoreAtRules = resolveIgnoreList('atRules', options?.ignores)

  const rules: Config['rules'] = {
    'function-name-case': null,
    'unit-no-unknown': [
      true,
      {
        ignoreUnits,
      },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes,
      },
    ],
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules,
      },
    ],
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules,
      },
    ],
  }

  if (options?.rules) {
    return {
      ...rules,
      ...options.rules,
    }
  }

  return rules
}

export function createIcebreakerStylelintConfig(options: IcebreakerStylelintOptions = {}): Config {
  return {
    extends: resolveExtends(options),
    overrides: resolveOverrides(options),
    rules: resolveRules(options),
  }
}

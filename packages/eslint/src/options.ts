import type { Linter } from 'eslint'
import type { OptionsVue } from './antfu'
import type { TailwindcssOption, UserDefinedOptions } from './types'
import { defu } from 'defu'
import { getDefaultTypescriptOptions, getDefaultVueOptions } from './defaults'
import { isObject } from './utils'

const BASE_DEFAULTS: Pick<UserDefinedOptions, 'formatters' | 'javascript' | 'test'> = {
  formatters: true,
  javascript: {
    overrides: {
      'curly': ['error', 'all'],
      'no-console': ['warn'],
    },
  },
  test: {
    overrides: {
      'test/prefer-lowercase-title': ['off'],
    },
  },
}

const BASE_RULES: Partial<Linter.RulesRecord> = {
  'unused-imports/no-unused-vars': 'off',
  'unicorn/prefer-number-properties': 'warn',
}

export type ResolvedUserOptions = UserDefinedOptions & {
  tailwindcss?: TailwindcssOption | boolean
}

function applyVueVersionSpecificRules(option: OptionsVue | boolean | undefined): void {
  if (!option || typeof option !== 'object') {
    return
  }

  const overrides = option.overrides
  if (!overrides) {
    return
  }

  if (option.vueVersion === 2) {
    Object.assign(overrides, {
      'vue/no-v-for-template-key-on-child': 'off',
      'vue/no-v-for-template-key': 'error',
      'vue/no-deprecated-v-bind-sync': 'off',
    })
    return
  }

  Object.assign(overrides, {
    'vue/no-v-for-template-key-on-child': 'error',
    'vue/no-v-for-template-key': 'off',
  })
}

export function resolveUserOptions(options?: UserDefinedOptions): ResolvedUserOptions {
  const resolved = defu<UserDefinedOptions, [UserDefinedOptions, typeof BASE_DEFAULTS]>(
    {},
    options ?? {},
    BASE_DEFAULTS,
  ) as ResolvedUserOptions

  const vueOptions = getDefaultVueOptions(options)
  if (resolved.vue === true) {
    resolved.vue = vueOptions
  }
  else if (isObject(resolved.vue)) {
    resolved.vue = defu(resolved.vue, vueOptions)
  }

  applyVueVersionSpecificRules(resolved.vue)

  const typescriptOptions = getDefaultTypescriptOptions(options)
  if (resolved.typescript === undefined || resolved.typescript === true) {
    resolved.typescript = typescriptOptions
  }
  else if (isObject(resolved.typescript)) {
    resolved.typescript = defu(resolved.typescript, typescriptOptions)
  }

  return resolved
}

export function createBaseRuleSet(isLegacy: boolean): Partial<Linter.RulesRecord> {
  if (!isLegacy) {
    return BASE_RULES
  }

  return {
    ...BASE_RULES,
    'perfectionist/sort-imports': 'off',
  }
}

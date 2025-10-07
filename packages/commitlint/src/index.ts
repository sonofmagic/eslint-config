import type { RulesConfig, UserConfig } from '@commitlint/types'

import type { IcebreakerCommitlintOptions } from './types'
import {
  buildHeaderRules,
  buildScopeRules,
  buildSubjectRules,
  buildTypesConfig,
} from './builders'
import { DEFAULT_EXTENDS, DEFAULT_PARSER_PRESET } from './constants'
import { mergePrompts } from './prompt'
import { mergeUnique } from './utils'

export {
  type CommitHeaderOptions,
  type CommitlintUserConfig,
  type CommitScopeOptions,
  type CommitSubjectOptions,
  type CommitTypeDefinition,
  type CommitTypesOptions,
  type IcebreakerCommitlintOptions,
  RuleConfigSeverity,
} from './types'

export function createIcebreakerCommitlintConfig(
  options: IcebreakerCommitlintOptions = {},
): UserConfig {
  const { types, scopes, subject, header } = options

  const extendsList = mergeUnique([
    ...DEFAULT_EXTENDS,
    ...mergeUnique(options.extends ?? []),
  ])

  const rules: Partial<RulesConfig> = {
    ...buildScopeRules(scopes),
    ...buildSubjectRules(subject),
    ...buildHeaderRules(header),
  }

  const typesConfig = buildTypesConfig(types)
  if (typesConfig.rule) {
    rules['type-enum'] = typesConfig.rule
  }

  const mergedRules: Partial<RulesConfig> = {
    ...rules,
    ...(options.rules ?? {}),
  }

  const prompt = mergePrompts(typesConfig.prompt, options.prompt)

  return {
    extends: extendsList,
    parserPreset: DEFAULT_PARSER_PRESET,
    ...(Object.keys(mergedRules).length > 0 ? { rules: mergedRules } : {}),
    ...(prompt ? { prompt } : {}),
  }
}

export function icebreaker(options?: IcebreakerCommitlintOptions): UserConfig {
  return createIcebreakerCommitlintConfig(options)
}

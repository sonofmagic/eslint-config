import type {
  EnumRuleConfig,
  RuleConfigCondition,
  RulesConfig,
  TargetCaseType,
  UserConfig,
  UserPromptConfig,
} from '@commitlint/types'
import conventionalConfig from '@commitlint/config-conventional'
import { RuleConfigSeverity } from '@commitlint/types'

export { RuleConfigSeverity }

const DEFAULT_EXTENDS = ['@commitlint/config-conventional'] as const
const DEFAULT_PARSER_PRESET = 'conventional-changelog-conventionalcommits'

export interface CommitTypeDefinition {
  value: string
  title?: string
  description?: string
  emoji?: string
}

export interface CommitTypesOptions {
  add?: string[]
  definitions?: CommitTypeDefinition[]
  condition?: RuleConfigCondition
  severity?: RuleConfigSeverity
}

export interface CommitScopeOptions {
  values?: string[]
  required?: boolean
  case?: TargetCaseType | TargetCaseType[]
  severity?: RuleConfigSeverity
}

export interface CommitSubjectOptions {
  forbidden?: TargetCaseType | TargetCaseType[]
  caseCondition?: RuleConfigCondition
  caseSeverity?: RuleConfigSeverity
  allowEmpty?: boolean
  allowEmptySeverity?: RuleConfigSeverity
  fullStop?: boolean
  fullStopSeverity?: RuleConfigSeverity
  fullStopCharacter?: string
}

export interface CommitHeaderOptions {
  maxLength?: number
  condition?: RuleConfigCondition
  severity?: RuleConfigSeverity
}

export interface IcebreakerCommitlintOptions {
  extends?: string[]
  rules?: Partial<RulesConfig>
  types?: CommitTypesOptions
  scopes?: CommitScopeOptions
  subject?: CommitSubjectOptions
  header?: CommitHeaderOptions
  prompt?: UserPromptConfig
}

function asArray<T>(value?: T | T[]): T[] {
  if (value === undefined) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function mergeUnique<T>(values: T[]): T[] {
  const seen = new Set<T>()
  const result: T[] = []

  for (const value of values) {
    if (value === undefined || value === null) {
      continue
    }

    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }

  return result
}

function resolveBaseTypeRule(): {
  severity: RuleConfigSeverity
  condition: RuleConfigCondition
  values: string[]
} {
  const rule = conventionalConfig.rules?.['type-enum'] as EnumRuleConfig | undefined

  if (Array.isArray(rule)) {
    const severity = (rule[0] ?? RuleConfigSeverity.Error) as RuleConfigSeverity
    const condition = (rule[1] ?? 'always') as RuleConfigCondition
    const values = (rule[2] ?? []) as string[]

    return {
      severity,
      condition,
      values: [...values],
    }
  }

  return {
    severity: RuleConfigSeverity.Error,
    condition: 'always',
    values: [],
  }
}

function buildTypesConfig(options?: CommitTypesOptions): {
  rule?: EnumRuleConfig
  prompt?: UserPromptConfig
} {
  if (!options) {
    return {}
  }

  const baseRule = resolveBaseTypeRule()
  const additional = mergeUnique([
    ...baseRule.values,
    ...mergeUnique(options.add ?? []),
    ...mergeUnique((options.definitions ?? []).map(definition => definition.value)),
  ])

  let rule: EnumRuleConfig | undefined
  if (additional.length > 0) {
    rule = [
      options.severity ?? baseRule.severity,
      options.condition ?? baseRule.condition,
      additional,
    ]
  }

  if (!options.definitions?.length) {
    return { rule }
  }

  const basePromptType = conventionalConfig.prompt?.questions?.type
  const mergedEnum: Record<
    string,
    {
      title?: string
      description?: string
      emoji?: string
    }
  > = {
    ...((basePromptType?.enum as Record<string, { title?: string, description?: string, emoji?: string }> | undefined) ?? {}),
  }

  for (const definition of options.definitions) {
    const { value, title, description, emoji } = definition
    mergedEnum[value] = {
      ...(mergedEnum[value] ?? {}),
      title,
      description,
      emoji,
    }
  }

  const prompt: UserPromptConfig = {
    ...(conventionalConfig.prompt ?? {}),
    questions: {
      ...(conventionalConfig.prompt?.questions ?? {}),
      type: {
        ...(basePromptType ?? {}),
        enum: mergedEnum,
      },
    },
  }

  return { rule, prompt }
}

function buildScopeRules(options?: CommitScopeOptions): Partial<RulesConfig> {
  if (!options) {
    return {}
  }

  const rules: Partial<RulesConfig> = {}
  const severity = options.severity ?? RuleConfigSeverity.Error

  const scopeValues = mergeUnique(asArray(options.values))
  if (scopeValues.length > 0) {
    rules['scope-enum'] = [severity, 'always', scopeValues]
  }

  if (options.required !== undefined) {
    if (options.required) {
      rules['scope-empty'] = [severity, 'never']
    }
    else {
      rules['scope-empty'] = [RuleConfigSeverity.Disabled]
    }
  }

  const scopeCases = mergeUnique(asArray(options.case))
  if (scopeCases.length > 0) {
    rules['scope-case'] = [severity, 'always', scopeCases]
  }

  return rules
}

function buildSubjectRules(options?: CommitSubjectOptions): Partial<RulesConfig> {
  if (!options) {
    return {}
  }

  const rules: Partial<RulesConfig> = {}

  const forbiddenCases = mergeUnique(asArray(options.forbidden))
  if (forbiddenCases.length > 0) {
    rules['subject-case'] = [
      options.caseSeverity ?? RuleConfigSeverity.Error,
      options.caseCondition ?? 'never',
      forbiddenCases,
    ]
  }

  if (options.allowEmpty !== undefined) {
    if (options.allowEmpty) {
      rules['subject-empty'] = [RuleConfigSeverity.Disabled]
    }
    else {
      rules['subject-empty'] = [
        options.allowEmptySeverity ?? RuleConfigSeverity.Error,
        'never',
      ]
    }
  }

  if (options.fullStop !== undefined) {
    if (options.fullStop) {
      rules['subject-full-stop'] = [
        options.fullStopSeverity ?? RuleConfigSeverity.Error,
        'always',
        options.fullStopCharacter ?? '.',
      ]
    }
    else {
      rules['subject-full-stop'] = [RuleConfigSeverity.Disabled]
    }
  }

  return rules
}

function buildHeaderRules(options?: CommitHeaderOptions): Partial<RulesConfig> {
  if (!options) {
    return {}
  }

  const rules: Partial<RulesConfig> = {}
  const severity = options.severity ?? RuleConfigSeverity.Error
  const condition = options.condition ?? 'always'

  if (options.maxLength !== undefined) {
    rules['header-max-length'] = [severity, condition, options.maxLength]
  }

  return rules
}

function mergePrompts(
  base: UserPromptConfig | undefined,
  override: UserPromptConfig | undefined,
): UserPromptConfig | undefined {
  if (!base && !override) {
    return undefined
  }

  if (!base) {
    return override
  }

  if (!override) {
    return base
  }

  return {
    ...base,
    ...override,
    questions: {
      ...(base.questions ?? {}),
      ...(override.questions ?? {}),
    },
  }
}

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

  const hasRules = Object.keys(mergedRules).length > 0

  const prompt = mergePrompts(typesConfig.prompt, options.prompt)

  return {
    extends: extendsList,
    parserPreset: DEFAULT_PARSER_PRESET,
    ...(hasRules ? { rules: mergedRules } : {}),
    ...(prompt ? { prompt } : {}),
  }
}

export type { UserConfig as CommitlintUserConfig }

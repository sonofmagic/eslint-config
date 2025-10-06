import type { RuleConfigCondition, TargetCaseType, UserConfig, UserPromptConfig } from '@commitlint/types'
import type {
  CommitTypeDefinition,
  HeaderRuleOptions,
  IcebreakerCommitlintOptions,
  RuleTuple,
  ScopeRuleOptions,
  SubjectRuleOptions,
  TypeRuleOptions,
} from './types'
import {

  RuleConfigSeverity,

} from '@commitlint/types'
import {
  DEFAULT_BODY_MAX_LINE_LENGTH,
  DEFAULT_COMMIT_TYPES,
  DEFAULT_EXTENDS,
  DEFAULT_FOOTER_MAX_LINE_LENGTH,
  DEFAULT_FULL_STOP,
  DEFAULT_HEADER_MAX_LENGTH,
  DEFAULT_PARSER_PRESET,
  DEFAULT_PROMPT_BODY_DESCRIPTION,
  DEFAULT_PROMPT_BREAKING_BODY_DESCRIPTION,
  DEFAULT_PROMPT_BREAKING_DESCRIPTION,
  DEFAULT_PROMPT_IS_BREAKING_DESCRIPTION,
  DEFAULT_PROMPT_IS_ISSUE_AFFECTED_DESCRIPTION,
  DEFAULT_PROMPT_ISSUES_BODY_DESCRIPTION,
  DEFAULT_PROMPT_ISSUES_DESCRIPTION,
  DEFAULT_PROMPT_SCOPE_DESCRIPTION,
  DEFAULT_PROMPT_SUBJECT_DESCRIPTION,
  DEFAULT_PROMPT_TYPE_DESCRIPTION,
  DEFAULT_SUBJECT_FORBIDDEN_CASES,
  DEFAULT_TYPES,
} from './constants'
import {
  createDefaultCommitTypeDefinition,
  mergeDeep,
  mergeTypeDefinitions,
  removeUndefined,
  toArray,
  unique,
} from './utils'

function resolveExtends(entries?: IcebreakerCommitlintOptions['extends']): string[] {
  if (!entries) {
    return [...DEFAULT_EXTENDS]
  }
  const values = toArray(entries)
  return unique([...DEFAULT_EXTENDS, ...values])
}

interface TypeSettings {
  rule: RuleTuple<string[]>
  definitions: CommitTypeDefinition[]
}

function resolveTypeSettings(options?: TypeRuleOptions | string[]): TypeSettings {
  let severity = RuleConfigSeverity.Error
  let condition: RuleConfigCondition = 'always'
  let overrides: CommitTypeDefinition[] = []

  let values: string[]

  if (!options) {
    values = [...DEFAULT_TYPES]
  }
  else if (Array.isArray(options)) {
    values = unique(options)
  }
  else {
    severity = options.severity ?? severity
    condition = options.condition ?? condition
    overrides = options.definitions ?? []

    const base = options.values ? toArray(options.values) : DEFAULT_TYPES
    const additions = options.add ? toArray(options.add) : []
    values = unique([...base, ...additions])
  }

  if (values.length === 0) {
    return {
      definitions: [],
      rule: [RuleConfigSeverity.Disabled],
    }
  }

  const definitionsMap = mergeTypeDefinitions(DEFAULT_COMMIT_TYPES, overrides)
  const definitions = values.map(
    value => definitionsMap.get(value) ?? createDefaultCommitTypeDefinition(value),
  )

  return {
    definitions,
    rule: [severity, condition, values],
  }
}

function asCaseArray(value?: TargetCaseType | TargetCaseType[]): TargetCaseType[] {
  if (!value) {
    return []
  }
  return toArray(value)
}

function resolveScopeRules(options?: ScopeRuleOptions | string[]): NonNullable<UserConfig['rules']> {
  if (!options) {
    return {}
  }

  const rules: NonNullable<UserConfig['rules']> = {}

  const values = Array.isArray(options)
    ? unique(options)
    : unique([
        ...toArray(options.values ?? []),
        ...toArray(options.add ?? []),
      ])

  const baseSeverity = !Array.isArray(options)
    ? options.severity ?? RuleConfigSeverity.Error
    : RuleConfigSeverity.Error

  if (values.length > 0) {
    rules['scope-enum'] = [baseSeverity, 'always', values]
  }

  const allowEmpty = Array.isArray(options)
    ? true
    : options.allowEmpty ?? !options.required

  if (allowEmpty) {
    rules['scope-empty'] = [RuleConfigSeverity.Disabled]
  }
  else {
    rules['scope-empty'] = [baseSeverity, 'never']
  }

  if (!Array.isArray(options) && options.case) {
    const scopeCaseValues = asCaseArray(options.case)
    if (scopeCaseValues.length > 0) {
      const caseSeverity = options.caseSeverity ?? baseSeverity
      rules['scope-case'] = [caseSeverity, 'always', scopeCaseValues]
    }
  }

  return rules
}

function resolveSubjectRules(options?: SubjectRuleOptions): NonNullable<UserConfig['rules']> {
  const rules: NonNullable<UserConfig['rules']> = {}

  const forbiddenCases = asCaseArray(options?.forbidden)
  const subjectCases = forbiddenCases.length > 0 ? forbiddenCases : DEFAULT_SUBJECT_FORBIDDEN_CASES
  const caseSeverity = options?.caseSeverity ?? RuleConfigSeverity.Error
  rules['subject-case'] = [caseSeverity, 'never', subjectCases]

  if (options?.allowEmpty) {
    rules['subject-empty'] = [RuleConfigSeverity.Disabled]
  }
  else {
    const emptySeverity = options?.emptySeverity ?? RuleConfigSeverity.Error
    rules['subject-empty'] = [emptySeverity, 'never']
  }

  if (options?.fullStop === false) {
    rules['subject-full-stop'] = [RuleConfigSeverity.Disabled]
  }
  else {
    const fullStopSeverity = options?.fullStopSeverity ?? RuleConfigSeverity.Error
    const fullStop = options?.fullStop ?? DEFAULT_FULL_STOP
    rules['subject-full-stop'] = [fullStopSeverity, 'never', fullStop]
  }

  return rules
}

function resolveHeaderRules(options?: HeaderRuleOptions): NonNullable<UserConfig['rules']> {
  const severity = options?.severity ?? RuleConfigSeverity.Error
  const maxLength = options?.maxLength ?? DEFAULT_HEADER_MAX_LENGTH
  return {
    'header-max-length': [severity, 'always', maxLength],
  }
}

function createBaseRules(): NonNullable<UserConfig['rules']> {
  return {
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'body-max-line-length': [
      RuleConfigSeverity.Error,
      'always',
      DEFAULT_BODY_MAX_LINE_LENGTH,
    ],
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'footer-max-line-length': [
      RuleConfigSeverity.Error,
      'always',
      DEFAULT_FOOTER_MAX_LINE_LENGTH,
    ],
    'header-trim': [RuleConfigSeverity.Error, 'always'],
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'type-empty': [RuleConfigSeverity.Error, 'never'],
  }
}

function buildTypeEnum(
  definitions: CommitTypeDefinition[],
): Record<string, { description?: string, title?: string, emoji?: string }> {
  return definitions.reduce<Record<string, { description?: string, title?: string, emoji?: string }>>(
    (accumulator, definition) => {
      accumulator[definition.value] = {
        description: definition.description,
        title: definition.title,
        emoji: definition.emoji,
      }
      return accumulator
    },
    {},
  )
}

function createBasePrompt(definitions: CommitTypeDefinition[]): UserPromptConfig {
  return {
    questions: {
      type: {
        description: DEFAULT_PROMPT_TYPE_DESCRIPTION,
        enum: buildTypeEnum(definitions),
      },
      scope: {
        description: DEFAULT_PROMPT_SCOPE_DESCRIPTION,
      },
      subject: {
        description: DEFAULT_PROMPT_SUBJECT_DESCRIPTION,
      },
      body: {
        description: DEFAULT_PROMPT_BODY_DESCRIPTION,
      },
      isBreaking: {
        description: DEFAULT_PROMPT_IS_BREAKING_DESCRIPTION,
      },
      breakingBody: {
        description: DEFAULT_PROMPT_BREAKING_BODY_DESCRIPTION,
      },
      breaking: {
        description: DEFAULT_PROMPT_BREAKING_DESCRIPTION,
      },
      isIssueAffected: {
        description: DEFAULT_PROMPT_IS_ISSUE_AFFECTED_DESCRIPTION,
      },
      issuesBody: {
        description: DEFAULT_PROMPT_ISSUES_BODY_DESCRIPTION,
      },
      issues: {
        description: DEFAULT_PROMPT_ISSUES_DESCRIPTION,
      },
    },
  }
}

function resolvePrompt(
  definitions: CommitTypeDefinition[],
  overrides?: UserPromptConfig,
): UserPromptConfig {
  const base = createBasePrompt(definitions)
  return mergeDeep(base, overrides)
}

export function createIcebreakerCommitlintConfig(
  options: IcebreakerCommitlintOptions = {},
): UserConfig {
  const extendsField = resolveExtends(options.extends)
  const typeSettings = resolveTypeSettings(options.types)
  const scopeRules = resolveScopeRules(options.scopes)
  const subjectRules = resolveSubjectRules(options.subject)
  const headerRules = resolveHeaderRules(options.header)

  const baseRules = createBaseRules()
  const rules: NonNullable<UserConfig['rules']> = {
    ...baseRules,
    'type-enum': typeSettings.rule,
    ...scopeRules,
    ...subjectRules,
    ...headerRules,
    ...options.rules,
  }

  const prompt = resolvePrompt(typeSettings.definitions, options.prompt)

  return removeUndefined({
    extends: extendsField,
    formatter: options.formatter,
    parserPreset: options.parserPreset ?? DEFAULT_PARSER_PRESET,
    rules,
    ignores: options.ignores,
    defaultIgnores: options.defaultIgnores,
    plugins: options.plugins,
    helpUrl: options.helpUrl,
    prompt,
  })
}

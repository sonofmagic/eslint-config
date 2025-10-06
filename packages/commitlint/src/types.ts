import type {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
  UserConfig,
  UserPromptConfig,
} from '@commitlint/types'

export interface CommitTypeDefinition {
  value: string
  title: string
  description: string
  emoji?: string
}

export interface TypeRuleOptions {
  /**
   * Replace the default set of commit types.
   */
  values?: string | string[]
  /**
   * Extend the existing commit types without replacing them.
   */
  add?: string | string[]
  /**
   * Provide metadata for commit types, primarily used by the prompt.
   */
  definitions?: CommitTypeDefinition[]
  severity?: RuleConfigSeverity
  condition?: RuleConfigCondition
}

export interface ScopeRuleOptions {
  values?: string | string[]
  add?: string | string[]
  case?: TargetCaseType | TargetCaseType[]
  /**
   * Require scopes on every commit message. Equivalent to disallowing empty scopes.
   */
  required?: boolean
  /**
   * Explicitly allow empty scopes. Takes precedence over `required` when set.
   */
  allowEmpty?: boolean
  severity?: RuleConfigSeverity
  caseSeverity?: RuleConfigSeverity
}

export interface SubjectRuleOptions {
  forbidden?: TargetCaseType | TargetCaseType[]
  caseSeverity?: RuleConfigSeverity
  /**
   * Control the trailing character check. Set to `false` to disable the rule entirely.
   */
  fullStop?: string | false
  fullStopSeverity?: RuleConfigSeverity
  allowEmpty?: boolean
  emptySeverity?: RuleConfigSeverity
}

export interface HeaderRuleOptions {
  maxLength?: number
  severity?: RuleConfigSeverity
}

export interface IcebreakerCommitlintOptions {
  extends?: string | string[]
  types?: TypeRuleOptions | string[]
  scopes?: ScopeRuleOptions | string[]
  subject?: SubjectRuleOptions
  header?: HeaderRuleOptions
  rules?: UserConfig['rules']
  parserPreset?: UserConfig['parserPreset']
  formatter?: UserConfig['formatter']
  ignores?: UserConfig['ignores']
  defaultIgnores?: UserConfig['defaultIgnores']
  plugins?: UserConfig['plugins']
  helpUrl?: UserConfig['helpUrl']
  prompt?: UserPromptConfig
}

export type RuleTuple<T>
  = | readonly [RuleConfigSeverity.Disabled]
    | readonly [RuleConfigSeverity, RuleConfigCondition, T]

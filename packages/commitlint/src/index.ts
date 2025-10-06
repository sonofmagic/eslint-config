import type { UserConfig } from '@commitlint/types'
import type { IcebreakerCommitlintOptions } from './types'
import { createIcebreakerCommitlintConfig } from './config'

export { createIcebreakerCommitlintConfig }
export {
  DEFAULT_COMMIT_TYPES,
  DEFAULT_EXTENDS,
  DEFAULT_SUBJECT_FORBIDDEN_CASES,
  DEFAULT_TYPES,
} from './constants'
export type {
  CommitTypeDefinition,
  HeaderRuleOptions,
  IcebreakerCommitlintOptions,
  ScopeRuleOptions,
  SubjectRuleOptions,
  TypeRuleOptions,
} from './types'
export { RuleConfigCondition, RuleConfigSeverity, TargetCaseType } from '@commitlint/types'

export function createCommitlintConfig(
  options?: IcebreakerCommitlintOptions,
): UserConfig {
  return createIcebreakerCommitlintConfig(options)
}

export function icebreaker(options?: IcebreakerCommitlintOptions): UserConfig {
  return createIcebreakerCommitlintConfig(options)
}

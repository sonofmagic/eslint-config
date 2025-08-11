import type { UserConfig } from '@commitlint/types'
// import preset from '@commitlint/config-conventional'
import {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
} from '@commitlint/types'
import { defu } from 'defu'
// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/src/index.ts
export function icebreaker(config?: UserConfig): UserConfig {
  return defu<UserConfig, UserConfig[]>(config, {
    extends: ['@commitlint/config-conventional'],
  })
}

export {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
}

export type {
  UserConfig,
}

import type { UserConfig } from '@commitlint/types'
import preset from '@commitlint/config-conventional'
import {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
} from '@commitlint/types'
import { defu } from 'defu'

export function icebreaker(config?: UserConfig): UserConfig {
  return defu<UserConfig, UserConfig[]>(config, preset)
}

export {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
}

export type {
  UserConfig,
}

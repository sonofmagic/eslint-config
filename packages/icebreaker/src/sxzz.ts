import { sxzz } from '@sxzz/eslint-config'
import type { FlatESLintConfigItem } from 'eslint-define-config'

export type UserDefinedConfig = Parameters<typeof sxzz>[1]

export function icebreakerWithPrettier(
  config?: UserDefinedConfig,
  rules?: FlatESLintConfigItem | FlatESLintConfigItem[],
) {
  return sxzz(rules, config)
}

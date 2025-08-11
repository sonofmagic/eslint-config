import type { UserConfig } from '@commitlint/types'
import { defu } from 'defu'

export function icebreaker(config?: UserConfig): UserConfig {
  return defu(config, {
    extends: ['@commitlint/config-conventional'],
  })
}

export type {
  UserConfig,
}

import { sxzz } from '@sxzz/eslint-config'
// eslint-disable-next-line import/no-named-as-default
import antfu from '@antfu/eslint-config'

// import defu from 'defu'

type SxzzArgs = Parameters<typeof sxzz>

export function icebreaker(...args: SxzzArgs) {
  return sxzz(args[0], args[1])
}

export function icebreakerWithoutPrettier(...args: Parameters<typeof antfu>) {
  return antfu(...args)
}

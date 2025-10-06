import type { UserConfigItem, UserDefinedOptions } from './types'
import { resolveAccessibilityPresets, resolveMdxPresets, resolveTailwindPresets } from './features'
import { createBaseRuleSet, resolveUserOptions } from './options'

export function getPresets(options?: UserDefinedOptions, mode?: 'legacy'): [UserDefinedOptions, ...UserConfigItem[]] {
  const resolved = resolveUserOptions(options)
  const presets: UserConfigItem[] = [
    {
      rules: createBaseRuleSet(mode === 'legacy'),
    },
  ]

  presets.push(
    ...resolveTailwindPresets(resolved.tailwindcss),
    ...resolveMdxPresets(resolved.mdx),
    ...resolveAccessibilityPresets(resolved.a11y, resolved.vue, resolved.react),
  )

  return [resolved, ...presets]
}

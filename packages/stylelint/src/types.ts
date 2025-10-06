import type { Config } from 'stylelint'

export interface PresetToggles {
  /** Include rules for SCSS syntax. Enabled by default. */
  scss?: boolean
  /** Include Vue-specific recommendations. Enabled by default. */
  vue?: boolean
  /** Enforce property ordering via recess-order. Enabled by default. */
  order?: boolean
}

export interface IgnoreListOptions {
  /** Replace the default ignore-at-rules list. */
  atRules?: string[]
  /** Replace the default ignore selector types list. */
  types?: string[]
  /** Replace the default ignore units list. */
  units?: string[]
  /** Additional at-rules to ignore. */
  addAtRules?: string[]
  /** Additional selector types to ignore. */
  addTypes?: string[]
  /** Additional units to ignore. */
  addUnits?: string[]
}

export interface IcebreakerStylelintOptions {
  /** Toggle built-in preset bundles. */
  presets?: PresetToggles
  /** Append extra extends entries. */
  extends?: Config['extends']
  /** Append override entries. */
  overrides?: Config['overrides']
  /** Provide additional or replacement rule ignore lists. */
  ignores?: IgnoreListOptions
  /** Override or add rules. */
  rules?: Config['rules']
}

export type ResolvedIgnoreKind = 'atRules' | 'types' | 'units'

import type { Linter } from 'eslint'
import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export type UserDefinedOptions = OptionsConfig &
  TypedFlatConfigItem & { tailwindcss?: boolean, mdx?: boolean }

export type UserConfigItem = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.FlatConfig[]
>

export type {
  OptionsConfig,
  TypedFlatConfigItem,
}

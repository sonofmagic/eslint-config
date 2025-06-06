import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export type UserDefinedOptions = OptionsConfig & TypedFlatConfigItem & {
  tailwindcss?: boolean
  mdx?: boolean
  a11y?: boolean
  nest?: boolean
  ionic?: boolean
  weapp?: boolean
}

export type UserConfigItem = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.Config[]
>

export type {
  OptionsConfig,
  TypedFlatConfigItem,
}

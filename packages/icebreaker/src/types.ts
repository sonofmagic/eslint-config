import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export interface TailwindcssOption {
  /**
   * Tailwind CSS v4 entry point, e.g. `src/global.css`.
   */
  entryPoint?: string
  /**
   * Tailwind CSS v3 config file path, e.g. `tailwind.config.js`.
   */
  tailwindConfig?: string
}

export type TailwindcssConfig = boolean | TailwindcssOption

export type UserDefinedOptions = OptionsConfig & TypedFlatConfigItem & {
  /**
   * Enable TailwindCSS support
   * @default false
   */
  tailwindcss?: TailwindcssConfig
  /**
   * Enable MDX support
   * @default false
   */
  mdx?: boolean
  /**
   * Enable A11y support
   * @default false
   */
  a11y?: boolean
  /**
   * Enable NestJS support
   * @default false
   */
  nestjs?: boolean
  /**
   * Enable Ionic support
   * @default false
   */
  ionic?: boolean
  /**
   * Enable Weapp support
   * @default false
   */
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

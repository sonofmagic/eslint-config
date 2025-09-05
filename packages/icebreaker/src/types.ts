import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import { } from 'eslint-plugin-better-tailwindcss'

export type UserDefinedOptions = OptionsConfig & TypedFlatConfigItem & {
  /**
   * Enable TailwindCSS support
   * @default false
   */
  tailwindcss?: boolean | {
    /**
     * tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
     */
    entryPoint?: string
    /**
     * tailwindcss 3: the path to the tailwind config file (eg: `tailwind.config.js`)
     */
    tailwindConfig?: string
  }
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

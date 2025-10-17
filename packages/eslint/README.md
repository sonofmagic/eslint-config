# @icebreakers/eslint-config

> extend [@antfu/eslint-config](https://www.npmjs.com/package/@antfu/eslint-config) and add `tailwindcss` , `mdx` , and `prettier` format support!

## Usage

```bash
pnpm i -D eslint @icebreakers/eslint-config
```

```ts
// eslint.config.mjs
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker()
```

`icebreaker()` returns a `FlatConfigComposer`, so you can opt into extra presets by passing the options documented below and still append workspace-specific rules.

## Available options

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker({
  vue: true,
  typescript: true,
  tailwindcss: {
    tailwindConfig: './tailwind.config.ts',
  },
  mdx: process.env.ENABLE_MDX === 'true',
  a11y: true, // load JSX + Vue accessibility helpers
})
```

- `tailwindcss` – enable Tailwind presets (`true`) or provide entry paths for Tailwind v3/v4.
- `mdx` – enable linting for `.mdx` files with Remark-powered processors.
- `a11y` – adds accessibility rules for whichever of `vue`/`react` you enable via @antfu.
- `vue`, `typescript`, `javascript`, `test` – extend the upstream `@antfu/eslint-config` options; the defaults bundle stricter unused checks and Vue fixes for Ionic/Weapp projects.

## VS Code support

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Version: ( >=`3.0.10`)

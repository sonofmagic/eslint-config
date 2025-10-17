# @icebreakers/eslint-config

- [简体中文指南](./README.zh.md)

## Overview

`@icebreakers/eslint-config` extends the `@antfu/eslint-config` flat presets and layers extra rules for Tailwind CSS, MDX, Vue accessibility, and Icebreaker specific TypeScript defaults. It returns a `FlatConfigComposer`, so you can opt into only the presets you need and keep adding workspace specific overrides.

## Requirements

- Node.js 18 or newer
- ESLint 9 with flat config support
- Install optional peer plugins when you turn on Tailwind (`eslint-plugin-tailwindcss` or `eslint-plugin-better-tailwindcss`), MDX (`eslint-plugin-mdx`), or UnoCSS (`@unocss/eslint-plugin`)

## Installation

```bash
pnpm add -D eslint @icebreakers/eslint-config
```

## Quick Start

Create `eslint.config.ts` (or `.mjs`) in your project root:

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker()
```

Run ESLint via your package manager:

```bash
pnpm eslint "src/**/*.ts"
```

If you need the legacy array config, call `icebreakerLegacy()` instead.

## Enabling Presets

Each optional preset mirrors the flags in `@antfu/eslint-config` and adds Icebreaker tweaks:

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker({
  vue: true, // or { vueVersion: 2 }
  react: true,
  typescript: true,
  test: true,
  tailwindcss: {
    tailwindConfig: './tailwind.config.ts',
  },
  mdx: process.env.LINT_MDX === 'true',
  a11y: true,
  nestjs: true,
  ionic: true,
  weapp: true,
  formatters: true,
})
```

- `vue` – enables Vue + optionally version specific overrides (Vue 2/3) and ionic/weapp adjustments.
- `react` – defers to the upstream React preset and unlocks accessibility helpers when `a11y` is enabled.
- `tailwindcss` – pass `true` to use the built-in Tailwind flat config or provide `{ entryPoint, tailwindConfig }` for Tailwind v4/v3 projects.
- `mdx` – activates MDX linting via `eslint-plugin-mdx`.
- `a11y` – wires in JSX (React) and Vue accessibility plugins.
- `typescript` – extends the TypeScript preset and applies stricter unused diagnostics plus NestJS conveniences when `nestjs` is true.
- `formatters` – keeps the built-in formatting rules enabled by default.
- `test` – relaxes certain Vitest/Jest style rules (`test/prefer-lowercase-title`).

## Adding Extra Config Items

Because `icebreaker()` returns a composer you can append overrides:

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker(
  { typescript: true },
  {
    files: ['*.vue'],
    rules: {
      'vue/no-undef-components': 'off',
    },
  },
)
```

You may also pass other flat configs (e.g. from in-house presets) as additional arguments.

## IDE Integration

- Install the VS Code ESLint extension (`>=3.0.10`).
- Set `"eslint.experimental.useFlatConfig": true` for older VS Code builds.
- Use `pnpm lint -- --fix` in a pre-commit hook for consistent formatting.

## Troubleshooting

- Missing plugin errors usually mean the optional dependency is not installed in the current workspace. Add it with `pnpm add -D`.
- When combining legacy `.eslintrc` projects, prefer `icebreakerLegacy()` and move overrides into flat config format incrementally.
- Tailwind class validation reads from your `tailwind.config.*`; double check the path when using monorepo roots or custom build tooling.

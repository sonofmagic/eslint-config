# @icebreakers/stylelint-config

Reusable stylelint configuration with sensible defaults for Vue + SCSS projects and an opt-in API for tailoring the rule set.

## CLI helper

Bootstrap VS Code settings so diagnostics come from stylelint instead of the built-in CSS linters:

```sh
npx @icebreakers/stylelint-config
```

The command creates (or updates) `.vscode/settings.json` with the required `stylelint.validate` entries.

## Basic usage

```ts
// stylelint.config.ts
import { icebreaker } from '@icebreakers/stylelint-config'

export default icebreaker()
```

`icebreaker()` reflects the legacy behaviour: it returns the default preset and merges any partial stylelint config you pass in.

## Advanced configuration

For granular control, use `createStylelintConfig` which exposes preset toggles and ignore list helpers:

```ts
import { createStylelintConfig } from '@icebreakers/stylelint-config'

export default createStylelintConfig({
  presets: {
    vue: false, // drop vue-specific rules if you lint pure SCSS
  },
  ignores: {
    units: [], // replace the default ignore list
    addUnits: ['upx'],
  },
  extends: [
    '@acme/stylelint-config-custom',
  ],
  rules: {
    'color-hex-length': 'long',
  },
})
```

Available options:

- `presets.scss` – include `stylelint-config-standard-scss` (default `true`)
- `presets.vue` – include `stylelint-config-recommended-vue/scss` (default `true`)
- `presets.order` – include `stylelint-config-recess-order` (default `true`)
- `ignores.atRules`, `ignores.types`, `ignores.units` – replace the defaults
- `ignores.addAtRules`, `ignores.addTypes`, `ignores.addUnits` – append extra entries
- `extends` – append custom configs after the presets
- `overrides` / `rules` – carried straight into the resulting Stylelint config

Both helpers share the same defaults:

- Allow the `rpx` unit to ease mini-program support
- Ignore custom at-rules used by Tailwind CSS and UnoCSS
- Ignore the `page` selector for platform-specific stylesheets

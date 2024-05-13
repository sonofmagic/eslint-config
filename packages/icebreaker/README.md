# @icebreakers/eslint-config

> extend [@antfu/eslint-config](https://www.npmjs.com/package/@antfu/eslint-config) and add `prettier` support!

## Usage

```bash
pnpm i -D eslint @icebreakers/eslint-config
```

```ts
// eslint.config.mjs
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker()
```

or use with `prettier`:

```ts
// eslint.config.mjs
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker({
  prettier: true,
  stylistic: false,
})
```

## VS Code support

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Version: `^3.0.5` ( >=`3.0.5`)

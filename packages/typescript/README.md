# sonofmagic/eslint-config

- [sonofmagic/eslint-config](#sonofmagiceslint-config)
  - [Install](#install)
    - [.editorconfig](#editorconfig)
    - [.prettierrc](#prettierrc)
    - [.eslintrc.js](#eslintrcjs)
  - [@icebreakers/eslint-config-basic](#icebreakerseslint-config-basic)
  - [@icebreakers/eslint-config-ts](#icebreakerseslint-config-ts)

## Install

```shell
npm i -D eslint prettier @icebreakers/eslint-config-ts
```

### .editorconfig

```text
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = false
insert_final_newline = false
```

### .prettierrc

```json
{
    "tabWidth": 2,
    "useTabs": false,
    "semi": false,
    "singleQuote": true,
    "endOfLine": "lf",
    "trailingComma": "none",
    "printWidth": 180
}
```

### .eslintrc.js

```js
module.exports = {
  extends: ['@icebreakers/eslint-config-ts']
}
```

## @icebreakers/eslint-config-basic

```json
{
    "eslint-config-prettier": "^8.5.0",
    "eslint-config-standard": "^17.0.0",
    "eslint-plugin-import": "2.26.0",
    "eslint-plugin-jest": "^27.1.3",
    "eslint-plugin-n": "^15.3.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-promise": "6.1.1"
}

```

## @icebreakers/eslint-config-ts

extends basic and add `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`

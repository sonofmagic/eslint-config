# @icebreakers/eslint-config

## 简介

`@icebreakers/eslint-config` 基于 `@antfu/eslint-config` 的 flat config
预设，额外补充了 Tailwind CSS、MDX、Vue 无障碍以及 Icebreaker
团队常用的 TypeScript 默认规则。它返回一个 `FlatConfigComposer`，
可以按需启用不同预设，并继续追加工作区特定的覆盖项。

## 环境要求

- Node.js 18 或更高版本
- 支持 Flat Config 的 ESLint 9
- 如需启用 Tailwind、MDX、UnoCSS 等，可安装对应的可选依赖：
  `eslint-plugin-tailwindcss` / `eslint-plugin-better-tailwindcss`、
  `eslint-plugin-mdx`、`@unocss/eslint-plugin`

## 安装

```bash
pnpm add -D eslint @icebreakers/eslint-config
```

## 快速上手

在项目根目录创建 `eslint.config.ts`（或 `.mjs`）：

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker()
```

使用包管理器运行 ESLint：

```bash
pnpm eslint \"src/**/*.ts\"
```

如果仍需兼容旧的 `.eslintrc` 流程，可改用 `icebreakerLegacy()`。

## 启用可选预设

所有可选项与 `@antfu/eslint-config` 保持一致，并叠加 Icebreaker 的
调整：

```ts
import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker({
  vue: true, // 或 { vueVersion: 2 }
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

- `vue`：启用 Vue 规则，可根据 Vue 2/3 自动切换，并在 `ionic`、`weapp`
  选项开启时追加对应覆盖。
- `react`：复用上游 React 预设，配合 `a11y` 注入无障碍插件。
- `tailwindcss`：传入 `true` 使用内置 Tailwind flat 配置，或通过对象
  指定 Tailwind v4 的入口文件 / v3 的配置文件路径。
- `mdx`：激活 `eslint-plugin-mdx` 处理 `.mdx` 文件。
- `a11y`：按需引入 JSX 与 Vue 的无障碍规则。
- `typescript`：开启 TypeScript 预设，并在 `nestjs` 为 `true` 时放宽
  NestJS 场景常见限制。
- `formatters`：默认启用格式化辅助规则。
- `test`：放宽 Vitest / Jest 常见规则，例如关闭
  `test/prefer-lowercase-title`。

## 追加自定义配置

`icebreaker()` 返回的 composer 支持继续拼接 Flat Config：

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

亦可追加其它第三方或内部预设，统一合并。

## IDE 集成

- VS Code 安装 ESLint 扩展（版本需 ≥ 3.0.10）。
- 老版本 VS Code 需在设置中启用
  `"eslint.experimental.useFlatConfig": true`。
- 在 Git 钩子或 CI 中执行 `pnpm lint -- --fix` 确保格式一致。

## 常见问题

- 如果提示缺少插件，说明当前工作区未安装对应可选依赖，可通过
  `pnpm add -D` 补齐。
- 与旧版 `.eslintrc` 混用时建议先改用 `icebreakerLegacy()`，逐步迁移至
  Flat Config。
- Tailwind 校验依赖 `tailwind.config.*`，Monorepo 或自定义构建路径时请
  确认配置文件位置。

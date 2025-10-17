# @icebreakers/commitlint-config

## 1.2.2

### Patch Changes

- 🐛 **docs: reflow package READMEs for better rendering** — [`44d4b37`](https://github.com/sonofmagic/dev-configs/commit/44d4b37a47e0a0c327fedce97d3d04ce36425a87) · Thanks [@sonofmagic](https://github.com/sonofmagic) · Patch release

## 1.2.1

### Patch Changes

- [`17f4de2`](https://github.com/sonofmagic/dev-configs/commit/17f4de206a6a5301c38bb050c19076fae93e4880) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Inline the conventional preset defaults so downstream commitlint consumers no longer need to install `@commitlint/config-conventional` manually.

## 1.2.0

### Minor Changes

- [`2fede36`](https://github.com/sonofmagic/dev-configs/commit/2fede366a29ed990a435c1bd7947504cbcfeda45) Thanks [@sonofmagic](https://github.com/sonofmagic)! - - 重构内部模块结构，拆分规则构建、提示合并与工具函数，提升可维护性并覆盖全面单元测试
  - 新增中文 README，推荐通过 `icebreaker` 快速生成可定制的 commitlint 配置

## 1.1.1

### Patch Changes

- [`87c3e2e`](https://github.com/sonofmagic/dev-configs/commit/87c3e2e9c3f4562e01c22197c6aabc5d853bfd01) Thanks [@sonofmagic](https://github.com/sonofmagic)! - refactor: code

## 1.1.0

### Minor Changes

- [`90b8f0e`](https://github.com/sonofmagic/dev-configs/commit/90b8f0eb9d4f73cc1354a1efed569f5af8163dc0) Thanks [@sonofmagic](https://github.com/sonofmagic)! - - 用可配置的工厂替换此前对 `@commitlint/config-conventional` 的轻量封装，使其复制上游默认值并暴露带类型的提交类型、作用域、主题规则与交互提示选项
  - 将新的构建器以 `createIcebreakerCommitlintConfig`/`createCommitlintConfig` 形式导出，并让工作空间配置同步更丰富的默认值
  - 新增针对默认预设与常见定制场景的单元测试

## 1.0.4

### Patch Changes

- [`c201d06`](https://github.com/sonofmagic/dev-configs/commit/c201d06b9e4d001c083f71c7b3819b61219a106c) Thanks [@sonofmagic](https://github.com/sonofmagic)! - chore(deps): upgrade

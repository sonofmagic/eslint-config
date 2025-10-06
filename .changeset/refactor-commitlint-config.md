---
'@icebreakers/commitlint-config': minor
---

- 用可配置的工厂替换此前对 `@commitlint/config-conventional` 的轻量封装，使其复制上游默认值并暴露带类型的提交类型、作用域、主题规则与交互提示选项
- 将新的构建器以 `createIcebreakerCommitlintConfig`/`createCommitlintConfig` 形式导出，并让工作空间配置同步更丰富的默认值
- 新增针对默认预设与常见定制场景的单元测试

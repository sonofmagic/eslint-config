---
'@icebreakers/eslint-config': minor
---

- 重构选项解析为独立模块，确保 Vue/TypeScript 默认和 Tailwind、MDX、无障碍插件按需加载
- 新增 `TailwindcssOption` 类型导出，明确 v3/v4 配置入口字段
- 更新 README，说明如何组合可选预设并扩展 @antfu/eslint-config 配置

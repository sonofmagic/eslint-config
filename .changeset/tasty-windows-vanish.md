---
'@icebreakers/stylelint-config': major
---

- 重构核心配置工厂，新增 `createStylelintConfig` 以支持开关预设、扩展忽略列表并保持 `icebreaker()` 向后兼容
- 精简 VS Code 初始化逻辑，移除 `get-value`/`set-value` 依赖，保留原有设置输出
- 更新包导出结构与 README 用法示例，覆盖 CLI、构建产物和文档说明

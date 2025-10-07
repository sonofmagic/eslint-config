# @icebreakers/commitlint-config

`@icebreakers/commitlint-config` 是一个基于 `@commitlint/config-conventional` 的可配置 preset。我们在保留社区标准的基础上，提供了一套函数式 API，方便团队按需扩展类型、Scope、Subject 等规则，并同步更新 commit prompt 元数据。

## 快速开始

```bash
pnpm add -D @icebreakers/commitlint-config
```

### 使用默认配置

`commitlint.config.ts`

```ts
import { icebreaker } from '@icebreakers/commitlint-config'

export default icebreaker()
```

### 自定义选项

```ts
import { icebreaker, RuleConfigSeverity } from '@icebreakers/commitlint-config'

export default icebreaker({
  types: {
    definitions: [
      {
        value: 'deps',
        title: 'Dependencies',
        description: '依赖升级',
        emoji: '📦',
      },
    ],
  },
  scopes: {
    values: ['core', 'docs'],
    required: true,
  },
  subject: {
    forbidden: ['sentence-case', 'start-case'],
    caseSeverity: RuleConfigSeverity.Warning,
  },
  header: {
    maxLength: 100,
  },
})
```

## 导出的工具

- `icebreaker(options?)`: 推荐使用的工厂函数，合并默认规则与自定义规则。
- `createIcebreakerCommitlintConfig(options?)`: 与 `icebreaker` 等效的底层函数，便于需要显式命名的场景。
- `RuleConfigSeverity`: Enum，用于声明 commitlint 规则的严重级别。
- `CommitTypesOptions`、`CommitScopeOptions`、`CommitSubjectOptions`、`CommitHeaderOptions`: 细粒度配置类型。
- `CommitlintUserConfig`: 对应 commitlint 的最终配置类型。

## 测试

```bash
pnpm --filter @icebreakers/commitlint-config test
```

## 许可证

MIT License。

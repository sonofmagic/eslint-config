# @icebreakers/changelog-github

## 概述

`@icebreakers/changelog-github` 是 `@changesets/changelog-github` 的无缝替代版本。它保留原有的元组写法，却额外提供了我们在 Icebreaker 团队常用的格式优化：支持摘要里的自定义指令、更友好的提交链接，并且自动加载 dotenv，确保本地与 CI 的输出一致。

## 环境要求

- Node.js 18+
- 通过 `GITHUB_TOKEN`、`GH_TOKEN` 或 `.env` 暴露 GitHub Token

## 安装

```bash
pnpm add -D @changesets/cli @icebreakers/changelog-github
```

## 快速开始

在 `.changeset/config.json` 中切换 changelog 生成器，并声明仓库地址：

```json
{
  "changelog": [
    "@icebreakers/changelog-github",
    { "repo": "org/repo" }
  ]
}
```

之后执行 `pnpm changeset` 即可，生成的 changelog 会使用增强版格式器。

## 与 `@changesets/changelog-github` 的差异

- **摘要指令**：额外识别位于摘要首部的 `pr:`、`commit:`、`author:` / `user:`（不区分大小写），用于覆盖 GitHub 拉取的元数据，同时保留正文内容。
- **短哈希链接**：当提供 `commit:` 指令时，会以短 SHA 生成链接，而不是仅展示完整 URL，阅读体验更好。
- **版本类型提示**：对非 `none` 版本自动附加 `> MAJOR release`、`> MINOR release` 等提示，方便读者快速掌握影响范围。
- **自动加载 dotenv**：在访问 GitHub API 前调用 `dotenv`，本地 CLI 与 CI 行为保持一致，无需额外手动引入。
- **依赖更新板块**：列出依赖升级时，会根据变更集补全提交链接，并统一 Markdown 缩进，便于对齐阅读。

其它行为（元组参数、必须提供 `repo` 选项、基础排版）与上游保持兼容，因此迁移仅需替换包名。

## 编写变更摘要的技巧

可以借助摘要指令精准控制展示的元数据：

```
pr: #42
commit: 1234567890abcdef1234567890abcdef12345678
author: @octocat

为 lint preset 新增可选的 `tailwind-config` 配置项

- 接受相对路径指向 `tailwind.config.ts`
- 未设置时默认读取工作区根目录
```

最终 changelog 会渲染为：

```
- 为 lint preset 新增可选的 `tailwind-config` 配置项 (sonofmagic/dev-configs#42 · `1234567` · Thanks [@octocat](https://github.com/octocat)!)
  - 接受相对路径指向 `tailwind.config.ts`
  - 未设置时默认读取工作区根目录
> MINOR release
```

## GitHub 鉴权

设置具备读取公开仓库权限的 `GITHUB_TOKEN`（或 `GH_TOKEN`）。本地开发时可放在 `.env` 中；由于格式器会自动执行 `dotenv/config`，无需额外配置。

## 常见问题

- **缺少 repo 报错**：确认元组里包含 `org/repo` 字符串，缺失时格式器会立即抛错。
- **元数据为空**：检查 GitHub Token 是否生效，以及提交 / PR 是否存在于对应仓库。
- **摘要指令未生效**：指令需要放在摘要最顶部，并且每行单独书写；正文内容必须位于指令之后。

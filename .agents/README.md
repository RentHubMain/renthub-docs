# Agent 配置（`.agents/`）

本目录是仓库内 **AI 编码助手** 配置的单一来源：Skills、Rules 等均放在此处，便于版本管理与跨工具对齐。

## 目录

| 路径 | 说明 |
|------|------|
| [`skills/`](./skills/) | 可复用工作流（各子目录含 `SKILL.md`） |
| [`rules/`](./rules/) | 项目级持久规则（`.mdc`，如 `project-guide.mdc`） |

## Cursor 兼容

Cursor 默认读取 `.cursor/skills` 与 `.cursor/rules`。克隆或 `vp install` 后，`prepare` 会执行 `scripts/link-agents.mjs`，将上述路径 **链接** 到本目录，无需重复维护两份文件。

若链接缺失，可手动运行：

```bash
node scripts/link-agents.mjs
```

## 内置 Skills

| Skill | 用途 |
|-------|------|
| `renthub-commit` | RentHub Conventional Commits 提交助手 |
| `legal-version-release` | 法律文档版本归档与发布 |
| `ui-ux-pro-max` | UI/UX 设计检索与建议（第三方数据包） |

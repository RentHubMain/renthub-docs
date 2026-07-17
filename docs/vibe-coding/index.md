---
title: Vibe Coding 指南
---

本板块记录 RentHub 团队在 AI 辅助开发中的使用约定，覆盖从 Cursor 的具体用法，到 Cursor 内部机制，再到用 `npx skills` 跨工具安装 Agent Skills，最后到 Agent harness 执行层的完整路径。按这个顺序阅读，最容易把“怎么用”与“为什么这样设计”连起来。

## 目录

| 文件 | 内容 |
|------|------|
| [Cursor 使用指南](/docs/vibe-coding/cursor-guide) | 账号、模型选择、限额配置与 token 控制 |
| [Cursor 核心概念](/docs/vibe-coding/cursor-concepts) | Rules / Skills / Commands / Subagents / MCP 定义与 Best Practice |
| [Beyond Cursor：用 npx skills 安装 Agent Skills](/docs/vibe-coding/beyond-cursor-toolbox) | Node / npm 前提、`npx skills add` 与跨工具安装 |
| [Agent Harness：把 AI 变成可控工作流](/docs/vibe-coding/agent-harness) | 把模型、工具、状态和反馈组织成可交付流程 |

---

## 目标

读完本板块，你应当能够：

- 合理配置 Cursor 的模型选择与额度，有效控制 API 成本
- 理解 Cursor 的实际使用方式与效率边界
- 理解并运用 Rules、Skills、Commands、MCP 等 Cursor 核心概念
- 理解为何需要 `npx skills add`，并能在具备 Node / npm 的环境下安装与更新 Agent Skills
- 理解 agent harness 如何把模型、工具、状态和反馈连成可交付流程
- 在日常开发中高效运用 AI 工具完成需求，减少重复摸索

---

## 与工程协作的衔接

分支、Conventional Commits、PR / Review 与 `/renthub-commit` 的配合方式见 [Git 协作工作流](/docs/project-mgmt/git-workflow)；Git 命令与工作区概念见 [Git 基础入门](/docs/project-mgmt/git-basics)。第一次参与业务仓开发时，建议按 [新成员上手指南](/docs/quick-start/onboarding) 走通「克隆 → 测试 → 提交 → PR」全链路。

---

## 核心原则

- 优先用套餐内额度，仅在真正需要时才切换到高算力模型
- 保持上下文精简，主动控制 token 消耗
- 及时沉淀提示词与工作流，减少重复摸索

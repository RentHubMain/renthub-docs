---
title: Agent Harness：把 AI 变成可控工作流
---

前面三篇分别讲了怎么用 Cursor、Cursor 里有哪些核心机制，以及如何用 `npx skills` 把 Agent Skills 安装到多个客户端。到这一层，问题已经不是“模型会不会回答”，而是“模型生成的东西能不能稳定落地”。

**Harness 解决的核心问题**：AI 模型是概率性的，而软件交付需要确定性。Harness 是模型外面那一圈工程设施——规则、工具、状态、执行环境、反馈回路——负责把“大概率正确的输出”变成“可执行、可验证、可继续推进的工作”。

## 1. 没有 harness 的任务会怎样

考虑这个场景：你要让 Agent 完成一个“升级 3 个依赖包”的任务，分 3 天断断续续在做。

**没有 harness 时：**
- 第一天做完 2 个，但没有留下任何记录
- 第二天新开了一个对话，Agent 不知道已经做了什么，从头开始分析
- 第三天发现第一天的改动其实引入了一个 peer dependency 冲突，但因为没有在当时跑 build 验证，三天后才发现
- 最终花了 3 倍时间，还有返工

**有 harness 时：**

| 环节 | 做了什么 | 结果 |
|------|---------|------|
| 开始前 | 在 git 分支 + 一个 `progress.md` 文件里记录任务状态 | 下次对话直接接着做 |
| 每完成一个 | 立即 commit，写清楚做了什么 | git log 就是任务记录 |
| 每次改完 | 跑 `npm run build` | 立刻发现 peer dependency 冲突 |
| 第二天 | Agent 读 git log + progress.md，知道剩什么 | 不重复劳动 |

Harness 不是让 AI 更“聪明”，而是让任务不依赖单次对话的完整性。

---

## 2. Harness 管四件事

| 事情 | 具体做法 | 没做时的代价 |
|------|---------|------------|
| **方向约束** | Rules、Skills（含 `npx skills` 安装）、commands | 模型每次输出可能漂到不同风格 |
| **实际执行** | git、npm、构建工具、浏览器验证 | 模型只会“说”，不会真的做完 |
| **状态持久化** | 分支、commit 历史、progress 文件 | 多轮任务靠聊天记录维持，上下文变长后开始漂 |
| **反馈回路** | build 验证、review、构建日志 | 错误进入下一步甚至进入 main 才被发现 |

---

## 3. 长任务的两阶段模式

对于需要多轮对话才能完成的任务（跨天、中途中断、需要多人接力），这个模式最有效：

### 3.1 阶段一：初始化（第一个 session）

目标：把任务变成可接手的状态。

```
输出：
├── git 分支已创建（feature/xxx）
├── progress.md（记录：任务目标、当前状态、剩余步骤）
└── 已完成的第一个里程碑并 commit
```

`progress.md` 示例：

```markdown
# 任务：升级 Docusaurus 到 3.6

---

## 目标
把 Docusaurus 从 3.4 升级到 3.6，同时升级相关插件。

---

## 状态
- [x] 升级 @docusaurus/core 和 @docusaurus/preset-classic
- [x] 验证 npm run build 通过
- [ ] 检查 @docusaurus/plugin-content-docs 的 breaking changes
- [ ] 更新 docusaurus.config.ts 里已废弃的 API 调用

---

## 已知问题
升级后 search 插件出现警告，暂时不影响构建，待下一步处理。
```

### 3.2 阶段二：接续（后续 session）

每次新对话开始时，让 Agent 先读状态再行动：

```
先读 progress.md 和最近 5 条 git log，告诉我当前状态，
然后继续处理第一个未完成的步骤。
```

这样 Agent 不需要你重新解释背景，也不会“重做”已经完成的事情。

---

## 4. RentHub 三个场景的具体做法

### 4.1 改文档

文档修改最常见的错误是：改了内容，忘了同步 index 和 sidebar，导致构建失败或页面孤立。

**最小可靠流程：**

```
1. 先看相关页面（确认你要改哪里，不要扩散）
2. 只改必要文件
3. 同步父级 index.md 的目录表（如有）
4. 同步 sidebars.ts（如果是新文档或移动了位置）
5. 跑 npm run build 确认没有断链或 front matter 问题
```

让 Agent 帮你做时，加上这一句就能省很多来回：

```
改完 X 文件后，帮我检查它的父级 index.md 是否需要更新，
并跑 npm run build，把构建日志给我看。
```

### 4.2 发布法律文档版本

这类多步流程最适合 harness 化，因为它有明确的步骤和明确的产物。

本仓库的 `legal-version-release` skill 就是一个典型 harness 片段：

- **方向约束**：skill 里定义了所有需要改的文件和每一步的操作
- **实际执行**：Agent 直接运行 `npx docusaurus docs:version:legal` 和 `npm run build`
- **反馈回路**：构建通过才算完成，否则报错让你修
- **状态记录**：改动通过 `/renthub-commit` 提交，变更有迹可查

没有这个 skill，你每次发版都要在脑子里维护“6 步清单”，任何一步遗漏（忘更新 navbar、漏了某份协议的 tip 块）都要返工。

### 4.3 并行探索方案

当你不确定某个问题的最佳解法，可以用 Worktree Subagent 同时跑多个方向：

```
同时启动 2 个 Subagent，分别在独立的 worktree 里：
- 方案 A：用 React Query 重构数据获取层
- 方案 B：用 SWR 重构数据获取层

两个都跑完 npm run build 后，对比代码量和类型安全度，
然后告诉我推荐哪个。
```

**关键**：给每个 Agent 一个可验证的结束条件（构建通过 + 测试通过），而不是“写完了告诉我”——否则你还是要手动 review 才知道哪个更好。

---

## 5. 什么时候不需要 Harness

Harness 引入的是结构和约束，不是灵活性。以下情况不需要：

- **一次性、15 分钟内能完成的任务**：直接在对话里做，不用 progress 文件
- **探索性对话**：问问题、理解代码、头脑风暴——不需要 commit 和验证
- **你在主动驾驶**：你每一步都在看结果，随时纠正，harness 是为了减少你不看时出的错

判断标准很简单：**如果这个任务中断后你会有“下次在哪里接”的困惑，那就值得加 harness**。

---

## 6. 这和前四篇怎么连起来

| 层级 | 关注点 | 对应文章 |
|------|--------|----------|
| 使用层 | 怎么把 Cursor 用顺手 | [Cursor 使用指南](/docs/vibe-coding/cursor-guide) |
| 机制层 | Cursor 里的 Rules / Skills / Commands / MCP 怎么分工 | [Cursor 核心概念](/docs/vibe-coding/cursor-concepts) |
| 统一层 | 怎么用 `npx skills` 把 Skills 装到多个 AI 客户端 | [Beyond Cursor：用 npx skills 安装 Agent Skills](/docs/vibe-coding/beyond-cursor-toolbox) |
| 执行层 | 怎么把这些约定变成可交付的工程流程 | 本文 |

---

## 7. 参考阅读

- [Effective Harnesses for Long-Running Agents — Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [The Anatomy of an Agent Harness — LangChain](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)

---
title: Cursor 核心概念指南
---

本文覆盖 Cursor 的五个核心扩展机制：Rules、Skills、Commands、Subagents、MCP。理解它们的边界，能让你花最少的配置精力获得最大的 AI 协作效率。

---

## 1. Rules — 始终生效的静态上下文

### 1.1 是什么

Rules 是写给 Agent 的持久化指令，每次对话开始时自动注入到 context 中。本质是 `.cursor/rules/` 下的 Markdown 文件。

四种类型：

| 类型 | 触发方式 |
|------|---------|
| Always Apply | 每次对话都加载 |
| Apply Intelligently | Agent 根据 description 自行判断是否相关 |
| Apply to Specific Files | 匹配文件 glob 时加载 |
| Apply Manually | 在对话中 `@mention` 时加载 |

### 1.2 最佳实践

- **小而聚焦**：一个 rule 只管一件事，超过 500 行就拆分
- **指向具体文件**：写 `参考 @auth.ts 的模式` 而非把代码复制进来——文件变了 rule 不会过时
- **不要写 Agent 已知的事**：常见工具（npm、git）、通用编码规范不需要重复
- **按需新增**：发现 Agent 反复犯同一个错误时再写 rule，不要提前过度优化
- **纳入 git**：团队共享，更新 rule = 更新团队规范

---

## 2. Skills — 按需加载的动态能力

### 2.1 是什么

Skills 是可复用的工作流指令，定义在 `SKILL.md` 文件中，放在 `.cursor/skills/<skill-name>/` 下。与 Rules 的区别：

- Rules 每次都加载（静态）
- Skills 只在 Agent 判断相关时才加载（动态），不占 context window

Skills 支持：
- 自定义工作流（用 `/` 触发）
- Hooks（Agent 动作前后执行的脚本）
- 领域知识片段（按需拉取）

### 2.2 最佳实践

- 把**重复性的多步骤工作流**封装成 Skill，而非每次在对话里重新描述
- Skill 内容要具体、步骤明确，写法类似内部 SOP
- 触发频率高、步骤固定的流程（如部署、PR 流程）优先封装
- 不要把所有规范都塞进 Skill——结构性约束放 Rules，流程性操作放 Skills

### 2.3 项目示例

**示例 A — `renthub-commit`（单步 git 工作流）**

本仓库已内置 `renthub-commit` skill，封装了 RentHub 的 Conventional Commits 规范：

- 自动读取 `git diff` 分析改动
- 按规范起草 `type(scope): subject` + body
- 展示给用户确认后执行 `git commit`

触发方式：在 Composer 中说"帮我 commit"或输入 `/renthub-commit`。

---

**示例 B — `legal-version-release`（多步流程自动化）**

本仓库内置的第二个 skill，封装了法律文档的版本发布流程，是 Skill 处理复杂多步骤任务的典型示例：

触发后，Agent 依次执行：

1. 向用户确认旧版本号、新版本号、生效日期（三个参数）
2. 运行 `npx docusaurus docs:version:legal <旧版本>` 归档当前版本
3. 更新 `legal/` 下各协议文件的 front matter 与 tip 提示块
4. 更新 `docusaurus.config.ts` 中的版本标签与 navbar 下拉菜单
5. 运行 `npm run build` 构建验证
6. 输出变更摘要，提示使用 `/renthub-commit` 完成 commit

触发方式：`/legal-version-release` 或说"发布法律文档新版本"。

**为什么用 Skill 而非每次手工描述？** 发布流程涉及 4 个文件、6 个步骤，细节容易遗漏（如忘记更新 navbar、跳过某份协议的 tip 块）。Skill 把 SOP 固化，Agent 不会跳步，执行者只需提供三个参数。这是 Skills 相较于临时 prompt 最核心的价值：**把容易出错的多步骤流程变成不可遗漏的清单**。

> Skills 目前在 Nightly 渠道可用，正式版尚未全面开放，可关注更新。

---

## 3. Commands — 一行触发的可复用工作流

### 3.1 是什么

Commands 是存储在 `.cursor/commands/` 下的 Markdown 文件，通过 `/命令名` 在 Agent 对话中触发。可以理解为"带完整上下文的快捷指令"。

示例 `/pr` 命令：

```markdown
为当前改动创建 Pull Request：

1. 用 `git diff` 查看暂存与未暂存的改动
2. 根据改动内容拟写清晰的 commit message
3. Commit 并 push 到当前分支
4. 用 `gh pr create` 创建 PR，填写标题和描述
5. 返回 PR URL
```

### 3.2 最佳实践

- 每天重复执行多次的流程最适合做成 Command（如 `/pr`、`/review`、`/fix-issue`）
- Command 内容要足够具体，包含工具调用（`gh`、`npm`、`git`）和判断依据
- 纳入 git，团队所有人共享同一套 Commands
- 不要为偶发性任务建 Command——对话里描述一次即可

---

## 4. Subagents — 并行与云端 Agent

### 4.1 是什么

Subagents 指在独立上下文中并行运行的 Agent 实例，Cursor 通过 **git worktree** 实现文件隔离，多个 Agent 可以同时修改代码互不干扰。

两种使用方式：

| 方式 | 场景 |
|------|------|
| 本地并行（Worktree） | 同时尝试多个实现方案，选最好的 |
| 云端 Agent（cursor.com/agents） | 把任务甩给后台，关电脑也在跑 |

云端 Agent 工作流：描述任务 → Agent 克隆仓库建分支 → 自主完成 → 开 PR → 你来 Review & Merge。

### 4.2 最佳实践

- **硬题用并行**：同一 prompt 跑 2-3 个模型，对比结果取最优
- **非阻塞任务交给云端**：写测试、更新文档、依赖升级——这类任务不要自己等，交出去
- **给 Agent 可验证的目标**：有测试的任务成功率远高于"随意实现"的任务
- **Worktree 用完及时清理**：避免本地分支堆积

---

## 5. MCP — 连接外部工具与数据

### 5.1 是什么

MCP（Model Context Protocol）是一套开放协议，让 Cursor Agent 能调用外部服务：查 Slack 消息、读数据库、抓 Sentry 错误、操作 Figma 文件等。

MCP Server 本质是一个暴露工具函数（Tools）的进程，通过三种方式运行：

| Transport | 部署方式 | 适用场景 |
|-----------|---------|---------|
| `stdio` | 本地进程，Cursor 管理 | 单人使用、本地工具 |
| `SSE` | 本地/远程服务器 | 多人共享 |
| `Streamable HTTP` | 本地/远程服务器 | 多人共享 |

配置在 `.cursor/mcp.json`（项目级）或 `~/.cursor/mcp.json`（全局）。

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"],
      "env": {
        "API_KEY": "${env:MY_API_KEY}"
      }
    }
  }
}
```

### 5.2 最佳实践

- **API 密钥用环境变量**，永远不要硬编码在 `mcp.json` 中
- 只安装来源可信的 MCP Server（官方 Marketplace 优先）
- 开启 **Auto-run** 前确认该工具是低风险的（只读操作可以，写/删操作建议保持手动确认）
- 本地敏感数据用 `stdio` 模式，不通过网络
- 定期检查已安装的 Server，删除不再使用的

### 5.3 RentHub 推荐 MCP

| Server | 用途 |
|--------|------|
| GitHub MCP | 让 Agent 读 Issue、PR、代码搜索 |
| 浏览器控制（Browser） | Agent 自动截图、验证 UI 改动 |

---

## 6. 五者关系速览

```
每次对话
  └─ Rules (always-on) ─────────────── 静态注入，始终在 context 里
  └─ Skills (on-demand) ────────────── 按需加载，保持 context 干净
  └─ Commands (/ 触发) ─────────────── 封装工作流，一行启动多步任务

多 Agent
  └─ Subagents (worktree / cloud) ──── 并行或后台运行，互不干扰

外部连接
  └─ MCP ───────────────────────────── 把外部工具变成 Agent 可调用的函数
```

**记忆口诀**：Rules 管规范，Skills 管流程，Commands 管快捷，Subagents 管并发，MCP 管连接。

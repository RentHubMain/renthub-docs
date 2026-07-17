---
title: Cursor 核心概念指南
---

本文覆盖 Cursor 的五个核心扩展机制：Rules、Skills、Commands、Subagents、MCP。

## 1. Rules — 始终生效的静态上下文

### 1.1 是什么

Rules 是写给 Agent 的持久化指令，每次对话开始时自动注入到 context 中。本仓库规范放在仓库根目录 `.agents/rules/`（Cursor 通过链接到 `.cursor/rules/` 加载）。

四种类型：

| 类型 | 触发方式 |
|------|---------|
| Always Apply | 每次对话都加载 |
| Apply Intelligently | Agent 根据 description 自行判断是否相关 |
| Apply to Specific Files | 匹配文件加载 |
| Apply Manually | 在对话中 `@mention` 时加载 |

### 1.2 好 Rule 和坏 Rule 的区别

先说结论：**Rule 要少、要硬、要能执行。**

原因很简单：每条 Always Apply 都会在每轮对话占用 token。Rule 越多越长，模型留给“理解代码和完成任务”的上下文就越少。

所以核心原则是：**只写“模型经常会犯、且代价高”的错误约束；不要写抽象口号。**

| 坏 Rule（太宽泛） | 好 Rule（具体可执行） |
|-----------------|-------------------|
| `使用 TypeScript 最佳实践` | `严格模式开启。禁止隐式 any。引入类型用 import type。状态用可辨识联合：type Status = \{kind: 'pending'\} \| \{kind: 'loaded'; data: T\}` |
| `正确处理错误` | `异步操作包 try/catch。错误统一记录上下文：logger.error('Failed to fetch user', \{userId, error\})。返回明确错误对象：\{success: false, error: 'User not found'\}` |
| `使用 React 最佳实践` | `只用函数式组件 + hooks，禁止 class components。计算开销大的值包 useMemo；传给子组件的回调包 useCallback` |
| `写清晰的代码` | （删掉这条，没有任何帮助） |

可执行 Rule 再加两条标准：

1. **能检查**：看到输出就能判断是否遵守（比如“禁止隐式 any”）。
2. **能落地**：出现违规时，知道下一步怎么改（比如“先改成函数组件再继续”）。

**另一个关键技巧：用“禁止/永远不要”，少用“建议/推荐”。**

模型对强指令的遵从率远高于软建议：

```
错误示例：
尽量别用 class 组件

正确示例：
只用函数组件。看到 class 组件，先改成函数组件再继续。
```

最后，**用代码示例锚定，而不仅是描述。** 给模型看“坏例子 vs 好例子”，比抽象说明更容易执行。

**参数校验规范**

不要这样做（只说“建议”）：
```ts
// 建议折扣别超过 1
function calcPrice(price: number, discount: number) {
  return price * (1 - discount)
}
```
生成代码没有约束，质量无法保障。

要这样做（给出硬约束 + 明确处理）：
```ts
// 折扣必须在 0~1 之间，否则直接报错
function calcPrice(price: number, discount: number) {
  if (discount < 0 || discount > 1) {
    throw new Error('discount must be between 0 and 1')
  }
  return price * (1 - discount)
}
```
代码里有明确的检查和处理逻辑，生成的代码质量更有保障。

### 1.3 最佳实践

- **不要提前写**：先用 Cursor，发现它反复犯同一个错，再写一条 rule 修正它
- **一条 rule 管一件事**：超过 500 行就拆分，按领域分文件（`frontend.mdc`、`backend.mdc`、`testing.mdc`）
- **指向具体文件**：写 `参考 @auth.ts 的模式` 而非把代码复制进来——文件变了 rule 不会过时
- **不要写模型已知的事**：常见工具（npm、git）、通用编码规范不需要重复
- **纳入 git**：团队共享，更新 rule = 更新团队规范

---

## 2. Skills — 按需加载的动态能力

### 2.1 是什么

Skills 是可复用的工作流指令，定义在 `SKILL.md` 文件中，放在 `.agents/skills/<skill-name>/` 下（Cursor 通过 `.cursor/skills` 链接发现）。与 Rules 的区别：

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
- 当 Skill 已经稳定到需要跨工具安装时，说明它不该继续困在某个客户端目录里，而该用 [npx skills add](/docs/vibe-coding/beyond-cursor-toolbox) 统一安装与同步

### 2.3 项目示例

**示例 A — `renthub-commit`（单步 git 工作流）**

本仓库已内置 `renthub-commit` skill，封装了 RentHub 的 Conventional Commits 规范：

- 自动读取 `git diff` 分析改动
- 按规范起草 `type(scope): subject` + body
- 展示给用户确认后执行 `git commit`

触发方式：在 Composer 中说“帮我 commit”或输入 `/renthub-commit`。

**示例 B — `legal-version-release`（多步流程自动化）**

本仓库内置的第二个 skill，封装了法律文档的版本发布流程，是 Skill 处理复杂多步骤任务的典型示例：

触发后，Agent 依次执行：

1. 向用户确认旧版本号、新版本号、生效日期（三个参数）
2. 运行 `npx docusaurus docs:version:legal <旧版本>` 归档当前版本
3. 更新 `legal/` 下各协议文件的 front matter 与 tip 提示块
4. 更新 `docusaurus.config.ts` 中的版本标签与 navbar 下拉菜单
5. 运行 `npm run build` 构建验证
6. 输出变更摘要，提示使用 `/renthub-commit` 完成 commit

触发方式：`/legal-version-release` 或说“发布法律文档新版本”。

**为什么用 Skill 而非每次手工描述？** 发布流程涉及 4 个文件、6 个步骤，细节容易遗漏（如忘记更新 navbar、跳过某份协议的 tip 块）。Skill 把 SOP 固化，Agent 不会跳步，执行者只需提供三个参数。这是 Skills 相较于临时 prompt 最核心的价值：**把容易出错的多步骤流程变成不可遗漏的清单**。

---

## 3. Commands — 一行触发的可复用工作流

### 3.1 是什么

Commands 是存储在 `.cursor/commands/` 下的 Markdown 文件，通过 `/命令名` 在 Agent 对话中触发。可以理解为“带完整上下文的快捷指令”。

**实际示例 — `/pr` 命令**

没有 `/pr` 命令时，每次提 PR 你都要在对话里描述同样的步骤。有了它：

为当前改动创建 Pull Request：

1. 用 `git diff` 查看暂存与未暂存的改动
2. 根据改动内容拟写清晰的 commit message（遵循 Conventional Commits）
3. Commit 并 push 到当前分支
4. 用 `gh pr create` 创建 PR，填写标题和描述
5. 返回 PR URL

每次只需要说 `/pr`，Agent 就会按 SOP 走完整个流程，而不是依赖你每次描述清楚。

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

### 4.2 什么任务适合交给 Subagent？

并非所有任务都适合。关键判断：**任务有没有可验证的产物**。

| 适合交出去 | 不适合交出去 |
|-----------|------------|
| 写测试（有明确覆盖目标） | 需要你频繁决策方向的任务 |
| 更新文档（有具体范围） | 架构设计（需要判断上下文） |
| 依赖升级（有构建验证） | 模糊的“优化一下” |
| 跑另一种实现方案（有对比标准） | 需要读取本地私密配置的任务 |

**反模式**：把一个描述模糊的任务交给 Subagent，它大概率会生成一堆看起来能用但逻辑有漏洞的代码，你得花更多时间 review 和返工，反而比自己做更慢。

### 4.3 最佳实践

- **硬题用并行**：同一 prompt 跑 2-3 个模型，对比结果取最优
- **非阻塞任务交给云端**：写测试、更新文档、依赖升级——这类任务不要自己等，交出去
- **给 Agent 可验证的目标**：有测试的任务成功率远高于“随意实现”的任务
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

### 5.2 什么时候 MCP 值得接入？

MCP 不是越多越好——每个 active server 会占用上下文空间，降低模型处理实际代码的效率。判断标准：**Agent 能用它完成一个完整动作，而不只是查询**。

| 值得接入 | 不值得接入 |
|---------|----------|
| GitHub MCP：让 Agent 直接读 Issue / PR，避免手动粘贴 | 只是“能查”但你从不让 Agent 查的工具 |
| 浏览器控制 MCP：让 Agent 截图验证 UI 改动 | 所有操作你都会手动确认，MCP 没有省任何步骤 |
| 内部数据库 MCP：让 Agent 查表结构辅助迁移 | 需要生产环境写权限的工具（风险太高） |

### 5.3 最佳实践

- **API 密钥用环境变量**，永远不要硬编码在 `mcp.json` 中
- 只安装来源可信的 MCP Server（官方 Marketplace 优先）
- 开启 **Auto-run** 前确认该工具是低风险的（只读操作可以，写/删操作建议保持手动确认）
- 本地敏感数据用 `stdio` 模式，不通过网络
- 定期检查已安装的 Server，**删除不再使用的**——它们持续占用上下文空间

### 5.4 RentHub 推荐 MCP

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

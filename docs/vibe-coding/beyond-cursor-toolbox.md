---
title: Beyond Cursor：用 npx skills 安装 Agent Skills
---

前两篇分别讲了 Cursor 的使用方式和内部机制，这一篇往外走一层：当团队已经在 Cursor 里沉淀出稳定的 Skills 后，下一步不是把它们留在单个客户端目录里，而是用统一的 CLI 安装到多个 Agent。工具来自开源项目 [vercel-labs/skills](https://github.com/vercel-labs/skills)，入口命令是 `npx skills add`。再往下一层，就进入 [Agent Harness：把 AI 变成可控工作流](/docs/vibe-coding/agent-harness) 这一类执行系统。

Skills 在 Cursor 内的概念与写法见 [Cursor 核心概念](/docs/vibe-coding/cursor-concepts)；本文聚焦**跨工具安装与发现**。

## 1. 先说痛点：Skills 目录漂移

Agent Skills 是可复用工作流（每个技能一个含 `SKILL.md` 的目录）。问题在于：不同客户端默认读不同路径，手工复制很容易不一致：

| 工具 | 项目内 Skills 常见路径 |
|------|----------------------|
| Cursor / Codex / OpenCode 等 | `.agents/skills/` |
| Claude Code | `.claude/skills/` |
| 全局（按客户端） | `~/.cursor/skills/`、`~/.claude/skills/` 等 |

典型漂移：

- 某人在 Cursor 仓库里加了 `renthub-commit`，换到 Claude Code 时技能不存在
- 从 [skills.sh](https://skills.sh) 或 GitHub 发现好用技能后，不知道该拷到哪个目录、是否要给每个 Agent 各装一份
- 两个月后，各客户端里的同名 Skill 内容已经分叉，没有人知道「官方副本」在哪

这不是不自律，而是**缺少统一的安装与同步入口**。[skills](https://github.com/vercel-labs/skills) CLI 要解决的就是这件事。

---

## 2. `npx skills` 是做什么的

[vercel-labs/skills](https://github.com/vercel-labs/skills) 是开放 Agent Skills 生态的官方 CLI（站点：[skills.sh](https://skills.sh)）。它支持 Cursor、Claude Code、Codex、OpenCode 以及数十种其它 Agent：把仓库或本地路径里的 `SKILL.md` 安装到各客户端约定目录。

**一句话定位：** `npx skills` 不是另一个 AI 客户端，而是**安装 / 发现 / 更新 / 卸载 Agent Skills** 的命令行工具；推荐用 `npx` 按需拉取最新版，不必全局安装。

核心子命令是 `add`：

```bash
npx skills add vercel-labs/agent-skills
```

也可以不先安装、临时使用某个技能（把生成的 prompt 交给 Agent）：

```bash
npx skills use vercel-labs/agent-skills@web-design-guidelines | claude
```

---

## 3. 前提条件：Node.js 与 npm

`npx` 随 [Node.js](https://nodejs.org/en/download) 一起提供（安装 Node 时通常已包含 **npm**）。没有 Node / npm，就无法运行 `npx skills …`。

### 3.1 安装

1. 打开 [Node.js 下载页](https://nodejs.org/en/download)
2. 安装当前 **LTS** 版本（页面会标明版本号）
3. 安装完成后重新打开终端，确认命令可用：

```bash
node -v
npm -v
npx -v
```

三者都能输出版本号即可。若 `npx` 找不到，多半是 Node 未装好或 PATH 未刷新，回到下载页重装或检查环境变量后再试。

### 3.2 为什么用 `npx` 而不是全局安装

| 方式 | 说明 |
|------|------|
| `npx skills add …`（推荐） | 每次按需下载/使用 CLI 最新发布版，团队文档里写同一条命令即可复现 |
| 全局 `npm i -g skills` | 可以，但容易版本滞后，CI 与本机不一致 |

本文示例一律用 `npx skills`，与上游 [README](https://github.com/vercel-labs/skills) 一致。

---

## 4. 详细讲解：`npx skills add`

### 4.1 为什么需要这条命令

- **统一入口**：一种写法覆盖几十种 Agent 的安装路径，不必记 `.agents/skills/` vs `.claude/skills/`
- **可发现**：配合 `find` / `--list`，从公开仓库或 [skills.sh](https://skills.sh) 生态挑选技能
- **可共享**：默认装到**项目**目录，可随仓库提交，团队克隆后技能一致
- **可维护**：`update` / `remove` 统一升级与清理，减少手工复制残留

对本仓库而言：团队内置技能放在 `.agents/skills/`（说明见仓库根目录 `.agents/README.md`）；从外部引入第三方 Skill 时，优先用 `npx skills add`，而不是手动往多个客户端目录各拷一份。

> 说明：本站文档仓的 Cursor 兼容方式是 `scripts/link-agents.mjs` 把 `.cursor/skills` 链到 `.agents/skills/`。`npx skills add` 面向「从远程/本地源安装到各 Agent」；两者互补——前者管本仓布局，后者管生态安装。

### 4.2 源地址（Source）格式

```bash
# GitHub 简写 owner/repo
npx skills add vercel-labs/agent-skills

# 完整 GitHub URL
npx skills add https://github.com/vercel-labs/agent-skills

# 仓库内某个 skill 的路径
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

# 任意 git URL / 本地路径
npx skills add git@github.com:vercel-labs/agent-skills.git
npx skills add ./my-local-skills
```

### 4.3 常用选项

| 选项 | 含义 |
|------|------|
| `-g`, `--global` | 装到用户目录（跨项目可用），默认是当前项目 |
| `-a`, `--agent <agents…>` | 只装到指定 Agent（如 `cursor`、`claude-code`） |
| `-s`, `--skill <skills…>` | 只安装指定技能名（`*` 表示全部） |
| `-l`, `--list` | 只列出源里有哪些技能，不安装 |
| `--copy` | 复制文件到各 Agent 目录（默认优先 symlink，单一信源） |
| `-y`, `--yes` | 跳过确认，适合 CI |
| `--all` | 把源中全部技能装到全部已检测 Agent |

### 4.4 项目 vs 全局

| 作用域 | 标志 | 典型位置 | 适用场景 |
|--------|------|----------|----------|
| 项目（默认） | 无 | `./.agents/skills/` 等（随 Agent 而变） | 随仓库提交、团队共享 |
| 全局 | `-g` | `~/.cursor/skills/` 等 | 个人通用技能、多仓库复用 |

### 4.5 实用示例

下面两个例子覆盖最常见场景：**装一整套公开技能包**，以及**只装团队仓库里的某一个技能**。

#### 示例 A — 安装 `obra/superpowers` 的全部 Skills

[obra/superpowers](https://github.com/obra/superpowers) 是一套面向 Agent 的开发流程技能包。若要一次装全：

```bash
# 先列出源里有哪些技能（可选）
npx skills add obra/superpowers --list

# 将该仓库中的全部 skills 安装到已检测的全部 Agent
npx skills add obra/superpowers --all
```

若只要全部技能、但限定目标客户端（例如只装到 Cursor）：

```bash
npx skills add obra/superpowers --skill '*' -a cursor
```

#### 示例 B — 只安装 RentHub Toolbox 的 `renthub-commit`

[RentHubMain/renthub-toolbox](https://github.com/RentHubMain/renthub-toolbox) 是 RentHub 团队共用的 Agent Skills 源仓库。业务项目根目录执行：

```bash
# 只看本仓库提供了哪些技能（不安装）
npx skills add RentHubMain/renthub-toolbox --list

# 等价写法：完整 GitHub URL
npx skills add https://github.com/RentHubMain/renthub-toolbox --list

# 只安装 renthub-commit（按 Conventional Commits 起草并提交）
npx skills add RentHubMain/renthub-toolbox --skill renthub-commit

# 需要时再指定 Agent，例如只给 Cursor
npx skills add RentHubMain/renthub-toolbox --skill renthub-commit -a cursor
```

装好后可用 `npx skills list` 确认；上游更新后在业务项目里执行 `npx skills update` 拉取。

其它常用写法：

```bash
# 非交互（CI / 脚本）
npx skills add RentHubMain/renthub-toolbox --skill renthub-commit -y

# 全局安装（跨项目个人使用）
npx skills add RentHubMain/renthub-toolbox --skill renthub-commit -g
```

安装时若环境里检测到多个 Agent，CLI 会提示选择目标；可用 `-a` / `--all` 直接指定。Symlink 模式推荐：各 Agent 目录指向同一份规范副本，更新时改一处即可。

---

## 5. 其它常用子命令

| 命令 | 作用 |
|------|------|
| `npx skills list`（别名 `ls`） | 列出已安装技能 |
| `npx skills find [query]` | 按关键词或交互搜索技能 |
| `npx skills update [skills…]` | 更新到最新版本 |
| `npx skills remove [skills…]` | 从 Agent 中卸载 |
| `npx skills use <source>` | 不安装，临时生成 prompt / 拉起 Agent |
| `npx skills init [name]` | 新建 `SKILL.md` 模板 |

```bash
npx skills find typescript
npx skills list
npx skills update
npx skills remove frontend-design
npx skills init my-skill
```

完整选项与支持的 Agent 列表以 [vercel-labs/skills README](https://github.com/vercel-labs/skills) 为准。

---

## 6. 什么时候值得用 `npx skills`？

- 团队里不止一种 AI 客户端，同一套 Skill 需要装到多处
- 要从 GitHub / [skills.sh](https://skills.sh) 引入第三方技能，而不是手写拷贝路径
- 需要在 CI 或 onboarding 脚本里用 `-y` / `--all` 可复现地安装技能

若你还在单独用 Cursor、且技能只在本仓库 `.agents/skills/` 里维护，先把 [Cursor 核心概念](/docs/vibe-coding/cursor-concepts) 里的 Skills 写稳即可；一旦要跨工具或引入外部技能包，再上 `npx skills add`。

---

## 7. 注意事项

- **先装 Node**：没有 npm / npx，后面所有命令都跑不起来——见上文第 3 节
- **优先项目作用域**：与团队共享时提交项目内 skills；全局安装只留给个人偏好
- **提交前检查**：安装结果是否应进 git（项目技能通常应提交；全局技能不进仓库）
- **上游变更**：CLI 与支持的 Agent 列表会演进，遇路径或选项差异时以 [GitHub 仓库](https://github.com/vercel-labs/skills) 为准

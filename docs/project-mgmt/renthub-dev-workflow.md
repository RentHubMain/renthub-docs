---
title: RentHub 业务仓库开发工作流
---

本文描述 **RentHub 业务 Monorepo**（微信小程序、云函数、共享契约与测试等）从日常开发到合并主干、再到微信侧发布的完整工作流，以及当前 **GitHub Actions `Build`** 流水线在做什么、不做什么。

> **说明**：本页**不是**文档站仓库 `renthub-docs` 的流程。文档站以 Docusaurus 构建、部署到 GitHub Pages 为主，见 [GitHub Actions 工作流](/docs/project-mgmt/github-actions) 第4 节。CI/CD 通用概念亦可在该文中查阅。

---

## 1. 适用范围与仓库角色

业务仓库根目录常见布局与职责如下（具体以实际仓库为准）。

| 区域 | 作用 |
|---|---|
| `miniprogram/` | 微信小程序前端（页面、分包、组件、工具函数） |
| `cloudfunctions/` | 云开发云函数（多函数，通常按 `event.action` 在入口路由） |
| `shared/contracts/` | 前后端共享的数据结构 / 契约；**改接口时应与小程序、云函数、文档对齐** |
| `tests/` | Jest：**小程序单测**、**E2E**、**云函数单测**（覆盖 entry / handlers / services 等层次） |
| `docs/` | 功能说明（如 `functionality_docs/`）、接口文档（如 `api_docs/`，中文） |
| 根目录 `package.json` | 统一脚本：`test`、`mini`、`cloud`、`test:e2e` 等 |

README 中可能还会提到独立目录或仓库下的 **管理后台**（`admin/`）、**官网**（`website/`）等。根脚本里若有 `dev:admin` 等，属于 **Web 本地开发 / 构建** 路径；**当前 `Build` 工作流通常只覆盖根目录的 Node 测试与 Sonar，不会在 CI 里为 admin、website 单独跑一套构建**（除非仓库另行增加 workflow）。

---

## 2. 云函数侧开发规范（业务后端）

云函数的定位、RentHub 按业务域拆分、`index.js` / `handlers/` / `services/` 等**目录与分层约定**、结构示例及**执行超时**配置，均以 **[腾讯云 CloudBase 入门 — 3. 云函数](/docs/dev-knowledge/cloudbase#cloudbase-cloud-functions)** 为权威说明。

从本工作流出发，改动云函数时还请同步：

- **契约与接口文档**：涉及字段或错误码时，更新 `shared/contracts` 与 `docs/api_docs`。
- **新增能力**：在入口注册 `action` → 实现 `handler`（必要时补充 `service`）；分层含义见上述链接中的 §3.4、§3.5。

---

## 3. 小程序侧开发规范（要点）

- **打开工程**：使用[微信开发者工具](/docs/dev-knowledge/wechat-mini-program)，打开仓库根目录；由 `project.config.json` 指定 `miniprogramRoot`、`cloudfunctionRoot`。
- **环境与云开发**：`app.js` 等处的 CloudBase / 云环境 ID 须与真机、体验版所用环境一致；仓库内往往**没有** `.env`，敏感配置依赖控制台与团队约定。
- **网络**：业务请求统一使用 `wx.request` 或基于它的封装；**不要使用浏览器环境的 `fetch`**。
- **分包与页面**：新增页面或分包时修改 `app.json`及子包配置；视觉与交互可对照本站 [小程序 UI 设计](/docs/ui-design/mini-program)。

云能力背景见 [腾讯云 CloudBase 入门](/docs/dev-knowledge/cloudbase)。

---

## 4. 测试工作流

### 4.1 Jest 是什么？代码覆盖率（coverage）是什么？

**Jest** 是面向 JavaScript 的**测试运行器 + 断言库**（生态成熟，常与 Babel 等配合）。在业务仓库里，它通常负责：发现 `*.test.js` 等测试文件、按 `describe` / `it` 组织用例、执行断言（如 `expect(x).toBe(y)`）、提供 **mock**（模拟 `wx`、`wx-server-sdk`、HTTP 等依赖），并在 CI 中以非交互方式一次性跑完所有用例。RentHub 小程序与云函数的自动化测试若统一挂在根目录 `npm test` 上，背后一般是 Jest 配置在驱动。

**代码覆盖率（coverage）** 指：在一次测试运行中，**哪些源码行、分支、函数曾被执行到**。Jest 可在开启覆盖率收集时生成报告（常见输出目录为 `coverage/`，其中 **`lcov.info`** 是 Sonar 等工具读取的标准格式之一）。覆盖率**不是**「有100% 就没有 bug」，而是帮助团队看见**哪些逻辑从未被任何用例碰到**——往往是遗漏的边界或错误路径。

### 4.2 为什么需要 Jest 与覆盖率？

| 动机 | 说明 |
|---|---|
| **统一命令与 CI** | 所有人、流水线都跑同一套 `npm test`，避免「我本地用别的脚本」导致结果不可比。 |
| **快速反馈** | Jest 在纯 Node 环境跑单测通常很快，适合每次改代码前后反复执行。 |
| **隔离外部依赖** | 通过 mock 避免测试必须连真云、真第三方接口，稳定且安全。 |
| **量化测试盲区** | 覆盖率报告标出未执行代码，便于补用例或与 Sonar Quality Gate 对齐；与 §5 中 Sonar 消费 `lcov` 的路径一致。 |
| **可维护的断言** | 用例以代码形式固定「预期行为」，比口头约定更不易被遗忘。 |

覆盖率宜作为**参考指标**：盲目追求数字会催生无意义断言；更应关注**关键业务路径与错误处理**是否被覆盖。

### 4.3 单元测试、集成测试与 E2E：分别是什么？

**单元测试**针对**最小可测单元**（例如 `services/` 里的一条规则、纯函数、或对入参的校验逻辑）。在本地用 Jest 快速执行，通常**不连接真实数据库、不启动微信开发者工具**，对 `wx-server-sdk`、HTTP 等外部依赖用 **mock / stub** 代替。目标是证明：在约定输入下，这段代码返回预期结果或抛出预期错误。

**集成测试**验证**多个模块协作**是否正确，例如某个 `handler` 在装配好的依赖下走完「解析 `event` → 调用 `services` / 数据访问层（可用内存实现或测试库）→ 组装 `{ success, data?, message? }`」。它比单测更重、准备数据更多，但仍主要落在**逻辑与服务边界**，不依赖用户真实点击小程序 UI。

**E2E（端到端）测试**从**用户视角**驱动**真实小程序界面**：打开页面、触发点击、断言界面文案或路由。业务仓库里常见基于 **miniprogram-automator**，依赖本机**微信开发者工具**及服务端口等；用于守护关键产品路径，运行成本与环境依赖高于前两者。

### 4.4 为什么需要这些测试？

| 动机 | 说明 |
|---|---|
| **尽早暴露问题** | 在本地或 CI 上失败，比在体验版、审核或生产环境再排查成本低。 |
| **防止回归** | 修改一处逻辑时，用例守护其它已承诺行为，减少「修 A 坏 B」。 |
| **便于重构与协作** | 有测试兜底时，更愿意拆分模块；新人也可通过测试理解「预期行为」而不仅是读实现。 |
| **与流水线一致** | `Build` 工作流会执行 `npm test` 并产出覆盖率；测试缺失或不稳定会直接表现为**合并不了主干**或 Sonar 指标变差。 |

单测与集成测试偏重**逻辑与协作是否正确**，E2E 偏重**关键路径在工具/真机链路下能否跑通**；三者互补，不是互相替代。云函数侧可优先在 `services/` 上叠厚单测，在入口或 handler 上补充集成测试；小程序与自动化场景再按需加 E2E。

### 4.5 如何用 AI 辅助编写测试用例？

在已了解 AI 辅助开发的前提下（见 [Cursor 使用指南](/docs/vibe-coding/cursor-guide)），可把模型当作「结对写测试」的助手，建议流程如下。

1. **提供上下文**：附上待测文件路径、相关 `shared/contracts` 或 `docs/api_docs` 片段、以及业务规则（含错误码、边界条件）。
2. **说清环境与约束**：说明使用 Jest、是否需要 mock `wx.cloud` / HTTP、以及仓库里测试文件命名约定（见 §4.6）。
3. **让 AI 生成草稿，人工验收**：请 AI 列出正常路径、边界与异常路径，并生成 `describe` / `it` 结构或完整实现；你必须在本地执行 `npm test`（或 `npm run cloud` / `npm run mini`）**跑绿**后再提交，并修正断言、mock 生命周期等细节。
4. **保持怀疑**：模型可能臆造 API 或忽略项目真实约束；以**可运行测试**与 Code Review 为准。
5. **敏感逻辑加人工复核**：支付、实名、权限、合规相关分支，除 AI 草稿外须由人对照产品与平台规则再检查。

### 4.6 仓库脚本与文件命名

根目录脚本与约定测试范围如下。

| 命令 | 含义 |
|---|---|
| `npm test` | 跑**全部单元测试**（含集成风格的 Jest 用例，以仓库配置为准）并生成覆盖率；产物通常输出到 `coverage/`（如 `lcov.info`），供 Sonar 消费 |
| `npm run mini` | 仅 `tests/miniprogram` |
| `npm run cloud` | 仅 `tests/cloudfunctions` |
| `npm run test:e2e` | 基于 miniprogram-automator 的 **E2E**；依赖本机微信开发者工具开启服务端口等环境 |

**文件命名约定（以仓库 `docs/functionality_docs/测试指南.md` 为准）**：

- 云函数入口层测试：常见 `*.cloudfunction.test.js`
- 一般业务单测：`*.test.js`
- E2E：`*.spec.js`

---

## 5. 代码质量与 SonarQube

仓库根目录 **`sonar-project.properties`**：绑定 SonarCloud（或团队 Sonar 实例）项目、`lcov` 路径、覆盖率排除规则（与 Jest `collectCoverageFrom` 策略对齐）、CPD/重复度等。

- **CI 顺序**：先执行 `npm test` 生成覆盖率，再使用 `SonarSource/sonarqube-scan-action` 上传分析结果。
- **Pull Request**：在 SonarCloud 项目里可配置 **Quality Gate**；是否阻断合入以团队在项目中的设置为准。

---

## 6. GitHub Actions：`Build` 工作流

以下为业务仓库当前 **唯一** CI工作流（文件名以 `.github/workflows/` 下实际为准，常见为 `build.yml`）的逻辑说明；YAML 与团队仓库保持一致即可。

### 6.1 触发条件

| 事件 | 行为 |
|---|---|
| `push` 到 `main` | 运行流水线 |
| `pull_request`（`opened`、`synchronize`、`reopened`） | 运行流水线 |

### 6.2 Job：`dependency-review`（仅 PR）

- `if: github.event_name == 'pull_request'`
- `actions/checkout@v4`
- `actions/dependency-review-action@v4`：对依赖变更做审查（许可证、已知漏洞等，具体行为以 Action 与 GitHub 策略为准）。

**Push 到 `main` 时该 Job 不会执行**（条件不满足）。

### 6.3 Job：`sonarqube`（push 与 PR 均执行）

典型步骤如下。

```yaml
name: Build

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  dependency-review:
    name: Dependency Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Review
        uses: actions/dependency-review-action@v4

  sonarqube:
    name: SonarQube
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - name: Install dependencies
        run: npm ci
      - name: Dependency audit
        run: npm audit --audit-level=critical
      - name: Test and coverage
        run: npm test
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v7
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

要点说明：

- **`fetch-depth: 0`**：完整 Git 历史便于 Sonar 做分支 / 增量分析（以 Sonar 配置为准）。
- **`npm ci`**：与 lockfile 严格一致的依赖安装，适合 CI。
- **`npm audit --audit-level=critical`**：仅当存在 **critical** 级别漏洞时失败；策略为「允许通过 critical 以下」时流水线仍可能通过，团队可按需收紧。
- **`npm test`**：单测 + 覆盖率，供 Sonar 报告使用。
- **`SONAR_TOKEN`**：须在 GitHub 仓库 **Secrets** 中配置，且与 `sonar-project.properties` 中的项目标识一致。

---

## 7. CI 未自动化的部分（需人工或其它流程）

以下内容**不在**上述 `Build` 工作流中自动完成，需按团队发布规范操作：

| 事项 | 说明 |
|---|---|
| 小程序包上传、提审、发布 | 在微信开发者工具与[公众平台](https://mp.weixin.qq.com/)完成；详见 [微信小程序开发体系](/docs/dev-knowledge/wechat-mini-program) §6.4 |
| 各云函数上传与部署 | 在云开发控制台或开发者工具中按函数部署 |
| E2E `npm run test:e2e` | 强依赖本机微信开发者工具，**一般不作为该 workflow 的必跑步骤** |
| 数据库变更、定时触发器 | 按 `定时任务配置` 等内部文档在控制台核对与发布 |

---

## 8. 从需求到上线的端到端链路

建议按以下顺序推进一条需求（可与团队看板状态对应）：

1. **读文档**：查阅 `docs/api_docs`、`docs/functionality_docs`，确认现有契约与业务规则。
2. **改契约（若需要）**：同步修改 `shared/contracts`、API 文档、报错码说明。
3. **实现**：小程序页面与调用 + 云函数 `handlers` / `services`；遵守目录与统一返回格式。
4. **补测**：在 `tests/cloudfunctions` 或 `tests/miniprogram` 增加/更新用例；本地执行 `npm test` 或 `npm run mini` / `npm run cloud`。
5. **可选**：`npm run test:e2e`、真机预览与体验版验证。
6. **提交与 PR**：推送分支并创建 Pull Request。
7. **PR 检查**：Dependency Review（仅 PR）+ `npm ci` → `audit` → `test` → Sonar；修复失败项直至通过团队门禁。
8. **合并 `main`**：合并后 `push` 会再次触发 `sonarqube` Job（Dependency Review 仍仅在 PR 上出现）。
9. **发布**：在微信侧**上传**小程序并走审核/发布；对改动的云函数在控制台**单独上传部署**；数据库与定时任务等按内部运维文档在控制台核对。

协作分支与 Commit 规范另见 [Git 协作工作流](/docs/project-mgmt/git-workflow)。

---

## 9. 环境要求（工作流前置）

| 项目 | 要求 |
|---|---|
| Node / npm | 以业务仓库 `package.json` 的 `engines` 为准（常见 **Node ≥ 16、npm ≥ 8**） |
| 微信开发者工具 | 日常开发与 E2E 必备 |
| GitHub | 已配置 **`SONAR_TOKEN`**；Sonar 项目与 `sonar-project.properties` 一致 |

本地若与 CI 结果不一致，优先核对 Node 版本、`npm ci` 是否可干净通过、以及 lockfile 是否已提交。

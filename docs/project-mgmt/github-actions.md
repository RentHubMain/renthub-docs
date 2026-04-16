---
title: GitHub Actions 工作流
---

GitHub Actions 是 GitHub 内置的 CI/CD 平台，让你可以在代码托管的同一个地方，定义并自动执行构建、测试、部署等任务。本文讲解核心概念，并以本文档站的上线流程为例，带你读懂一份真实的工作流文件。

---

## 1. 什么是 CI/CD

**CI/CD** 是 **持续集成（Continuous Integration）** 和 **持续交付/部署（Continuous Delivery / Deployment）** 的缩写，是现代软件工程的核心实践。

### 1.1 持续集成（CI）

持续集成的核心思想是：**每次代码提交后，自动运行一系列检查**，尽早发现问题。

典型的 CI 流程包括：

1. 开发者推送代码到远程仓库
2. 自动触发构建（把源代码编译/打包成可运行的产物）
3. 自动运行测试（单元测试、集成测试等）
4. 输出结果：通过则允许合并，失败则阻断并通知开发者

在没有 CI 的团队里，"在我本地是好的"是一句常见的抱怨——每个人的本地环境不同，合并代码时才发现冲突或错误，修复成本很高。CI 把问题暴露在合并之前，越早发现越便宜。

### 1.2 持续交付 / 持续部署（CD）

CD 在 CI 的基础上更进一步，自动化了"把代码送到用户面前"的过程：

| 概念 | 含义 |
|------|------|
| **持续交付**（Continuous Delivery） | 每次通过 CI 的代码都自动准备好可部署的版本，但需要人工确认后才真正上线 |
| **持续部署**（Continuous Deployment） | 通过 CI 后完全自动推送到生产环境，无需人工干预 |

两者的区别只在于最后一步是否需要人工确认。对于本文档站这样的低风险项目，采用的是持续部署：代码合入 `main` 分支后，自动构建并上线，全程无需手动操作。

### 1.3 CI/CD 解决的核心问题

| 没有 CI/CD | 有 CI/CD |
|------------|----------|
| 手动在本地打包，再手动上传 | 推送代码即自动触发，全程自动化 |
| "在我机器上没问题" | 统一的干净环境，结果可复现 |
| 发布靠人记得操作 | 代码合并即发布，不依赖人 |
| 出问题才知道上次部署有 bug | 每次提交都经过验证，问题早发现 |

---

## 2. 核心概念

在读工作流文件之前，先建立几个必要的心智模型。

### 2.1 什么是工作流（Workflow）

工作流是一段写在 YAML 文件里的自动化脚本，放在仓库的 `.github/workflows/` 目录下。每个文件就是一条工作流，可以有多个。

工作流由三个层次构成：

```
Workflow（工作流）
  └─ Job（任务）         ← 可以有多个，默认并行
       └─ Step（步骤）   ← 顺序执行，失败则中止
```

### 2.2 触发器（Trigger）

触发器决定"什么时候"运行工作流。常见触发条件：

| 触发器 | 含义 |
|--------|------|
| `push` | 代码推送到指定分支时触发 |
| `pull_request` | PR 创建或更新时触发 |
| `workflow_dispatch` | 手动在 GitHub 页面点击触发 |
| `schedule` | 按 cron 表达式定时触发 |

### 2.3 任务（Job）

一个工作流可以包含多个 Job。默认情况下 Job 并行执行；用 `needs` 字段可以声明依赖关系，让某个 Job 等待另一个 Job 完成后再开始。

每个 Job 在独立的虚拟机（Runner）上运行，彼此隔离——这意味着一个 Job 产生的文件，另一个 Job 默认看不到，需要通过 Artifact（构建产物）传递。

### 2.4 步骤（Step）

Step 是 Job 内部的最小执行单元，按顺序运行。Step 有两种写法：

- **`run`**：直接写 Shell 命令
- **`uses`**：引用一个 Action（可复用的打包操作）

### 2.5 Action

Action 是 GitHub Marketplace 上发布的可复用操作单元，类似函数调用。官方维护了一批常用 Action（`actions/` 命名空间），社区也有大量第三方 Action。引用时可以用 `@v4` 这样的 tag 锁定版本。

### 2.6 运行器（Runner）

Runner 是执行 Job 的服务器。GitHub 提供免费的托管 Runner（`ubuntu-latest`、`windows-latest`、`macos-latest`），也支持自托管。对于开源和个人项目，托管 Runner 的免费额度通常够用。

---

## 3. 工作流文件结构

一个标准的工作流文件骨架：

```yaml
name: 工作流名称           # 显示在 GitHub Actions 页面的名称

on:                        # 触发器
  push:
    branches: [main]

permissions:               # 该工作流需要的 GitHub Token 权限
  contents: read

jobs:
  job-name:                # Job ID（自定义，kebab-case）
    runs-on: ubuntu-latest # 运行环境

    steps:
      - name: 步骤名称      # 可选，显示在日志里
        uses: actions/checkout@v4   # 引用 Action

      - name: 运行命令
        run: echo "Hello"
```

---

## 4. 示例：本项目的部署工作流

本文档站（`renthub-docs`）使用 GitHub Actions 自动将 Docusaurus 站点部署到 GitHub Pages。工作流文件位于 `.github/workflows/deploy-pages.yml`。

下面逐段讲解这份真实的配置文件。

### 4.1 完整文件

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build site
        run: npm run build
        env:
          NODE_ENV: production

      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 4.2 触发条件

```yaml
on:
  push:
    branches: [main, master]
  workflow_dispatch:
```

- **`push: branches: [main, master]`**：每次有代码推送到 `main` 或 `master` 分支时自动触发。本仓库以 `main` 为主干，列出 `master` 是兼容旧仓库命名习惯。
- **`workflow_dispatch`**：允许在 GitHub 仓库页面的 Actions 标签页手动点击"Run workflow"触发，不需要推送代码。这对于排查部署问题或强制重新部署很有用。

### 4.3 权限声明

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

GitHub Actions 默认只给工作流最小权限。部署到 GitHub Pages 需要额外授权：

| 权限 | 用途 |
|------|------|
| `contents: read` | 允许 checkout 读取仓库代码 |
| `pages: write` | 允许向 GitHub Pages 写入部署产物 |
| `id-token: write` | 允许通过 OIDC 获取身份令牌，GitHub Pages 官方部署方式依赖此机制验证身份 |

遵循最小权限原则：只声明需要的权限，不写 `write-all`。

### 4.4 并发控制

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

这段配置解决了一个实际问题：如果你快速连续推送两次代码，第一次触发的部署还没完成，第二次就开始了，可能造成部署顺序混乱或竞态条件。

- **`group: pages`**：将所有针对 `pages` 这个并发组的工作流实例放入同一个队列。
- **`cancel-in-progress: true`**：新的运行触发时，自动取消同组中正在进行的旧实例。

效果：始终只有最新一次推送的部署在执行，节省 Runner 资源，避免旧版本覆盖新版本。

### 4.5 构建 Job（build）

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
```

Job 运行在 GitHub 托管的 Ubuntu 最新版虚拟机上。每次运行都是全新的干净环境，上次运行产生的缓存、文件默认不会保留（除非显式缓存）。

**步骤一：Checkout 代码**

```yaml
- uses: actions/checkout@v4
```

将当前仓库代码克隆到 Runner 工作目录。这是几乎所有工作流的第一步——Runner 是空白的服务器，没有代码就什么都做不了。

**步骤二：配置 Node.js 环境**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
```

- **`node-version: 20`**：安装 Node.js 20（与本地开发环境保持一致，避免版本差异导致的构建问题）。
- **`cache: npm`**：自动缓存 `node_modules` 依赖，下次运行时如果 `package-lock.json` 没有变化，直接使用缓存，跳过重新下载，**显著缩短构建时间**。

**步骤三：安装依赖**

```yaml
- name: Install dependencies
  run: npm ci
```

使用 `npm ci` 而不是 `npm install`：

| 命令 | 行为 | 适用场景 |
|------|------|---------|
| `npm install` | 按 `package.json` 安装，可能更新 `lock` 文件 | 本地开发 |
| `npm ci` | 严格按 `package-lock.json` 安装，`lock` 文件不匹配则报错 | CI/CD 环境 |

`npm ci` 保证每次构建的依赖版本与本地开发时完全一致，是 CI 环境的最佳实践。

**步骤四：配置 Pages**

```yaml
- name: Setup Pages
  id: pages
  uses: actions/configure-pages@v5
```

这一步由 GitHub 官方 Action 处理，配置 GitHub Pages 部署所需的上下文信息（如站点的 base URL）。`id: pages` 给这个步骤命名，后续步骤可以通过 `steps.pages.outputs.*` 引用它的输出值。

**步骤五：构建站点**

```yaml
- name: Build site
  run: npm run build
  env:
    NODE_ENV: production
```

执行 Docusaurus 构建命令，产物输出到 `build/` 目录。`env` 字段注入环境变量，`NODE_ENV: production` 告知构建工具进行生产优化（压缩、去除调试代码等）。

**步骤六：上传构建产物**

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: build
```

将 `build/` 目录打包并上传为 Pages Artifact。这是 `build` Job 与 `deploy` Job 之间传递文件的桥梁——两个 Job 运行在不同的虚拟机上，文件无法直接共享，必须通过 Artifact 中转。

### 4.6 部署 Job（deploy）

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  steps:
    - id: deployment
      uses: actions/deploy-pages@v4
```

**`needs: build`**：声明 `deploy` Job 依赖 `build` Job，必须等 `build` 成功完成后才开始执行。这是控制 Job 执行顺序的核心机制。

**`environment`**：将这个 Job 关联到 GitHub 的 `github-pages` 部署环境。这样可以在仓库页面的 Environments 标签看到部署历史和当前状态，`url` 字段会显示成可点击的链接，指向上线后的站点地址。

**`${{ steps.deployment.outputs.page_url }}`**：这是 GitHub Actions 的**表达式语法**，用双大括号 `${{ }}` 包裹。`steps.deployment.outputs.page_url` 读取 `deploy-pages` Action 执行后返回的站点 URL。

**`actions/deploy-pages@v4`**：官方 Action，从上一步上传的 Artifact 中取出构建产物，正式发布到 GitHub Pages。

---

## 5. 整体执行流程梳理

```
推送代码到 main 分支
       │
       ▼
   触发工作流
       │
       ▼
  ┌─────────────────────────────────────────────┐
  │  build Job（ubuntu-latest）                  │
  │  1. checkout 代码                            │
  │  2. 安装 Node.js 20（读取 npm 缓存）          │
  │  3. npm ci 安装依赖                          │
  │  4. configure-pages 配置上下文               │
  │  5. npm run build 生成 build/ 目录           │
  │  6. 上传 build/ 为 Pages Artifact           │
  └─────────────────────────────────────────────┘
       │ 成功
       ▼
  ┌─────────────────────────────────────────────┐
  │  deploy Job（ubuntu-latest）                 │
  │  1. 取出 Artifact                            │
  │  2. 发布到 GitHub Pages                      │
  └─────────────────────────────────────────────┘
       │
       ▼
  站点上线：https://docs.renthub.cloud
```

---

## 6. 前置配置要求

工作流本身配置好后，还需要在 GitHub 仓库设置里完成一步操作，否则部署会失败：

进入仓库 **Settings → Pages → Build and deployment**，将 Source 改为 **GitHub Actions**（而非默认的 Deploy from a branch）。

这个设置告诉 GitHub：该仓库的 Pages 内容由 Actions 工作流发布，而不是从某个分支的根目录直接读取。

---

## 7. 查看运行结果

每次触发后，可以在 GitHub 仓库的 **Actions** 标签页查看：

- 工作流运行列表（成功/失败/进行中）
- 每个 Job 的详细日志，展开可以看到每个 Step 的输出
- 失败时的错误信息和行号

> 部署失败时，优先看 `build` Job 里的 `Build site` 步骤，通常是依赖版本问题或代码错误导致构建报错。

---

## 8. 注意事项

- **不要在工作流文件中硬编码密钥**。API 密钥、Token 等敏感信息应存放在仓库 Settings → Secrets，通过 `${{ secrets.MY_SECRET }}` 引用。
- **版本锁定**：Action 引用尽量指定固定版本（如 `@v4`），避免上游更新破坏你的工作流。生产环境可以进一步锁定到 commit SHA。
- **缓存失效**：`setup-node` 的 npm 缓存以 `package-lock.json` 的 hash 为 key，每次修改依赖后缓存会自动失效并重新下载。
- **免费额度**：GitHub 对公开仓库提供无限 Actions 分钟数；私有仓库每月有 2000 分钟免费额度（具体以 GitHub 官方为准）。

---

## 9. 延伸阅读

RentHub **业务 Monorepo**（小程序、云函数、Jest 与 Sonar 等）的 CI 与端到端发布链路见 [RentHub 业务仓库开发工作流](/docs/project-mgmt/renthub-dev-workflow)。

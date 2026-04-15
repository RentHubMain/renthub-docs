# RentHub 开发者指南

![RentHub Banner](./assets/images/renthub-banner.png)

本仓库 **`renthub-developer-guide`** 是 **RentHub（租汇）** 面向团队的 **文档站源码**：使用 [Docusaurus 3](https://docusaurus.io/) 将 `docs/` 下的 Markdown 构建为静态站点。**不包含小程序、云函数、管理后台等业务代码**；正文与专题在 `docs/` 中持续补充。

**线上站点**：[docs.renthub.cloud](https://docs.renthub.cloud)（由本仓库构建部署，自定义域名见 `static/CNAME`）。

## RentHub 产品与文档的关系

RentHub 是基于微信小程序的租赁市场平台（信息发布、浏览、预订、订单等），并配有 Web 管理后台。产品线在工程上通常采用 **Monorepo**，常见目录约定包括：

- 小程序前端（WXML + WXSS + JS）
- 云函数（user / asset / order 等域）
- React + TypeScript 管理后台
- 官方网站

上述 **业务代码所在仓库与本文档仓库相互独立**；本仓库只维护开发者可见的说明、规范与上手路径。

官网：[renthub.cloud](https://www.renthub.cloud/)

## 本仓库结构（文档站）

| 路径 | 说明 |
|------|------|
| `docs/` | 文档正文；每板块一个子目录，`index.md` 为入口 |
| `sidebars.ts` | 文档侧栏结构 |
| `docusaurus.config.ts` | 站点、`baseUrl`、`staticDirectories`、导航栏等 |
| `src/pages/` | 站点首页（React）及样式模块 |
| `src/css/custom.css` | 全站 Infima 变量与品牌色 |
| `src/theme/DocRoot/Layout/` | 通过 `docusaurus swizzle` 定制的文档页布局（侧栏、主内容区等） |
| `static/` | 构建时复制到站点根目录（如 `.nojekyll`、`CNAME`） |
| `assets/` | 图片等静态资源（在配置中作为 `staticDirectories` 之一挂载） |

编写与导航约定见：[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)。

## 文档目录

文档按 **目录 = 板块** 组织；每块用 `index.md` 作入口索引，子话题为独立的 `kebab-case.md` 文件。

| 板块 | 内容 | 状态 |
|------|------|------|
| [氛围编程 Vibe Coding](./docs/vibe-coding/index.md) | AI 辅助开发的约定与注意点 | 进行中 |
| [项目管理](./docs/project-mgmt/index.md) | 分支、发布、Code Review 等 | 进行中 |
| [界面设计](./docs/ui-design/index.md) | 拟物化设计系统、三端 UI 规范 | 进行中 |
| 项目综述 | 架构、技术选型、模块关系 | 待撰写 |
| 开发注意事项 | 环境、调试、常见问题 | 待撰写 |
| 开发知识 | 云开发、小程序、TypeScript 等 | 待撰写 |

后续若有新主题，在 `docs/` 下新增同级目录并将本表同步更新，保持入口一致。

## 零基础新手？从这里开始

如果你刚接触开发，建议按以下顺序阅读：

1. **[Git 基础入门](./docs/project-mgmt/git-basics.md)** — 理解版本控制、分支、提交与 PR，是参与任何项目的前提
2. **[Cursor 使用指南](./docs/vibe-coding/cursor-guide.md)** — 了解如何用 AI 辅助开发，模型怎么选、额度怎么省
3. **[Cursor 核心概念](./docs/vibe-coding/cursor-concepts.md)** — 深入理解 Rules、Skills、MCP 等机制，让 AI 真正为你所用
4. **[Git 协作工作流](./docs/project-mgmt/git-workflow.md)** — 掌握团队协作规范，包括分支策略、Commit 写法与 PR 流程

熟悉以上内容后，再按需阅读其他板块。

## 不只适用于 RentHub

本文档站虽以 RentHub 项目为背景，但其中大量内容对**任何开发者**都有参考价值：

- **Vibe Coding 板块**：Cursor 模型选择策略、token 控制、Rules/Skills/MCP 的使用方式，适用于所有使用 Cursor 进行 AI 辅助开发的场景
- **项目管理板块**：Git 基础、Conventional Commits 规范、AI 时代的协作纪律，适用于任何团队或个人项目

如果你是独立开发者或在其他团队，可以直接借鉴这些经验，按自己的项目情况调整使用。

## 本地开发

`docusaurus.config.ts` 中 **`baseUrl` 为 `/`**，本地默认地址为站点根路径（无子路径前缀）。

```bash
npm install          # 首次安装，或依赖变更后
npm start            # 开发服务器，默认 http://localhost:3000/
npm run build        # 生产构建，产物在 build/
npm run serve        # 本地预览构建产物
```

## 部署

本仓库通过 [GitHub Actions](./.github/workflows/deploy-pages.yml) 在推送至 **`main`** 或 **`master`** 时构建 `build/` 并发布到 **GitHub Pages**。

1. 在 GitHub 打开本仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中，将 **Source** 设为 **GitHub Actions**（不要选 “Deploy from a branch”）。
3. 若使用 GitHub 默认域名，访问形式一般为 `https://<用户或组织>.github.io/<仓库名>/`。本仓库同时通过 `static/CNAME` 配置 **自定义域名** `docs.renthub.cloud`；DNS 与证书需在域名/GitHub 侧按官方文档配置。

---

仓库级编写规范见：[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)

# RentHub 开发者指南

![RentHub Banner](./assets/images/renthub-banner.png)

本仓库是 **RentHub（租汇）** 面向开发者的 **文档站**：以 Markdown 为主，帮助团队快速了解项目、上手开发与统一协作方式。**不包含可运行的业务代码**；具体说明与专题正文放在 `docs/` 下（随撰写进度补充）。

## RentHub 简介

RentHub 是基于微信小程序的租赁市场平台，连接出租方与承租方，支持租赁信息发布、浏览、预订与订单管理等；并配有 Web 管理后台，供审核与运营使用。主工程采用 Monorepo，涵盖小程序、云函数、管理端与官网等。

官网：[renthub.cloud](https://www.renthub.cloud/)

## 文档目录

文档按 **目录 = 板块** 组织；每块用 `index.md` 作入口索引，子话题为独立的 `kebab-case.md` 文件。

| 板块 | 内容 | 状态 |
|------|------|------|
| [氛围编程 Vibe Coding](./docs/vibe-coding/index.md) | AI 辅助开发的约定与注意点 | 进行中 |
| [项目管理](./docs/project-mgmt/index.md) | 分支、发布、Code Review 等 | 进行中 |
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

```bash
npm install          # 首次安装，或依赖变更后
npm start            # 开发服务器，默认 http://localhost:3000/renthub-developer-guide/
npm run build        # 生产构建，产物在 build/
npm run serve        # 本地预览构建产物
```

## GitHub Pages 部署

本仓库使用 [Docusaurus 3](https://docusaurus.io/) 生成静态站点，并通过 [GitHub Actions 工作流](./.github/workflows/deploy-pages.yml) 自动部署到 GitHub Pages。

1. 在 GitHub 打开本仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中，将 **Source** 设为 **GitHub Actions**（不要选 "Deploy from a branch"）。
3. 向 **`main`** 或 **`master`** 分支推送后，工作流会自动构建并发布；部署完成后，同一页面会显示访问地址，一般为 `https://<用户名或组织名>.github.io/<仓库名>/`。

---

仓库级编写规范见：[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)

# RentHub 开发者指南

本仓库是 **RentHub（租汇）** 面向开发者的 **文档站**：以 Markdown 为主，帮助团队快速了解项目、上手开发与统一协作方式。**不包含可运行的业务代码**；具体说明与专题正文放在 `docs/` 下（随撰写进度补充）。

## RentHub 简介

RentHub 是基于微信小程序的租赁市场平台，连接出租方与承租方，支持租赁信息发布、浏览、预订与订单管理等；并配有 Web 管理后台，供审核与运营使用。主工程采用 Monorepo，涵盖小程序、云函数、管理端与官网等。

## 文档目录

文档按 **目录 = 板块** 组织；每块用 `README.md` 作入口索引，子话题为独立的 `kebab-case.md` 文件。

| 板块 | 内容 | 状态 |
|------|------|------|
| [项目综述](./docs/overview/README.md) | 架构、技术选型、模块关系 | 待撰写 |
| [开发注意事项](./docs/dev-notes/README.md) | 环境、调试、常见问题 | 待撰写 |
| [Vibe Coding](./docs/vibe-coding/README.md) | AI 辅助开发的约定与注意点 | 进行中 |
| [项目管理](./docs/project-mgmt/README.md) | 分支、发布、Code Review 等 | 待撰写 |
| [开发知识](./docs/knowledge/README.md) | 云开发、小程序、TypeScript 等 | 待撰写 |

后续若有新主题，在 `docs/` 下新增同级目录并将本表同步更新，保持入口一致。

仓库级编写规范见：[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)

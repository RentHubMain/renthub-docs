# RentHub 文档站 — 项目技术文档

## 概述

RentHub 官方综合文档站，使用 **Docusaurus 3** 构建为静态站点，部署在 Cloudflare Pages（`docs.renthub.cloud`）。内容覆盖产品使用、开发工程、界面设计、法律协议等专题，独立于业务代码仓库。

## 技术架构

| 层 | 技术 |
|----|------|
| 框架 | Docusaurus 3（React + MDX，`preset-classic`）|
| 语言 | TypeScript（配置）+ Markdown/MDX（内容）|
| 样式 | Infima CSS（Docusaurus 内置）+ 自定义变量 |
| 国际化 | `zh-Hans`（`i18n.defaultLocale`）|
| 部署 | GitHub Actions → Cloudflare Pages |

## 目录结构

```
docusaurus.config.ts      # 站点 URL、navbar、footer、插件配置
sidebars.ts               # 文档侧栏结构（docsSidebar）
sidebars-legal.ts         # 法律文档侧栏

src/
  pages/index.tsx         # 站点首页（Hero + 板块卡片）
  css/custom.css          # Infima 变量覆盖（品牌色 #3d7c47）
  theme/                  # swizzle 的主题组件（DocRoot 布局）

docs/                     # 文档正文
  vibe-coding/            # AI 辅助开发规范
  project-mgmt/           # 版本管理与工作流
  ui-design/              # 界面设计系统
  dev-knowledge/          # 开发知识库
  product-thinking/       # 产品思维

legal/                    # 法律协议（商家/租户租赁协议）
legal_versioned_docs/     # 法律文档历史版本

static/                   # 构建时复制到根（静态资源）
assets/images/            # 图片资源（在 staticDirectories 注册）
```

## 常用命令

```bash
npm install       # 安装依赖
npm start         # 开发服务器（http://localhost:3000/）
npm run build     # 生产构建（build/）
npm run serve     # 本地预览
```

## 内容规范

- 板块目录命名用 `kebab-case`，入口文件为 `index.md`
- 每个 `.md` 文件须含 `title` front matter
- 图片放 `assets/images/`，通过绝对路径引用（如 `/images/xxx.png`）
- 板块 `index.md` 顶部必须有 `## 目录` 表格列出子文档链接
- 新增文档同步更新：父级 `index.md`、`sidebars.ts`、首页板块卡片

## 部署

GitHub Actions 触发于 `main` 分支 push：
1. 安装依赖（`npm ci`）
2. `npm run build` 生成 `build/`
3. 通过 `wrangler-action` 执行 `pages deploy build --project-name renthub-admin` 部署到 Cloudflare Pages

部署依赖以下 GitHub Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 注意事项

- `webpack` 通过 `overrides` 固定在 `5.95.0`（与 `webpackbar@6` 兼容性问题）
- `build/` 和 `.docusaurus/` 不入库（GitHub Actions 每次全量构建）
- 法律文档版本化由 Docusaurus 版本化插件管理（`legal_versioned_docs/`），修改需经法务确认
- 品牌色：`#3d7c47`（浅色主题）、`#7cb342`（深色主题）

# RentHub 文档站 — Claude 指引

## 项目概述

RentHub 官方综合文档站，使用 **Docusaurus 3** 构建，部署在 Cloudflare Pages（`docs.renthub.cloud`）。内容涵盖产品、开发、设计、法律协议等专题，不包含业务代码。

## 技术栈

- **框架:** Docusaurus 3（React + MDX），`preset-classic`
- **语言:** TypeScript（配置）+ Markdown（内容）
- **国际化:** `zh-Hans`（当前仅中文）
- **部署:** GitHub Actions → Cloudflare Pages（`.github/workflows/deploy-pages.yml`）

## 目录结构

```
docs/           # 文档内容（每板块一个子目录，index.md 为入口）
legal/          # 法律协议文档
src/
  pages/        # 站点首页（React）
  theme/        # swizzle 的主题组件
  css/          # 全站样式（custom.css）
static/         # 构建时复制到根目录（静态资源）
assets/         # 图片等静态资源
docusaurus.config.ts  # 站点主配置
sidebars.ts           # 文档侧栏结构
```

## 常用命令

```bash
npm install       # 安装依赖
npm start         # 开发服务器（http://localhost:3000/）
npm run build     # 生产构建（产物到 build/）
npm run serve     # 预览构建产物
npm run format:md # 统一格式化 docs / legal 下 Markdown（标题编号、引号、空行等）
npm run format:md:check # 检查是否需要格式化（CI 用，有改动则非零退出）
```

## 内容规范

- 每篇文档必须有 YAML front matter（至少 `title`）
- 文件名用 **kebab-case**，板块入口用 `index.md`
- 图片放 `assets/images/`
- 新增文档时同步更新：父级 `index.md` 目录表、`sidebars.ts`
- 新增板块时同步更新：`src/pages/index.tsx`（首页卡片）、`sidebars.ts`、`docusaurus.config.ts`（navbar 如需要）

## 注意事项

- `package.json` 通过 `overrides` 锁定 `webpack@5.95.0`（与 `webpackbar@6` 兼容性问题，升级前确认）
- `build/` 和 `.docusaurus/` 不入库
- `legal_versioned_docs/` 是 Docusaurus 版本化内容，修改法律协议需经审核

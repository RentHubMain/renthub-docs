# RentHub文档站

![RentHub Banner](./assets/images/renthub-banner.png)

本仓库 **`renthub-docs`** 是 **RentHub（租汇）官方综合文档站**的源码：使用 [Docusaurus 3](https://docusaurus.io/) 将 `docs/`、`legal/` 等目录下的 Markdown 构建为静态站点。内容覆盖快速开始、产品、开发协作、界面设计、法律知识库等主题；**不包含**小程序、云函数、管理后台等业务实现代码。

**线上站点**：[docs.renthub.cloud](https://docs.renthub.cloud)（由本仓库构建部署，域名托管在 Cloudflare）。

## 公司简介

**租汇（RentHub）** 由 **成都租汇互联网服务有限责任公司** 运营，是 **轻资产服务平台**：为 **商户（出租方，lessor）** 与 **租户（承租方，lessee）** 提供 **信息发布、交易撮合、支付结算、物流协调、争议调解** 等中介服务。业务聚焦 **B2B / C2C 物品与工业设备租赁**，当前阶段以 **C2C** 为切入。（C2C 场景下商户含个人卖家，口径仍称商户。）

## RentHub 产品与文档的关系

RentHub 客户端以 **微信小程序** 为主触点，配套 **Web 管理后台** 与 **官网**，覆盖浏览上架物品、下单、合约与支付、履约协同等链路。产品线在工程上通常采用 **Monorepo**，常见目录约定包括：

- 小程序前端（WXML + WXSS + JS）
- 云函数（user / asset / order 等域）
- React + TypeScript 管理后台
- 官方网站

上述 **业务代码所在仓库与本文档仓库相互独立**；本仓库维护 **RentHub 文档站** 的源码与正文（综合知识库，可持续扩展新专题）。

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
| `static/` | 构建时复制到站点根目录（站点静态资源） |
| `assets/` | 图片等静态资源（在配置中作为 `staticDirectories` 之一挂载） |

编写与导航约定见：[`.agents/rules/project-guide.mdc`](./.agents/rules/project-guide.mdc)。

## 文档目录

文档按 **目录 = 板块** 组织；每块用 `index.md` 作入口索引，子话题为独立的 `kebab-case.md` 文件。

| 板块 | 内容 | 状态 |
|------|------|------|
| [氛围编程 Vibe Coding](./docs/vibe-coding/index.md) | AI 辅助开发的约定与注意点 | 进行中 |
| [版本管理与工作流](./docs/project-mgmt/index.md) | 分支、Code Review、文档站与业务仓 CI 工作流等 | 进行中 |
| [界面设计](./docs/ui-design/index.md) | 拟物化设计系统、三端 UI 规范 | 进行中 |
| [开发知识](./docs/dev-knowledge/index.md) | 微信小程序开发体系、CloudBase、JavaScript ES6+等 | 进行中 |
| [产品思维](./docs/product-thinking/index.md) | 产品主人意识、用户第一、方法论与租汇实践 | 进行中 |
| [法律文档](./legal/index.md) | 平台公示的协议与法律类文本（商家 / 租户租赁协议等） | 进行中 |
| 项目综述 | 架构、技术选型、模块关系 | 待撰写 |
| 开发注意事项 | 环境、调试、常见问题 | 待撰写 |

后续若有新主题，在 `docs/` 下新增同级目录并将本表同步更新，保持入口一致。

## 零基础新手？从这里开始

如果你刚接触开发，建议按以下顺序阅读（与站点首页「新手路线」一致）：

1. **[新成员上手指南](./docs/quick-start/onboarding.md)** — 环境、克隆仓库、测试与第一次 PR
2. **[Cursor 使用指南](./docs/vibe-coding/cursor-guide.md)** — AI 辅助开发与额度
3. **[Cursor 核心概念](./docs/vibe-coding/cursor-concepts.md)** — Rules、Skills、MCP
4. **[Git 基础入门](./docs/project-mgmt/git-basics.md)** — 版本控制与工作区
5. **[Git 协作工作流](./docs/project-mgmt/git-workflow.md)** — 分支、Commit、PR、GitHub Projects
6. **[GitHub Actions 工作流](./docs/project-mgmt/github-actions.md)** — CI/CD 与文档站部署示例
7. **[RentHub 业务仓库开发工作流](./docs/project-mgmt/renthub-dev-workflow.md)** — Monorepo、测试、Sonar、业务仓 CI
8. **[微信小程序开发体系](./docs/dev-knowledge/wechat-mini-program.md)** — 工具链与提审发布
9. **[腾讯云 CloudBase 入门](./docs/dev-knowledge/cloudbase.md)** — 云数据库与云函数

熟悉以上内容后，再按需阅读 [界面设计](./docs/ui-design/index.md)、[JavaScript ES6+](./docs/dev-knowledge/js-es6.md)（非必）等其余文档。

## 不只适用于 RentHub

本站虽以 RentHub 业务为背景编写，其中许多篇章对**读者与协作者**（含开发、产品、设计等角色）都有参考价值：

- **Vibe Coding 板块**：Cursor 模型选择策略、token 控制、Rules/Skills/MCP 的使用方式，适用于所有使用 Cursor 进行 AI 辅助开发的场景
- **版本管理与工作流板块**：Git 基础、Conventional Commits 规范、AI 时代的协作纪律，适用于任何团队或个人项目

若你在其他团队或独立工作，可直接借鉴这些内容，并按自身场景裁剪使用。

## 本地开发

`docusaurus.config.ts` 中 **`baseUrl` 为 `/`**，本地默认地址为站点根路径（无子路径前缀）。

本仓库使用 [Vite+](https://viteplus.dev/guide/) 统一工具链（`vp` 管理 Node、依赖与代码检查）。Docusaurus 的 dev/build 仍通过 `package.json` scripts 执行。

```bash
vp install           # 首次安装，或依赖变更后
vp run start         # 开发服务器，默认 http://localhost:3000/
vp run build         # 生产构建，产物在 build/
vp run serve         # 本地预览构建产物
vp check             # 格式化、Lint 与类型检查
vp run format:md     # 统一格式化 docs / legal 等 Markdown
```

未安装 `vp` 时，见 [Getting Started](https://viteplus.dev/guide/)（Windows：`irm https://vite.plus/ps1 | iex`）。

## 部署

本仓库通过 [GitHub Actions](./.github/workflows/deploy.yml) 在推送至 **`main`** 时构建 `build/` 并发布到 **Cloudflare Pages**。

工作流关键步骤：

1. `voidzero-dev/setup-vp` 安装 Vite+ 与 Node.js。
2. `vp install` 安装依赖；`vp check` 与 `vp run format:md:check` 做代码与 Markdown 检查。
3. `vp run build` 生成 Docusaurus 产物（`build/`）。
3. 使用 `wrangler-action` 自动确保 Pages 项目存在（`renthub-admin`）。
4. 执行 `pages deploy build --project-name renthub-admin` 发布到 Cloudflare Pages。

部署前请在 GitHub 仓库中配置以下 Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 法律文档版本管理

法律文档（`legal/`）采用 Docusaurus 独立插件版本化管理。**现行版本始终存放在 `legal/` 目录**，旧版本归档至 `legal_versioned_docs/`。

### 目录结构

| 路径 | 说明 |
|------|------|
| `legal/` | 现行版本文档（版本号由 `docusaurus.config.ts` 中 `current.label` 标注） |
| `legal_versioned_docs/version-X.X.X/` | 已归档的旧版本快照（只读，不直接修改） |
| `legal_versioned_sidebars/version-X.X.X-sidebars.json` | 对应旧版本的侧边栏配置 |
| `legal_versions.json` | 已归档版本列表（不含当前版本） |
| `sidebars-legal.ts` | 现行版本侧边栏配置 |

### 修改现行版本

直接编辑 `legal/` 下的文件。修改完成后同步更新每份协议文件的 front matter 与顶部 tip 块：

```yaml
version: "X.X.X"
effectiveDate: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
```

### 发布新版本

使用内置 Cursor Skill 自动完成整个发布流程：

```
/legal-version-release
```

Skill 会依次引导你归档旧版本、更新元数据、更新站点配置，并完成构建验证。完整 SOP 见 [`.agents/skills/legal-version-release/SKILL.md`](./.agents/skills/legal-version-release/SKILL.md)。

如需手动操作，核心命令为：

```bash
# 将当前 legal/ 快照为旧版本（如 0.0.2）
npx docusaurus docs:version:legal 0.0.2

# 之后更新 legal/ 文件元数据 + docusaurus.config.ts 版本标签与 navbar
```

## 许可证

除另有声明外，本仓库中的文档与站点内容采用 [**Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International**](https://creativecommons.org/licenses/by-nc-nd/4.0/)（**CC BY-NC-ND 4.0**，署名—非商业性使用—禁止演绎）许可：使用须保留署名；不得用于商业目的；不得基于本作品制作并分享演绎作品。完整许可条款以仓库根目录 [**LICENSE**](./LICENSE) 文件为准。

---

仓库级编写规范见：[`.agents/rules/project-guide.mdc`](./.agents/rules/project-guide.mdc)

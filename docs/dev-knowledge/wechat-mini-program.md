---
title: 微信小程序开发体系
---

本文说明**微信小程序**从账号与工具、获取代码到日常开发的完整链路，并指向微信官方文档便于深入查阅。RentHub 的小程序端运行在这一套体系之上；业务代码在团队业务仓库中维护，本仓库仅提供开发者指南。

> **官方总览**：[小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 1. 体系概览

### 1.1 小程序是什么？

微信小程序是运行在微信客户端内的应用形态：使用微信提供的**运行时 + 组件 + API**，用类 Web 技术（WXML、WXSS、JavaScript）构建界面与逻辑，由微信负责渲染、权限与安全沙箱。你无需单独发布安装包，用户通过微信扫码、搜索或分享进入。

### 1.2 与 RentHub 的关系

在 RentHub 工程中，常见分工是：

| 层次 | 技术 | 说明 |
|---|---|---|
| 表现与交互 | WXML、WXSS、小程序 JS | 页面、组件、路由、本地状态 |
| 端能力 | 微信 API | 登录、支付、文件、位置等（需配置与权限） |
| 数据与业务后端 | 云开发 / CloudBase、`wx.cloud` | 数据库、云函数、存储等（见本站 [腾讯云 CloudBase 入门](/docs/dev-knowledge/cloudbase)） |

界面视觉规范另见 [小程序 UI 设计](/docs/ui-design/mini-program)。

### 1.3 官方文档地图（建议收藏）

| 主题 | 链接 |
|---|---|
| 框架与运行原理 | [小程序框架](https://developers.weixin.qq.com/miniprogram/dev/framework/) |
| 组件 | [组件参考](https://developers.weixin.qq.com/miniprogram/dev/component/) |
| 客户端 API | [API 参考](https://developers.weixin.qq.com/miniprogram/dev/api/) |
| 服务端 API | [服务端 API](https://developers.weixin.qq.com/miniprogram/dev/api-backend/) |
| 开发者工具 | [工具文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools) |
| 云开发 | [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started) |

---

## 2. 账号、注册与小程序 AppID

### 2.1 微信公众平台

开发、预览真机、提交审核与正式发布，都依赖**小程序账号**。注册与认证在[微信公众平台](https://mp.weixin.qq.com/)完成。

- **个人/企业主体**：影响可开通能力（如部分支付、直播等能力对企业主体有要求）。
- **AppID（小程序 ID）**：项目的唯一标识；在开发者工具导入项目、配置服务器域名、云开发环境关联等场景都会用到。

### 2.2 开发成员权限

业务仓库的代码由团队维护时，通常还需要：

- 由管理员将你添加为**小程序项目成员**或**体验者**，才能使用指定 AppID 进行真机预览、上传体验版等。
- 具体权限以团队规范为准；若无法预览，优先检查成员权限与 AppID 是否一致。

---

## 3. 安装微信开发者工具

### 3.1 下载与安装

1. 打开微信官方[工具下载页](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable)（或从[工具文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools)进入「下载」）。
2. 选择与你操作系统匹配的版本（Windows / macOS），下载并安装。
3. 使用**微信扫码登录**开发者工具（需与有权限的微信账号一致）。

### 3.2 版本与基础库

- 定期更新开发者工具，可减少与真机行为不一致的问题。
- 在工具中可设置**调试基础库**版本；上线前应在项目配置允许的范围内，在较低基础库版本上做一次冒烟测试，避免低版本用户白屏。

> **说明**：工具具体菜单可能随版本微调，以当前工具内界面与[工具文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools)为准。

---

## 4. 获取代码与打开项目

### 4.1 从 Git 克隆业务仓库

RentHub 小程序源码不在 `renthub-developer-guide` 文档仓库中。按团队约定从 Git 托管平台克隆**小程序前端工程**到本机，打开Powershell/任意终端：

>需要先下载git后再运行，且本企业项目不公开，下载前先请求权限

```bash
git clone https://github.com/RentHubMain/renthub-mini-program.git
cd <小程序项目目录>
```

克隆后目录中通常包含 `app.json`、`project.config.json`（或 `project.private.config.json`）等小程序标识文件。

### 4.2 使用开发者工具导入项目

1. 打开微信开发者工具，选择**导入项目**（或「新建小程序项目」并指向已有目录）。
2. **目录**：选择克隆下来的小程序根目录（包含 `app.json` 的目录）。
3. **AppID**：填写团队提供的小程序 AppID；若仅本地学习无 AppID，可选用测试号（能力受限，以工具提示为准）。
4. 导入后即可在模拟器中查看首页；若项目依赖云开发，需按仓库 README 或下文完成环境初始化。

### 4.3 依赖与构建（若项目使用 npm）

部分工程会使用 npm 包，需在项目目录执行：

```bash
npm install
```

然后在开发者工具中执行**工具 →构建 npm**（具体入口以当前工具版本为准），否则可能报找不到 `miniprogram_npm` 下模块。团队项目若使用 Taro、uni-app 等框架，还需按其文档执行额外的 dev/build 命令，以业务仓库说明为准。

---

## 5. 工程结构（概念）

官方对目录与配置的说明见[小程序工程结构](https://developers.weixin.qq.com/miniprogram/dev/framework/structure)。常见要点：

| 文件/目录 | 作用 |
|---|---|
| `app.js` / `app.json` / `app.wxss` | 小程序全局逻辑、配置、全局样式 |
| `pages/` | 各页面目录，通常每页包含 `.wxml`、`.wxss`、`.js`、`.json` |
| `components/` | 自定义组件 |
| `project.config.json` | 工具与编译相关配置 |
| `sitemap.json` | 索引与爬虫相关配置 |

页面路由由 `app.json` 的 `pages` 数组声明，**第一项为小程序启动页**。

---

## 6. 日常开发流程

### 6.1 编写页面与组件

- **WXML**：结构，类似 HTML，但标签为小程序内置组件或自定义组件。
- **WXSS**：样式，支持大部分 CSS，单位常用 `rpx`（详见 [小程序 UI 设计](/docs/ui-design/mini-program)）。
- **JavaScript**：页面/组件逻辑；可使用 `Page()`、`Component()` 等 API。

组件与 API 细节以官方文档为准：[组件](https://developers.weixin.qq.com/miniprogram/dev/component/)、[API](https://developers.weixin.qq.com/miniprogram/dev/api/)。

### 6.2 调用云能力与 CloudBase

若项目已开通云开发并初始化 `wx.cloud`，小程序端可通过云数据库、云函数、云存储等访问后端，与 RentHub 文档中的 [CloudBase 能力说明](/docs/dev-knowledge/cloudbase) 相对应。具体环境 ID、权限与初始化代码以业务仓库为准。

### 6.3 本地调试

- 使用开发者工具**模拟器**查看界面与 Console。
- 需要相机、定位、真实登录态时，使用**预览**生成二维码，用微信扫码在真机调试。
- **Network** 面板可查看请求；云函数日志需在云开发控制台或工具云开发面板查看。

### 6.4 上传与版本

1. **在开发者工具里上传**：窗口**左上方工具栏**中有 **「上传」** 按钮（与「预览」「真机调试」等并列）。点击后会弹出上传对话框。
2. **填写版本信息**：在对话框中选择**更新类型**（如版本升级、特性更新等），填写**版本号**（仅字母、数字、小数点），并在**项目备注**中写清本次改动摘要，最后点击绿色的 **「上传」** 确认。代码会传到微信后台，生成一条**开发版/待处理版本**，但**不会自动对用户上线**。

![微信开发者工具：点击工具栏「上传」后弹出的版本与备注对话框](/images/wechat-devtools-upload-dialog.png)

3. **上传之后要做什么**：上传成功 ≠ 线上生效。需要登录 [微信公众平台](https://mp.weixin.qq.com/) 小程序后台，将该版本**手动设为体验版**（供体验者扫码）或走**提交审核 → 审核通过 → 发布**流程后，用户才能用到正式线上版本。
4. **审核与类目**：**正式发布前必须经过微信审核**。提审时小程序展示的内容（含页面、文案、**商品/服务信息**等）应与账号备案时选择的**服务类目**一致；若随意上传与类目无关的商品或功能描述，容易被判定为类目不符或信息不实，导致**审核不通过**。上架规则、类目范围与资质要求以微信官方最新说明为准。

---

## 7. 常见问题与注意事项

### 7.1 域名与 request 合法域名

小程序内 `wx.request`、WebSocket、上传下载等使用的域名，需在公众平台配置**服务器域名**白名单；未配置的域名在正式环境会失败。本地开发阶段可在开发者工具中开启「不校验合法域名」等选项（**仅用于开发**，勿依赖此选项上线）。

### 7.2 用户隐私与权限

涉及用户信息、位置、相册等能力时，需在 `app.json` 等处声明权限，并遵守微信[用户隐私保护指引](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/)等平台规范。

### 7.3 与文档站的关系

本页描述的是**微信侧通用开发体系**；RentHub 特有的分支策略、环境变量、云函数命名等，以业务仓库文档与团队约定为准。

---

## 8. 延伸阅读

| 资源 | 链接 |
|---|---|
| 官方起步教程（含视频） | 从[开发指南首页](https://developers.weixin.qq.com/miniprogram/dev/framework/)进入「官方教程」等入口 |
| 框架参考（生命周期、场景值等） | [框架参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/) |
| 云托管（如需容器化后端） | [微信云托管](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/) |

学完本页后，建议结合官方 [快速开始](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html)动手新建一个演示小程序，再对照业务仓库理解 RentHub 实际工程结构。

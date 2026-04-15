---
title: 腾讯云 CloudBase 入门
---

RentHub 的后端完全运行在**腾讯云 CloudBase**上。这篇文档会帮你建立一个清晰的框架——CloudBase 到底帮我们做了什么，以及它的五大核心能力分别是什么。

> **官方文档**：[快速开始](https://docs.cloudbase.net/quick-start/)

---

## 1. CloudBase 是什么？

传统开发需要自己租服务器、安装数据库、写接口……CloudBase 把这些全部打包成"开箱即用的云服务"，让你只关注业务逻辑，不用操心基础设施。

一句话总结：

> **CloudBase = 数据库 + 函数 + 托管 + 存储 + 登录，全部在云端，按需调用。**

RentHub 的小程序直接通过微信的 `wx.cloud` SDK 调用这些服务，不需要自己搭 API 服务器。

---

## 2. 文档型数据库

### 2.1 什么是文档型数据库？

你可能听说过 Excel 或 MySQL——那是"表格型"数据库，数据整整齐齐排成行和列。

文档型数据库（CloudBase 用的是 MongoDB 风格）则把每条数据存成一个**JSON 对象**，叫做"文档"。好处是结构灵活——同一个集合里不同文档可以有不同字段。每当需要补充新的数据的时候，只需要在这篇文档的末尾加上新的字段即可。

```json
// 一条"房源"文档的例子
{
  "_id": "asset_001",
  "title": "朝阳区精装一居室",
  "price": 4500,
  "tags": ["近地铁", "押一付三"],
  "owner": "user_123"
}
```

### 2.2 核心概念

| 概念 | 类比 Excel | 说明 |
|---|---|---|
| **数据库（Database）** | 整个 Excel 文件 | 一个环境下可建多个数据库 |
| **集合（Collection）** | 一张工作表 | 存放同类数据，如 `assets`、`orders` |
| **文档（Document）** | 一行数据 | 一条记录，格式为 JSON |
| **字段（Field）** | 一列 | 文档里的每个 key |

### 2.3 RentHub 中的使用

RentHub 的主要集合包括 `users`（用户）、`assets`（资产）、`orders`（订单）、`messages`（消息）等。

在小程序端，读取数据的代码大概长这样：

```js
const db = wx.cloud.database();
const result = await db.collection('assets').where({ status: 'available' }).get();
console.log(result.data); // 返回所有可用资产
```

> **深入阅读**：[CloudBase 数据库官方文档](https://docs.cloudbase.net/database/introduce)

---

## 3. 云函数 {#cloudbase-cloud-functions}

### 3.1 什么是云函数？

想象一下：你雇了一个助手，每次你交给他一个任务（发送请求），他处理完就把结果还给你，然后消失——你不用管他住在哪里、用什么电脑工作。

**云函数**就是这样的助手。你写一段 Node.js 代码上传到云端，需要时"调用"它，它运行、返回结果，然后自动释放资源。你不需要维护服务器。

### 3.2 为什么需要云函数？

有些操作不能直接在小程序前端做，比如：

- 操作其他用户的数据（权限控制）
- 调用第三方 API（需要隐藏密钥）
- 复杂的业务逻辑（如订单状态流转）
- 涉及支付逻辑
- 发送模板消息

这些都放在云函数里执行，更安全、更可控。

### 3.3 RentHub 的云函数划分

RentHub 按业务域划分云函数：

| 云函数 | 职责 |
|---|---|
| `user` | 用户注册、登录、信息更新 |
| `asset` | 房源发布、编辑、下架 |
| `order` | 下单、取消、状态流转 |
| `message` | 消息发送与通知 |
| `admin` | 管理后台专用操作 |
| `help` | 帮助与客服相关 |

调用云函数的代码示例：

```js
const res = await wx.cloud.callFunction({
  name: 'asset',          // 云函数名称
  data: {                 // 传给云函数的参数
    action: 'create',
    title: '精装两居室',
    price: 6000,
  },
});
console.log(res.result);  // 云函数返回的结果
```

在业务仓库里，各云函数（如 `order`、`user`、`breach`、`insurance` 等）建议采用统一的目录与职责划分，并按需调整**执行超时**：可在 `cloudfunctions/<名称>/config.json` 与**云开发控制台**中配置，避免调用第三方接口等耗时场景下默认时限过短导致失败。

### 3.4 RentHub 云函数目录规定

| 路径 | 职责 | 说明 |
|------|------|------|
| **index.js** | 入口与路由 | 仅负责 `cloud.init`、`exports.main`，根据 `event.action` 分发到对应 handler；不写业务逻辑。 |
| **handlers/** | 动作处理 | 每个 action 对应处理函数：校验入参、调用 services 与数据库、返回统一结构 `{ success, data?, message? }`。 |
| **services/** | 业务逻辑 | 纯计算、规则与流程编排；不直接依赖 `wx-server-sdk`，便于单测。 |
| **utils/** | 通用工具 | 配置读取、安全校验、第三方 SDK 封装等，供 handlers 与 services 复用。 |
| **constants.js** | 常量 | 状态码、错误码、配置键名等集中定义。 |

这样划分，首先是把**云环境、路由**与**可单独验证的业务规则**拆开：`services/` 不绑 `wx-server-sdk`，在普通 Node 环境里即可 `require` 编写、导出并跑**单元测试**，不必为每条规则起整套云函数。`handlers/` 只管「接 action、校验、调 services/库、组返回」，变更某个动作时影响面小，**长期维护**更可控。各目录**职责单一、边界清楚**，符合**原子化**思路——每个模块只做一类事，再组合成完整调用链，避免「一个大文件里什么都写」带来的耦合。

**约定**：`index.js` 只做「解析 event → 调用 handler → 返回结果」；新增 action 时在入口注册，并委托给 `handlers/` 下的实现。

### 3.5 目录结构示例（以 order 为例）

```
cloudfunctions/order/
├── index.js
├── constants.js
├── handlers/
│   ├── order.js
│   ├── payment.js
│   ├── renewal.js
│   ├── evidence.js
│   ├── callback.js
│   └── admin.js
├── services/
│   ├── deliverySubsidy.js
│   └── settlement.js
└── utils/
```

> **深入阅读**：[CloudBase 云函数官方文档](https://docs.cloudbase.net/cloud-function/introduce)

---

## 4. 云托管

### 4.1 什么是云托管？

云函数适合短时间运行的任务（几秒内完成）。但如果你有一个**持续运行的服务**——比如 RentHub 的 Web 管理后台——就需要"云托管"。

云托管本质上是**容器化的服务器**：你把代码打包成 Docker 镜像，上传后腾讯云帮你运行、自动扩缩容、处理流量。你依然不用维护物理服务器。

### 4.2 云函数 vs 云托管

| 对比维度 | 云函数 | 云托管 |
|---|---|---|
| 运行时长 | 短（通常 < 30s） | 可持续运行 |
| 适合场景 | 单次操作、事件触发 | HTTP API、长连接 |
| 技术形式 | 单个 JS 文件 | Docker 容器 |
| 冷启动 | 有（首次调用稍慢） | 可保持常驻 |

RentHub 的 Web 管理后台后端接口部署在云托管上。

> **深入阅读**：[CloudBase 云托管官方文档](https://docs.cloudbase.net/run/introduction)

---

## 5. 云存储

### 5.1 什么是云存储？

用来存放**文件**——图片、PDF、视频等。数据库存的是结构化数据（JSON），而图片这样的二进制文件太大，不适合放在数据库里，应该放在云存储中。

每个上传的文件会得到一个唯一的 `fileID`（云文件地址），可以保存到数据库，需要时用这个 ID 下载或生成临时链接。

### 5.2 RentHub 中的使用

资产图片、用户头像、合同附件、实名认证照片等都存在云存储中：

```js
// 上传图片
const uploadResult = await wx.cloud.uploadFile({
  cloudPath: `assets/${Date.now()}.jpg`,  // 存储路径
  filePath: tempFilePath,                  // 本地临时路径
});
const fileID = uploadResult.fileID;        // 拿到云端 ID，存入数据库

// 获取临时访问链接（有效期有限）
const { fileList } = await wx.cloud.getTempFileURL({
  fileList: [fileID],
});
console.log(fileList[0].tempFileURL);
```

> **深入阅读**：[CloudBase 云存储官方文档](https://docs.cloudbase.net/storage/introduce)

---

## 6. 身份验证（登录鉴权）

### 6.1 为什么需要身份验证？

任何有用户系统的应用都需要解决两个问题：

1. **你是谁？**（Authentication / 认证）——用户登录，证明自己的身份
2. **你能做什么？**（Authorization / 授权）——控制不同用户的操作权限

### 6.2 CloudBase 的登录方式

CloudBase 支持多种登录方式，RentHub 主要使用：

| 登录方式 | 适用端 | 说明 |
|---|---|---|
| **微信登录** | 小程序 | 用户一键授权，无需输密码，最常用 |
| **自定义登录** | Web 管理后台 | 后台管理员用账号密码登录 |

### 6.3 微信小程序登录流程

微信小程序登录的流程比较特殊，简化版如下：

```
用户打开小程序
    ↓
wx.login() 获取临时 code
    ↓
云函数用 code 换取用户的 openid（微信用户唯一标识）
    ↓
用 openid 在数据库查找或创建用户记录
    ↓
返回登录状态，用户进入应用
```

CloudBase 在微信小程序环境下会自动帮你处理大部分认证流程，你只需要在数据库权限中配置"仅创建者可读写"之类的规则，CloudBase 会自动比对当前登录用户。

### 6.4 数据库权限与登录的关系

CloudBase 数据库有四种权限模式：

| 权限模式 | 说明 |
|---|---|
| 仅创建者可读写 | 只有数据的创建者能操作，适合用户私有数据 |
| 所有用户可读，仅创建者可写 | 适合公开展示但只能自己编辑的内容（如房源） |
| 所有用户可读写 | 完全公开，慎用 |
| 仅管理端可读写 | 只有云函数（服务端）能操作，最安全 |

RentHub 的敏感操作（如修改订单状态）都通过云函数以**管理员身份**执行，绕过前端权限限制，确保安全。

> **深入阅读**：[CloudBase 登录鉴权官方文档](https://docs.cloudbase.net/authentication-v2/auth/introduce)

---

## 7. 五大能力总结

| 能力 | 解决什么问题 | RentHub 中的用途 |
|---|---|---|
| **文档型数据库** | 存储结构化业务数据 | 用户、房源、订单、消息 |
| **云函数** | 安全执行服务端逻辑 | 业务操作、第三方 API 调用 |
| **云托管** | 运行持续性后端服务 | 管理后台 API |
| **云存储** | 存放图片等文件 | 房源图片、用户头像 |
| **身份验证** | 管理用户登录与权限 | 微信一键登录、数据访问控制 |

---

## 8. 下一步

- CloudBase 控制台入口：[console.cloud.tencent.com/tcb](https://console.cloud.tencent.com/tcb)

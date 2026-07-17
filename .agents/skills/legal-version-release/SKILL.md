---
description: 发布法律文档新版本 — 归档现行版本并将 legal/ 升级为新版本号
---

# legal-version-release

> 触发方式：在 Cursor Composer 中输入 `/legal-version-release`，或说"发布法律文档新版本"

## 用途

`legal/` 下的协议文件修订完成后，按 Docusaurus 版本化规范将当前内容归档为旧版本，并把 `legal/` 升级为新版本。

---

## 执行前确认

向用户询问并明确以下三项信息再继续：

1. **旧版本号**：`docusaurus.config.ts` 中 legal 插件 `versions.current.label` 当前的值（如 `0.0.2`）
2. **新版本号**：本次发布的版本（如 `0.0.3`）
3. **生效日期**：`YYYY-MM-DD` 格式（通常为今天）

---

## 步骤

### 1. 归档当前版本

运行 Docusaurus 内置命令，将 `legal/` 快照为旧版本归档：

```bash
npx docusaurus docs:version:legal <旧版本号>
```

该命令自动完成：
- `legal/` → `legal_versioned_docs/version-<旧版本号>/`（复制）
- 生成 `legal_versioned_sidebars/version-<旧版本号>-sidebars.json`
- 在 `legal_versions.json` 首位插入旧版本号

执行后验证 `legal_versioned_docs/version-<旧版本号>/` 目录已出现再进行下一步。

---

### 1.1 校正归档快照：标明「已失效 / 历史版本」（必做）

`docs:version:legal` 会把当时 `legal/` 里的「现行有效」提示原样复制进归档目录；若不修改，读者会误以为旧版本仍有效。**必须在进入步骤 2 之前**处理 `legal_versioned_docs/version-<旧版本号>/` 下所有协议 `.md`（不含 `index.md`）。

**front matter：**

- 将 `status: current` 改为 `status: archived`（若该文件无 `status` 字段则新增此行）。
- **不要**改动 `version`、`effectiveDate`、`lastUpdated`：它们应继续反映该历史版本的编号与当时日期，便于审计与对照。

**将顶部的「当前版本」提示块整体替换为**（日期用该文件原有的生效日 / 最后更新日转成中文表述，与归档前正文一致即可）：

```
:::caution 历史版本（已失效）
**v<旧版本号>** · 生效日期：<X>年<X>月<X>日 · 最后更新：<X>年<X>月<X>日 · 本页为历史归档，**不再作为现行有效协议**；签订、履行与争议处理请以 [现行协议文档](/legal) 为准。
:::
```

说明：

- 使用 `:::caution`（或 `:::warning`）而非 `:::tip`，与「已失效」语义一致，避免与现行版的绿色提示混淆。
- 链接使用站点绝对路径 `/legal`（现行法律文档根），符合文档站链接规范。

---

### 1.2 归档版 `index.md` 目录须指向本版本文档（必做）

`docs:version:legal` 会把 `legal/index.md` 一并复制到 `legal_versioned_docs/version-<旧版本号>/index.md`。其中 **## 目录** 表格里的链接若仍是 `/legal/…`（无版本前缀），读者从 **`/legal/<旧版本号>/`** 进入后会跳到**现行版**协议页，与「历史版本」语境不符。

**必须在进入步骤 2 之前** 编辑 `legal_versioned_docs/version-<旧版本号>/index.md`：

- 将目录表中**每一份协议**的链接改为**本归档版本**的站点路径（相对 `baseUrl`，**不带**尾部斜杠、**不带** `.md`、**不要**写仓库目录如 `legal_versioned_docs/...`）：

  ```markdown
  [租汇平台商家租赁协议](/legal/<旧版本号>/lessor-rental-agreement)
  [租汇平台租户租赁协议](/legal/<旧版本号>/lessee-rental-agreement)
  ```

- **指向现行版**的入口只应出现在读者需要「回到最新公示」时（例如协议正文顶部的 caution 块链到 `/legal`）；归档首页的目录表应**只链到同版本下的协议页**。

---

### 2. 更新 `legal/` 文件元数据

遍历 `legal/` 下所有协议 `.md` 文件（不含 `index.md`），逐一更新：

**front matter：**

```yaml
version: "<新版本号>"
effectiveDate: "<生效日期>"
lastUpdated: "<生效日期>"
```

**顶部 tip 提示块：**

```
:::tip 当前版本
**v<新版本号>** · 生效日期：<X>年<X>月<X>日 · 最后更新：<X>年<X>月<X>日 · 状态：**现行有效**
:::
```

---

### 3. 更新 `docusaurus.config.ts`

**3a. 插件版本标签** — 找到 `id: 'legal'` 的插件配置，修改 `versions.current.label`：

```ts
versions: {
  current: {
    label: '<新版本号>',
  },
},
```

**3b. Navbar 下拉菜单** — 找到 `label: '法律文档'` 的 `dropdown`：

- 将已有**现行版**条目的 `label` 改为新版本号，且**必须使用**固定 `to`（勿用 `docSidebar`：在 `/legal/<旧版本>/…` 下仍会解析为该版本侧栏首页，无法切回现行版）：

  ```ts
  {
    to: '/legal/',
    label: '协议文档（v<新版本号>）',
    activeBaseRegex:
      '^/legal(?!/(?:\\d+\\.\\d+\\.\\d+|next)(?:/|$))',
  }
  ```

- 在下方追加旧版本归档链接（版本倒序排列，新在上旧在下）：

  ```ts
  { href: '/legal/<旧版本号>/', label: '协议文档（v<旧版本号>）' }
  ```

---

### 4. 构建验证

```bash
npm run build
```

确认无报错。如需本地预览，可先运行 `npm start`。

---

### 5. 输出发布摘要

向用户展示以下变更汇总，确认无遗漏：

| 变更项 | 说明 |
|--------|------|
| `legal_versioned_docs/version-<旧版本号>/` | 新增（旧版本快照）；各协议页已改为 `status: archived` + 「历史版本（已失效）」提示；`index.md` 目录表已改为 `/legal/<旧版本号>/…` 指向本版协议 |
| `legal_versioned_sidebars/version-<旧版本号>-sidebars.json` | 新增 |
| `legal_versions.json` | 首位新增 `"<旧版本号>"` |
| `legal/` 各协议文件 front matter + tip 块 | 升级为 `<新版本号>` |
| `docusaurus.config.ts` | 版本标签与 navbar 已更新 |

提示用户使用 `/renthub-commit` 完成 commit。

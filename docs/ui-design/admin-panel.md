---
title: Admin Panel UI 设计
---

## 1. 概述

本文档规定 RentHub Web 管理后台的 UI 设计标准。管理后台面向内部运营人员，设计目标是**信息密度高、操作效率强**，在保持品牌拟物化风格的同时，提供清晰的数据展示与便捷的操作体验。

**与官网的区别**：
- 管理后台信息密度更高，卡片 hover 偏移更保守（`-2px`）
- 表格、筛选器、分页是核心组件，官网几乎不用
- 字号整体偏小（`--font-sm: 14px` 为正文主力）
- 内容区宽度随侧边栏动态变化，无固定 `max-width`

---

## 2. 基础变量系统

### 2.1 圆角系统

```css
--radius-small:   12px;
--radius-medium:  20px;
--radius-large:   32px;
--radius-round:  999px;
--radius-capsule: 50px;
```

### 2.2 阴影系统

```css
/* 凸起阴影 */
--shadow-neomorphic-raised:
  8px 8px 16px rgba(0, 0, 0, 0.15),
  inset 1px 1px 2px rgba(255, 255, 255, 0.6);

/* 凹陷阴影 */
--shadow-neomorphic-pressed:
  inset 6px 6px 12px rgba(0, 0, 0, 0.15),
  inset -6px -6px 12px rgba(255, 255, 255, 0.6);

/* 激活阴影（绿色 CTA） */
--shadow-neomorphic-active-green:
  6px 6px 16px rgba(61, 124, 71, 0.4),
  -4px -4px 12px rgba(124, 179, 66, 0.3),
  inset 1px 1px 2px rgba(255, 255, 255, 0.3);
```

### 2.3 间距系统（8pt 规则）

```css
--spacing-xs:  4px;
--spacing-sm:  8px;
--spacing-md:  16px;
--spacing-lg:  24px;
--spacing-xl:  32px;
--spacing-2xl: 48px;

/* 页面布局变量 */
--page-padding:  var(--spacing-lg);  /* 24px */
--page-gap:      var(--spacing-md);  /* 16px */
--card-gap:      var(--spacing-md);  /* 16px */
--card-padding:  var(--spacing-md) var(--spacing-lg); /* 16px 24px */
```

### 2.4 字体大小系统

管理后台以 14px 为正文主力字号，信息密度高：

```css
--font-xs:  12px;  /* 标签、注释 */
--font-sm:  14px;  /* 正文、表格内容 */
--font-md:  16px;  /* 卡片标题、强调 */
--font-lg:  18px;
--font-xl:  20px;
--font-2xl: 24px;  /* 页面标题 */
--font-3xl: 28px;
```

### 2.5 颜色系统

```css
/* 公司主题色 */
--color-green-dark:  #3d7c47;
--color-green-light: #7cb342;
--color-blue-dark:   #2c5f8d;
--color-blue-light:  #4a9b8e;
--color-brown-dark:  #8b7355;
--color-brown-light: #c4a775;

/* 主色调 */
--primary-color: var(--color-green-light);   /* #7cb342 */
--primary-dark:  var(--color-green-dark);    /* #3d7c47 */
--primary-light: #E8F5E9;

/* 功能色 */
--success-color: #7cb342;
--warning-color: #F59E0B;
--error-color:   #EF4444;
--info-color:    #3B82F6;

/* 文本色 */
--text-primary:     #1A1A1A;
--text-secondary:   #666666;
--text-placeholder: #999999;
--text-disabled:    #CCCCCC;

/* 背景色 */
--bg-primary:   #FFFFFF;
--bg-secondary: #F5F5F5;
--bg-grey:      #F8F8F8;
--border-color: #EEEEEE;
```

### 2.6 渐变系统（管理后台专用）

```css
/* 卡片头部轻量渐变 */
--header-gradient: linear-gradient(135deg,
  rgba(124, 179, 66, 0.1) 0%,
  rgba(61, 124, 71, 0.15) 50%,
  rgba(124, 179, 66, 0.1) 100%);

/* 强调头部渐变 */
--header-gradient-strong: linear-gradient(135deg,
  rgba(124, 179, 66, 0.2) 0%,
  rgba(61, 124, 71, 0.25) 50%,
  rgba(124, 179, 66, 0.2) 100%);

/* 悬浮高亮背景 */
--highlight-bg: linear-gradient(135deg,
  rgba(124, 179, 66, 0.08) 0%,
  rgba(61, 124, 71, 0.12) 100%);
```

---

## 3. 页面布局规范

### 3.1 页面容器

```css
.page-container {
  display: flex;
  flex-direction: column;
  gap: var(--page-gap);
  padding: var(--page-padding);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.page-title {
  font-size: var(--font-2xl); /* 24px */
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
  padding: 0 var(--spacing-md);
}
```

### 3.2 内容区域布局

管理后台通常采用侧边栏 + 主内容区的两栏布局：

```css
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
}

.main-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background: var(--bg-grey);
}
```

---

## 4. 卡片组件

### 4.1 基础卡片

```css
.card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-2px); /* 管理后台偏移更保守 */
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.1),
    -12px -12px 24px rgba(255, 255, 255, 0.95),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8),
    inset -1px -1px 2px rgba(0, 0, 0, 0.05);
}

.card-body {
  padding: var(--card-padding);
}

/* 卡片头部：使用轻量绿色渐变 */
.card-header {
  background: var(--header-gradient);
  background-color: var(--primary-light);
  border-bottom: 1px solid rgba(124, 179, 66, 0.1);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-large) var(--radius-large) 0 0;
}

.card-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
}
```

---

## 5. 表格组件

表格是管理后台最核心的组件，用于展示订单、用户、资产等列表数据：

```css
.table-container {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: var(--spacing-lg);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

/* 表头 */
.table thead {
  background: var(--header-gradient);
  background-color: var(--primary-light);
}

.table th {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-weight: 600;
  font-size: var(--font-sm);
  color: var(--text-primary);
  border-bottom: 1px solid rgba(124, 179, 66, 0.1);
  white-space: nowrap;
}

/* 表体 */
.table td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  font-size: var(--font-sm);
  color: var(--text-primary);
}

/* 行悬浮高亮 */
.table tbody tr:hover {
  background: var(--highlight-bg);
  transform: translateX(2px); /* 轻微位移增强反馈 */
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

### 5.1 表格操作按钮

```css
/* 表格内的小型操作按钮 */
.table-action {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 12px;
  font-size: var(--font-xs);
  font-weight: 500;
  border-radius: var(--radius-capsule);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  text-decoration: none;
}
```

---

## 6. 状态标签（Status Tag）

与小程序 Tag 遵循相同的胶囊外形和拟物化阴影设计原则：

```css
.status-tag,
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 14px;
  border-radius: var(--radius-capsule);
  font-size: var(--font-xs);
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  box-shadow: var(--shadow-neomorphic-pressed);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

/* 成功状态（已完成、正常等） */
.status-tag.success,
.tag-success {
  background: linear-gradient(135deg, var(--success-color), var(--primary-dark));
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 2px 8px rgba(61, 124, 71, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* 警告状态（待处理、审核中等） */
.status-tag.warning,
.tag-warning {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  color: #92400E;
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow:
    0 2px 8px rgba(245, 158, 11, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.6),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* 错误状态（已拒绝、异常等） */
.status-tag.error,
.tag-error {
  background: linear-gradient(135deg, #FEE2E2, #FECACA);
  color: #991B1B;
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow:
    0 2px 8px rgba(239, 68, 68, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.6),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* 信息状态 */
.status-tag.info {
  background: linear-gradient(135deg, #DBEAFE, #BFDBFE);
  color: #1E40AF;
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow:
    0 2px 8px rgba(59, 130, 246, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.6),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
}

/* 默认状态 */
.status-tag.default {
  background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
  color: var(--text-primary);
  border-color: rgba(0, 0, 0, 0.1);
}
```

---

## 7. 按钮组件

### 7.1 基础按钮

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 24px;
  font-size: var(--font-sm); /* 14px */
  font-weight: 500;
  border-radius: var(--radius-capsule);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}
```

### 7.2 按钮变体

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #7cb342, #3d7c47);
  color: #FFFFFF;
  box-shadow: var(--shadow-neomorphic-active-green);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    8px 8px 20px rgba(61, 124, 71, 0.5),
    -4px -4px 12px rgba(124, 179, 66, 0.4),
    inset 1px 1px 2px rgba(255, 255, 255, 0.3);
}

.btn-primary:active {
  transform: translateY(1px) scale(0.98);
}

/* 次要按钮 */
.btn-secondary {
  background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%);
  color: var(--text-primary);
  box-shadow: var(--shadow-neomorphic-pressed);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
  box-shadow: var(--shadow-neomorphic-raised);
}
```

### 7.3 按钮尺寸

```css
.btn-small {
  height: 32px;
  padding: 0 16px;
  font-size: var(--font-xs); /* 12px */
}

.btn-large {
  height: 48px;
  font-size: var(--font-md); /* 16px */
}

.btn-block  { width: 100%; }
.btn-disabled { opacity: 0.5; pointer-events: none; cursor: not-allowed; }
```

---

## 8. 输入框组件

### 8.1 基础输入框

```css
.input {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-md);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-capsule);
  font-size: var(--font-sm);
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: var(--shadow-neomorphic-raised);
}

.input:hover {
  border-color: rgba(124, 179, 66, 0.3);
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow:
    0 0 0 3px rgba(124, 179, 66, 0.1),
    var(--shadow-neomorphic-raised);
}

.input::placeholder {
  color: var(--text-placeholder);
}

.input:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: var(--shadow-neomorphic-pressed);
}
```

### 8.2 搜索框

```css
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 40px;
  padding-left: calc(var(--spacing-md) + 20px + var(--spacing-sm)); /* 为图标留位 */
  padding-right: var(--spacing-md);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-capsule);
  font-size: var(--font-sm);
  box-shadow: var(--shadow-neomorphic-raised);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow:
    var(--shadow-neomorphic-active-green),
    0 0 0 3px rgba(124, 179, 66, 0.1);
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--text-placeholder);
  pointer-events: none;
}
```

---

## 9. 筛选器组件

筛选器是管理后台特有的组合组件，通常放在表格上方：

```css
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--card-padding);
  margin-bottom: var(--spacing-md);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* 筛选项下拉 */
.filter-select {
  height: 36px;
  padding: 0 var(--spacing-md);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-capsule);
  font-size: var(--font-sm);
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: var(--shadow-neomorphic-raised);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}
```

---

## 10. 统计项组件

用于仪表盘或列表头部展示关键数字：

```css
.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: var(--radius-medium);
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.1),
    -4px -4px 8px rgba(255, 255, 255, 0.8),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8),
    inset -1px -1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 44px;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.12),
    -6px -6px 12px rgba(255, 255, 255, 0.9),
    inset 1px 1px 2px rgba(255, 255, 255, 0.9),
    inset -1px -1px 2px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: var(--font-md);
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(124, 179, 66, 0.2);
}

/* 状态变体 */
.stat-item.stat-success {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-color: rgba(124, 179, 66, 0.2);
}

.stat-item.stat-success .stat-value {
  color: var(--success-color);
}

.stat-item.stat-warning {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-color: rgba(245, 158, 11, 0.2);
}

.stat-item.stat-error {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  border-color: rgba(239, 68, 68, 0.2);
}
```

---

## 11. 分页组件

```css
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.pagination button {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--spacing-sm);
  border: none;
  border-radius: var(--radius-medium);
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-neomorphic-raised);
}

.pagination button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--highlight-bg);
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.1),
    -6px -6px 12px rgba(255, 255, 255, 0.95);
}

/* 当前页 */
.pagination button.active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: #FFFFFF;
  box-shadow: var(--shadow-neomorphic-active-green);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 每页条数选择 */
.pagination-size {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-sm);
  color: var(--text-secondary);
}
```

---

## 12. 空状态组件

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state-text {
  font-size: var(--font-md);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.empty-state-desc {
  font-size: var(--font-sm);
  color: var(--text-placeholder);
}
```

---

## 13. 侧边栏导航

```css
.sidebar-nav {
  padding: var(--spacing-md) 0;
}

.sidebar-section-title {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--text-placeholder);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 10px var(--spacing-lg);
  font-size: var(--font-sm);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0 var(--radius-capsule) var(--radius-capsule) 0;
  margin-right: var(--spacing-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.sidebar-item:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.sidebar-item.active {
  color: var(--primary-dark);
  background: var(--primary-light);
  font-weight: 500;
  border-right: 3px solid var(--primary-color);
}

.sidebar-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
```

---

## 14. 动画规范

管理后台以实用为主，动画简洁不花哨：

```css
/* 交互过渡（比官网快一档） */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* 快速 */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 标准 */

/* 表格行高亮偏移（微小，不影响布局） */
.table tbody tr:hover { transform: translateX(2px); }

/* 卡片悬浮（保守） */
.card:hover { transform: translateY(-2px); }
```

---

## 15. 注意事项

1. **信息密度**：管理后台优先显示更多内容，字号偏小、间距偏紧是有意为之
2. **表格为核心**：表格头部必须使用 `--header-gradient` 绿色渐变，区分表头与表体
3. **状态标签统一**：Status Tag 与小程序 Tag 共用胶囊外形和拟物化阴影设计原则，跨端保持一致
4. **操作反馈**：按钮 hover 需有 `translateY(-1px)` 的微小上浮，active 需有下压反馈
5. **禁用状态**：所有禁用元素使用 `opacity: 0.5` + `cursor: not-allowed`，不改变颜色
6. **卡片 hover 偏移**：管理后台为 `-2px`（官网为 `-4px`），密度更高时动效更克制
7. **分页必选**：所有列表页必须配置分页组件，默认每页显示 20 条

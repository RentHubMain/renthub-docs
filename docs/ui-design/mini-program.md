---
title: 小程序 UI 设计
---

## 1. 概述

本文档规定微信小程序端的 UI 设计标准。小程序使用 `rpx`（响应式像素）作为单位，在 750px 基准宽度下 `1rpx = 0.5px`，框架会自动适配不同设备。

**核心约束**：
- 单位：全部使用 `rpx`，不使用 `px`（除非是固定值如边框 `1px`）
- 滚动：**不使用 `scroll-view`**，使用页面原生滚动（`page` 标签的默认能力）
- 安全区域：底部内容预留 `env(safe-area-inset-bottom)`

---

## 2. 基础变量系统

### 2.1 圆角系统

```css
--radius-small: 12rpx;    /* 小元素、标签 */
--radius-medium: 20rpx;   /* 卡片、输入框 */
--radius-large: 32rpx;    /* 主要卡片容器 */
--radius-round: 999rpx;   /* 圆形，按钮、头像 */
--radius-capsule: 50rpx;  /* 胶囊形按钮、搜索框 */
```

**使用规则**：

| 圆角变量 | 适用元素 |
|---|---|
| `--radius-small` | 标签（Tag）、徽章（Badge） |
| `--radius-medium` | 图片、输入框、地址选择器 |
| `--radius-large` | 卡片容器、主要区块 |
| `--radius-round` | 头像、圆形按钮 |
| `--radius-capsule` | 按钮、搜索框、加载器 |

### 2.2 阴影系统

拟物化设计的核心是三种阴影状态：

```css
/* 凸起阴影 - 卡片、按钮默认状态 */
--shadow-neomorphic-raised:
  8rpx 8rpx 16rpx rgba(0, 0, 0, 0.15),
  inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.6);

/* 凹陷阴影 - 按钮按下状态、输入框、标签 */
--shadow-neomorphic-pressed:
  inset 6rpx 6rpx 12rpx rgba(0, 0, 0, 0.15),
  inset -6rpx -6rpx 12rpx rgba(255, 255, 255, 0.6);

/* 激活阴影 - 主要按钮（绿色 CTA） */
--shadow-neomorphic-active-green:
  6rpx 6rpx 16rpx rgba(61, 124, 71, 0.4),
  -4rpx -4rpx 12rpx rgba(124, 179, 66, 0.3),
  inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);

/* 红色徽章阴影 */
--shadow-badge:
  4rpx 4rpx 10rpx rgba(239, 68, 68, 0.5),
  -2rpx -2rpx 6rpx rgba(239, 68, 68, 0.3),
  inset 1rpx 1rpx 1rpx rgba(255, 255, 255, 0.3);
```

### 2.3 间距系统（8pt 规则）

所有间距必须是 8 的倍数：

```css
--spacing-xs:  8rpx;   /* 4px  - 最小间距 */
--spacing-sm:  16rpx;  /* 8px  - 小间距 */
--spacing-md:  24rpx;  /* 12px - 中间距，容器内边距 */
--spacing-lg:  32rpx;  /* 16px - 大间距 */
--spacing-xl:  40rpx;  /* 20px */
--spacing-2xl: 48rpx;  /* 24px */

--grid-gap:     16rpx; /* 网格/元素间距 */
--grid-padding: 24rpx; /* 容器内边距 */
```

### 2.4 字体大小系统

采用 Major Third（1.25）比例，以 32rpx（16px）为基准：

```css
--font-size-xs:   26rpx;  /* 13px - 超小号，标签文字 */
--font-size-sm:   28rpx;  /* 14px - 小号 */
--font-size-base: 32rpx;  /* 16px - 正文 */
--font-size-md:   32rpx;  /* 16px - 同 base */
--font-size-lg:   40rpx;  /* 20px - H6 */
--font-size-xl:   50rpx;  /* 25px - H5，区块标题 */
--font-size-2xl:  62rpx;  /* 31px - H4 */
--font-size-3xl:  78rpx;  /* 39px - H3 */

/* 行高 */
--line-height-tight:   1.2;   /* 标题 */
--line-height-normal:  1.5;   /* 正文 */
--line-height-relaxed: 1.75;  /* 长文本 */

/* 字间距 */
--letter-spacing-tight:  -0.02em; /* 大标题 */
--letter-spacing-normal: 0;       /* 正文 */
--letter-spacing-wide:   0.05em;  /* 强调文本 */
```

### 2.5 颜色系统（60-30-10 规则）

```css
/* 60% 主导色 */
--bg-dominant:   #F5F5F5; /* 主背景 */
--text-dominant: #1A1A1A; /* 主文本 */

/* 30% 次要色 */
--bg-secondary:     #FFFFFF; /* 卡片背景 */
--bg-secondary-alt: #FAFAFA; /* 备用卡片背景 */
--text-secondary:   #666666; /* 次要文本 */

/* 10% 强调色 */
--accent-primary:      #7cb342; /* 主 CTA */
--accent-primary-dark: #3d7c47; /* 主 CTA 深色变体 */

/* 功能色 */
--success-color:    #7cb342;
--warning-color:    #F59E0B;
--error-color:      #EF4444;
--text-placeholder: #999999;
--text-disabled:    #CCCCCC;
--border-color:     #EEEEEE;
```

---

## 3. 页面布局规范

### 3.1 页面容器

```css
/* 页面根容器，填满视口 */
.container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

/* 内容容器，带内边距和底部安全区域 */
.page-container {
  padding: var(--grid-padding);
  padding-bottom: calc(var(--grid-padding) + env(safe-area-inset-bottom));
}
```

### 3.2 顶部占位符

所有使用 `page-title-capsule` 组件的页面，必须在内容最顶部添加占位符，防止内容被固定定位的标题胶囊遮挡：

```html
<!-- 不使用 scroll-view 的页面 -->
<page-title-capsule title="页面标题"></page-title-capsule>
<view class="container">
  <view class="page-spacer page-spacer-top"></view>
  <view class="content">...</view>
</view>
```

```css
.page-spacer { width: 100%; flex-shrink: 0; }
.page-spacer-top { height: var(--capsule-bottom-rpx, 148rpx); }
```

占位符后第一个内容元素必须有统一的 `margin-top: var(--grid-padding)`（24rpx）。

**命名规范**：`{页面名}-spacer {页面名}-spacer-top`，例如 `settings-spacer settings-spacer-top`。

**特殊情况**：消息页面有固定定位的分类标签栏，高度需叠加：

```css
.message-spacer-top {
  height: calc(var(--capsule-bottom-rpx, 148rpx) + 96rpx + 24rpx + 24rpx);
}
```

### 3.3 区块（Section）

```css
.section {
  margin-bottom: var(--grid-padding); /* 24rpx */
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--grid-padding);
  margin-bottom: var(--grid-gap);
}

.section-title {
  font-size: var(--font-size-xl); /* 50rpx */
  font-weight: 600;
  color: var(--text-dominant);
  line-height: var(--line-height-tight);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
```

### 3.4 TabBar 空间预留

```css
--bottom-bar-height: calc(136rpx + env(safe-area-inset-bottom));
--tabbar-height: var(--bottom-bar-height);

/* 有 TabBar 的页面，容器需预留底部空间 */
.container {
  padding-bottom: var(--tabbar-height);
}
```

---

## 4. 卡片组件

### 4.1 基础卡片

```css
.card {
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:active {
  transform: translateY(-2rpx);
  box-shadow:
    12rpx 12rpx 24rpx rgba(0, 0, 0, 0.1),
    -12rpx -12rpx 24rpx rgba(255, 255, 255, 0.95),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.8);
}

.card-body {
  padding: var(--grid-padding);
}
```

### 4.2 横向卡片（横向列表）

```css
.asset-card-horizontal {
  width: 320rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.3 纵向卡片（2 列网格）

```css
.asset-card-vertical {
  width: calc((100% - var(--grid-gap)) / 2);
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.4 海浪流动卡片

用于展示重要统计数据（总金额、总经验等），带动态海浪动画效果：

```html
<view class="wave-flow-card">
  <view class="wave"></view>
  <view class="wave"></view>
  <view class="wave"></view>
  <view class="wave-flow-content">
    <text class="wave-flow-label">总金额</text>
    <text class="wave-flow-value">¥1,280</text>
  </view>
</view>
```

```css
.wave-flow-card {
  flex: 1;
  position: relative;
  height: 88rpx;
  border-radius: var(--radius-capsule);
  box-shadow: var(--shadow-neomorphic-raised);
  overflow: hidden;
  background: rgba(61, 124, 71, 0.2);
}

.wave-flow-card .wave {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  opacity: 0.7;
  left: -64rpx;
  top: 50%;
  margin-top: -120rpx;
  background: linear-gradient(744deg,
    var(--color-green-light),
    var(--color-green-dark) 60%,
    var(--color-green-light));
  border-radius: 40%;
  animation: wave-rotate 5.4s infinite linear;
  z-index: 0;
}

.wave-flow-card .wave:nth-child(2) {
  margin-top: -100rpx;
  opacity: 0.6;
  animation-duration: 5.2s;
  animation-direction: reverse;
}

.wave-flow-card .wave:nth-child(3) {
  margin-top: -80rpx;
  opacity: 0.5;
  animation-duration: 5s;
}

@keyframes wave-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.wave-flow-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--grid-padding);
}

.wave-flow-label,
.wave-flow-value {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: #000000; /* 深色确保海浪背景上可读 */
}
```

**注意事项**：必须使用 3 个 `.wave` 元素；文字颜色固定使用 `#000000`，确保在绿色海浪上清晰可读。

---

## 5. 按钮组件

### 5.1 基础按钮

```css
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;       /* 44px，符合 8pt 规则 */
  padding: 0 32rpx;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--radius-capsule);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.2 按钮变体

```css
/* 主要按钮（10% 强调色） */
.btn-primary {
  background: linear-gradient(135deg,
    var(--accent-primary),
    var(--accent-primary-dark));
  color: #FFFFFF;
  box-shadow: var(--shadow-neomorphic-active-green);
}

.btn-primary:active {
  transform: translateY(1rpx) scale(0.98);
}

/* 次要按钮（30% 次要色） */
.btn-secondary {
  background: linear-gradient(135deg,
    var(--bg-dominant) 0%,
    #EEEEEE 100%);
  color: var(--text-dominant);
  box-shadow: var(--shadow-neomorphic-pressed);
}

/* 轮廓按钮 */
.btn-outline {
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  border: 2rpx solid var(--accent-primary);
  color: var(--accent-primary);
  box-shadow: var(--shadow-neomorphic-raised);
}

/* 危险按钮 */
.btn-danger {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: #FFFFFF;
  box-shadow:
    4rpx 4rpx 12rpx rgba(239, 68, 68, 0.4),
    -4rpx -4rpx 12rpx rgba(239, 68, 68, 0.2),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);
}
```

### 5.3 按钮尺寸

```css
.btn-small  { height: 64rpx; padding: 0 24rpx; font-size: var(--font-size-sm); }
.btn-large  { height: 96rpx; font-size: var(--font-size-lg); }
.btn-block  { width: 100%; }
.btn-disabled { opacity: 0.5; pointer-events: none; }
```

### 5.4 底部悬浮按钮（Floating Capsule Button）

底部悬浮按钮栏中的主操作按钮，圆角需与容器协调：

```css
.floating-capsule-btn {
  min-width: 200rpx;
  height: 72rpx;
  padding: 0 32rpx;
  border-radius: 64rpx; /* 容器 72rpx，留出 8rpx 视觉间距 */
}
```

**圆角层次**：外层容器 `80rpx` → 内容区域 `72rpx` → 按钮 `64rpx`，每层差 `8rpx`。

---

## 6. 标签与徽章组件

### 6.1 统一设计原则

所有标签类组件（Tag、StarBadge、Badge）必须遵循：

- 圆角：`--radius-capsule`（50rpx）
- 阴影：`--shadow-neomorphic-pressed`（凹陷）
- 高度：基础 44rpx
- 内边距：水平 18rpx
- 字体：`--font-size-xs`（26rpx）
- 过渡：`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### 6.2 基础 Tag

```css
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44rpx;
  padding: 0 18rpx;
  background: linear-gradient(135deg,
    rgba(124, 179, 66, 0.15),
    rgba(61, 124, 71, 0.1));
  border-radius: var(--radius-capsule);
  font-size: var(--font-size-xs);
  color: var(--accent-primary);
  white-space: nowrap;
  box-shadow: var(--shadow-neomorphic-pressed);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6.3 Tag 变体

```css
/* 成功状态 */
.tag-success {
  background: linear-gradient(135deg,
    var(--accent-primary),
    var(--accent-primary-dark));
  color: #FFFFFF;
  font-weight: 600;
  box-shadow:
    2rpx 2rpx 6rpx rgba(61, 124, 71, 0.3),
    -2rpx -2rpx 6rpx rgba(124, 179, 66, 0.2),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);
}

/* 警告状态 */
.tag-warning {
  background: linear-gradient(135deg,
    rgba(250, 173, 20, 0.15),
    rgba(245, 158, 11, 0.1));
  color: var(--warning-color);
  box-shadow: var(--shadow-neomorphic-pressed);
}

/* 错误状态 */
.tag-error {
  background: linear-gradient(135deg,
    rgba(239, 68, 68, 0.15),
    rgba(220, 38, 38, 0.1));
  color: var(--error-color);
  box-shadow: var(--shadow-neomorphic-pressed);
}
```

### 6.4 星级徽章（Star Badge）

用于展示用户等级，支持 small / medium / large 三种尺寸及 bronze / silver / gold / diamond 四种等级变体。统一使用 `--radius-capsule` 和 `--shadow-neomorphic-pressed`。

```css
.star-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44rpx;
  padding: 0 18rpx;
  border-radius: var(--radius-capsule);
  font-size: var(--font-size-xs);
  font-weight: 500;
  box-shadow: var(--shadow-neomorphic-pressed);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 等级变体示例 */
.star-badge-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #333;
  box-shadow:
    2rpx 2rpx 6rpx rgba(255, 215, 0, 0.3),
    -2rpx -2rpx 6rpx rgba(255, 215, 0, 0.15),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);
}
```

### 6.5 Badge 数字徽章

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 12rpx;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  border-radius: var(--radius-capsule);
  font-size: var(--font-size-xs);
  color: #FFFFFF;
  font-weight: 600;
  box-shadow:
    2rpx 2rpx 6rpx rgba(239, 68, 68, 0.3),
    -2rpx -2rpx 6rpx rgba(239, 68, 68, 0.15),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);
}
```

---

## 7. 输入框组件

### 7.1 基础输入框

```css
.input {
  height: 88rpx;
  padding: 0 var(--grid-padding);
  background: linear-gradient(135deg, var(--bg-dominant) 0%, #EEEEEE 100%);
  border-radius: var(--radius-capsule);
  font-size: var(--font-size-base);
  color: var(--text-dominant);
  box-shadow: var(--shadow-neomorphic-pressed); /* 默认凹陷 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  box-shadow: var(--shadow-neomorphic-raised); /* 聚焦时凸起 */
}
```

### 7.2 搜索框

搜索框外层使用公司多色彩虹渐变边框：

```css
.search-bar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rpx;
  background: conic-gradient(
    from 45deg at 50% 50%,
    #2c5f8d 0deg,
    #4a9b8e 90deg,
    #8b7355 180deg,
    #c4a775 270deg,
    #2c5f8d 360deg
  );
  border-radius: var(--radius-capsule);
  box-shadow: var(--shadow-neomorphic-raised);
}

.search-bar {
  flex: 1;
  height: 72rpx;
  padding: 0 var(--grid-padding);
  background: transparent;
  border-radius: calc(var(--radius-capsule) - 4rpx);
  z-index: 1;
}
```

### 7.3 文本域

```css
.textarea {
  width: 100%;
  min-height: 200rpx;
  padding: var(--grid-padding);
  background: linear-gradient(135deg, var(--bg-dominant) 0%, #EEEEEE 100%);
  border-radius: var(--radius-large); /* 多行用 large，非胶囊 */
  font-size: var(--font-size-base);
  color: var(--text-dominant);
  box-shadow: var(--shadow-neomorphic-pressed);
}
```

---

## 8. Toggle 开关组件

凹陷容器 + 凸起滑块 + LED 指示灯，激活时使用主题绿色系：

```css
/* 容器：凹陷效果 */
.switch-container {
  width: 120rpx;
  height: 60rpx;
  background: linear-gradient(135deg, var(--bg-dominant) 0%, #EEEEEE 100%);
  border-radius: 50rpx;
  box-shadow: var(--shadow-neomorphic-pressed);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 滑块：凸起效果 */
.toggle {
  width: 80rpx;
  height: 50rpx;
  background: linear-gradient(135deg,
    var(--bg-secondary) 0%,
    var(--bg-secondary-alt) 100%);
  border-radius: 50rpx;
  position: absolute;
  top: 5rpx;
  left: 5rpx;
  box-shadow: var(--shadow-neomorphic-raised);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 激活状态 */
.toggle-container.checked .switch-container {
  background: linear-gradient(135deg,
    var(--accent-primary) 0%,
    var(--accent-primary-dark) 100%);
  box-shadow: var(--shadow-neomorphic-active-green);
}

.toggle-container.checked .toggle {
  left: 35rpx;
}

/* LED 指示灯 */
.led {
  width: 10rpx;
  height: 10rpx;
  background: #999999;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-container.checked .led {
  background: #FF9800;
  box-shadow: 0 0 15rpx 4rpx rgba(255, 152, 0, 0.6);
}
```

---

## 9. Loader 加载组件

下凹胶囊容器 + 上凸绿色移动球，往返动画：

```css
/* 下凹胶囊容器 */
.loader {
  display: inline-flex;
  align-items: center;
  height: 44rpx;
  padding: 0 18rpx;
  background: linear-gradient(135deg, var(--bg-dominant) 0%, #EEEEEE 100%);
  border-radius: var(--radius-capsule);
  box-shadow: var(--shadow-neomorphic-pressed);
  overflow: hidden;
  min-width: 200rpx;
  position: relative;
}

/* 上凸绿色移动球 */
.loader-ball {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: linear-gradient(135deg,
    var(--color-green-light),
    var(--color-green-dark));
  box-shadow:
    4rpx 4rpx 8rpx rgba(61, 124, 71, 0.3),
    -2rpx -2rpx 4rpx rgba(124, 179, 66, 0.2),
    inset 1rpx 1rpx 2rpx rgba(255, 255, 255, 0.3);
  animation: ball-move 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

@keyframes ball-move {
  0%   { left: 18rpx; transform: scale(1); }
  25%  { transform: scale(1.2) translateY(-3rpx); }
  50%  { left: calc(100% - 18rpx - 32rpx); transform: scale(1.1); }
  75%  { transform: scale(1.2) translateY(-3rpx); }
  100% { left: 18rpx; transform: scale(1); }
}
```

**尺寸选择**：页面初始加载用 `size="80"`（中等），加载更多用 `size="32"`（小）。

---

## 10. 其他常用组件

### 10.1 信息胶囊（Info Capsule）

用于展示押金、费用等信息标签，下凹设计：

```css
.info-capsule {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 24rpx;
  background: linear-gradient(135deg, var(--bg-dominant) 0%, #EEEEEE 100%);
  border-radius: var(--radius-capsule);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-neomorphic-pressed);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 10.2 空状态

```css
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}

.empty-icon  { width: 200rpx; height: 200rpx; margin-bottom: 32rpx; }
.empty-text  { font-size: var(--font-size-base); color: var(--text-placeholder); text-align: center; }
```

### 10.3 "没有更多"提示

列表页底部使用随机文案（由 `app.getRandomNoMoreText()` 全局方法提供），禁止在页面中重新定义：

```css
.no-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg) 0;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-placeholder);
  text-align: center;
}
```

文案格式统一为 `- 这里没有内容啦 -` 形式，统一在 `app.js` 的 `globalData.noMoreTexts` 中维护。

---

## 11. 动画规范

```css
/* 快速过渡（简单交互） */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* 标准过渡（大多数交互） */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* 慢速过渡（复杂动画） */
transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

常用关键帧动画：

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40rpx); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

## 12. 注意事项

1. **单位统一用 `rpx`**：边框等固定值可用 `1px`
2. **安全区域**：底部内容必须预留 `env(safe-area-inset-bottom)`
3. **不随意添加颜色**：严格遵守 60-30-10 规则，新颜色需在 CSS 变量中注册
4. **交互反馈**：所有可点击元素必须有 `:active` 状态，通常使用 `scale(0.98)` + 阴影变化
5. **标签统一**：Tag、StarBadge、Badge 必须使用相同的胶囊外形和凹陷阴影，不得出现视觉不一致

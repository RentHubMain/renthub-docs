---
title: 网页（官网）UI 设计
---

## 1. 概述

本文档规定 RentHub 官方网站（`renthub.cloud`）的 UI 设计标准。官网采用 `px` 单位，面向桌面端为主，同时通过媒体查询支持移动端响应式布局。最大内容宽度为 `1200px`，居中展示。

**与管理后台的区别**：官网面向外部用户，更注重品牌展示与视觉冲击力，标题层级更大、区块间距更宽；管理后台面向内部运营，更注重信息密度与操作效率。

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

/* 激活阴影（绿色 CTA） */
--shadow-neomorphic-active-green:
  6px 6px 16px rgba(61, 124, 71, 0.4),
  -4px -4px 12px rgba(124, 179, 66, 0.3),
  inset 1px 1px 2px rgba(255, 255, 255, 0.3);
```

### 2.3 间距系统（8pt 规则）

官网在标准间距之上增加了更大的区块间距：

```css
--spacing-xs:  4px;
--spacing-sm:  8px;
--spacing-md:  16px;
--spacing-lg:  24px;
--spacing-xl:  32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;  /* 官网特有，大区块间距 */
```

### 2.4 字体大小系统

官网标题层级更大，支持英雄区大字号：

```css
--font-xs:  12px;
--font-sm:  14px;
--font-md:  16px;
--font-lg:  18px;
--font-xl:  20px;
--font-2xl: 24px;
--font-3xl: 28px;
--font-4xl: 32px;  /* 区块标题 */
--font-5xl: 40px;  /* Hero 副标题 */
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
--primary-color: var(--color-green-light);  /* #7cb342 */
--primary-dark:  var(--color-green-dark);   /* #3d7c47 */
--primary-light: #E8F5E9;

/* 文本色 */
--text-primary:     #1A1A1A;
--text-secondary:   #666666;
--text-placeholder: #999999;

/* 背景色 */
--bg-primary:   #FFFFFF;
--bg-secondary: #F5F5F5;
--border-color: #EEEEEE;
```

---

## 3. 页面布局规范

### 3.1 全局容器

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg); /* 两侧 24px */
}
```

### 3.2 区块（Section）

官网以区块（section）为基本单位组织内容，每个区块上下各有 `--spacing-3xl`（64px）内边距：

```css
.section {
  padding: var(--spacing-3xl) 0; /* 上下 64px */
}

.section-title {
  font-size: var(--font-4xl);    /* 32px */
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.section-subtitle {
  font-size: var(--font-lg);     /* 18px */
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}
```

### 3.3 Hero 区

Hero 区是官网最重要的视觉区域，遵循以下规范：

- 标题字号最大（可达 `--font-5xl` 40px 以上）
- 副标题使用 `--font-lg` 或 `--font-xl`
- 主 CTA 按钮使用 `btn-primary`，次要 CTA 使用 `btn-outline`
- 背景可使用轻量绿色渐变营造品牌感
- 支持左文右图或居中纯文案两种布局

```css
.hero {
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg,
    rgba(124, 179, 66, 0.05) 0%,
    rgba(61, 124, 71, 0.08) 50%,
    rgba(124, 179, 66, 0.05) 100%);
}

.hero-title {
  font-size: clamp(32px, 4vw, 56px); /* 响应式大标题 */
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
}

.hero-subtitle {
  font-size: var(--font-xl);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
  max-width: 560px;
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
}

.card:hover {
  transform: translateY(-4px); /* 官网悬浮偏移比管理后台更大 */
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.1),
    -12px -12px 24px rgba(255, 255, 255, 0.95),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}
```

### 4.2 特性卡片（Feature Card）

用于展示产品功能、优势等内容：

```css
.feature-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-neomorphic-raised);
  padding: var(--spacing-2xl) var(--spacing-xl);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 179, 66, 0.2);
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.1),
    -12px -12px 24px rgba(255, 255, 255, 0.95),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.feature-icon {
  width: 56px;
  height: 56px;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.feature-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.feature-desc {
  font-size: var(--font-md);
  color: var(--text-secondary);
  line-height: 1.6;
}
```

---

## 5. 按钮组件

### 5.1 基础按钮

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 32px;
  font-size: var(--font-md);
  font-weight: 500;
  border-radius: var(--radius-capsule);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  text-decoration: none;
}
```

### 5.2 按钮变体

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #7cb342, #3d7c47);
  color: #FFFFFF;
  box-shadow: var(--shadow-neomorphic-active-green);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    8px 8px 20px rgba(61, 124, 71, 0.5),
    -4px -4px 12px rgba(124, 179, 66, 0.4);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* 轮廓按钮（次要 CTA） */
.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  box-shadow: none;
}

.btn-outline:hover {
  background: var(--primary-light);
  box-shadow: var(--shadow-neomorphic-raised);
}
```

### 5.3 按钮尺寸

```css
.btn-large {
  height: 56px;
  padding: 0 40px;
  font-size: var(--font-lg); /* 18px */
}

.btn-small {
  height: 36px;
  padding: 0 20px;
  font-size: var(--font-sm); /* 14px */
}

.btn-block { width: 100%; }
```

---

## 6. 导航栏

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  height: 64px;
  display: flex;
  align-items: center;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.navbar-logo {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  list-style: none;
}

.navbar-link {
  font-size: var(--font-md);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-link:hover,
.navbar-link.active {
  color: var(--primary-color);
}
```

---

## 7. 页脚

```css
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-3xl) 0 var(--spacing-2xl);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-brand p {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: var(--spacing-sm);
  max-width: 280px;
}

.footer-col-title {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-link {
  display: block;
  font-size: var(--font-sm);
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: var(--spacing-sm);
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-sm);
  color: var(--text-placeholder);
}
```

---

## 8. 网格布局

### 8.1 特性网格

```css
/* 三列特性展示 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

/* 四列网格 */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}
```

### 8.2 两列布局

```css
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.two-col-reverse {
  direction: rtl; /* 图左文右时使用 */
}

.two-col-reverse > * {
  direction: ltr;
}
```

---

## 9. 响应式断点

```css
/* 移动端（< 768px） */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-md); /* 16px */
  }

  .section {
    padding: var(--spacing-2xl) 0; /* 48px，缩小区块间距 */
  }

  .section-title {
    font-size: var(--font-3xl); /* 28px */
  }

  .hero-title {
    font-size: 28px;
  }

  .features-grid,
  .grid-4 {
    grid-template-columns: 1fr; /* 移动端单列 */
  }

  .two-col {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .navbar-nav {
    display: none; /* 移动端隐藏导航，通常用汉堡菜单替代 */
  }
}

/* 平板（768px - 1024px） */
@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* 桌面（> 1024px） */
@media (min-width: 1025px) {
  /* 默认样式即为桌面样式 */
}
```

---

## 10. 动画规范

与其他端保持一致，使用 `cubic-bezier(0.4, 0, 0.2, 1)` 缓动函数：

```css
/* 标准交互过渡 */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* 卡片悬浮偏移：官网比管理后台幅度更大 */
.card:hover { transform: translateY(-4px); }

/* 页面进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.5s cubic-bezier(0.0, 0, 0.2, 1) both;
}
```

---

## 11. 注意事项

1. **内容宽度**：正文内容限制在 `max-width: 1200px`，超宽屏幕左右留白
2. **导航栏**：使用 `position: sticky` + `backdrop-filter: blur`，滚动时保持可见
3. **响应式优先**：所有布局必须在移动端验证，最小支持 320px 宽度
4. **卡片悬浮**：官网卡片 hover 偏移为 `-4px`（比管理后台的 `-2px` 更夸张），增强视觉动感
5. **字号层级**：Hero 区可用 `clamp()` 实现流式字号，避免大屏显示过小、小屏溢出
6. **品牌色一致**：所有页面使用相同的绿色系主题色，不得引入非设计系统颜色

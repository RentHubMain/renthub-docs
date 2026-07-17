import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * API 文档按分组拆分为多个 sidebar：
 * 导航栏 dropdown 的每一项用 `type: 'docSidebar'` 指向对应 sidebar，
 * 这样进入「规范」只显示规范下的文档，进入「核心业务」只显示核心业务下的文档，
 * 并且 dropdown 的 active 状态由侧栏匹配决定，不会所有项同时高亮。
 */
const sidebars: SidebarsConfig = {
  apiOverviewSidebar: [
    {
      type: "doc",
      id: "index",
      label: "概览",
    },
  ],
  apiSpecSidebar: [
    {
      type: "category",
      label: "规范",
      collapsed: false,
      items: ["api-spec", "common-error-codes"],
    },
  ],
  apiCoreSidebar: [
    {
      type: "category",
      label: "核心业务",
      collapsed: false,
      items: ["user", "order", "asset", "seller-home"],
    },
  ],
  apiCreditSidebar: [
    {
      type: "category",
      label: "信用与评价",
      collapsed: false,
      items: ["experience", "review", "referral", "newbie"],
    },
  ],
  apiDisputeSidebar: [
    {
      type: "category",
      label: "保障与争议",
      collapsed: false,
      items: ["breach", "insurance", "dispute"],
    },
  ],
  apiMessageSidebar: [
    {
      type: "category",
      label: "消息与帮助",
      collapsed: false,
      items: ["message", "help"],
    },
  ],
  apiSystemSidebar: [
    {
      type: "category",
      label: "系统与管理",
      collapsed: false,
      items: ["preload", "sfexpress", "scheduler", "admin"],
    },
  ],
};

export default sidebars;

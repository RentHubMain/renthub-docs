import path from "path";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const githubOrg = "RentHubMain";
const githubRepo = "renthub-docs";
const githubDefaultBranch = "main";

/**
 * 「编辑此页」链接：
 * - 本地 `npm start`（NODE_ENV !== production）：用编辑器协议打开本机 Markdown（默认 vscode，可用 DOC_EDIT_PROTOCOL=cursor）
 * - 生产构建：指向 GitHub 在线编辑
 *
 * 环境变量：DOC_EDIT_PROTOCOL — 例如 `cursor`（默认 `vscode`）
 */
function createEditUrl(repoContentSubdir: "docs" | "legal" | "api_docs") {
  return ({
    docPath,
    versionDocsDirPath,
  }: {
    docPath: string;
    versionDocsDirPath: string;
  }): string | undefined => {
    if (process.env.NODE_ENV !== "production") {
      const absolutePath = path.resolve(process.cwd(), versionDocsDirPath, docPath);
      const scheme = process.env.DOC_EDIT_PROTOCOL ?? "vscode";
      const normalized = absolutePath.replace(/\\/g, "/");
      return `${scheme}://file/${encodeURI(normalized)}`;
    }
    return `https://github.com/${githubOrg}/${githubRepo}/edit/${githubDefaultBranch}/${repoContentSubdir}/${docPath}`;
  };
}

const config: Config = {
  title: "RentHub文档站",
  tagline: "成都租汇互联网服务有限责任公司 · 轻资产物品与工业设备租赁 — 官方文档与知识库",
  favicon: "images/icon.png",

  url: "https://docs.renthub.cloud",
  baseUrl: "/",

  organizationName: "RentHubMain",
  projectName: "renthub-docs",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  // Serve existing assets/images/ as static files
  staticDirectories: ["static", "assets"],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "legal",
        path: "legal",
        routeBasePath: "legal",
        sidebarPath: "./sidebars-legal.ts",
        lastVersion: "current",
        versions: {
          current: {
            label: "0.0.2",
          },
        },
        editUrl: createEditUrl("legal"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "api_docs",
        routeBasePath: "api",
        sidebarPath: "./sidebars-api.ts",
        editUrl: createEditUrl("api_docs"),
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: createEditUrl("docs"),
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes("/page/"));
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "images/renthub-banner.png",
    navbar: {
      title: "RentHub文档站",
      logo: {
        alt: "RentHub Logo",
        src: "images/icon.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "quickStartSidebar",
          position: "left",
          label: "快速开始",
        },
        {
          type: "dropdown",
          label: "开发文档",
          position: "left",
          items: [
            {
              type: "docSidebar",
              sidebarId: "productThinkingSidebar",
              label: "产品文档",
            },
            {
              type: "docSidebar",
              sidebarId: "vibeCodingSidebar",
              label: "Vibe Coding",
            },
            {
              type: "docSidebar",
              sidebarId: "projectMgmtSidebar",
              label: "版本管理与工作流",
            },
            {
              type: "docSidebar",
              sidebarId: "uiDesignSidebar",
              label: "界面设计",
            },
            {
              type: "docSidebar",
              sidebarId: "devKnowledgeSidebar",
              label: "开发知识",
            },
          ],
        },
        {
          // API 文档：二级菜单按分组拆分侧栏，进入「规范」只显示规范两篇文档
          // 每项用 docSidebar 指向独立侧栏，active 状态由侧栏匹配判定，避免全部高亮
          type: "dropdown",
          label: "API 文档",
          position: "left",
          items: [
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiOverviewSidebar",
              label: "概览",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiSpecSidebar",
              label: "规范",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiCoreSidebar",
              label: "核心业务",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiCreditSidebar",
              label: "信用与评价",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiDisputeSidebar",
              label: "保障与争议",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiMessageSidebar",
              label: "消息与帮助",
            },
            {
              type: "docSidebar",
              docsPluginId: "api",
              sidebarId: "apiSystemSidebar",
              label: "系统与管理",
            },
          ],
        },
        {
          type: "dropdown",
          label: "法律文档",
          position: "left",
          items: [
            // 勿用 docSidebar：在版本化路径下仍会解析为「当前正在看的版本」的首页，导致无法切回现行版
            {
              to: "/legal/",
              label: "协议文档（v0.0.2）",
              activeBaseRegex: "^/legal(?!/(?:\\d+\\.\\d+\\.\\d+|next)(?:/|$))",
            },
            {
              href: "/legal/0.0.1/",
              label: "协议文档（v0.0.1）",
            },
          ],
        },
        {
          href: "https://www.renthub.cloud/",
          label: "官网",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
        {
          // @ts-ignore — 自定义 NavbarItem → src/theme/NavbarItem/MobileMenuToggleNavbarItem.tsx
          type: "custom-MobileMenuToggle",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [],
      copyright: `Copyright ©2025-${new Date().getFullYear()} 成都租汇互联网服务有限责任公司 版权所有 | 轻资产物品与工业设备租赁（C2C 优先）| RentHub文档站`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    algolia: {
      appId: "Q3UHSQWKBU",
      apiKey: "7f4e555dbe98878ba653ec0eb92b5a58",
      indexName: "RentHub Docs",
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

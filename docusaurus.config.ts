import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'RentHub文档站',
  tagline:
    '成都租汇互联网服务有限责任公司 · 轻资产物品与工业设备租赁 — 官方文档与知识库',
  favicon: 'images/icon.png',

  url: 'https://docs.renthub.cloud',
  baseUrl: '/',

  organizationName: 'RentHubMain',
  projectName: 'renthub-docs',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  // Serve existing assets/images/ as static files
  staticDirectories: ['static', 'assets'],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'legal',
        path: 'legal',
        routeBasePath: 'legal',
        sidebarPath: './sidebars-legal.ts',
        lastVersion: 'current',
        versions: {
          current: {
            label: '0.0.2',
          },
        },
        editUrl: () => undefined,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: () => undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'images/renthub-banner.png',
    navbar: {
      title: 'RentHub文档站',
      logo: {
        alt: 'RentHub Logo',
        src: 'images/icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'quickStartSidebar',
          position: 'left',
          label: '快速开始',
        },
        {
          type: 'docSidebar',
          sidebarId: 'productThinkingSidebar',
          position: 'left',
          label: '产品文档',
        },
        {
          type: 'dropdown',
          label: '开发文档',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'vibeCodingSidebar',
              label: 'Vibe Coding',
            },
            {
              type: 'docSidebar',
              sidebarId: 'projectMgmtSidebar',
              label: '项目管理',
            },
            {
              type: 'docSidebar',
              sidebarId: 'uiDesignSidebar',
              label: '界面设计',
            },
            {
              type: 'docSidebar',
              sidebarId: 'devKnowledgeSidebar',
              label: '开发知识',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '法律文档',
          position: 'left',
          items: [
            // 勿用 docSidebar：在版本化路径下仍会解析为「当前正在看的版本」的首页，导致无法切回现行版
            {
              to: '/legal/',
              label: '协议文档（v0.0.2）',
              activeBaseRegex:
                '^/legal(?!/(?:\\d+\\.\\d+\\.\\d+|next)(?:/|$))',
            },
            {
              href: '/legal/0.0.1/',
              label: '协议文档（v0.0.1）',
            },
          ],
        },
        {
          href: 'https://www.renthub.cloud/',
          label: '官网',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          // @ts-ignore — 自定义 NavbarItem → src/theme/NavbarItem/MobileMenuToggleNavbarItem.tsx
          type: 'custom-MobileMenuToggle',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
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
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    algolia: {
      appId: 'Q3UHSQWKBU',
      apiKey: '7f4e555dbe98878ba653ec0eb92b5a58',
      indexName: 'RentHub Docs',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

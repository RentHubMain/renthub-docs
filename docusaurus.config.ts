import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'RentHub 开发者指南',
  tagline: 'RentHub 团队开发者参考手册',
  favicon: 'images/icon.png',

  url: 'https://docs.renthub.cloud',
  baseUrl: '/',

  organizationName: 'RentHubMain',
  projectName: 'renthub-developer-guide',

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

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/RentHubMain/renthub-developer-guide/edit/main/',
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
      title: 'RentHub 开发者指南',
      logo: {
        alt: 'RentHub Logo',
        src: 'images/icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {
          href: 'https://www.renthub.cloud/',
          label: '官网',
          position: 'right',
        },
        {
          href: 'https://github.com/RentHubMain/renthub-developer-guide',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [],
      copyright: `Copyright ©2025-${new Date().getFullYear()} 成都租汇互联网服务有限责任公司 版权所有 | RentHub 开发者指南`,
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

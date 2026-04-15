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
          href: 'https://github.com/RentHubMain/renthub-developer-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档板块',
          items: [
            { label: 'Vibe Coding', to: '/docs/vibe-coding/' },
            { label: '项目管理', to: '/docs/project-mgmt/' },
          ],
        },
        {
          title: '更多',
          items: [
            { label: 'RentHub 官网', href: 'https://www.renthub.cloud/' },
            {
              label: 'GitHub',
              href: 'https://github.com/RentHubMain/renthub-developer-guide',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RentHub Team.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

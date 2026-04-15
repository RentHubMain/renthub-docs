import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Vibe Coding',
      link: { type: 'doc', id: 'vibe-coding/index' },
      items: [
        'vibe-coding/cursor-guide',
        'vibe-coding/cursor-concepts',
      ],
    },
    {
      type: 'category',
      label: '项目管理',
      link: { type: 'doc', id: 'project-mgmt/index' },
      items: [
        'project-mgmt/git-basics',
        'project-mgmt/git-workflow',
        'project-mgmt/github-actions',
        'project-mgmt/renthub-dev-workflow',
      ],
    },
    {
      type: 'category',
      label: '界面设计',
      link: { type: 'doc', id: 'ui-design/index' },
      items: [
        'ui-design/mini-program',
        'ui-design/website',
        'ui-design/admin-panel',
      ],
    },
    {
      type: 'category',
      label: '开发知识',
      link: { type: 'doc', id: 'dev-knowledge/index' },
      items: [
        'dev-knowledge/wechat-mini-program',
        'dev-knowledge/cloudbase',
        'dev-knowledge/js-es6',
      ],
    },
  ],
};

export default sidebars;

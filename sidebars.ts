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
      ],
    },
  ],
};

export default sidebars;

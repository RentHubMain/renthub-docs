import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  quickStartSidebar: [
    {
      type: 'category',
      label: '快速开始',
      link: { type: 'doc', id: 'quick-start/index' },
      items: [
        'quick-start/onboarding',
      ],
    },
  ],
  vibeCodingSidebar: [
    {
      type: 'category',
      label: 'Vibe Coding',
      link: { type: 'doc', id: 'vibe-coding/index' },
      items: [
        'vibe-coding/cursor-guide',
        'vibe-coding/cursor-concepts',
        'vibe-coding/beyond-cursor-toolbox',
        'vibe-coding/agent-harness',
      ],
    },
  ],
  projectMgmtSidebar: [
    {
      type: 'category',
      label: '版本管理与工作流',
      link: { type: 'doc', id: 'project-mgmt/index' },
      items: [
        'project-mgmt/git-basics',
        'project-mgmt/git-workflow',
        'project-mgmt/github-actions',
        'project-mgmt/renthub-dev-workflow',
      ],
    },
  ],
  uiDesignSidebar: [
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
  ],
  devKnowledgeSidebar: [
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
  productThinkingSidebar: [
    {
      type: 'category',
      label: '产品文档',
      link: { type: 'doc', id: 'product-thinking/index' },
      items: [
        'product-thinking/product-owner-mindset',
        'product-thinking/user-first',
        'product-thinking/product-frameworks',
        'product-thinking/product-design-practice',
        'product-thinking/renthub-practice',
      ],
    },
  ],
};

export default sidebars;

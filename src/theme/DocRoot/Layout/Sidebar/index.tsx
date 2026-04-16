import React, {useEffect, type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import type {Props} from '@theme/DocRoot/Layout/Sidebar';
import {useMobileMenu} from '@site/src/contexts/MobileMenuContext';

import styles from './styles.module.css';

const SIDEBAR_LABELS: Record<string, string> = {
  quickStartSidebar: '快速开始',
  productThinkingSidebar: '产品文档',
  vibeCodingSidebar: 'Vibe Coding',
  projectMgmtSidebar: '项目管理',
  uiDesignSidebar: '界面设计',
  devKnowledgeSidebar: '开发知识',
};

function ResetOnSidebarChange({children}: {children: ReactNode}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}

function SidebarSectionTitle(): ReactNode {
  const sidebar = useDocsSidebar();
  const label = SIDEBAR_LABELS[sidebar?.name ?? ''] ?? '';
  return <h2 className={styles.sidebarSectionTitle}>{label}</h2>;
}

/** 将当前 sidebar 数据同步到全局 MobileMenuContext，供移动端抽屉菜单使用 */
function SidebarDataSync(): null {
  const sidebar = useDocsSidebar();
  const {setSidebar} = useMobileMenu();

  useEffect(() => {
    if (sidebar) {
      setSidebar({name: sidebar.name, items: sidebar.items as any});
    }
    return () => setSidebar(null);
  }, [sidebar?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function DocRootLayoutSidebar({
  sidebar,
}: Props): ReactNode {
  const {pathname} = useLocation();

  return (
    <>
      <SidebarDataSync />
      <aside
        className={clsx(
          ThemeClassNames.docs.docSidebarContainer,
          styles.docSidebarContainer,
        )}>
        <ResetOnSidebarChange>
          <div className={styles.sidebarViewport}>
            <div className={styles.sidebarInner}>
              <SidebarSectionTitle />
              <DocSidebar
                sidebar={sidebar}
                path={pathname}
                onCollapse={() => {}}
                isHidden={false}
              />
            </div>
          </div>
        </ResetOnSidebarChange>
      </aside>
    </>
  );
}

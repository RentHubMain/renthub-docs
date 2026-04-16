import React, { useEffect, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import {
  Zap,
  Lightbulb,
  Terminal,
  GitBranch,
  Layout,
  BookOpen,
  Globe,
  GitFork,
  Folder,
  FileText,
  X,
} from 'lucide-react';
import { useMobileMenu, type SidebarItem } from '@site/src/contexts/MobileMenuContext';
import styles from './styles.module.css';

// ── 导航数据 ─────────────────────────────────────────
const NAV_SECTIONS = [
  { label: '快速开始',  to: '/docs/quick-start/',    Icon: Zap },
  { label: '产品文档',  to: '/docs/product-thinking/', Icon: Lightbulb },
  { label: 'Vibe Coding', to: '/docs/vibe-coding/', Icon: Terminal },
  { label: '项目管理',  to: '/docs/project-mgmt/',   Icon: GitBranch },
  { label: '界面设计',  to: '/docs/ui-design/',       Icon: Layout },
  { label: '开发知识',  to: '/docs/dev-knowledge/',   Icon: BookOpen },
];

const EXTERNAL_LINKS = [
  { label: '官网',   href: 'https://www.renthub.cloud/',                                Icon: Globe },
  { label: 'GitHub', href: 'https://github.com/RentHubMain/renthub-docs',   Icon: GitFork },
];

const SIDEBAR_LABELS: Record<string, string> = {
  quickStartSidebar:   '快速开始',
  productThinkingSidebar: '产品文档',
  vibeCodingSidebar:   'Vibe Coding',
  projectMgmtSidebar:  '项目管理',
  uiDesignSidebar:     '界面设计',
  devKnowledgeSidebar: '开发知识',
};

// ── 侧边栏目录递归渲染 ────────────────────────────────
function SidebarItems({
  items,
  close,
  currentPath,
}: {
  items: SidebarItem[];
  close: () => void;
  currentPath: string;
}): ReactNode {
  return (
    <>
      {items.map((item, i) => {
        if (item.type === 'category') {
          return (
            <div key={i} className={styles.categoryBlock}>
              {item.href ? (
                <Link
                  to={item.href}
                  onClick={close}
                  className={clsx(styles.categoryLink, currentPath === item.href && styles.active)}
                >
                  <Folder size={14} className={styles.itemIcon} />
                  {item.label}
                </Link>
              ) : (
                <span className={styles.categoryLabel}>
                  <Folder size={14} className={styles.itemIcon} />
                  {item.label}
                </span>
              )}
              {item.items && item.items.length > 0 && (
                <div className={styles.categoryChildren}>
                  <SidebarItems items={item.items} close={close} currentPath={currentPath} />
                </div>
              )}
            </div>
          );
        }
        if (item.type === 'doc' || item.type === 'link') {
          return (
            <Link
              key={i}
              to={item.href ?? '#'}
              onClick={close}
              className={clsx(styles.docLink, currentPath === item.href && styles.active)}
            >
              <FileText size={13} className={styles.itemIcon} />
              {item.label}
            </Link>
          );
        }
        return null;
      })}
    </>
  );
}

// ── 主组件 ───────────────────────────────────────────
export default function MobileDrawer(): ReactNode {
  const { isOpen, close, sidebar } = useMobileMenu();
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sidebarLabel = sidebar ? (SIDEBAR_LABELS[sidebar.name] ?? '') : '';

  return (
    <>
      <div className={styles.backdrop} onClick={close} />
      <div className={styles.drawer}>

        {/* 顶部关闭按钮行 */}
        <div className={styles.drawerHeader}>
          <button className={styles.closeButton} onClick={close} aria-label="关闭菜单">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 导航分区 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>导航</div>
          {NAV_SECTIONS.map(({ label, to, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className={clsx(styles.navItem, location.pathname.startsWith(to) && styles.active)}
            >
              <Icon size={15} className={styles.navIcon} />
              {label}
            </Link>
          ))}
        </div>

        {/* 相关链接分区 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>相关链接</div>
          {EXTERNAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={href}
              href={href}
              className={styles.navItem}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <Icon size={15} className={styles.navIcon} />
              {label}
              <span className={styles.externalIcon}>↗</span>
            </a>
          ))}
        </div>

        {/* 当前板块目录 */}
        {sidebar && sidebar.items.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>{sidebarLabel} 目录</div>
            <SidebarItems items={sidebar.items} close={close} currentPath={location.pathname} />
          </div>
        )}

      </div>
    </>
  );
}

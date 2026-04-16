import type { FC } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.css';

const steps = [
  {
    num: '01',
    title: '新成员快速上手指南',
    desc: '环境、克隆业务仓、跑通测试到第一次 PR 的推荐顺序与检查清单',
    to: '/docs/quick-start/onboarding',
  },
  {
    num: '02',
    title: 'Cursor 使用指南',
    desc: '如何用 AI 辅助开发：模型怎么选、额度怎么省',
    to: '/docs/vibe-coding/cursor-guide',
  },
  {
    num: '03',
    title: 'Cursor 核心概念',
    desc: 'Rules、Skills、MCP 等机制，让 AI 按团队规范工作',
    to: '/docs/vibe-coding/cursor-concepts',
  },
  {
    num: '04',
    title: 'Git 基础入门',
    desc: '理解版本控制、工作区与分支，是参与任何项目的前提',
    to: '/docs/project-mgmt/git-basics',
  },
  {
    num: '05',
    title: 'Git 协作工作流',
    desc: '分支策略、Conventional Commits、PR / Review、GitHub Projects 关联',
    to: '/docs/project-mgmt/git-workflow',
  },
  {
    num: '06',
    title: 'GitHub Actions 工作流',
    desc: '读懂 CI/CD 概念与文档站部署示例，再看业务仓流水线更容易',
    to: '/docs/project-mgmt/github-actions',
  },
  {
    num: '07',
    title: 'RentHub 业务仓库开发工作流',
    desc: 'Monorepo 目录、Jest / 覆盖率、Sonar、`Build` 流水线与发布链路',
    to: '/docs/project-mgmt/renthub-dev-workflow',
  },
  {
    num: '08',
    title: '微信小程序开发体系',
    desc: '开发者工具、导入项目、上传体验版 / 提审与类目注意点',
    to: '/docs/dev-knowledge/wechat-mini-program',
  },
  {
    num: '09',
    title: '腾讯云 CloudBase 入门',
    desc: '数据库、云函数分层与调用方式，对应小程序 `wx.cloud`',
    to: '/docs/dev-knowledge/cloudbase',
  },
];

const categories = [
  {
    tag: '法律文档',
    title: '法律与协议',
    desc: '平台公示的商家租赁协议等文本，便于商户、租户与团队统一查阅版本与生效信息。',
    to: '/legal/',
  },
  {
    tag: '产品思维',
    title: '产品与用户价值',
    desc: '像产品主人一样思考：用户第一、方法论与租汇场景下的实践总结。',
    to: '/docs/product-thinking/',
  },
  {
    tag: 'Vibe Coding',
    title: 'AI 辅助开发',
    desc: 'Cursor 模型选择、token 控制、Rules / Skills / MCP 的使用方式。不管你在哪个团队，这套方法都能直接用。',
    to: '/docs/vibe-coding/',
  },
  {
    tag: '版本管理与工作流',
    title: '工程协作规范',
    desc: 'Git 基础、Conventional Commits、AI 时代的协作纪律。个人项目同样适用。',
    to: '/docs/project-mgmt/',
  },
  {
    tag: '界面设计',
    title: 'UI 设计准则',
    desc: '拟物化设计系统、60-30-10 色彩规则、组件规范。覆盖小程序、官网与管理后台三端。',
    to: '/docs/ui-design/',
  },
  {
    tag: '开发知识',
    title: '云开发技术栈',
    desc: '微信小程序体系、CloudBase、JavaScript ES6+ 等，与业务仓库技术栈对齐。',
    to: '/docs/dev-knowledge/',
  },
];

const HomepageHero: FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <span className={styles.heroBadge}>文档站</span>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroLead}>
            租汇（RentHub）是轻资产服务平台，为商户（出租方，lessor）与租户（承租方，lessee）提供信息发布、撮合、支付结算、物流协调与争议调解等能力；聚焦物品与工业设备的
            B2B/C2C 租赁（当前以 C2C 为主），依托微信小程序与 Monorepo（小程序、云函数、管理后台、官网）。
          </p>
          <p className={styles.heroMeta}>
            官网：<a
              href="https://www.renthub.cloud/"
              target="_blank"
              rel="noreferrer"
              className={styles.heroLink}
            >
              renthub.cloud
            </a>
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.btnSecondary} to="/docs/quick-start">
              快速开始
            </Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <img
            src="/images/renthub-banner.png"
            alt="RentHub Banner"
            className={styles.heroBanner}
          />
        </div>
      </div>
    </div>
  );
};

const QuickStart: FC = () => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>新手路线</span>
        <h2 className={styles.sectionTitle}>从这里开始</h2>
        <p className={styles.sectionSub}>
          建议按序阅读：先跟快速上手指南走通环境与第一次 PR；再用 Cursor 建立 AI 协作习惯，接着读 Git 基础与团队工作流；随后是 CI、RentHub 业务仓流程，以及微信与 CloudBase。完整目录见侧栏与各板块首页。
        </p>
      </div>
      <ol className={styles.timeline}>
        {steps.map((s) => (
          <li key={s.num} className={styles.timelineItem}>
            <Link to={s.to} className={styles.timelineLink}>
              <span className={styles.timelineNum}>{s.num}</span>
              <div className={styles.timelineBody}>
                <h3 className={styles.timelineTitle}>{s.title}</h3>
                <p className={styles.timelineDesc}>{s.desc}</p>
              </div>
              <svg className={styles.timelineArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ol>
      <p className={styles.quickStartFoot}>
        做界面与视觉规范时另读{' '}
        <Link to="/docs/ui-design/">界面设计</Link>
        {' '}；需要巩固现代 JS 时可读{' '}
        <Link to="/docs/dev-knowledge/js-es6">JavaScript ES6+</Link>
        {' '}；版本管理与工作流其余文档见{' '}
        <Link to="/docs/project-mgmt/">板块索引</Link>
        {' '}；开发知识见{' '}
        <Link to="/docs/dev-knowledge/">开发知识</Link>
        。
      </p>
    </div>
  </section>
);

const BeyondRentHub: FC = () => (
  <section className={clsx(styles.section, styles.sectionAlt)}>
    <div className={styles.sectionInner}>
      <div className={styles.beyondLayout}>
        <div className={styles.beyondText}>
          <span className={styles.sectionLabel}>通用价值</span>
          <h2 className={styles.sectionTitle}>不只适用于 RentHub</h2>
          <p className={styles.beyondDesc}>
            本站以 RentHub 业务为背景编写，其中大量内容对<strong>不同角色的读者</strong>都有参考价值。
            若你在其他团队或独立工作，可以直接借鉴这些经验，按自己的项目情况调整使用。
          </p>
        </div>
        <div className={styles.beyondCards}>
          {categories.map((c) => (
            <Link key={c.tag} to={c.to} className={styles.beyondCard}>
              <span className={styles.beyondTag}>{c.tag}</span>
              <h3 className={styles.beyondCardTitle}>{c.title}</h3>
              <p className={styles.beyondCardDesc}>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Home: FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHero />
      <main>
        <QuickStart />
        <BeyondRentHub />
      </main>
    </Layout>
  );
};

export default Home;

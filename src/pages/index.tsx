import type { FC } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.css';

const steps = [
  {
    num: 1,
    title: 'Git 基础入门',
    desc: '理解版本控制、分支、提交与 PR，是参与任何项目的前提',
    to: '/docs/project-mgmt/git-basics',
  },
  {
    num: 2,
    title: 'Cursor 使用指南',
    desc: '了解如何用 AI 辅助开发，模型怎么选、额度怎么省',
    to: '/docs/vibe-coding/cursor-guide',
  },
  {
    num: 3,
    title: 'Cursor 核心概念',
    desc: '深入理解 Rules、Skills、MCP 等机制，让 AI 真正为你所用',
    to: '/docs/vibe-coding/cursor-concepts',
  },
  {
    num: 4,
    title: 'Git 协作工作流',
    desc: '掌握团队协作规范，包括分支策略、Commit 写法与 PR 流程',
    to: '/docs/project-mgmt/git-workflow',
  },
];

const categories = [
  {
    title: 'Vibe Coding',
    desc: 'Cursor 模型选择策略、token 控制、Rules / Skills / MCP 的使用方式，适用于所有使用 Cursor 进行 AI 辅助开发的场景。',
    to: '/docs/vibe-coding/',
  },
  {
    title: '项目管理',
    desc: 'Git 基础、Conventional Commits 规范、AI 时代的协作纪律，适用于任何团队或个人项目。',
    to: '/docs/project-mgmt/',
  },
];

const HomepageHero: FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img
          src="/images/renthub-banner.png"
          alt="RentHub Banner"
        />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p>
          RentHub 是基于微信小程序的租赁市场平台，连接出租方与承租方，支持租赁信息发布、浏览、预订与订单管理等；
          并配有 Web 管理后台，供审核与运营使用。主工程采用 Monorepo，涵盖小程序、云函数、管理端与官网等。
        </p>
        <p>
          官网：<a href="https://www.renthub.cloud/" style={{ color: 'inherit' }}>renthub.cloud</a>
          {' · '}
          <a href="https://github.com/RentHubMain/renthub-developer-guide" style={{ color: 'inherit' }}>GitHub</a>
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--secondary button--lg" to="/docs/vibe-coding/">
            Vibe Coding 板块
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/project-mgmt/">
            项目管理板块
          </Link>
        </div>
      </div>
    </div>
  );
};

const QuickStart: FC = () => (
  <section className={styles.section}>
    <div className="container">
      <h2 className={styles.sectionTitle}>零基础新手？从这里开始</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ifm-color-emphasis-700)' }}>
        如果你刚接触开发，建议按以下顺序阅读：
      </p>
      <div className={styles.stepsGrid}>
        {steps.map((s) => (
          <Link key={s.num} to={s.to} className={styles.stepCard} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.stepNumber}>{s.num}</div>
            <div className={styles.stepContent}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--ifm-color-emphasis-600)' }}>
        熟悉以上内容后，再按需阅读其他板块。
      </p>
    </div>
  </section>
);

const BeyondRentHub: FC = () => (
  <section className={clsx(styles.section, styles.sectionAlt)}>
    <div className="container">
      <h2 className={styles.sectionTitle}>不只适用于 RentHub</h2>
      <div className={styles.notice}>
        <p>
          本文档站虽以 RentHub 项目为背景，但其中大量内容对<strong>任何开发者</strong>都有参考价值。
          如果你是独立开发者或在其他团队，可以直接借鉴这些经验，按自己的项目情况调整使用。
        </p>
      </div>
      <br />
      <div className={styles.cardsGrid}>
        {categories.map((c) => (
          <Link key={c.title} to={c.to} className={styles.card}>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </Link>
        ))}
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

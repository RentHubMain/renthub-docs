/**
 * 一次性脚本：把 renthub-mini-program/docs/api_docs 下的 18 份中文文件名 API 文档
 * 迁移到 renthub-docs/api_docs/（作为独立 docs 插件的内容目录），并：
 *   - 文件名改为英文（kebab-case）
 *   - 去掉原文件首行 `# 模块名称：…`，改写为 YAML front matter（title + sidebar_label）
 *   - 更新互相引用的链接（00-API文档规范.md → api-spec.md, 00-通用报错码.md → common-error-codes.md 等）
 *   - 去掉 `../README.md#22-通用约定` 这类对小程序仓 README 的链接（改为纯文本）
 *
 * 运行：node scripts/migrate-api-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "D:/Projects/RentHub/renthub-mini-program/docs/api_docs";
const DST = "D:/Projects/RentHub/renthub-docs/api_docs";

/** 原文件 → { 新文件名, title, sidebarLabel } */
const mapping = {
  "00-API文档规范.md": { file: "api-spec.md", title: "API 文档规范", label: "API 文档规范" },
  "00-通用报错码.md": {
    file: "common-error-codes.md",
    title: "通用报错码",
    label: "通用报错码",
  },
  "01-用户.md": { file: "user.md", title: "用户 (user)", label: "用户" },
  "02-订单.md": { file: "order.md", title: "订单 (order)", label: "订单" },
  "03-资产.md": { file: "asset.md", title: "资产 (asset)", label: "资产" },
  "04-经验与信用.md": {
    file: "experience.md",
    title: "经验与信用 (experience)",
    label: "经验与信用",
  },
  "05-消息.md": { file: "message.md", title: "消息 (message)", label: "消息" },
  "06-新手任务.md": { file: "newbie.md", title: "新手任务 (newbie)", label: "新手任务" },
  "07-违约.md": { file: "breach.md", title: "违约 (breach)", label: "违约" },
  "08-保险.md": { file: "insurance.md", title: "保险 (insurance)", label: "保险" },
  "09-评论.md": { file: "review.md", title: "评论 (review)", label: "评论" },
  "10-推荐.md": { file: "referral.md", title: "推荐 (referral)", label: "推荐" },
  "11-帮助.md": { file: "help.md", title: "帮助 (help)", label: "帮助" },
  "12-预拉取.md": { file: "preload.md", title: "预拉取 (preload)", label: "预拉取" },
  "13-顺丰物流.md": {
    file: "sfexpress.md",
    title: "顺丰物流 (sfexpress)",
    label: "顺丰物流",
  },
  "14-定时任务.md": {
    file: "scheduler.md",
    title: "定时任务 (scheduler)",
    label: "定时任务",
  },
  "15-管理员.md": { file: "admin.md", title: "管理员 (admin)", label: "管理员" },
  "16-商家主页.md": {
    file: "seller-home.md",
    title: "商家主页 (seller-home)",
    label: "商家主页",
  },
  "17-争议.md": { file: "dispute.md", title: "争议 (dispute)", label: "争议" },
};

/** 原文件名 → 新文件名 的链接映射 */
const linkMap = Object.fromEntries(Object.entries(mapping).map(([src, m]) => [src, m.file]));

function rewriteLinks(body) {
  let out = body;

  // [xxx](00-通用报错码.md) → [xxx](common-error-codes.md) 等
  for (const [src, dst] of Object.entries(linkMap)) {
    const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\]\\(${escaped}(#[^)]*)?\\)`, "g");
    out = out.replace(re, (_, hash) => `](${dst}${hash ?? ""})`);
  }

  // 链到小程序仓 README 的链接在文档站不存在，转成纯文本
  out = out.replace(/\[([^\]]+)\]\(\.{0,2}\/?README\.md(#[^)]*)?\)/g, "$1");

  return out;
}

function transform(raw, meta) {
  let text = raw.replace(/\r\n/g, "\n");

  // 去掉首个 `# 模块名称：...` / `# 通用报错码...` 这类 H1
  text = text.replace(/^#\s+[^\n]*\n+/, "");

  text = rewriteLinks(text);

  const fm = `---\n` + `title: ${meta.title}\n` + `sidebar_label: ${meta.label}\n` + `---\n\n`;

  return fm + text;
}

function run() {
  if (!fs.existsSync(DST)) fs.mkdirSync(DST, { recursive: true });

  for (const [src, meta] of Object.entries(mapping)) {
    const srcPath = path.join(SRC, src);
    const dstPath = path.join(DST, meta.file);
    if (!fs.existsSync(srcPath)) {
      console.warn("missing source:", srcPath);
      continue;
    }
    const raw = fs.readFileSync(srcPath, "utf8");
    const out = transform(raw, meta);
    fs.writeFileSync(dstPath, out, "utf8");
    console.log("wrote:", path.relative(process.cwd(), dstPath));
  }
}

run();

/**
 * One-off: copy api/ → api_docs/ with English filenames + URL rewrites.
 * Run from repo root: node scripts/migrate-api-docs-to-english.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(repoRoot, "api");
const destDir = path.join(repoRoot, "api_docs");

const fileMap = new Map([
  ["index.md", "index.md"],
  ["00-API文档规范.md", "api-spec.md"],
  ["00-通用报错码.md", "common-error-codes.md"],
  ["01-用户.md", "user.md"],
  ["02-订单.md", "order.md"],
  ["03-资产.md", "asset.md"],
  ["04-经验与信用.md", "experience.md"],
  ["05-消息.md", "message.md"],
  ["06-新手任务.md", "newbie.md"],
  ["07-违约.md", "breach.md"],
  ["08-保险.md", "insurance.md"],
  ["09-评论.md", "review.md"],
  ["10-推荐.md", "referral.md"],
  ["11-帮助.md", "help.md"],
  ["12-预拉取.md", "preload.md"],
  ["13-顺丰物流.md", "sfexpress.md"],
  ["14-定时任务.md", "scheduler.md"],
  ["15-管理员.md", "admin.md"],
  ["16-商家主页.md", "seller-home.md"],
  ["17-争议.md", "dispute.md"],
]);

/** Longest-first URL path replacements in markdown */
const urlReplacements = [
  ["/api/API 文档规范", "/api/api-spec"],
  ["/api/API文档规范", "/api/api-spec"],
  ["/api/经验与信用", "/api/experience"],
  ["/api/通用报错码", "/api/common-error-codes"],
  ["/api/新手任务", "/api/newbie"],
  ["/api/顺丰物流", "/api/sfexpress"],
  ["/api/定时任务", "/api/scheduler"],
  ["/api/预拉取", "/api/preload"],
  ["/api/商家主页", "/api/seller-home"],
  ["/api/管理员", "/api/admin"],
  ["/api/争议", "/api/dispute"],
  ["/api/保险", "/api/insurance"],
  ["/api/评论", "/api/review"],
  ["/api/推荐", "/api/referral"],
  ["/api/帮助", "/api/help"],
  ["/api/消息", "/api/message"],
  ["/api/违约", "/api/breach"],
  ["/api/订单", "/api/order"],
  ["/api/资产", "/api/asset"],
  ["/api/用户", "/api/user"],
];

function transformBody(text) {
  let out = text;
  for (const [from, to] of urlReplacements) {
    out = out.split(from).join(to);
  }
  return out;
}

if (!fs.existsSync(srcDir)) {
  console.error("Missing source folder:", srcDir);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });

for (const [oldName, newName] of fileMap) {
  const from = path.join(srcDir, oldName);
  if (!fs.existsSync(from)) {
    console.error("Missing:", oldName);
    process.exit(1);
  }
  let raw = fs.readFileSync(from, "utf8");
  raw = transformBody(raw);
  fs.writeFileSync(path.join(destDir, newName), raw, "utf8");
  console.log(oldName, "→", newName);
}

console.log("Done. Review api_docs/ then remove api/ if satisfied.");

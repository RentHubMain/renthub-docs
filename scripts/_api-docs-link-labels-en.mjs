import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "api_docs");

const pairs = [
  ["[通用报错码]", "[common-error-codes]"],
  ["[00-通用报错码]", "[common-error-codes]"],
  ["[README 2.2 通用约定]", "[Overview §2.2 conventions]"],
  ["[API 文档规范]", "[api-spec]"],
  ["[消息]", "[message]"],
  ["[推荐模块]", "[referral]"],
];

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".md")) continue;
  const p = path.join(dir, f);
  let t = fs.readFileSync(p, "utf8");
  let n = t;
  for (const [a, b] of pairs) {
    n = n.split(a).join(b);
  }
  if (n !== t) {
    fs.writeFileSync(p, n, "utf8");
    console.log("updated", f);
  }
}

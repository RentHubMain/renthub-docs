import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "api_docs");
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".md")) continue;
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  const zh = t.match(/\/api\/[\u4e00-\u9fff][^)\]\s"'<>]*/g);
  if (zh?.length) console.log(f, [...new Set(zh)].join(" | "));
}

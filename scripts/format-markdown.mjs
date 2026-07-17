/**
 * RentHub 文档站 — 统一 Markdown 格式化
 *
 * - 保留 YAML front matter 原样（不改引号与缩进）
 * - 代码块 / 缩进代码块内：仅做行尾空白修剪
 * - 正文：二级/三级标题自动编号（index.md 除外）、二级标题间分割线 ---、
 *   ASCII " 转为中文弯引号 “”、保守的中英词间空格、行尾空白、连续空行压缩
 * - 带圈数字 ①–⑳（U+2460–U+2473）：在 `### h2.h3` 小节内，将 `**① …**` 类标记
 *   按出现顺序改为 `**h2.h3.1**`、`**h2.h3.2**` …（需已出现带数字的三级标题作为上下文）
 *
 * 用法: node scripts/format-markdown.mjs [--check]
 * --check: 若有文件需要格式化则退出码 1，不写回
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const roots = ["docs", "legal", "legal_versioned_docs", "api_docs"];

const LDQM = "\u201c"; // "
const RDQM = "\u201d"; // "

/** ①–⑳ */
const RE_CIRCLED_DIGIT = /[\u2460-\u2473]/;

const RE_FRONT_MATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

function splitFrontMatter(text) {
  const m = text.match(RE_FRONT_MATTER);
  if (m) {
    return { front: m[0], body: text.slice(m[0].length) };
  }
  return { front: "", body: text };
}

function isFenceStart(line) {
  const t = line.trim();
  return t.startsWith("```") || t.startsWith("~~~");
}

/** Mask `inline code` segments; returns { line, tokens: string[] } */
function maskInlineCode(line) {
  const tokens = [];
  const masked = line.replace(/`[^`]*`/g, (m) => {
    tokens.push(m);
    return `\x00C${tokens.length - 1}\x00`;
  });
  return { line: masked, tokens };
}

function unmaskInlineCode(line, tokens) {
  // oxlint-disable-next-line eslint/no-control-regex -- intentional sentinel for inline-code masking
  return line.replace(/\x00C(\d+)\x00/g, (_, i) => tokens[Number(i)] ?? "");
}

/** ASCII " → “” 交替；不处理已存在的弯引号配对 */
function convertAsciiDoubleQuotesMasked(maskedLine) {
  let depth = 0;
  let out = "";
  for (let i = 0; i < maskedLine.length; i++) {
    const c = maskedLine[i];
    if (c === '"') {
      out += depth % 2 === 0 ? LDQM : RDQM;
      depth++;
    } else {
      out += c;
    }
  }
  return out;
}

/**
 * 在「中文」与「英文单词（≥2 字母）」邻接处补空格（表格行跳过，避免破坏对齐习惯）
 */
function insertCjkLatinSpacing(line) {
  if (/^\s*\|/.test(line)) {
    return line;
  }
  let s = line;
  s = s.replace(/([\u4e00-\u9fff])([A-Za-z]{2,})/g, "$1 $2");
  s = s.replace(/([A-Za-z]{2,})([\u4e00-\u9fff])/g, "$1 $2");
  return s;
}

function stripTrailingWhitespace(line) {
  return line.replace(/[ \t]+$/u, "");
}

/**
 * 根据当前 ### h2.h3 小节，把 **① ** 等带圈序号改为 **h2.h3.n**（n 递增）。
 * 仅处理已有三级标题编号上下文（lastH3 > 0）的行。
 */
function replaceCircledEnumeration(line, ctx) {
  if (ctx.h3 <= 0 || !RE_CIRCLED_DIGIT.test(line)) {
    return line;
  }
  return line.replace(/\*\*([\u2460-\u2473])\s*/g, () => {
    ctx.circledSeq += 1;
    return `**${ctx.h2}.${ctx.h3}.${ctx.circledSeq} `;
  });
}

/** 从已格式化的标题行更新带圈序号所处的 h2/h3 上下文 */
function updateCircledContextFromHeading(line, ctx) {
  const h2m = line.match(/^##\s+(\d+)\.\s+/);
  if (h2m) {
    ctx.h2 = Number(h2m[1]);
    ctx.h3 = 0;
    ctx.circledSeq = 0;
    return;
  }
  const h3m = line.match(/^###\s+(\d+)\.(\d+)\s+/);
  if (h3m) {
    ctx.h2 = Number(h3m[1]);
    ctx.h3 = Number(h3m[2]);
    ctx.circledSeq = 0;
  }
}

/** ## / ### 标题编号（index.md 跳过） */
function formatHeadingLine(line, state, skipNumbering) {
  const h2 = line.match(/^(##)\s+(.*)$/);
  if (h2) {
    if (!skipNumbering) {
      state.h2 += 1;
      state.h3 = 0;
      const title = h2[2].replace(/^\d+\.\s*/, "").trim();
      return `## ${state.h2}. ${title}`;
    }
    return `## ${h2[2].trim()}`;
  }

  const h3 = line.match(/^(###)\s+(.*)$/);
  if (h3) {
    if (!skipNumbering) {
      if (state.h2 === 0) {
        state.h2 = 1;
      }
      state.h3 += 1;
      const title = h3[2].replace(/^\d+\.\d+\s+/, "").trim();
      return `### ${state.h2}.${state.h3} ${title}`;
    }
    return `### ${h3[2].trim()}`;
  }

  const h4 = line.match(/^(####)\s+(.*)$/);
  if (h4 && !skipNumbering) {
    const title = h4[2].replace(/^(\d+\.)+\d+\s+/, "").trim();
    return `#### ${title}`;
  }

  return line;
}

function hasDividerAbove(lines, startIdx) {
  let j = startIdx - 1;
  while (j >= 0 && lines[j] === "") {
    j--;
  }
  return j >= 0 && lines[j] === "---";
}

/** 在第二个及以后的 ## 前插入 ---（与正文 front matter 的 --- 无关） */
function ensureH2Dividers(lines) {
  const out = [];
  let seenH2 = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##(\s|$)/.test(line)) {
      if (seenH2 && !hasDividerAbove(out, out.length)) {
        while (out.length > 0 && out[out.length - 1] === "") {
          out.pop();
        }
        out.push("");
        out.push("---");
        out.push("");
      }
      seenH2 = true;
    }
    out.push(line);
  }
  return out;
}

/** 正文段内最多连续两个空行；代码块内保留原样 */
function collapseBlankLinesFenceAware(lines) {
  const out = [];
  let inFence = false;
  let blankRun = 0;

  for (const line of lines) {
    if (isFenceStart(line)) {
      inFence = !inFence;
      blankRun = 0;
      out.push(line);
      continue;
    }

    if (!inFence && line === "") {
      blankRun++;
      if (blankRun <= 2) {
        out.push("");
      }
      continue;
    }

    blankRun = 0;
    out.push(line);
  }

  return out;
}

function processBody(body, skipHeadingNumbering) {
  const rawLines = body.replace(/\r\n/g, "\n").split("\n");
  const state = { h2: 0, h3: 0 };
  const circledCtx = { h2: 0, h3: 0, circledSeq: 0 };
  const out = [];
  let inFence = false;

  for (const raw of rawLines) {
    const line = stripTrailingWhitespace(raw);

    if (isFenceStart(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }

    if (inFence) {
      out.push(line);
      continue;
    }

    let processed = line;
    processed = formatHeadingLine(processed, state, skipHeadingNumbering);
    updateCircledContextFromHeading(processed, circledCtx);
    processed = replaceCircledEnumeration(processed, circledCtx);

    const { line: masked, tokens } = maskInlineCode(processed);
    let q = convertAsciiDoubleQuotesMasked(masked);
    q = unmaskInlineCode(q, tokens);
    q = insertCjkLatinSpacing(q);

    out.push(q);
  }

  let withDividers = ensureH2Dividers(out);
  withDividers = collapseBlankLinesFenceAware(withDividers);

  let text = withDividers.join("\n");
  if (!text.endsWith("\n")) {
    text += "\n";
  }
  return text;
}

function processFile(filePath, checkOnly) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { front, body } = splitFrontMatter(raw);
  const skipHeadingNumbering = path.basename(filePath) === "index.md";
  const newBody = processBody(body, skipHeadingNumbering);
  const next = front + newBody;
  if (next !== raw) {
    if (!checkOnly) {
      fs.writeFileSync(filePath, next, "utf8");
    }
    return true;
  }
  return false;
}

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walk(p, acc);
    } else if (name.endsWith(".md")) {
      acc.push(p);
    }
  }
}

const checkOnly = process.argv.includes("--check");
const files = [];
for (const r of roots) {
  const d = path.join(repoRoot, r);
  if (fs.existsSync(d)) {
    walk(d, files);
  }
}

let changed = 0;
for (const f of files.sort((a, b) => a.localeCompare(b))) {
  if (processFile(f, checkOnly)) {
    changed++;
    console.log(checkOnly ? "needs format:" : "updated:", path.relative(repoRoot, f));
  }
}

console.log(
  `${checkOnly ? "check" : "done"}. ${changed} file(s) ${checkOnly ? "would change" : "modified"}, ${files.length} total.`,
);

if (checkOnly && changed > 0) {
  process.exitCode = 1;
}

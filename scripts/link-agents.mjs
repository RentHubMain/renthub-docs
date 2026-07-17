/**
 * Link `.cursor/skills` and `.cursor/rules` to `.agents/` for Cursor IDE discovery.
 * Canonical agent config lives under `.agents/`; `.cursor/*` are local junctions/symlinks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cursorDir = path.join(root, ".cursor");

const links = [
  { name: "skills", target: path.join(root, ".agents", "skills") },
  { name: "rules", target: path.join(root, ".agents", "rules") },
];

function linkPointsTo(linkPath, targetPath) {
  try {
    const resolved = fs.realpathSync(linkPath);
    const expected = fs.realpathSync(targetPath);
    return resolved === expected;
  } catch {
    return false;
  }
}

function removeIfWrong(linkPath, targetPath) {
  if (!fs.existsSync(linkPath)) return;
  if (linkPointsTo(linkPath, targetPath)) return;

  const stat = fs.lstatSync(linkPath);
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    fs.rmSync(linkPath, { recursive: true, force: true });
    return;
  }

  throw new Error(`Cannot replace non-link path: ${linkPath}`);
}

fs.mkdirSync(cursorDir, { recursive: true });

for (const { name, target } of links) {
  if (!fs.existsSync(target)) {
    throw new Error(`Missing agent directory: ${path.relative(root, target)}`);
  }

  const linkPath = path.join(cursorDir, name);
  removeIfWrong(linkPath, target);

  if (fs.existsSync(linkPath)) continue;

  const relativeTarget = path.relative(path.dirname(linkPath), target);
  const linkType = process.platform === "win32" ? "junction" : "dir";
  fs.symlinkSync(relativeTarget, linkPath, linkType);
}

---
name: renthub-commit
description: 按照 RentHub Conventional Commits 规范分析当前 git 改动、起草 commit message 并执行提交。当用户说"帮我 commit"、"生成 commit message"、"提交代码"或类似表达时使用。
---

# RentHub Commit 助手

## 工作流程

### 第一步：读取改动

```bash
git status
git diff --staged   # 已暂存的改动
git diff            # 未暂存的改动
```

若暂存区为空，询问用户是否要暂存全部（`git add .`）或指定文件，再继续。

### 第二步：分析改动目的

判断改动是否属于**同一个目的**：

- 是 → 生成 1 个 commit
- 否 → 告知用户需要拆分，按目的分批 `git add` + 逐个 commit

### 第三步：起草 message

格式严格遵循：

```
<type>(<scope>): <subject>

[body：解释为什么，可选]
```

**type 选择：**

| type | 使用场景 |
|------|---------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不新增功能、不修 bug） |
| `chore` | 依赖、配置、构建等非业务改动 |
| `docs` | 纯文档变更 |
| `test` | 测试相关 |
| `style` | 格式、空格等不影响逻辑的改动 |

**起草规则：**

- `subject`：动词开头，中文，不加句号，不超过 50 字
- `scope`：填改动所属模块（如 `order`、`auth`、`vibe-coding`），无明确模块可省略
- `body`：若改动有明确的背景原因，补充一段。**写"为什么"，不写"做了什么"**；若原因显而易见可省略
- **禁止**在 subject/body 中出现工具归因文案，例如 `Made with Cursor`、`Co-authored-by: Cursor`、类似 AI 署名等；commit只描述项目改动本身

### 第四步：展示并确认

将起草的 message 完整展示给用户，等待确认。**不得在用户确认前自动执行 commit。**

用户确认后执行：

```bash
git commit -m "<完整 message>"
```

多行 message 在 PowerShell 环境下用 `` `n `` 换行：

```powershell
git commit -m "type(scope): subject`n`nbody 内容"
```

### 第五步：完成提示

commit 成功后，输出 commit hash 与 message 摘要，提醒用户按需执行 `git push`。

---

## 常见问题

**改动涉及多个模块怎么办？**
scope 可用斜杠分隔：`feat(order/payment): ...`，或省略 scope 直接描述。

**body 要不要写？**
改动原因不明显时写，原因显而易见（如"修复拼写错误"）时可省略。

**WIP 临时 commit 要提交吗？**
不要。先用 `git rebase -i` 整理成有意义的 commit 再提交。

---
title: Git 基础入门
---

本文从"Git 是什么"开始，帮你建立完整的心智模型，并掌握日常开发所需的基本操作。

---

## 1. Git 是什么，为什么需要它

### 1.1 没有 Git 时会发生什么

想象你和队友共同修改同一份代码文件：

- 你发给他一个 `app_v2.js`，他改完发回 `app_v2_final.js`，你又改成 `app_v2_final_真的final.js`
- 某天出了 bug，想回到三天前的版本——找不到了
- 两个人同时改了同一行，互相覆盖，其中一人的工作丢失

Git 解决的就是这些问题。

### 1.2 Git 是什么

**Git 是一个版本控制系统**，它做三件事：

1. **记录每一次改动**：谁在什么时候改了什么，永久保存
2. **支持多人协作**：大家各自修改，Git 负责合并
3. **允许随时回退**：任何历史版本都能一键还原

> 类比：Git 就像游戏存档系统。你可以在任意时刻存档，随时读取任意一个存档点，还能开多条存档线（分支）并行探索。

---

## 2. 核心概念

理解这六个概念，Git 就入门了。

### 2.1 Repository（仓库，英文简称repo）

**仓库**就是被 Git 管理的文件夹。你的项目代码、Git 记录的所有历史，都存在这个文件夹里。

- **本地仓库**：你电脑上的那份
- **远程仓库**：放在 GitHub 上的那份，团队共享

### 2.2 Commit（提交）

**Commit 是一个存档点**。每次你觉得"这阶段的工作完成了"，就执行一次 commit，Git 会快照当前所有文件的状态并永久保存。

每个 commit 包含：
- 改动的内容
- 提交时间
- 提交人
- 你写的一段说明（commit message）


### 2.3 Branch（分支）

**Branch 是独立的开发线**。默认只有一条线（`main`），但你可以随时从某个点分叉出一条新线，在上面自由开发，不影响主线。

```
main:    A ── B ── C ──────── G
                    \        /
feature:             D ── E ── F（合并回 main）
```

类比：分支就像平行宇宙，你在新宇宙里实验，觉得好再合并回主宇宙。

### 2.4 Merge（合并）

**Merge 把一个分支的改动合并到另一个分支**。通常是把功能分支合并回主分支。

如果两个分支改动了同一行代码，Git 无法自动决定保留哪个，会产生**冲突（conflict）**，需要人工选择。

### 2.5 Remote（远程）

**Remote 是远程仓库的别名**，默认叫 `origin`，指向 GitHub 上的仓库。

- **Push**：把本地的 commit 上传到远程
- **Pull**：把远程的最新改动下载到本地
- **Clone**：把远程仓库完整复制到本地（第一次使用时）

### 2.6 Pull Request（PR）

**PR 是 GitHub 提供的"请求合并"流程**，是团队协作的核心入口。

> PR只是一个名字，Github叫做PR (Pull Request)，Gitlab上又叫做MR (Merge Request)，但实际上本质是一致的

Git 本身只有 merge 命令，PR 是 GitHub 在此之上加的一层协作机制：

1. 你把功能分支 push 到 GitHub
2. 在 GitHub 上发起 PR，说明"我想把 `feature/xxx` 合并到 `dev`"
3. 队友在 PR 页面查看你的改动、留评论、提问题
4. 所有问题解决后，点击 **Merge** 完成合并

```
你的电脑                     GitHub
─────────────────────────────────────────────
feature/login  →  push  →  feature/login
                               ↓
                           发起 PR
                               ↓
                        队友 Review + 评论
                               ↓
                           Merge 到 dev
```

PR 的价值不只是合并代码，更是一个**异步讨论和质量把关**的场所。每一次合并都有记录，出问题可以追溯到具体的 PR 和讨论。

> 关于 PR 的写法规范和 Review 流程，见 [Git 协作工作流](/docs/project-mgmt/git-workflow)。

---

## 3. 安装与初始配置

### 3.1 安装 Git

前往 [git-scm.com](https://git-scm.com) 下载安装包，一路默认安装即可。

安装完成后，在终端运行验证：

```bash
git --version
# 输出类似：git version 2.47.0
```

### 3.2 配置身份信息

Git 记录每次 commit 的作者，先告诉它你是谁：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

这两条命令只需执行一次，对所有仓库生效。

---

## 4. 基本工作流程

> **不用死记命令。** Cursor、VS Code 等现代 IDE 内置了 Git 图形界面（侧边栏 Source Control），暂存、提交、推送、拉取、查看历史、解决冲突……全部点鼠标就能完成，不需要手动敲命令。
>
> 本节列出的命令是帮你**理解每步在做什么**，以及在图形界面失灵时能手动兜底。日常用 IDE 的 GUI 操作即可。

日常开发 90% 的操作就是这个循环：

```
修改代码 → 暂存改动 → 提交 → 推送到远程
```

### 4.1 查看当前状态

```bash
git status
```

这是用得最多的命令之一。它告诉你：
- 哪些文件被修改了
- 哪些改动已暂存（准备提交）
- 当前在哪个分支

### 4.2 暂存改动

**暂存**是 commit 的前一步，你选择"这次提交包含哪些文件的改动"。

```bash
# 暂存某个文件
git add 文件名.js

# 暂存所有改动
git add .
```

> 为什么有"暂存"这一步？因为你可能同时修改了 5 个文件，但只想把其中 3 个作为一次 commit，另外 2 个留到下次。

### 4.3 提交

```bash
git commit -m "feat: 添加用户登录功能"
```

`-m` 后面跟的是 commit message，描述这次改动做了什么。写清楚，三个月后的自己（和队友）会感谢你。

### 4.4 推送到远程

```bash
git push origin main
```

把本地的 commit 上传到 GitHub 上名为 `origin` 的远程仓库的 `main` 分支。

### 4.5 拉取远程最新改动

```bash
git pull
```

队友 push 了新代码，你执行这条命令就能同步到本地。

---

## 5. 分支操作

### 5.1 查看分支

```bash
# 查看本地所有分支（* 号标记当前所在分支）
git branch

# 查看包含远程分支
git branch -a
```

### 5.2 创建并切换分支

```bash
# 从当前分支创建新分支并切换过去
git checkout -b feature/my-feature
```

命名规范参考 [Git 协作工作流](/docs/project-mgmt/git-workflow) 中的分支策略。

### 5.3 切换分支

```bash
git checkout main
```

### 5.4 合并分支

```bash
# 先切换到目标分支（接收改动的那个）
git checkout main

# 再把功能分支合并进来
git merge feature/my-feature
```

### 5.5 删除分支

```bash
# 删除本地分支（合并后清理）
git branch -d feature/my-feature

# 删除远程分支
git push origin --delete feature/my-feature
```

---

## 6. 克隆与远程操作

### 6.1 克隆仓库

第一次拿到一个项目：

```bash
git clone git@github.com:组织名/仓库名.git
cd 仓库名
```

### 6.2 查看远程仓库信息

```bash
git remote -v
# 输出：
# origin  git@github.com:org/repo.git (fetch)
# origin  git@github.com:org/repo.git (push)
```

---

## 7. 处理冲突

冲突不可怕，只是 Git 在说："这两处改动我不知道保留哪个，你来决定。"

> **IDE 会帮你处理。** Cursor / VS Code 遇到冲突时会高亮显示，并提供 "Accept Current"（保留你的）、"Accept Incoming"（保留对方的）、"Accept Both" 按钮，点一下就解决，不需要手动删除标记行。

冲突发生时，文件里会出现这样的标记：

```
<<<<<<< HEAD
这是你的改动
=======
这是队友的改动
>>>>>>> feature/their-branch
```

解决步骤：
1. 打开冲突文件，找到 `<<<<<<<` 标记
2. 决定保留哪个版本（或两者都保留、手动合并）
3. 删除所有 `<<<<<<<`、`=======`、`>>>>>>>` 标记行
4. 保存文件
5. `git add 冲突文件` 标记已解决
6. `git commit` 完成合并

> 现代 IDE（如 Cursor/VS Code）会用可视化界面展示冲突，点击"Accept Current"或"Accept Incoming"即可，不需要手动编辑标记。

---

## 8. 查看历史记录

```bash
# 查看提交历史
git log

# 简洁单行格式
git log --oneline

# 查看某个文件的改动历史
git log --follow -p -- 文件名.js

# 查看某次 commit 的具体改动
git show commit哈希值
```

---

## 9. 撤销与回退

> **IDE 的"撤销"更直观。** Source Control 面板中右键文件可以"Discard Changes"（丢弃改动），历史记录视图也支持直接 revert 某次 commit，不必记忆命令。以下命令供了解原理或终端操作时参考。

### 9.1 撤销未暂存的改动

```bash
# 丢弃某个文件的改动（恢复到上次 commit 的状态）
git checkout -- 文件名.js
```

### 9.2 撤销暂存

```bash
# 把文件从暂存区移出（改动还在，只是不再准备提交）
git restore --staged 文件名.js
```

### 9.3 撤销最近一次 commit

```bash
# 撤销 commit，但保留代码改动
git reset --soft HEAD~1

# 撤销 commit 并丢弃代码改动（危险，谨慎使用）
git reset --hard HEAD~1
```

> `HEAD~1` 表示"上一个 commit"，`HEAD~3` 表示"往前三个 commit"。

---

## 10. 常见问题

**Q：push 被拒绝，提示"rejected, non-fast-forward"**

原因：远程有你本地没有的 commit（队友先 push 了）。先 pull 同步再 push：

```bash
git pull --rebase
git push
```

**Q：不小心 commit 了不该提交的文件（如 `.env`）**

```bash
# 撤销最近一次 commit，保留改动
git reset --soft HEAD~1
# 把敏感文件加入 .gitignore
echo ".env" >> .gitignore
# 重新 add 和 commit，不包含该文件
git add .
git commit -m "chore: 初始化项目配置"
```

**Q：切换分支前提示"有未提交的改动"**

两个选择：
1. 先 commit 再切换
2. 用 `git stash` 临时保存改动，切换完再 `git stash pop` 还原

```bash
git stash          # 临时保存
git checkout main  # 切换分支
git stash pop      # 还原改动
```

---

## 11. 与团队工作流衔接

掌握本文内容后，阅读 [Git 协作工作流](/docs/project-mgmt/git-workflow) 了解 RentHub 团队具体的分支策略、Commit 规范与 PR 流程。

**快速回顾：日常开发最常用的命令**

```bash
git status                        # 查看状态（随时可用）
git checkout -b feature/xxx       # 创建并切换到功能分支
git add .                         # 暂存所有改动
git commit -m "feat: 简洁描述"    # 提交
git push origin feature/xxx       # 推送到远程
git pull                          # 拉取最新改动
git log --oneline                 # 查看历史
```

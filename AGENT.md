# AGENT.md

给接手这个项目的 agent 看的速览。读完这份就够开工，细节在 README 和源码里。

## 项目是什么

一个**个人技术博客**，纯静态，部署产物是一堆 HTML。视觉风格偏二次元：手写感标题字体、粉紫青渐变标题、全屏插画欢迎页、圆形卡通 logo。内容是本地 Markdown，没有后台、没有数据库、没有评论区。

目标读者是作者本人（仓库路径 `~/sylphy/study/project/SylphyBlogs`），所以不要主动张罗多人协作、CI 规范、组件库那一套，除非明确要求。

## 技术栈与版本约束

| 项 | 值 | 备注 |
|---|---|---|
| 框架 | Astro **7.4.10** | 唯一的框架，没有 React/Vue |
| 包管理 | pnpm **11.28.5** | lockfile 是 `9.0` |
| Node | **>= 22.23.4** | 写在 `package.json` 的 engines 里，Cloudflare Pages 默认正好是 22.23.4 |
| 运行时依赖 | `astro` + `@fontsource/zcool-kuaile` | 就这两个，别随手加包 |

**npm registry 是 npmmirror（`registry.npmmirror.com`），常比 npmjs 慢一个补丁号。** 之前 `create-astro` 写进 `^7.4.11` 导致装不上，已改成 `^7.4.10`。遇到 `ERR_PNPM_NO_MATCHING_VERSION` 先查镜像上的实际版本，别急着换 registry。

## 跑起来

```sh
pnpm dev      # http://localhost:4321
pnpm build    # 输出 dist/
pnpm preview  # 预览构建产物
```

## 路由表

| 路径 | 文件 | 说明 |
|---|---|---|
| `/` | `src/pages/index.astro` | 欢迎页，全屏背景图 + 渐变大标题 + 两个入口按钮 |
| `/blog` | `src/pages/blog/index.astro` | 文章列表，按发布时间倒序 |
| `/blog/<id>/` | `src/pages/blog/[...id].astro` | 文章详情，`getStaticPaths` + `render()` |
| `/archive` | `src/pages/archive.astro` | 按年份分组，年份带篇数 |
| `/tags` | `src/pages/tags.astro` | 标签云（带计数）+ 每个标签一节，锚点为 `#tag-<标签>` |
| `/about` | `src/pages/about.astro` | 占位正文 |

导航项集中在 `src/lib/nav.ts` 的 `navItems` 数组，`Header.astro` 遍历渲染。当前页靠 `aria-current="page"` 高亮（`/` 用全等匹配，其余用前缀匹配，所以 `/blog/xxx` 也会点亮「博客」）。

## 目录结构

```text
src/
├── content.config.ts          # blog 集合 + zod schema
├── content/blog/*.md          # 文章，文件名即 URL 片段
├── layouts/BaseLayout.astro   # html 骨架、字体引入、主题初始化、favicon
├── components/
│   ├── Header.astro           # 固定顶栏 + 导航 + 汉堡菜单 + 滚动收缩脚本
│   ├── Footer.astro
│   ├── PostCard.astro         # 列表项
│   └── ThemeToggle.astro      # 亮暗切换
├── lib/date.ts                # 日期格式化
├── lib/nav.ts                 # 导航配置
├── pages/                     # 见上面的路由表
└── styles/global.css          # 变量、基础排版、内页标题、列表、正文、代码块
public/
├── images/hero.jpg            # 欢迎页背景（1800×1237，341 KB）
├── images/logo.png            # 品牌图标 256×256
├── favicon.png                # 64×64
└── apple-touch-icon.png       # 180×180
```

样式分工：**全局**在 `global.css`，**组件专属**写在各自 `.astro` 的 `<style>` 里（Astro 会自动 scoped）。改组件样式优先改组件内部那份，别全堆进 global。

## 设计系统

所有颜色和尺寸都是 `global.css` 顶部 `:root` 里的 CSS 变量，暗色覆盖在 `html[data-theme='dark']`：

| 变量 | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--bg` / `--bg-soft` | `#fcfcfa` / `#f4f3ef` | `#141413` / `#1c1c19` | 页面底 / 次级底 |
| `--fg` / `--fg-muted` | `#22211f` / `#6b6a66` | `#e8e6e1` / `#9a9890` | 文字 / 弱化文字 |
| `--border` | `#e5e3dd` | `#2a2a26` | 分割线 |
| `--accent` | `#0f766e` | `#5eead4` | 强调色（青绿） |
| `--measure` | `56rem` | 同 | 正文列宽（896px） |
| `--header-measure` | `72rem` | 同 | 顶栏宽度，刻意比正文宽 |
| `--header-height` / `--header-height-compact` | `4rem` / `3.25rem` | 同 | 顶栏常态 / 滚动收缩后高度 |
| `--font-sans` | 系统字体栈 | 同 | 正文 |
| `--font-display` | `'ZCOOL KuaiLe'`（站酷快乐体） | 同 | 标题 |
| `--title-gradient` | `#db2777 → #7c3aed → #0d9488` | `#f9a8d4 → #c4b5fd → #5eead4` | 一级标题渐变 |

- 断点只有一个：`48em`（768px），窄屏导航折叠成汉堡下拉面板。
- 字体：站酷快乐体**只用于**品牌名、`.page-title`、文章 h1、`.hero h1`、`.prose h1/.prose h2`；正文保持系统无衬线。
- 渐变只给一级标题（`.brand-text`、`.page-title`、文章 h1、`.hero h1`、`.prose h1`），`.prose h2` 保持正文色，避免长文到处是彩色标题。

## 几个容易踩的实现细节

1. **顶栏是 `position: fixed` + 独立占位块**（`Header.astro` 的 `.header-spacer`）。不要改回 `sticky`：sticky 会让顶栏高度参与文档流，滚动收缩时改变文档总高、夹紧滚动位置，造成 scroll 事件无限抖动（实测 `260↔259` 死循环）。改完量一下静止时 scroll 事件数应为 0。
2. **渐变文字必须配 `width: fit-content`**。`h1` 是块级元素，背景渐变会铺满整个容器宽度，文字只吃到渐变前半段，末端青色根本看不见。
3. 渐变字上不能用 `color` 做悬停变化（`-webkit-text-fill-color: transparent` 会盖掉），品牌名的悬停改成了 `filter: brightness() saturate()`。
4. **Shiki 双主题**：`astro.config.mjs` 里配了 `themes: { light, dark }`，暗色切换靠 `global.css` 末尾 `html[data-theme='dark'] .astro-code` 覆写 `--shiki-dark*` 变量。改代码块配色要动这里，不是改 Shiki 主题名。
5. **欢迎页 hero 满宽出血公式**：`margin: -3rem calc(50% - 50vw) 0`，抵消 `.wrap` 的左右 padding 和 `main` 的上 padding；高度 `calc(100vh - var(--header-height))`。
6. 站酷快乐体由 fontsource 按 `unicode-range` 切成 93 片、单片约 18KB，只下载用到的分片，`font-display: swap`。别改成单个全量文件。
7. 草稿：`draft: true` 的文章不出现在列表，也不参与构建。

## 写文章

在 `src/content/blog/` 新建 `.md`，文件名即 URL（`hello.md` → `/blog/hello/`）：

```markdown
---
title: 标题
description: 一句话摘要
pubDate: 2026-11-13
tags: ['标签']
draft: true
---

正文……
```

字段由 `src/content.config.ts` 的 zod schema 校验（`title`/`description`/`pubDate` 必填，`tags` 默认 `[]`，`draft` 默认 `false`，另有可选 `updatedDate`）。写错会在构建时报错，这是有意的。

## 当前状态（截至 2026-11-13）

- 已提交 4 个 commit，最新是 `b7a830e feat: 欢迎页添加全屏背景图`。
- **工作区有一批未提交改动**：logo/favicon 接入、站酷快乐体 + 渐变标题、顶栏固定与滚动收缩、内容列宽 44→56rem 等。动手前先 `git status` 看清，别覆盖。
- 未做：部署、`site` 配置、RSS、sitemap、404 页、文章分页。
- 部署方向已聊过：优先 Cloudflare Pages（`pnpm build` / `dist`，根路径，代码里全是绝对路径所以不要用 GitHub 项目页的子路径部署），具体待执行。

## 约定

- 只有 `astro` + 字体包两个依赖，加依赖要有明确理由。
- 文案是中文，语气轻松；占位内容（欢迎页自我介绍、关于页正文）留了明显的 placeholder 味道，替换即可。
- 提交信息用中文 Conventional Commits；不主动提交，改完汇报等确认。

<!-- [claudecode 2026-11-13] 新建 AGENT.md，汇总项目目的、技术栈、设计系统与实现坑 -->

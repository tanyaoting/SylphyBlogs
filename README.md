# SylphyBlogs

基于 Astro 7 的静态博客。文章是本地 Markdown，构建时生成纯 HTML，无运行时框架依赖。

## 常用命令

```sh
pnpm install        # 安装依赖
pnpm dev            # 本地开发，默认 http://localhost:4321
pnpm build          # 构建到 dist/
pnpm preview        # 预览构建产物
```

## 目录结构

```text
src/
├── content.config.ts          # 定义 blog 集合与 frontmatter schema
├── content/blog/*.md          # 文章，文件名即 URL
├── layouts/BaseLayout.astro   # HTML 骨架、主题初始化脚本
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── PostCard.astro
│   └── ThemeToggle.astro
├── lib/
│   ├── date.ts                # 日期格式化
│   └── nav.ts                 # 顶部导航项配置
├── pages/
│   ├── index.astro            # 欢迎页
│   ├── blog/index.astro       # 文章列表
│   ├── blog/[...id].astro     # 文章详情
│   ├── archive.astro          # 归档，按年份分组
│   ├── tags.astro             # 标签聚合
│   └── about.astro            # 关于
└── styles/global.css          # 主题变量、排版、代码块样式
```

## 写文章

在 `src/content/blog/` 新建 `.md`，文件名就是 URL 路径（如 `hello.md` → `/blog/hello/`）：

```markdown
---
title: 标题
description: 一句话摘要
pubDate: 2026-11-12
tags: ['标签']
draft: true
---

正文……
```

- `draft: true` 的文章不会出现在列表，也不会被构建。
- frontmatter 由 `src/content.config.ts` 的 zod schema 校验，字段缺失或类型错误会直接构建失败。
- `src/content/blog/writing-template.md` 是一份可复制的排版模板。

## 顶部导航

导航项集中在 `src/lib/nav.ts` 的 `navItems` 数组里，改数组即改导航，`Header.astro` 自动渲染并高亮当前页（`aria-current="page"`）。窄屏（`< 48em`）折叠为汉堡菜单。

当前五项：首页 `/`（欢迎页）、博客 `/blog`、归档 `/archive`、标签 `/tags`、关于 `/about`。

## 欢迎页背景

背景图在 `public/images/hero.jpg`（1800×1237，341 KB），由 `index.astro` 的 `.hero` 引用：满宽出血（`margin: -3rem calc(50% - 50vw) 0`）、高度 `calc(100vh - 4rem)`、`background-size: cover`。

左侧渐隐遮罩是 `.hero::before` 的横向渐变，亮暗各一套；底部 `.hero::after` 用 `7rem` 渐变融进页面背景。换图直接替换同名文件，保持横向构图即可。

## 主题与代码高亮

- 亮暗主题由 `<html data-theme>` 控制，切换结果存 `localStorage`，首次访问跟随系统 `prefers-color-scheme`。
- 代码高亮用 Astro 内置的 Shiki，亮暗双主题在 `astro.config.mjs` 的 `markdown.shikiConfig.themes` 配置，暗色变量由 `global.css` 末尾的 `html[data-theme='dark'] .astro-code` 规则接管。

## 部署

静态托管即可，构建命令 `pnpm build`，产物目录 `dist`。

<!-- [claudecode 2026-11-12] 替换脚手架自带 README，改为本项目说明 -->
<!-- [claudecode 2026-11-12] 补充顶部导航配置说明与 lib/nav.ts 目录项 -->
<!-- [claudecode 2026-11-12] 补充归档/标签/关于三个页面与当前导航项说明 -->
<!-- [claudecode 2026-11-12] 补充欢迎页背景图说明 -->
<!-- [claudecode 2026-11-12] 首页改为欢迎页，文章列表迁至 /blog 并新增导航项 -->

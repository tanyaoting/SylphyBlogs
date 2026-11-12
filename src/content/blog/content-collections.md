---
title: 用内容集合管理文章
description: Content Collections 把 Markdown 变成有类型的数据源，frontmatter 写错会在构建期报错。
pubDate: 2026-11-05
tags: ['Astro', 'TypeScript']
---

文章放在 `src/content/blog/` 下，目录结构就是路由结构。但真正让它好用的是 **内容集合**：frontmatter 会被 zod schema 校验，缺字段、类型不对都会在构建时直接失败，而不是等到页面上渲染出 undefined。

## 定义集合

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

## 查询与排序

`getCollection()` 返回带类型的数组，`data` 就是 schema 校验后的结果：

```ts
const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
```

> 草稿（`draft: true`）默认不会出现在列表和构建产物里，写一半的文章可以安心提交。

## 一些约定

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 页面标题，同时用于 `<title>` |
| `description` | `string` | 摘要，显示在列表页和 meta 标签 |
| `pubDate` | `date` | 发布日期，决定列表排序 |
| `updatedDate` | `date?` | 可选，更新日期 |
| `tags` | `string[]` | 标签，渲染成圆角小标签 |
| `draft` | `boolean` | 是否草稿 |

---
title: 为什么选 Astro 写博客
description: 静态优先、默认零 JS，同时又能按需挂上服务端渲染，是这个项目落地的核心原因。
pubDate: 2026-11-12
tags: ['Astro', '选型']
---

博客的核心需求只有三件事：**写起来快、打开得快、放得住**。静态站点生成器天然满足后两点，区别只在写作体验和可扩展性上。

## 静态优先

Astro 默认把每个页面在构建时渲染成 HTML，浏览器拿到的就是成品，没有 hydration 开销。只有显式标记的交互组件才会带 JavaScript 上船。

```bash
# 构建产物是纯静态文件
pnpm build
ls dist
```

## 需要时再加后端

如果某天要在网页上写文章或者加评论区，加一个 adapter 就能按路由开启服务端渲染，其余页面仍然是静态的：

```ts
// src/pages/api/likes.ts
export const prerender = false;

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  return new Response(JSON.stringify({ ok: true, body }), {
    headers: { 'content-type': 'application/json' },
  });
}
```

这条路径的好处是**升级不需要重写**：同一套页面组件、同一套样式，静态和动态两条路复用。

## 不需要的部分

这个项目刻意没有引入 React。列表页、详情页、主题切换都是原生实现的，依赖表里只有 `astro` 一项。

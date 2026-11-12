---
title: 写作模板与排版对照
description: 新文章可以从这篇复制骨架，顺便当样式自检页用。
pubDate: 2026-10-28
tags: ['写作']
---

复制下面的 frontmatter 就能开新文章：

```md
---
title: 标题
description: 一句话摘要
pubDate: 2026-10-28
tags: ['标签']
draft: true
---
```

## 正文元素

普通段落。行内代码写作 `pnpm dev`，强调用 **粗体** 或 *斜体*，链接写成 [Astro 文档](https://docs.astro.build/)。

### 列表

- 无序项一
- 无序项二
  - 嵌套项

1. 有序项一
2. 有序项二

### 引用

> 引用块用来放结论或摘录，左侧有一条强调色竖线。

### 代码块

```ts
type Post = {
  title: string;
  tags: string[];
};

export function countTags(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}
```

```go
func main() {
    tags := map[string]int{"astro": 3, "写作": 1}
    for name, n := range tags {
        fmt.Printf("%s: %d\n", name, n)
    }
}
```

---

分隔线以上是正文，下面留给「更新记录」之类的附录。

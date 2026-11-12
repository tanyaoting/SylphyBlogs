export interface NavItem {
  label: string;
  href: string;
}

/**
 * 顶部导航项，按数组顺序渲染。
 * 增删改只动这里，Header.astro 会自动同步。
 */
export const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '归档', href: '/archive' },
  { label: '标签', href: '/tags' },
  { label: '关于', href: '/about' },
];

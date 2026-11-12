// @ts-check
// [claudecode 2026-11-12] 配置 Shiki 亮暗双主题（配合 global.css 中的 data-theme 规则）
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});

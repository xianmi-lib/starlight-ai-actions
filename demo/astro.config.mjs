import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightThemeLargePrint from 'starlight-theme-large-print';
import starlightAiActions from 'starlight-ai-actions';

export default defineConfig({
  site: 'https://example.com',
  vite: {
    server: {
      fs: {
        // starlight-theme-large-print 是 file: 链接的外部仓库（../../starlight-theme-large-print），
        // dev 下 Vite 只服务项目根内文件，需放行公共父目录（照 xianmi-preview-cn 挂接现状）
        allow: ['../..'],
      },
    },
  },
  integrations: [
    starlight({
      title: 'AI Actions Demo',
      plugins: [
        starlightThemeLargePrint({ font: 'noto-serif-sc' }),
        // sidebar-topics 工厂禁止顶层 sidebar 配置（会 throw）：原 sidebar 条目收进 topics
        starlightSidebarTopics([
          {
            label: 'Demo',
            id: 'demo',
            icon: 'open-book',
            link: '/a/',
            items: [
              { label: 'A', slug: 'a' },
              { label: 'Hidden', slug: 'hidden' },
              { label: 'Custom prompt', slug: 'custom-prompt' },
            ],
          },
          {
            label: 'Pages',
            id: 'pages',
            icon: 'document',
            link: '/',
            items: [
              { label: 'Home', slug: 'index' },
              { label: 'Index page', slug: 'index-page' },
              { label: 'Guides', slug: 'guides' },
            ],
          },
        ]),
        starlightAiActions({
          markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'], mdUrl: '{site}{base}/md/{filePath}' },
          // 第三个 combine 用豆包位图，暴露 .pa-combine .pa-icon-img 位图锁标路径（v5 无对照的泛化路径，Task 11 目测用）
          direct: [
            { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
            { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
            { name: '豆包', href: 'https://www.doubao.com/chat/', icon: 'doubao', style: 'combine' },
          ],
          where: { idPattern: '^(a|hidden|custom-prompt)' },
        }),
      ],
    }),
  ],
});

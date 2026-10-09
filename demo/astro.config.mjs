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
      // 三语演示（prompt/labels 按页面语言分发的复验夹具）：root=English（默认在 /），
      // zh-cn / zh-tw 各带 Starlight `lang` 精确码（DEFAULT_PROMPTS/labels 的键）
      locales: {
        root: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
        'zh-tw': { label: '正體中文', lang: 'zh-TW' },
      },
      plugins: [
        starlightThemeLargePrint({ font: 'noto-serif-sc' }),
        // sidebar-topics 工厂禁止顶层 sidebar 配置（会 throw）：原 sidebar 条目收进 topics。
        // items 用 link 型（非 slug 型）：slug 型会按当前 locale 重解析（slug 'a' → zh-cn 下查 'zh-cn/a'），
        // 多语言下缺镜像页直接 throw；link 型只按 locale 加前缀不查内容库。页归属走各页 frontmatter `topic`
        starlightSidebarTopics([
          {
            label: 'Demo',
            id: 'demo',
            icon: 'open-book',
            link: '/a/',
            items: [
              { label: 'A', link: '/a/' },
              { label: 'Hidden', link: '/hidden/' },
              { label: 'Custom prompt', link: '/custom-prompt/' },
            ],
          },
          {
            label: 'Pages',
            id: 'pages',
            icon: 'document',
            link: '/',
            items: [
              { label: 'Home', link: '/' },
              { label: 'Index page', link: '/index-page/' },
              { label: 'Guides', link: '/guides/' },
            ],
          },
        ]),
        starlightAiActions({
          // {base}/md/{filePath} 同源相对路径：demo 在 public/md/ 提供 raw markdown 真源
          markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'], mdUrl: '{base}/md/{filePath}' },
          // 两个 combine 锁标（豆包位图夹具已撤，位图路径仍由 paste 叠钮里的豆包头像覆盖）
          direct: [
            { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
            { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
          ],
          where: { idPattern: '^(a|hidden|custom-prompt|zh-cn/demo|zh-tw/demo)' },
        }),
      ],
    }),
  ],
});

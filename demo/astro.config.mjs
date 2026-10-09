import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightThemeLargePrint from 'starlight-theme-large-print';
import starlightAiActions from 'starlight-ai-actions';

export default defineConfig({
  site: 'https://www.xianmi.co',
  // 文档站挂 www.xianmi.co/starlight-ai-actions*（theme demo 的 /starlight 同模式）：
  // base 只改 URL 前缀，dev 下 URL 同样带前缀
  base: '/starlight-ai-actions',
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
      title: 'Starlight AI Actions',
      // demo 统一英语（用户 2026-10-09 拍板：教程+demo 只英语；三语 prompt/labels 由
      // 单测覆盖，生产站中文页面自然命中 zh-CN/zh-TW 缺省）
      locales: {
        root: { label: 'English', lang: 'en' },
      },
      plugins: [
        starlightThemeLargePrint({ font: 'noto-serif-sc' }),
        // sidebar-topics 工厂禁止顶层 sidebar 配置（会 throw）：原 sidebar 条目收进 topics。
        // items 用 link 型（非 slug 型）：slug 型会按当前 locale 重解析、缺镜像页直接 throw；
        // link 型只按 locale 加前缀不查内容库。页归属走各页 frontmatter `topic` 不动：
        // `topic: demo` 命中 id；`topic: pages` 与无 topic 的落地页（教程页）经 options.topics
        // 全模式映射回 Guide（根 index 的 slug 匹配不到 topic.link '/'，落地页必须走映射）
        starlightSidebarTopics(
          [
            {
              label: 'Guide',
              id: 'demo',
              icon: 'open-book',
              link: '/',
              items: [
                { label: 'A', link: '/a/' },
                { label: 'Hidden', link: '/hidden/' },
                { label: 'Custom prompt', link: '/custom-prompt/' },
              ],
            },
          ],
          { topics: { demo: ['**'] } },
        ),
        starlightAiActions({
          // {base}/md/{filePath} 同源相对路径：demo 在 public/md/ 提供 raw markdown 真源
          markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'], mdUrl: '{base}/md/{filePath}' },
          // 两个 combine 锁标（豆包位图夹具已撤，位图路径仍由 paste 叠钮里的豆包头像覆盖）
          direct: [
            { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
            { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
          ],
          where: { idPattern: '^(a|hidden|custom-prompt)' },
        }),
      ],
    }),
  ],
});

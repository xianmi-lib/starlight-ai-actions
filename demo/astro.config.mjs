import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightAiActions from 'starlight-ai-actions';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    starlight({
      title: 'AI Actions Demo',
      plugins: [
        starlightAiActions({
          markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'], mdUrl: '{site}{base}/md/{filePath}' },
          where: { idPattern: '^(a|hidden)' },
        }),
      ],
      sidebar: [{ label: 'Demo', items: [{ label: 'A', slug: 'a' }, { label: 'Hidden', slug: 'hidden' }, { label: 'Index page', slug: 'index-page' }] }],
    }),
  ],
});

---
title: starlight-ai-actions
description: Starlight plugin that adds a page-actions bar to your docs — a Markdown tools menu, one-click ChatGPT/Claude discussion buttons, and a paste-prompt dialog for other AI chatbots. Fully configurable, no runtime dependencies.
---

`starlight-ai-actions` adds a compact actions bar under each page title:

- **Markdown tools menu** — view the page's Markdown source, copy its content, copy its URL, or copy a ready-made prompt that references it.
- **ChatGPT / Claude buttons** — open a new chat with the prompt pre-filled (these two products support prompt prefill via URL).
- **Discuss with AI** — a paste-prompt dialog with buttons for AI chatbots that have no URL prefill (Gemini, Copilot, Poe, Doubao, DeepSeek, Qwen, Yuanbao, or your own list).

Everything is configurable from `astro.config.mjs`, can be overridden per page in frontmatter, and speaks English, Simplified Chinese, and Traditional Chinese out of the box (labels follow the page language).

## Install

```sh
npm install starlight-ai-actions
```

Peer requirements: `astro` ^7.2 and `@astrojs/starlight` ≥ 0.42.

## Setup

Two places need wiring: the plugin in `astro.config.mjs`, and the frontmatter schema in `src/content.config.ts`.

### 1. Register the plugin

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightAiActions from 'starlight-ai-actions';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightAiActions({
          markdown: { mdUrl: 'https://example.com{base}/md/{filePath}' },
        }),
      ],
    }),
  ],
});
```

The plugin takes over Starlight's `PageTitle` component to render the bar. If you also override `PageTitle` yourself, your override wins — render `AiActionsBar` from `starlight-ai-actions/AiActionsBar.astro` inside your own component if you need both.

### 2. Allow the `aiActions` frontmatter key

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { aiActionsSchema } from 'starlight-ai-actions/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: z.object({ aiActions: aiActionsSchema() }) }),
});

export const collections = { docs };
```

Without this step the bar still works — you just cannot use the per-page `aiActions` frontmatter key.

## Configuration

All options are plain data (string templates and arrays — no functions), so they survive the plugin's virtual-module bridge.

```js
starlightAiActions({
  markdown: {
    items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'],
    mdUrl: '{site}{base}/md/{filePath}',
  },
  direct: [
    { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
    { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
  ],
  paste: [
    { name: 'Gemini', href: 'https://gemini.google.com/app', icon: 'gemini' },
    // …
  ],
  prompt: 'I am reading this article (Markdown): {url}. Please read it first, then help me understand it.',
  where: { idPattern: '^guides/' },
  dialog: { title: 'Discuss with AI', hint1: 'Click an AI button below, then paste the prompt with Ctrl+V.' },
  labels: { 'zh-CN': { view: '查看 Markdown' } },
})
```

### `markdown` — the Markdown tools menu

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `markdown` | `false` | — | Hide the whole menu. |
| `items` | `MarkdownItem[]` | all four | Which entries to show, in order. `view`, `copyContent`, `copyUrl`, `copyPrompt`. An empty array hides the menu. |
| `mdUrl` | `string` | — | Template that resolves to the page's Markdown URL. See placeholders below. |

The `mdUrl` result is used for the *view* link, for *copy content* (the menu fetches it), for *copy URL*, and for `{url}` in prompts. Serve real Markdown at that URL (e.g. a `/md/` mirror of your sources) and the whole menu works.

### `direct` — buttons that jump straight into a chat

Each entry: `{ name, href, icon, iconUrl?, style?, bg?, scale?, ring? }`.

| Key | Meaning |
| --- | --- |
| `name` | Visible label (and `aria-label`) — a `string` (same name in all languages) or a per-language map `{ en: 'Doubao', 'zh-CN': '豆包' }`. |
| `href` | Target URL. `{prompt}` and `{url}` are substituted, URL-encoded. |
| `icon` | Built-in sprite id: `chatgpt`, `claude`, `gemini`, `copilot`, `poe`, `qwen`, `yuanbao`, `markdown`, `copy`, `link`, `external`, `commentAlt`, `caret`, `close`. Or use `icon: 'custom'` with `iconUrl`. |
| `style` | `combine` (icon + wordmark, like the built-in ChatGPT/Claude), `round`, or `square` (avatar buttons). Defaults to `round`. |
| `bg`, `scale`, `ring` | Avatar look, applied to the `<img>` path only (bitmap or `iconUrl`). Use `bg: 'transparent'` for flat logos in `combine` style. |

Buttons open in a new tab and dispatch an `ai-actions` event before navigating. Set `direct: false` to hide the group.

### `paste` — dialog buttons for chatbots without URL prefill

Same fields as `direct` (minus `style`), rendered inside the dialog. Set `paste: false` to hide the dialog entirely.

### `prompt` — the prompt template

Placeholders: `{url}` (the `mdUrl` result), `{title}`, `{lang}`, `{site}`.

Defaults are language-aware: English, Simplified Chinese, and Traditional Chinese are built in and selected by the page's language. A `prompt` option overrides them globally; frontmatter can override per page.

### `where` — which pages get the bar

`where: { idPattern: 'regex' }` filters on the content entry id. Regardless of this setting, index pages (`index.md` / `index.mdx`) never show the bar, and `aiActions: false` in frontmatter always hides it:

```
show = (frontmatter.aiActions !== false) && where(id) && not an index page
```

### `dialog`

`{ title?, hint1? }` to customize the dialog heading and the instruction line, or `dialog: false` to disable it (which requires `paste` to be empty too).

### `labels`

11 UI strings × 3 built-in languages (`en`, `zh-CN`, `zh-TW`), keyed by the exact language code with `en` as fallback. Override any key for any language:

```js
labels: { 'zh-TW': { pasteOpen: '與 AI 討論' } }
```

Keys: `view`, `copyContent`, `copyUrl`, `copyPrompt`, `copySuccess`, `copyFail`, `mdMenu`, `pasteOpen`, `dialogTitle`, `dialogHint1`, `dialogClose`.

## Per-page frontmatter

```yaml
aiActions: false          # hide the bar on this page
# or
aiActions:
  prompt: 'Summarize this article for a beginner: {url}'
```

## Events

Every action dispatches a `window` CustomEvent named `ai-actions` — useful for analytics. Buttons also carry `data-ai-action` attributes.

```js
window.addEventListener('ai-actions', (e) => {
  // e.detail = { type: 'markdown' | 'direct' | 'paste',
  //              action: 'view' | 'copyContent' | 'copyUrl' | 'copyPrompt' | 'open',
  //              provider?: string, url?: string,
  //              page: { url: string, title: string } }
});
```

## Recipes

Only ChatGPT and Claude, no dialog:

```js
starlightAiActions({ markdown: { mdUrl: '{site}{base}/md/{filePath}' }, paste: false })
```

Add a self-hosted chatbot:

```js
starlightAiActions({
  direct: [{ name: 'MyBot', href: 'https://bot.example.com/new?q={prompt}', icon: 'custom', iconUrl: '/mybot.svg', style: 'combine', bg: 'transparent' }],
})
```

Hide everything on internal pages:

```yaml
# frontmatter of the page
aiActions: false
```

## Limitations

- Configuration must be serializable: templates and regex strings, not functions.
- `bg` / `scale` / `ring` apply to avatar images only; sprite glyphs are flat.
- `style: 'square'` currently renders the round avatar.
- If `markdown` is disabled (or `items: []`) but a prompt or `href` still needs `{url}`, provide the URL anyway with `markdown: { items: [], mdUrl: '…' }`.

## License

MIT. All product names and brand icons are trademarks of their respective owners, referenced nominatively; icon sources are lobe-icons (MIT), simple-icons (CC0), and Starlight's built-in icon set (MIT).

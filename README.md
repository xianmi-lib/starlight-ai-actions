# starlight-ai-actions

[Starlight](https://starlight.astro.build/) page actions: a **Markdown tools** menu and **AI-discuss buttons** with a paste-prompt dialog — one compact action bar under the page title.

Readers can open the page's Markdown source, copy its content / URL / a ready-made prompt, jump straight into ChatGPT or Claude with the prompt prefilled, or copy the prompt and paste it into any other AI chat (Gemini, Copilot, Poe, 豆包, 千问, 元宝, …).

Requires `@astrojs/starlight` ≥ 0.42 and Astro 7 (peer dependencies).

## Features

- **Markdown tools menu** — `view` (open the `.md` in a new tab), `copyContent`, `copyUrl`, `copyPrompt` in one dropdown.
- **Direct AI buttons** — open a provider in a new tab with the prompt prefilled in the URL (`{prompt}` / `{url}` placeholders). Brand-lockup (`combine`) or avatar round button.
- **Paste-prompt dialog** — copies the prompt to the clipboard and opens a dialog listing every paste-type provider, for chats that cannot be prefilled by URL.
- **Per-page control** — frontmatter `aiActions: false` hides the bar, `aiActions: { prompt }` overrides the prompt; `where.idPattern` filters pages by content id.
- **Localized labels** — English, Simplified and Traditional Chinese out of the box, overridable per language.
- **Analytics hook** — every action dispatches an `ai-actions` `CustomEvent` on `window`.
- Bundled brand icon sprite and Doubao bitmap; no runtime dependencies.

## Installation

```bash
npm i starlight-ai-actions
```

## Setup

Two places need wiring: the Starlight plugin, and the content-collection schema (for frontmatter `aiActions`).

### 1. Plugin — `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightAiActions from 'starlight-ai-actions';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightAiActions({
          markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'], mdUrl: '{site}{base}/md/{filePath}' },
          direct: [
            { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
            { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
          ],
          where: { idPattern: '^guides/' },
        }),
      ],
    }),
  ],
});
```

### 2. Content schema — `src/content.config.ts`

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { aiActionsSchema } from 'starlight-ai-actions/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: z.object({ aiActions: aiActionsSchema() }) }),
});

export const collections = { docs };
```

> Starlight 0.42 has no `starlightSchema` export — extend `docsSchema` as shown above.

## Configuration reference

Top-level options (`StarlightAiActionsOptions`). All values are plain data (see [Limitations](#limitations)).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `markdown` | `{ items?: MarkdownItem[]; mdUrl?: string } \| false` | `{ items: [view, copyContent, copyUrl, copyPrompt] }` | Markdown tools menu. `false` disables it. `items` picks the dropdown entries; `mdUrl` is the template for the page's Markdown URL (placeholders below). |
| `direct` | `DirectProvider[] \| false` | ChatGPT + Claude lockups | Buttons that open a provider in a new tab. `false` or `[]` disables the group. |
| `paste` | `PasteProvider[] \| false` | Gemini, Copilot, Poe, 豆包, 千问, 元宝 | Providers listed in the paste dialog (one stacked-avatar button + the dialog rows). `false` or `[]` disables the group. |
| `prompt` | `string` | see [Default configuration](#default-configuration) | Prompt template used by `copyPrompt`, direct `href`s and the dialog. |
| `where` | `{ idPattern?: string }` | `{}` | Page filter, see [`where.idPattern`](#whereidpattern). |
| `labels` | `Record<string, Partial<Labels>>` | `{}` | Per-language label overrides keyed by page `lang` (e.g. `'zh-CN'`), see [Labels](#labels). |
| `dialog` | `{ title?: string; hint1?: string } \| false` | `{}` | Paste dialog copy (overrides the `dialogTitle` / `dialogHint1` labels). `false` removes the dialog and requires `paste` empty (`false` or `[]`). |

Group semantics: for **rendering**, an empty array is the same as `false` — when all three groups are empty/disabled, nothing is rendered on the page. One exception: `markdown: { items: [], mdUrl }` is still the legal carrier of `mdUrl` — it hides the Markdown menu while keeping the Markdown URL available to `{url}` / direct `href`s.

### `markdown.items`

| Value | Renders |
| --- | --- |
| `view` | Link that opens the Markdown URL in a new tab |
| `copyContent` | Copies the Markdown text (fetches the `mdUrl` result at click time) |
| `copyUrl` | Copies the Markdown URL |
| `copyPrompt` | Copies the rendered prompt |

### Provider fields (`direct[]` / `paste[]`)

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — (required) | Label next to / under the icon; also reported as `provider` in the event. |
| `href` | `string` | — (required) | Target URL. Supports `{prompt}` and `{url}` (both substituted URL-encoded). |
| `icon` | `string` | — (required) | Sprite symbol name without the `ic-` prefix: `chatgpt`, `claude`, `gemini`, `copilot`, `poe`, `qwen`, `yuanbao`; `doubao` uses the bundled PNG instead of the sprite. |
| `iconUrl` | `string?` | — | Custom image URL; overrides `icon`. Rendered as `<img>`. |
| `bg` | `string?` | `'#fff'` | Avatar chip background color (see note). |
| `scale` | `number?` | `0.75` | Icon scale inside the avatar (see note). |
| `ring` | `'light' \| 'dark'?` | `'light'` on direct bitmaps; none on paste | Inset ring around the avatar (see note). |
| `style` | `'combine' \| 'round' \| 'square'?` | `'round'` | **`direct` only.** `combine` = icon + name lockup; anything else = avatar round button (see [Limitations](#limitations) for `square`). |

`bg` / `scale` / `ring` style the avatar. On **direct** buttons they only apply to the `<img>` (bitmap) path (`iconUrl` or the bundled Doubao PNG) — sprite icons render bare and ignore all three. On **paste** stacked avatars `bg` / `scale` apply to the chip and its icon (bitmap or sprite), and `ring` is opt-in: omitting it renders no ring (the `'light'` default is the direct/AiIcon path, not the stacked button).

### Template placeholders

| Placeholder | Value | Available in |
| --- | --- | --- |
| `{base}` | `import.meta.env.BASE_URL` without trailing slash | `markdown.mdUrl` |
| `{filePath}` | content file path relative to `src/content/docs/` | `markdown.mdUrl` |
| `{site}` | `String(Astro.site)` without a trailing slash | `markdown.mdUrl`, `prompt` |
| `{url}` | rendered Markdown URL | `prompt`, provider `href` |
| `{title}` | page title | `prompt` |
| `{lang}` | page language code | `prompt` |
| `{prompt}` | rendered prompt, URL-encoded | provider `href` |

Example `mdUrl` for a site serving raw `.md` files: `'{site}{base}/md/{filePath}'`.

### `where.idPattern`

Regular expression tested against the content entry `id` (e.g. `'^p\\d\\d/'`). Pages that don't match are skipped. Index pages (`index.md` / `index.mdx`) never show the bar.

### Labels

`labels` maps a page language code to partial overrides of these keys. Unknown languages fall back to English; omitted keys keep the built-in string.

| Key | Used for | `en` | `zh-CN` | `zh-TW` |
| --- | --- | --- | --- | --- |
| `view` | Markdown menu item | View Markdown | 查看 Markdown | 檢視 Markdown |
| `copyContent` | Markdown menu item | Copy Markdown content | 复制 Markdown 内容到剪贴板 | 複製 Markdown 內容到剪貼簿 |
| `copyUrl` | Markdown menu item | Copy Markdown URL | 复制 Markdown URL 到剪贴板 | 複製 Markdown URL 到剪貼簿 |
| `copyPrompt` | Markdown menu item | Copy prompt with URL | 复制带 URL 的提示词到剪贴板 | 複製帶 URL 的提示詞到剪貼簿 |
| `copySuccess` | copy status text | Copied to clipboard ✓ | 已复制到剪贴板 ✓ | 已複製到剪貼簿 ✓ |
| `copyFail` | copy status text | Copy failed — please select and copy manually | 复制失败，请手动全选复制 | 複製失敗，請手動全選複製 |
| `mdMenu` | dropdown label | Markdown tools | Markdown 工具 | Markdown 工具 |
| `pasteOpen` | paste button label | Discuss with AI | 和 AI 讨论 | 和 AI 討論 |
| `dialogTitle` | dialog title | Discuss with AI | 和 AI 讨论 | 和 AI 討論 |
| `dialogHint1` | dialog hint | Click an AI button below, then press Ctrl+V in the chat box to paste the prompt and start discussing. | 点击下面 AI 按钮，并在对话框中 Ctrl v 粘贴提示词，开始讨论。 | 點擊下面 AI 按鈕，並在對話框中 Ctrl v 貼上提示詞，開始討論。 |
| `dialogClose` | dialog close button | Close | 关闭 | 關閉 |

## Frontmatter

Requires the schema extension from [Setup §2](#2-content-schema--srccontentconfigts).

```yaml
---
# hide the whole action bar on this page
aiActions: false
---
```

```yaml
---
# override just the prompt for this page
aiActions:
  prompt: 'Summarize this page for a beginner: {url}'
---
```

## When the bar renders

A page gets the action bar iff all of the following hold:

1. frontmatter `aiActions` is not `false`;
2. the file is not `index.md` / `index.mdx`;
3. `where.idPattern` is unset or matches `entry.id`;
4. at least one group is non-empty (`markdown.items`, `direct`, `paste`).

The dialog renders iff `paste` is non-empty.

## Validation

Options are validated at config load; two mistakes throw:

1. **`markdown.mdUrl` is required when anything needs the Markdown URL** — i.e. `markdown.items` is non-empty, **or** the `prompt` template contains `{url}` while `direct` or `paste` is non-empty, **or** any direct `href` contains `{url}`. (With all three groups off there is no consumer, so `mdUrl` is not required.) With `markdown: false` there is nowhere to put `mdUrl` — use `markdown: { items: [], mdUrl: '…' }` instead (empty `items` hides the menu but keeps the URL available).
2. **`dialog: false` requires `paste` to be empty** (`false` or `[]`) — paste buttons only live inside the dialog.

## Events

Every action dispatches a `CustomEvent('ai-actions')` on `window`. Events are notifications: opening a provider and copying always proceed as normal.

```js
window.addEventListener('ai-actions', (event) => {
  const { type, action, provider, url, page } = event.detail;
  // e.g. forward to your analytics
});
```

Detail shape (`AiActionDetail`):

| Field | Type | Meaning |
| --- | --- | --- |
| `type` | `'markdown' \| 'direct' \| 'paste'` | Which group fired. |
| `action` | `'view' \| 'copyContent' \| 'copyUrl' \| 'copyPrompt' \| 'open'` | What the user did (`open` = provider button). |
| `provider` | `string?` | Provider `name` (direct buttons, dialog rows). |
| `url` | `string?` | Markdown URL (markdown actions). |
| `page` | `{ url: string; title: string }` | Page location and document title at click time. |

## Default configuration

The effective defaults (all groups on; `markdown.mdUrl` still required — see [Validation](#validation)):

```js
starlightAiActions({
  markdown: { items: ['view', 'copyContent', 'copyUrl', 'copyPrompt'] },
  direct: [
    { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
    { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
  ],
  paste: [
    { name: 'Gemini', href: 'https://gemini.google.com/app', icon: 'gemini', bg: '#fff', scale: 0.8, ring: 'light' },
    { name: 'Copilot', href: 'https://copilot.microsoft.com/', icon: 'copilot', bg: '#fff', scale: 0.75, ring: 'light' },
    { name: 'Poe', href: 'https://poe.com/', icon: 'poe', bg: '#fff', scale: 0.75, ring: 'light' },
    { name: '豆包', href: 'https://www.doubao.com/chat/', icon: 'doubao', bg: '#fff', scale: 0.75, ring: 'light' },
    { name: '千问', href: 'https://www.qianwen.com/chat/', icon: 'qwen', bg: '#fff', scale: 0.75, ring: 'light' },
    { name: '元宝', href: 'https://yuanbao.tencent.com/', icon: 'yuanbao', bg: '#fff', scale: 0.75, ring: 'light' },
  ],
  prompt: '我在阅读这篇文章（Markdown 格式）：{url}。请先阅读全文，然后帮我理解内容，并准备回答我的相关问题。',
  where: {},
  labels: {},
  dialog: {},
});
```

## Limitations

- **Options must be serializable plain data** — they reach the client through a Vite virtual module (`JSON.stringify`): functions are dropped, class instances are flattened to plain objects.
- **Icon backgrounds are inline styles.** `bg` is applied as `style="background:…"` and wins over CSS. In `combine` form a bitmap `iconUrl` needs `bg="transparent"` (bare-logo lockup) — the component already renders `combine` with `bg="transparent"`, so for `direct` providers `bg` / `scale` / `ring` only take effect on the round/square avatar form.
- **`style: 'square'` currently renders the round avatar form** (the square corner rule exists but is not wired to a style value yet).
- **`PageTitle` override.** The bar is injected via a Starlight `PageTitle` component override; if your site already overrides `PageTitle`, your override wins and the bar will not render unless you render `AiActionsBar` yourself.

## Trademarks

All product names and brand icons are trademarks of their respective owners, referenced nominatively. Brand marks in the bundled sprite come from [lobe-icons](https://github.com/lobehub/lobe-icons) (MIT, nominative use); `markdown` and `copy` from [simple-icons](https://simpleicons.org/) (CC0); `comment-alt` is a Starlight built-in icon (MIT).

## License

[MIT](LICENSE)

<div align="center">
  <h1>starlight-ai-actions 🤖</h1>
  <p>Starlight plugin that adds a Markdown tools menu and AI-discussion buttons under each page title.</p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/starlight-ai-actions.svg)](https://www.npmjs.com/package/starlight-ai-actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Documentation](https://img.shields.io/badge/docs-xianmi.co-7c3aed.svg)](https://www.xianmi.co/starlight-ai-actions/)

</div>

## Features

- **Markdown tools menu** — view the page's Markdown source, copy its content, copy its URL, or copy a ready-made prompt that references it
- **ChatGPT / Claude buttons** — jump straight into a new chat with the prompt pre-filled
- **Discuss with AI dialog** — paste-prompt workflow with buttons for chatbots that have no URL prefill (Gemini, Copilot, Poe, Doubao, Qwen, Yuanbao, or your own list)
- **Fully configurable** — every button group and every entry can be changed, added, or removed from `astro.config.mjs`, with per-page frontmatter overrides
- **Multilingual** — English, Simplified Chinese, and Traditional Chinese labels and prompts built in, selected by page language
- **Zero runtime dependencies** — icons included, `ai-actions` CustomEvent for analytics hooks
- Works alongside `starlight-sidebar-topics` and Starlight themes

## Quick Start

```sh
npm install starlight-ai-actions
```

```js
// astro.config.mjs
import starlightAiActions from 'starlight-ai-actions';

starlight({
  plugins: [
    starlightAiActions({
      markdown: { mdUrl: 'https://example.com{base}/md/{filePath}' },
    }),
  ],
});
```

```ts
// src/content.config.ts — allow the per-page `aiActions` frontmatter key
import { aiActionsSchema } from 'starlight-ai-actions/schema';
// …
schema: docsSchema({ extend: z.object({ aiActions: aiActionsSchema() }) })
```

Per-page control from frontmatter:

```yaml
aiActions: false          # hide the bar on this page
# or
aiActions:
  prompt: 'Summarize this article for a beginner: {url}'
```

## Documentation

Full configuration reference — every option with examples, the event contract, recipes, and limitations — lives in the [documentation](https://www.xianmi.co/starlight-ai-actions/).

## License

Licensed under the MIT License.

All product names and brand icons are trademarks of their respective owners, referenced nominatively; icon sources are lobe-icons (MIT), simple-icons (CC0), and Starlight's built-in icon set (MIT).

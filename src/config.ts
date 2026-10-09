import type { EntryLike, StarlightAiActionsOptions, DirectProvider, PasteProvider } from './types.js';

export const DEFAULT_ITEMS = ['view', 'copyContent', 'copyUrl', 'copyPrompt'] as const;
export const DEFAULT_DIRECT: DirectProvider[] = [
  { name: 'ChatGPT', href: 'https://chatgpt.com/?prompt={prompt}', icon: 'chatgpt', style: 'combine' },
  { name: 'Claude', href: 'https://claude.ai/new?q={prompt}', icon: 'claude', style: 'combine' },
];
export const DEFAULT_PASTE: PasteProvider[] = [
  { name: 'Gemini', href: 'https://gemini.google.com/app', icon: 'gemini', bg: '#fff', scale: 0.8, ring: 'light' },
  { name: 'Copilot', href: 'https://copilot.microsoft.com/', icon: 'copilot', bg: '#fff', scale: 0.75, ring: 'light' },
  { name: 'Poe', href: 'https://poe.com/', icon: 'poe', bg: '#fff', scale: 0.75, ring: 'light' },
  { name: '豆包', href: 'https://www.doubao.com/chat/', icon: 'doubao', bg: '#fff', scale: 0.75, ring: 'light' },
  { name: '千问', href: 'https://www.qianwen.com/chat/', icon: 'qwen', bg: '#fff', scale: 0.75, ring: 'light' },
  { name: '元宝', href: 'https://yuanbao.tencent.com/', icon: 'yuanbao', bg: '#fff', scale: 0.75, ring: 'light' },
];
export const DEFAULT_PROMPT = '我在阅读这篇文章（Markdown 格式）：{url}。请先阅读全文，然后帮我理解内容，并准备回答我的相关问题。';

export function renderPrompt(template: string, ctx: { url: string; title: string; lang: string; site: string }): string {
  return template.replaceAll('{url}', ctx.url).replaceAll('{title}', ctx.title).replaceAll('{lang}', ctx.lang).replaceAll('{site}', ctx.site);
}

export function renderMdUrl(template: string, ctx: { base: string; filePath: string; site: string }): string {
  return template.replaceAll('{base}', ctx.base).replaceAll('{filePath}', ctx.filePath).replaceAll('{site}', ctx.site);
}

export function resolveShow(entry: EntryLike, where: { idPattern?: string }): boolean {
  if (/(^|\/)index\.mdx?$/.test(entry.filePath ?? '')) return false;
  if (where.idPattern && !new RegExp(where.idPattern).test(entry.id)) return false;
  return true;
}

export function validateOptions(raw: unknown): StarlightAiActionsOptions {
  const o = (raw ?? {}) as StarlightAiActionsOptions;
  const markdown = o.markdown === false ? false : { items: o.markdown?.items ?? [...DEFAULT_ITEMS], mdUrl: o.markdown?.mdUrl };
  const direct = o.direct === false ? false : (o.direct ?? DEFAULT_DIRECT);
  const paste = o.paste === false ? false : (o.paste ?? DEFAULT_PASTE);
  const dialog = o.dialog === false ? false : (o.dialog ?? {});
  const prompt = o.prompt ?? DEFAULT_PROMPT;
  const where = o.where ?? {};
  // prompt 模板仅在有按钮会渲染它（direct/paste 非空）时才构成对 {url} 的依赖；三组全关时 prompt 无处渲染，不应反向要求 mdUrl
  const promptUsed = (direct !== false && direct.length > 0) || (paste !== false && paste.length > 0);
  const usesUrl =
    (markdown !== false && markdown.items.length > 0) ||
    (promptUsed && prompt.includes('{url}')) ||
    direct !== false && direct.some((p) => p.href.includes('{url}'));
  if (usesUrl && !(markdown !== false && markdown.mdUrl)) {
    // markdown:false 时 mdUrl 无处可写——报错指路 `markdown: { items: [], mdUrl }`（关菜单但提供 URL）
    const hint =
      markdown === false || markdown.items.length === 0
        ? ' To hide the Markdown menu while still supplying the URL, use `markdown: { items: [], mdUrl: \'…\' }`.'
        : '';
    throw new Error(
      '[starlight-ai-actions] Missing `markdown.mdUrl` template: the `mdUrl`/`{url}` placeholders and the view/copy items all depend on it.' + hint,
    );
  }
  if (dialog === false && paste !== false && paste.length > 0) {
    throw new Error('[starlight-ai-actions] `dialog: false` requires `paste` to be empty (paste-type buttons only live inside the dialog).');
  }
  return { markdown, direct, paste, prompt, where, labels: o.labels ?? {}, dialog };
}

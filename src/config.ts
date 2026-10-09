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
// 缺省 prompt 按页面语言三语（通用措辞，不含站点名）；用户可用 `prompt` 全局覆盖
export const DEFAULT_PROMPTS: Record<'en' | 'zh-CN' | 'zh-TW', string> = {
  en: "I'm reading this article (in Markdown): {url}. Please read it first, then help me understand the content and be ready to answer my questions.",
  'zh-CN': '我在阅读这篇文章（Markdown 格式）：{url}。请先阅读全文，然后帮我理解内容，并准备回答我的相关问题。',
  'zh-TW': '我在閱讀這篇文章（Markdown 格式）：{url}。請先全文閱讀，然後幫助我理解內容，並準備回答我的相關問題。',
};

// 选择序：frontmatter 逐页 > options.prompt 全局 > 按语言缺省（lang 精确命中，回退 en——与 mergeLabels 同款）
export function resolvePrompt(fmPrompt: string | undefined, optionPrompt: string | undefined, lang: string): string {
  if (fmPrompt) return fmPrompt;
  if (optionPrompt) return optionPrompt;
  return DEFAULT_PROMPTS[lang as keyof typeof DEFAULT_PROMPTS] ?? DEFAULT_PROMPTS.en;
}

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
  // prompt 可缺省（缺省由 resolvePrompt 按页面语言取 DEFAULT_PROMPTS）；校验 {url} 依赖时按缺省模板（恒含 {url}）计
  const prompt = o.prompt;
  const where = o.where ?? {};
  // prompt 模板仅在有按钮会渲染它（direct/paste 非空）时才构成对 {url} 的依赖；三组全关时 prompt 无处渲染，不应反向要求 mdUrl
  const promptUsed = (direct !== false && direct.length > 0) || (paste !== false && paste.length > 0);
  const usesUrl =
    (markdown !== false && markdown.items.length > 0) ||
    (promptUsed && (prompt ?? DEFAULT_PROMPTS.en).includes('{url}')) ||
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

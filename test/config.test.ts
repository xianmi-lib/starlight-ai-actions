import { describe, expect, it } from 'vitest';
import { DEFAULT_PROMPTS, renderPrompt, renderMdUrl, resolvePrompt, resolveShow, validateOptions } from '../src/config.js';

describe('renderPrompt', () => {
  it('替换全部占位符', () => {
    expect(renderPrompt('读 {title}（{url}）lang={lang} site={site}', { url: 'U', title: 'T', lang: 'zh-CN', site: 'S' })).toBe('读 T（U）lang=zh-CN site=S');
  });
});
describe('renderMdUrl', () => {
  it('替换 base/filePath/site', () => {
    expect(renderMdUrl('{site}{base}/md/{filePath}', { base: '/zh-tw', filePath: 'p02/a/1.md', site: 'https://www.xianmi.co' })).toBe('https://www.xianmi.co/zh-tw/md/p02/a/1.md');
  });
});
describe('resolveShow', () => {
  const art = { id: 'p02/a/1', filePath: 'src/content/docs/p02/a/1.md', data: {} };
  const idx = { id: 'p02/a/index', filePath: 'src/content/docs/p02/a/index.md', data: {} };
  it('默认显示文章、排除 index 页', () => {
    expect(resolveShow(art, {})).toBe(true);
    expect(resolveShow(idx, {})).toBe(false);
    expect(resolveShow({ ...idx, filePath: 'src/content/docs/p02/index.mdx' }, {})).toBe(false);
  });
  it('idPattern 过滤 entry.id', () => {
    expect(resolveShow(art, { idPattern: '^p\\d\\d/' })).toBe(true);
    expect(resolveShow({ ...art, id: 'guides/ai-chat' }, { idPattern: '^p\\d\\d/' })).toBe(false);
  });
  it('frontmatter false 恒不显示（由 PageTitle 判定前置，此处只测 where）', () => {
    expect(resolveShow(art, { idPattern: '^zz' })).toBe(false);
  });
});
describe('validateOptions', () => {
  it('带 mdUrl 的配置合法并落默认值', () => {
    const o = validateOptions({ markdown: { mdUrl: '/md/{filePath}' } });
    expect(o.markdown === false ? undefined : o.markdown?.items).toEqual(['view', 'copyContent', 'copyUrl', 'copyPrompt']);
    expect(o.direct).toHaveLength(2);
    expect(o.paste).toHaveLength(6);
  });
  it('mdUrl 缺失且使用 {url} 时报错', () => {
    expect(() => validateOptions({})).toThrowError(/mdUrl/);
  });
  it('dialog false 而 paste 非空报错', () => {
    expect(() => validateOptions({ markdown: { mdUrl: '/md/{filePath}' }, dialog: false })).toThrowError(/dialog/);
  });
  it('三组全关合法', () => {
    expect(() => validateOptions({ markdown: false, direct: false, paste: false, dialog: false })).not.toThrow();
  });
});
describe('validateOptions 边界', () => {
  it('markdown:false 且 prompt 无 {url} 时不需要 mdUrl', () => {
    expect(() => validateOptions({ markdown: false, prompt: '读 {title}', direct: false, paste: false, dialog: false })).not.toThrow();
  });
  it('direct href 含 {url} 时需要 mdUrl', () => {
    expect(() => validateOptions({ markdown: false, direct: [{ name: 'X', href: 'https://x.test/?u={url}', icon: 'gemini' }], paste: false, dialog: false })).toThrowError(/mdUrl/);
  });
  it('空数组视同关组', () => {
    const o = validateOptions({ markdown: { mdUrl: '/md/{filePath}', items: [] }, direct: false, paste: false, dialog: false });
    expect(o.markdown === false ? undefined : o.markdown?.items).toEqual([]);
  });
  it('direct href 含 {url} 分句单独钉（prompt 无 {url} 仍抛）+ markdown:false 报错含 items: [] 指路', () => {
    const cfg = () =>
      validateOptions({
        markdown: false,
        prompt: '读 {title}',
        direct: [{ name: 'X', href: 'https://x.test/?u={url}', icon: 'chatgpt' }],
        paste: false,
        dialog: false,
      });
    expect(cfg).toThrowError(/mdUrl/);
    expect(cfg).toThrowError(/items: \[\]/);
  });
  it('promptUsed 分句单独钉（items 空、direct 非空、prompt 含 {url} 仍抛 mdUrl）', () => {
    expect(() =>
      validateOptions({
        markdown: { mdUrl: undefined, items: [] },
        prompt: '读 {url}',
        direct: [{ name: 'X', href: 'https://x.test/', icon: 'chatgpt' }],
        paste: false,
        dialog: false,
      }),
    ).toThrowError(/mdUrl/);
  });
});
describe('DEFAULT_PROMPTS / resolvePrompt', () => {
  it('三键齐全且各含 {url}（通用措辞）', () => {
    expect(Object.keys(DEFAULT_PROMPTS).sort()).toEqual(['en', 'zh-CN', 'zh-TW']);
    for (const tpl of Object.values(DEFAULT_PROMPTS)) expect(tpl).toContain('{url}');
  });
  it('frontmatter 逐页 prompt 优先', () => {
    expect(resolvePrompt('FM {url}', 'OPT {url}', 'zh-CN')).toBe('FM {url}');
    expect(resolvePrompt('FM {url}', undefined, 'en')).toBe('FM {url}');
  });
  it('无 frontmatter 时 options.prompt 全局覆盖（跨语言站自己负责）', () => {
    expect(resolvePrompt(undefined, 'OPT {url}', 'zh-TW')).toBe('OPT {url}');
    expect(resolvePrompt(undefined, 'OPT {url}', 'en')).toBe('OPT {url}');
  });
  it('两者皆缺按 lang 精确命中取缺省，未知 lang 回退 en', () => {
    expect(resolvePrompt(undefined, undefined, 'en')).toBe(DEFAULT_PROMPTS.en);
    expect(resolvePrompt(undefined, undefined, 'zh-CN')).toBe(DEFAULT_PROMPTS['zh-CN']);
    expect(resolvePrompt(undefined, undefined, 'zh-TW')).toBe(DEFAULT_PROMPTS['zh-TW']);
    expect(resolvePrompt(undefined, undefined, 'zh-Hans')).toBe(DEFAULT_PROMPTS.en);
    expect(resolvePrompt(undefined, undefined, '')).toBe(DEFAULT_PROMPTS.en);
  });
  it('validateOptions 不再代填 prompt（缺省留给 resolvePrompt 按语言取）', () => {
    const o = validateOptions({ markdown: { mdUrl: '/md/{filePath}' } });
    expect(o.prompt).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { renderPrompt, renderMdUrl, resolveShow, validateOptions } from '../src/config.js';

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

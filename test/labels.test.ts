import { describe, expect, it } from 'vitest';
import { DEFAULT_LABELS, mergeLabels } from '../src/labels.js';

describe('mergeLabels', () => {
  it('zh-TW 精确命中正体文案', () => {
    expect(mergeLabels('zh-TW').dialogHint1).toContain('貼上');
    expect(mergeLabels('zh-CN').dialogHint1).toContain('粘贴');
  });
  it('未知语言回退 en', () => {
    expect(mergeLabels('fr').view).toBe(DEFAULT_LABELS.en.view);
  });
  it('overrides 键级合并', () => {
    expect(mergeLabels('zh-CN', { 'zh-CN': { view: '看 MD' } }).view).toBe('看 MD');
    expect(mergeLabels('zh-CN', { 'zh-CN': { view: '看 MD' } }).copyUrl).toBe(DEFAULT_LABELS['zh-CN'].copyUrl);
  });
  it('mdMenu 三语缺省为裸 Markdown（0.2.2 精简，用户拍板去「工具」）', () => {
    expect(DEFAULT_LABELS.en.mdMenu).toBe('Markdown');
    expect(DEFAULT_LABELS['zh-CN'].mdMenu).toBe('Markdown');
    expect(DEFAULT_LABELS['zh-TW'].mdMenu).toBe('Markdown');
  });
});

describe('mergeLabels 附录回归（2026-10-21）', () => {
  it('overrides 显式 undefined 不抹掉默认值', () => {
    const merged = mergeLabels('zh-CN', { 'zh-CN': { view: undefined } });
    expect(merged.view).toBe(DEFAULT_LABELS['zh-CN'].view);
    expect(merged.copyUrl).toBe(DEFAULT_LABELS['zh-CN'].copyUrl);
  });
  it('undefined 与有效覆盖混排：有效键生效、undefined 键保留默认', () => {
    const merged = mergeLabels('en', { en: { view: 'See MD', copyUrl: undefined } });
    expect(merged.view).toBe('See MD');
    expect(merged.copyUrl).toBe(DEFAULT_LABELS.en.copyUrl);
  });
});

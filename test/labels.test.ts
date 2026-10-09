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
});

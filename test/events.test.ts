import { describe, expect, it } from 'vitest';
import { buildDetail } from '../src/events.js';

describe('buildDetail', () => {
  it('markdown/view 带 url 与 page', () => {
    expect(buildDetail({ type: 'markdown', action: 'view', url: 'U', page: { url: '/p/1/', title: 'T' } })).toEqual({
      type: 'markdown', action: 'view', url: 'U', page: { url: '/p/1/', title: 'T' },
    });
  });
  it('direct/open 带 provider', () => {
    expect(buildDetail({ type: 'direct', action: 'open', provider: 'ChatGPT', page: { url: '/p/1/', title: 'T' } }).provider).toBe('ChatGPT');
  });
});
